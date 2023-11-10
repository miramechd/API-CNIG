/**
 * @module M/impl/layer/GenericVector
 */
import * as LayerType from 'M/layer/Type';
import * as EventType from 'M/event/eventtype';
import {
  isNullOrEmpty,
  isNull,
  getResolutionFromScale,
  isUndefined,
} from 'M/util/Utils';
import Vector from './Vector';
import ImplMap from '../Map';
import Feature from '../feature/Feature';
import Utils from '../util/Utils';

/**
  * @classdesc
  * La API-CNIG permite visualizar la capa de Open Street Map.
  *
  * @api
  * @extends {M.impl.layer.Vector}
  */
class GenericVector extends Vector {
  constructor(options = {}, vendorOptions) {
    // calls the super constructor
    super(options, vendorOptions);
    this.options = options;

    /**
      * Layer map. La instancia del mapa.
      */
    this.map = null;

    /**
      * WMS zIndex_. Índice de la capa, (+40).
      */
    this.zIndex_ = ImplMap.Z_INDEX[LayerType.Generic];


    this.sldBody = options.sldBody;

    /**
      * WMS styles. Estilos de la capa.
      */
    this.styles = this.options.styles || '';

    this.style = vendorOptions.getStyle === undefined ? null : vendorOptions.getStyle().name;

    if (this.style !== 'createDefaultStyle' && vendorOptions.getStyle) {
      this.style = vendorOptions.getStyle();
    }

    /**
      * WFS cql: Opcional: instrucción CQL para filtrar.
      * El método setCQL(cadena_cql) refresca la capa aplicando el
      * nuevo predicado CQL que recibe.
      */
    this.cql = this.options.cql;

    this.fnAddFeatures_ = null;
  }

  /**
    * Este método agrega la capa al mapa.
    *
    * @public
    * @function
    * @param {M.impl.Map} map Mapa de la implementación.
    * @api stable
    */
  addTo(map) {
    this.map = map;

    Utils.addFacadeName(this.facadeLayer_, this.ol3Layer, 'Vector');

    if (this.facadeLayer_.legend === undefined) {
      Utils.addFacadeLegend(this.facadeLayer_, this.ol3Layer);
    }


    if (!isNullOrEmpty(this.visibility)) {
      this.ol3Layer.setVisible(this.visibility);
    }

    if (!isNullOrEmpty(this.maxZoom)) {
      this.ol3Layer.setMaxZoom(this.maxZoom);
    }

    if (!isNullOrEmpty(this.minZoom)) {
      this.ol3Layer.setMinZoom(this.minZoom);
    }

    if (!isNullOrEmpty(this.zIndex_)) {
      this.ol3Layer.setZIndex(this.zIndex_);
    }

    if (!isNullOrEmpty(this.sldBody)) {
      this.ol3Layer.getSource().updateParams({ SLD_BODY: this.sldBody });
    }

    if (!isNullOrEmpty(this.styles)) {
      this.ol3Layer.getSource().updateParams({ STYLES: this.styles });
    }

    if (!isNullOrEmpty(this.format)) {
      this.ol3Layer.getSource().updateParams({ FORMAT: this.format });
    }

    if (!isNullOrEmpty(this.version)) {
      this.ol3Layer.getSource().updateParams({ VERSION: this.version });
    }

    if (!isNullOrEmpty(this.maxExtent)) {
      this.ol3Layer.setExtent(this.maxExtent);
    }

    if (!isUndefined(this.ol3Layer.getSource().getLegendUrl)) {
      this.legendUrl_ = this.ol3Layer.getSource().getLegendUrl();
    }
    this.ol3Layer.setOpacity(this.opacity_);
    this.ol3Layer.setVisible(this.visibility);

    if (!isNullOrEmpty(this.ids)) {
      const featureId = this.ids.split(',').map((id) => {
        return this.name.concat('.').concat(id);
      });
      this.ol3Layer.getSource().setUrl(`${this.ol3Layer.getSource().getUrl()}&featureId=${featureId}`);
    }

    if (!isNullOrEmpty(this.cql)) {
      this.ol3Layer.getSource().setUrl(`${this.ol3Layer.getSource().getUrl()}&CQL_FILTER=${window.encodeURIComponent(this.cql)}`);
    }

    // calculates the resolutions from scales
    if (!isNull(this.options) &&
       !isNull(this.options.minScale) && !isNull(this.options.maxScale)) {
      const units = this.map.getProjection().units;
      this.options.minResolution = getResolutionFromScale(this.options.minScale, units);
      this.options.maxResolution = getResolutionFromScale(this.options.maxScale, units);
      this.ol3Layer.setMaxResolution(this.options.maxResolution);
      this.ol3Layer.setMinResolution(this.options.minResolution);
    } else if (!isNull(this.options) &&
       !isNull(this.options.minResolution) && !isNull(this.options.maxResolution)) {
      this.ol3Layer.setMaxResolution(this.options.maxResolution);
      this.ol3Layer.setMinResolution(this.options.minResolution);
    }

    map.getMapImpl().addLayer(this.ol3Layer);

    this.fnAddFeatures_ = this.addFeaturesToFacade.bind(this);
    this.ol3Layer.getSource().on('change', this.fnAddFeatures_);
  }

  addFeaturesToFacade() {
    if (this.ol3Layer.getSource().getState() === 'ready') {
      if (this.ol3Layer.getSource().getFeatures) {
        const features = this.ol3Layer.getSource().getFeatures().map((f) => {
          return Feature.olFeature2Facade(f);
        });
        this.facadeLayer_.addFeatures(features);
        this.loaded_ = true;
        this.deactivate();
        this.fire(EventType.LOAD, [this.features_]);
        if (this.style !== 'createDefaultStyle') {
          this.ol3Layer.setStyle(this.style);
        }
      } else {
        this.deactivate();
      }
    }
  }

  /**
    * Este método vuelve a dibujar la capa.
    *
    * @function
    * @public
    * @api stable
    */
  redraw() {
    const olLayer = this.getOL3Layer();
    if (!isNullOrEmpty(olLayer)) {
      const olSource = olLayer.getSource();
      /**  if (olSource instanceof OLSourceCluster) {
         olSource = olSource.getSource();
       } */
      // remove all features from ol vector
      const olFeatures = [...olSource.getFeatures()];
      olFeatures.forEach(olSource.removeFeature, olSource);

      const features = this.facadeLayer_.getFeatures();
      olSource.addFeatures(features.map(Feature.facade2OLFeature));
    }
  }


  deactivate() {
    this.ol3Layer.getSource().un('change', this.fnAddFeatures_);
    this.fnAddFeatures_ = null;
  }

  equals(obj) {
    let equals = false;
    if (obj instanceof GenericVector) {
      equals = (this.url === obj.url);
      equals = equals && (this.name === obj.name);
      equals = equals && (this.version === obj.version);
    }

    return equals;
  }
}

export default GenericVector;

