/**
 * @module M/impl/control/FullTOCControl
 */
export default class FullTOCControl extends M.impl.Control {
  /**
   * This function adds the control to the specified map
   *
   * @public
   * @function
   * @param {M.Map} map to add the plugin
   * @param {HTMLElement} html of the plugin
   * @api stable
   */
  addTo(map, html) {
    this.facadeMap_ = map;
    this.facadeControl_ = undefined;
    super.addTo(map, html);
  }

  /**
   * Registers events on map and layers to render the
   * fulltoc
   *
   * @public
   * @function
   * @api stable
   */
  registerEvents() {
    if (!M.utils.isNullOrEmpty(this.facadeMap_)) {
      const olMap = this.facadeMap_.getMapImpl();
      this.registerViewEvents_(olMap.getView());
      this.registerLayersEvents_(olMap.getLayers());
      olMap.on('change:view', () => this.onViewChange_.bind(this));
    }
  }

  /**
   * Unegisters events for map and layers from the fulltoc
   *
   * @public
   * @function
   * @api stable
   */
  unregisterEvents() {
    if (!M.utils.isNullOrEmpty(this.facadeMap_)) {
      const olMap = this.facadeMap_.getMapImpl();
      this.unregisterViewEvents_(olMap.getView());
      this.unregisterLayersEvents_(olMap.getLayers());
      olMap.un('change:view', () => this.onViewChange_.bind(this));
    }
  }

  /**
   *
   */
  registerViewEvents_(view) {
    view.on('change:resolution', () => this.facadeControl_.render());
  }

  /**
   *
   */
  registerLayersEvents_(layers) {
    layers.forEach(this.registerLayerEvents_.bind(this));
    layers.on('remove', () => this.facadeControl_.render());
    layers.on('add', () => this.onAddLayer_.bind(this));
  }

  /**
   *
   */
  registerLayerEvents_(layer) {
    layer.on('change:visible', () => this.facadeControl_.render());
    layer.on('change:extent', () => this.facadeControl_.render());
  }

  /**
   *
   */
  unregisterViewEvents_(view) {
    view.un('change:resolution', () => this.facadeControl_.render());
  }

  /**
   *
   */
  unregisterLayersEvents_(layers) {
    layers.forEach(this.unregisterLayerEvents_.bind(this));
    layers.un('remove', () => this.facadeControl_.render());
    layers.un('add', () => this.onAddLayer_.bind(this));
  }

  /**
   *
   */
  unregisterLayerEvents_(layer) {
    layer.un('change:visible', () => this.facadeControl_.render());
    layer.un('change:extent', () => this.facadeControl_.render());
  }

  /**
   *
   */
  onViewChange_(evt) {
    // removes listener from previous view
    this.unregisterViewEvents_(evt.oldValue);

    // attaches listeners to the new view
    const olMap = this.facadeMap_.getMapImpl();
    this.registerViewEvents_(olMap.getView());
  }

  /**
   *
   */
  onAddLayer_(evt) {
    this.registerLayerEvents_(evt.element);
    this.facadeControl_.render();
  }

  /**
   *
   */
  getGeoJSONExtent(layer) {
    return layer.getImpl().getOL3Layer().getSource().getExtent();
  }

  /**
  * Loads GeoJSON layer
  * @public
  * @function
  * @param {*} source2 -
  */
  loadGeoJSONLayer(source, layerName, layerLegend) {
    let features = new ol.format.GeoJSON()
      .readFeatures(source, { featureProjection: this.facadeMap_.getProjection().code });

    features = this.featuresToFacade(features);
    features = features.filter((f) => {
      return f.getGeometry() !== null;
    });

    const layer = new M.layer.Vector({ name: layerName, legend: layerLegend, extract: false });
    layer.addFeatures(features);
    this.facadeMap_.addLayers(layer);
    layer.setZIndex(layer.getZIndex() + 8);
    return features;
  }

  featuresToFacade(implFeatures) {
    return implFeatures.map((feature) => {
      return M.impl.Feature.olFeature2Facade(feature);
    });
  }

  /**
  * Centers on features
  * @public
  * @function
  * @api
  * @param {*} features -
  */
  centerFeatures(features, isGPX) {
    if (!M.utils.isNullOrEmpty(features)) {
      if ((features.length === 1) && (features[0].getGeometry().type === 'Point')) {
        const pointView = new ol.View({
          center: features[0].getGeometry().coordinates,
          zoom: 15,
        });
        this.facadeMap_.getMapImpl().setView(pointView);
      } else {
        const extent = M.impl.utils.getFeaturesExtent(features);
        this.facadeMap_.getMapImpl().getView().fit(extent, {
          duration: 500,
          minResolution: 1,
        });
      }

      features.forEach((f) => {
        switch (f.getGeometry().type) {
          case 'Point':
          case 'MultiPoint':
            const newPointStyle = {
              radius: 6,
              fill: {
                color: '#71a7d3',
              },
              stroke: {
                color: 'white',
                width: 2,
              },
            };

            if (isGPX && f.getAttributes().name !== undefined && f.getAttributes().name !== '') {
              newPointStyle.label = {
                fill: {
                  color: '#ff0000',
                },
                stroke: {
                  color: 'white',
                  width: 2,
                  linedash: [0, 0],
                  linedashoffset: 0,
                  linecap: 'none',
                  linejoin: 'none',
                },
                scale: 2,
                text: f.getAttributes().name,
                font: '8px sanserif',
                align: 'center',
                baseline: 'top',
                rotate: false,
                rotation: 0,
                offset: [0, 10],
              };
            }

            if (f !== undefined) f.setStyle(new M.style.Point(newPointStyle));
            break;
          case 'LineString':
          case 'MultiLineString':
            const newLineStyle = new M.style.Line({
              stroke: {
                color: '#71a7d3',
                width: 3,
                linedash: undefined,
              },
            });
            if (f !== undefined) f.setStyle(newLineStyle);
            break;
          case 'Polygon':
          case 'MultiPolygon':
            const newPolygonStyle = new M.style.Polygon({
              fill: {
                color: '#71a7d3',
                opacity: 0.2,
              },
              stroke: {
                color: '#71a7d3',
                width: 3,
              },
            });
            if (f !== undefined) f.setStyle(newPolygonStyle);
            break;
          default:
            break;
        }
      });
    }
  }

  /**
  * Transforms x,y coordinates to 4326 on coordinates array.
  * @public
  * @function
  * @api
  * @param {String} codeProjection
  * @param {Array<Number>} oldCoordinates
  */
  getTransformedCoordinates(codeProjection, oldCoordinates) {
    const transformFunction = ol.proj.getTransform(codeProjection, 'EPSG:4326');
    return this.getFullCoordinates(
      oldCoordinates,
      transformFunction(this.getXY(oldCoordinates)),
    );
  }

  /**
  * Substitutes x, y coordinates on coordinate set (x, y, altitude...)
  * @public
  * @function
  * @api
  * @param {Array} oldCoordinates
  * @param {Array<Number>} newXY - [x,y]
  */
  getFullCoordinates(oldCoordinates, newXY) {
    const newCoordinates = oldCoordinates;
    newCoordinates[0] = newXY[0];
    newCoordinates[1] = newXY[1];
    return newCoordinates;
  }

  /**
  * Given a coordinate set (x, y, altitude?), returns [x,y].
  * @public
  * @function
  * @api
  * @param {Array<Number>} coordinatesSet
  */
  getXY(coordinatesSet) {
    const coordinateCopy = [];
    for (let i = 0; i < coordinatesSet.length; i += 1) coordinateCopy.push(coordinatesSet[i]);
    while (coordinateCopy.length > 2) coordinateCopy.pop();
    return coordinateCopy;
  }
}
