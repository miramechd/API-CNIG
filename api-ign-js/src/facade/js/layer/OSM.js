/**
 * @module M/layer/OSM
 */
import OSMImpl from 'impl/layer/OSM';
import LayerBase from './Layer';
import { isNullOrEmpty, isUndefined } from '../util/Utils';
import Exception from '../exception/exception';
import * as LayerType from './Type';
import * as parameter from '../parameter/parameter';
import { getValue } from '../i18n/language';

/**
 * @classdesc
 * La API-CNIG permite visualizar la capa de Open Street Map.
 *
 * @property {String} name Nombre de la capa, OSM.
 * @property {String} legend Indica el nombre que queremos que aparezca en
 * el árbol de contenidos, si lo hay.
 * @property {Boolean} transparent Falso si es una capa base, verdadero en caso contrario.
 * @property {Object} options Opciones OSM.
 *
 * @api
 * @extends {M.Layer}
 */
class OSM extends LayerBase {
  /**
   * Constructor principal de la clase.
   *
   * @constructor
   * @param {string|Mx.parameters.WMS} userParameters Parámetros para la construcción de la capa.
   * - name: Nombre de la capa en la leyenda.
   * - legend: Indica el nombre que queremos que aparezca en el árbol de contenidos, si lo hay.
   * - transparent: Falso si es una capa base, verdadero en caso contrario.
   * - type: Tipo de la capa.
   * - url: Url genera la OSM.
   * - minZoom: Zoom mínimo aplicable a la capa.
   * - maxZoom: Zoom máximo aplicable a la capa.
   * - maxExtent: La medida en que restringe la visualización a una región específica.
   * @param {Mx.parameters.LayerOptions} options Estas opciones se mandarán
   * a la implementación de la capa.
   * - visibility: Define si la capa es visible o no.
   * - animated: Activa la animación para capas base o parámetros animados.
   * - displayInLayerSwitcher: Define si la capa se mostrará en el selector de capas.
   * - opacity: Opacidad de capa, por defecto 1.
   * @param {Object} vendorOptions Opciones para la biblioteca base. Ejemplo vendorOptions:
   * <pre><code>
   * import SourceOSM from 'ol/source/OSM';
   * {
   *  opacity: 0.1,
   *  source: new SourceOSM({
   *    attributions: 'osm',
   *    ...
   *  })
   * }
   * </code></pre>
   * @api
   */
  constructor(userParametersVar, options = {}, vendorOptions = {}) {
    let userParameters = userParametersVar;

    // Checks if the implementation can create OSM.
    if (isUndefined(OSMImpl)) {
      Exception(getValue('exception').osm_method);
    }

    // Checks if the param is null or empty.
    if (isNullOrEmpty(userParameters)) {
      userParameters = 'OSM';
    }

    /**
     * Implementación.
     * @public
     * @implements {M.layer.OSMImpl}
     * @type {M.layer.OSMImpl}
     */
    const impl = new OSMImpl(userParameters, options, vendorOptions);

    // This layer is of parameters.
    const parameters = parameter.layer(userParameters, LayerType.OSM);
    if (isNullOrEmpty(parameters.name)) {
      parameters.name = 'osm';
    }

    // Calls the super constructor.
    super(parameters, impl);

    /**
     * OSM name. Nombre de la capa, OSM.
     */
    this.name = parameters.name;

    /**
     * OSM legend. Indica el nombre que queremos que aparezca en el árbol de contenidos, si lo hay.
     */
    this.legend = parameters.legend;
    if (isNullOrEmpty(parameters.legend)) {
      this.legend = 'OpenStreetMap';
    }

    /**
     * OSM transparent.
     * Falso si es una capa base, verdadero en caso contrario.
     */
    this.transparent = parameters.transparent;

    /**
     * OSM options. Opciones OSM.
     */
    this.options = options;
  }

  /**
   * Devuelve el valor de la propiedad "transparent".
   * @function
   * @return {M.layer.OSM.impl.transparent} Valor de "transparent".
   * @api
   */
  get transparent() {
    return this.getImpl().transparent;
  }

  /**
   * Sobrescribe el valor de la propiedad "transparent".
   * @function
   * @param {Boolean} newTransparent Nuevo valor de "transparent".
   * @api
   */
  set transparent(newTransparent) {
    if (!isNullOrEmpty(newTransparent)) {
      this.getImpl().transparent = newTransparent;
    } else {
      this.getImpl().transparent = false;
    }
  }

  /**
   * Devuelve el tipo de capa, OSM.
   * @function
   * @return {M.LayerType.OSM} Devuelve OSM.
   * @api
   */
  get type() {
    return LayerType.OSM;
  }

  /**
   * Sobrescribe el tipo de capa.
   * @function
   * @param {String} newType Nuevo tipo de capa.
   * @api
   */
  set type(newType) {
    if (!isUndefined(newType) &&
      !isNullOrEmpty(newType) && (newType !== LayerType.OSM)) {
      Exception('El tipo de capa debe ser \''.concat(LayerType.OSM).concat('\' pero se ha especificado \'').concat(newType).concat('\''));
    }
  }

  /**
   * Este método comprueba si un objeto es igual
   * a esta capa.
   *
   * @function
   * @param {Object} obj Objeto a comparar.
   * @returns {Boolean} Valor verdadero es igual, falso no lo es.
   * @api
   */
  equals(obj) {
    let equals = false;

    if (obj instanceof OSM) {
      equals = (this.url === obj.url);
      equals = equals && (this.name === obj.name);
      equals = equals && (this.options === obj.options);
    }
    return equals;
  }
}

export default OSM;
