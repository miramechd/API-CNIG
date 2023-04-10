/**
 * @module M/layer/GeoJSON
 */
import GeoJSONImpl from 'impl/layer/GeoJSON';
import LayerVector from './Vector';
import { GeoJSON as GeoJSONType } from './Type';
import { isString, isNullOrEmpty, isUndefined, isArray, normalize } from '../util/Utils';
import Exception from '../exception/exception';
import { getValue } from '../i18n/language';

/**
 * @classdesc
 * Main constructor of the class. Creates a WMS layer
 * with parameters specified by the user
 * @api
 */
class GeoJSON extends LayerVector {
  /**
   *
   * @constructor
   * @extends {M.layer.Vector}
   * @param {string|Mx.parameters.GeoJSON} userParameters parameters
   * @param {Mx.parameters.LayerOptions} options provided by the user
   * @param {Object} vendorOptions vendor options for the base library
   * @api
   */
  constructor(parameters, options = {}, vendorOptions) {
    /**
     * Implementation of this layer
     * @public
     * @type {M.impl.layer.GeoJSON}
     */
    const impl = new GeoJSONImpl(parameters, options, vendorOptions);

    // calls the super constructor
    super(parameters, options, undefined, impl);

    // checks if the implementation can create KML layers
    if (isUndefined(GeoJSONImpl)) {
      Exception(getValue('exception').geojsonlayer_method);
    }

    // checks if the param is null or empty
    if (isNullOrEmpty(parameters)) {
      Exception(getValue('exception').no_param);
    }

    if (isString(parameters)) {
      this.url = parameters;
    } else if (isArray(parameters)) {
      this.source = parameters;
    } else {
      // url
      this.url = parameters.url;

      // name
      this.name = parameters.name;

      // source
      this.source = parameters.source;
      if (isString(this.source)) {
        this.source = this.deserialize(this.source);
      }

      // extract
      this.extract = parameters.extract || false;
      // crs
      if (!isNullOrEmpty(parameters.crs)) {
        if (isNullOrEmpty(this.source)) {
          this.source = {
            type: 'FeatureCollection',
            features: [],
          };
        }
        this.source.crs = {
          type: 'EPSG',
          properties: {
            code: parameters.crs,
          },
        };
      }
    }

    // options
    this.options = options;
  }

  /**
   * 'type' This property indicates if
   * the layer was selected
   */
  get type() {
    return GeoJSONType;
  }

  set type(newType) {
    if (!isUndefined(newType) &&
      !isNullOrEmpty(newType) && (newType !== GeoJSONType)) {
      Exception('El tipo de capa debe ser \''.concat(GeoJSONType).concat('\' pero se ha especificado \'').concat(newType).concat('\''));
    }
  }

  /**
   * 'extract' the features properties
   */
  get source() {
    return this.getImpl().source;
  }

  set source(newSource) {
    this.getImpl().source = newSource;
  }

  /**
   * 'extract' the features properties
   */
  get extract() {
    return this.getImpl().extract;
  }

  set extract(newExtract) {
    if (!isNullOrEmpty(newExtract)) {
      if (isString(newExtract)) {
        this.getImpl().extract = (normalize(newExtract) === 'true');
      } else {
        this.getImpl().extract = newExtract;
      }
    } else {
      this.getImpl().extract = false;
    }
  }

  /**
   * This function checks if an object is equals
   * to this layer
   *
   * @function
   * @api
   */
  equals(obj) {
    let equals = false;

    if (obj instanceof GeoJSON) {
      equals = this.name === obj.name;
      equals = equals && (this.extract === obj.extract);
    }

    return equals;
  }

  /**
   * This function checks if an object is equals
   * to this layer
   *
   * @function
   * @api
   */
  setSource(source) {
    this.source = source;
    this.getImpl().refresh(source);
  }

  /**
   * This function sets the style to layer
   *
   * @function
   * @public
   * @param {M.Style}
   * @param {bool}
   */
  setStyle(styleParam, applyToFeature = false, defaultStyle = GeoJSON.DEFAULT_OPTIONS_STYLE) {
    super.setStyle(styleParam, applyToFeature, defaultStyle);
  }

  /**
   * This function serializes this object
   *
   * @function
   * @return {String}
   * @api
   * @public
   */
  serialize() {
    return window.btoa(unescape(encodeURIComponent(JSON.stringify(this.source))));
  }

  /**
   * This function deserializes this object
   *
   * @function
   * @param { String } encodedSerialized
   * @return {String}
   * @api
   * @public
   */
  deserialize(encodedSerialized) {
    const source = JSON.parse(decodeURIComponent(escape(window.atob(encodedSerialized.replace(' ', '+')))));
    return source;
  }
}

/**
 * Default params for style GeoJSON layers * @const
 * @type {object}
 * @public
 * @api
 */
GeoJSON.DEFAULT_PARAMS = {
  fill: {
    color: 'rgba(255, 255, 255, 0.4)',
    opacity: 0.4,
  },
  stroke: {
    color: '#3399CC',
    width: 1.5,
  },
};

/**
 * Default style for GeoJSON layers
 * @const
 * @type {object}
 * @public
 * @api
 */
GeoJSON.DEFAULT_OPTIONS_STYLE = {
  point: {
    ...GeoJSON.DEFAULT_PARAMS,
    radius: 5,
  },
  line: {
    ...GeoJSON.DEFAULT_PARAMS,
  },
  polygon: {
    ...GeoJSON.DEFAULT_PARAMS,
  },
};

export default GeoJSON;
