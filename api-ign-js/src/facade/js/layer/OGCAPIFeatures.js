/**
 * @module M/layer/OGCAPIFeatures
 */
import OGCAPIFeaturesImpl from 'impl/layer/OGCAPIFeatures';
import { isUndefined, isNullOrEmpty } from '../util/Utils';
import Exception from '../exception/exception';
import Vector from './Vector';
import * as LayerType from './Type';
import * as parameter from '../parameter/parameter';
import { parse } from '../geom/Geom';
import { getValue } from '../i18n/language';

/**
 * @classdesc
 * Main constructor of the class. Creates a OGCAPIFeatures layer
 * with parameters specified by the user
 * @api
 */
class OGCAPIFeatures extends Vector {
  /**
   * @constructor
   * @extends {M.layer.Vector}
   * @param {string|Mx.parameters.OGCAPIFeatures} uPar parameters
   * @param {Mx.parameters.LayerOptions} opt provided by the user
   * @param {Object} vendorOpts vendor opt for the base library
   * @api
   */
  constructor(uPar, opt = {}, vendorOpts = {}, impl = new OGCAPIFeaturesImpl(opt, vendorOpts)) {
    // This layer is of parameters.
    const parameters = parameter.layer(uPar, LayerType.OGCAPIFeatures);

    // calls the super constructor
    super(parameters, opt, undefined, impl);

    // checks if the implementation can create OGCAPIFeatures layers
    if (isUndefined(OGCAPIFeaturesImpl)) {
      Exception(getValue('exception').OGCAPIFeatureslayer_method);
    }

    // checks if the param is null or empty
    if (isNullOrEmpty(uPar)) {
      Exception(getValue('exception').no_param);
    }

    // namespace
    this.namespace = parameters.namespace;

    // legend
    this.legend = parameters.legend;

    // cql
    this.cql = parameters.cql;

    // geometry
    this.geometry = parameters.geometry;

    // ids
    this.ids = parameters.ids;

    // limit
    this.limit = parameters.limit;

    // offset
    this.offset = parameters.offset;

    // id
    this.id = parameters.id;

    // format
    this.format = parameters.format;

    // bbox
    this.bbox = parameters.bbox;

    // version
    this.version = parameters.version;

    // options
    this.opt = opt;
  }

  /**
   * 'type' This property indicates if
   * the layer was selected
   */
  get type() {
    return LayerType.OGCAPIFeatures;
  }

  set type(newType) {
    if (!isUndefined(newType) && !isNullOrEmpty(newType) &&
      (newType !== LayerType.OGCAPIFeatures)) {
      Exception('El tipo de capa debe ser \''.concat(LayerType.OGCAPIFeatures).concat('\' pero se ha especificado \'').concat(newType).concat('\''));
    }
  }

  /**
   * 'namespace' the layer name
   */
  get namespace() {
    return this.getImpl().namespace;
  }

  set namespace(newNamespace) {
    this.getImpl().namespace = newNamespace;
  }
  /**
   * 'legend' the layer name
   */
  get legend() {
    return this.getImpl().legend;
  }

  set legend(newLegend) {
    if (isNullOrEmpty(newLegend)) {
      this.getImpl().legend = this.name;
    } else {
      this.getImpl().legend = newLegend;
    }
  }

  /**
   * 'cql' the layer name
   */
  get cql() {
    return this.getImpl().cql;
  }

  set cql(newCQL) {
    this.getImpl().cql = newCQL;
  }

  /**
   * 'geometry' the layer name
   */
  get geometry() {
    return this.getImpl().geometry;
  }

  set geometry(newGeometry) {
    if (!isNullOrEmpty(newGeometry)) {
      const parsedGeom = parse(newGeometry);
      if (isNullOrEmpty(parsedGeom)) {
        Exception(`El tipo de capa OGCAPIFeatures <b>${newGeometry}</b> no se reconoce. Los tipos disponibles son: POINT, LINE, POLYGON, MPOINT, MLINE, MPOLYGON`);
      }
      this.getImpl().geometry = parsedGeom;
    }
  }

  /**
   * 'ids' the layer name
   */
  get ids() {
    return this.getImpl().ids;
  }

  set ids(newIds) {
    if (isNullOrEmpty(newIds)) {
      this.getImpl().ids = this.ids;
    } else {
      this.getImpl().ids = newIds;
    }
  }

  /**
   * 'limit' the layer name
   */
  get limit() {
    return this.getImpl().limit;
  }

  set limit(newLimit) {
    if (isNullOrEmpty(newLimit)) {
      this.getImpl().limit = this.limit;
    } else {
      this.getImpl().limit = newLimit;
    }
  }

  /**
 * 'offset' the layer name
 */
  get offset() {
    return this.getImpl().offset;
  }

  set offset(newoffset) {
    if (isNullOrEmpty(newoffset)) {
      this.getImpl().offset = this.offset;
    } else {
      this.getImpl().offset = newoffset;
    }
  }

  /**
   * 'id' the layer name
   */
  get id() {
    return this.getImpl().id;
  }

  set id(newid) {
    if (isNullOrEmpty(newid)) {
      this.getImpl().id = this.id;
    } else {
      this.getImpl().id = newid;
    }
  }

  /**
   * 'format' the layer name
   */
  get format() {
    return this.getImpl().format;
  }

  set format(newformat) {
    if (isNullOrEmpty(newformat)) {
      this.getImpl().format = this.format;
    } else {
      this.getImpl().format = newformat;
    }
  }

  /**
  * 'bbox' the layer name
  */
  get bbox() {
    return this.getImpl().bbox;
  }

  set bbox(newbbox) {
    if (isNullOrEmpty(newbbox)) {
      this.getImpl().bbox = this.bbox;
    } else {
      this.getImpl().bbox = newbbox;
    }
  }


  /**
   * 'version' the layer name
   */
  get version() {
    return this.getImpl().version;
  }

  set version(newVersion) {
    if (!isNullOrEmpty(newVersion)) {
      this.getImpl().version = newVersion;
    } else {
      this.getImpl().version = '1.0.0'; // default value
    }
  }

  /**
   * This function checks if an object is equals
   * to this layer
   *
   * @function
   * @api
   */
  setCQL(newCQLparam) {
    let newCQL = newCQLparam;
    this.getImpl().getDescribeFeatureType().then((describeFeatureType) => {
      if (!isNullOrEmpty(newCQL)) {
        const geometryName = describeFeatureType.geometryName;
        // if exist, replace {{geometryName}} with the value geometryName
        newCQL = newCQL.replace(/{{geometryName}}/g, geometryName);
      }
      if (this.getImpl().cql !== newCQL) {
        this.getImpl().setCQL(newCQL);
      }
    });
  }

  /**
   * This function sets the style to layer
   *
   * @function
   * @public
   * @param {M.Style}
   * @param {bool}
   */
  setStyle(styleParam, applyToFeature = false, defaultStyle = OGCAPIFeatures.DEFAULT_OPTS_STYLE) {
    super.setStyle(styleParam, applyToFeature, defaultStyle);
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

    if (obj instanceof OGCAPIFeatures) {
      equals = (this.url === obj.url);
      equals = equals && (this.namespace === obj.namespace);
      equals = equals && (this.name === obj.name);
      equals = equals && (this.ids === obj.ids);
      equals = equals && (this.limit === obj.limit);
      equals = equals && (this.offset === obj.offset);
      equals = equals && (this.format === obj.format);
      equals = equals && (this.bbox === obj.bbox);
      equals = equals && (this.id === obj.id);
      equals = equals && (this.cql === obj.cql);
      equals = equals && (this.version === obj.version);
    }

    return equals;
  }
}

/**
 * Default params for style OGCAPIFeatures layers
 * @const
 * @type {object}
 * @public
 * @api
 */
OGCAPIFeatures.DEFAULT_PARAMS = {
  fill: {
    color: 'rgba(103, 175, 19, 0.2)',
    opacity: 0.4,
  },
  stroke: {
    color: '#67af13',
    width: 1,
  },
};

/**
 * Default style for OGCAPIFeatures layers
 * @const
 * @type {object}
 * @public
 * @api
 */
OGCAPIFeatures.DEFAULT_OPTS_STYLE = {
  point: {
    ...OGCAPIFeatures.DEFAULT_PARAMS,
    radius: 5,
  },
  line: {
    ...OGCAPIFeatures.DEFAULT_PARAMS,
  },
  polygon: {
    ...OGCAPIFeatures.DEFAULT_PARAMS,
  },
};

export default OGCAPIFeatures;
