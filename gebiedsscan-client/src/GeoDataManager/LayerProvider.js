/**
 * Created by TomasDePomas.
 * Using: PhpStorm
 * On: 2/6/18 - 1:42 PM
 */
import turf from 'turf';
import length from '@turf/length';
import turfcontains from '@turf/boolean-contains';

export default class {
  constructor(manager) {
    this.TYPE = {
      UNKNOWN: 0,
      TILES: 1,
      GEOMETRY: 2
    };
    Object.freeze(this.TYPE);
    this.manager = manager;

    this.name = "";
    this.visible = false;
    this.zIndex = null;
    this.type = this.TYPE.UNKNOWN;
    this.filters = [];
    this.methods = {};
    this.listeners = {};
    this.eventCallbacks = {};

    if (!manager) {
      throw new Error(`Unable to instantiate LayerProvider. Register new providers in the manager`)
    }
  }

  getZoomBounds() {
    if (this.zoomBounds) {
      return this.zoomBounds instanceof Array ?
        {
          min: Math.min(...this.zoomBounds),
          max: Math.max(...this.zoomBounds)
        } : this.zoomBounds
    }
    if (this.maxZoom || this.minZoom) {
      return {
        min: this.minZoom || 1,
        max: this.maxZoom || 20
      }
    }
    return null;
  }

  render() {
  }

  setZIndex(zIndex) {
    this.zIndex = zIndex;
    if (this.visible) {
      this.manager._restack();
    }
  }

  hide() {
    if (this.visible) {
      if (this.layer && !this.manager.mapless) {
        this.manager.map.removeLayer(this.layer);
      }
      this.visible = false;
      // hardcode the removal of the watel levels legend
      if (this.name === "GrondwaterLevels") {
        document.getElementById("waterlevels").style.visibility = "hidden";
      }
    }
  }

  dissapear() {
    if (this.visible) {
      if (this.layer && !this.manager.mapless) {
        // this.layer.setStyle({
        //     weight: 7,
        //     color: 'rgba(0,0,0,0)'
        // })
      }
    }
  }

  show() {
    if (!this.visible) {
      if (this.layer && !this.manager.mapless) {
        this.manager.map.addLayer(this.layer);
      }
      this.visible = true;
      // add the watel levels legend show option
      if (this.name === "GrondwaterLevels") {
        document.getElementById("waterlevels").style.visibility = "visible";
      }
    }
  }

  on(event, callback) {
    if (!this.eventCallbacks[event]) {
      this.eventCallbacks[event] = [];
    }
    this.eventCallbacks[event].push(callback);

    if (this.layer) {
      this._registerEventListener(event, callback);
    }
  }

  getLegend() {
    if (this.legend) {
      return Object.keys(this.legend).map(name => {
        return {
          name,
          style: typeof this.legend[name] === 'string' ?
            {'backgroundColor': this.legend[name]} :
            this.legend[name]
        }
      });
    } else if (this.OndergrondLegend) {
      return Object.keys(this.OndergrondLegend).map(name => {
        return {
          name,
          style: typeof this.OndergrondLegend[name] === 'string' ?
            {'backgroundColor': this.OndergrondLegend[name]} :
            this.OndergrondLegend[name]
        }
      });
    }
    return [];
  }

  getUnderPoint(point, bounds, distance) {
    return new Promise((resolve) => {
      if (this.layer === null || this.type !== this.TYPE.GEOMETRY || !this.visible) {
        resolve([]);
      }

      point = turf.flip(turf.point(point));

      let geoJSONLayer = new L.GeoJSON(null, {
        pointToLayer(feature, latlng) {
          return L.circleMarker(latlng, {
            radius: 4,
            stroke: false,
            fill: true,
            fillOpacity: 0.6
          });
        },
        style(feature) {
          return {
            stroke: false,
            fill: true,
            fillOpacity: 0.6
          }
        },
      });

      let elements = this.layer.getLayers()
        .filter(object => {
          return object.getBounds ? bounds.overlaps(object.getBounds()) : bounds.contains(object.getLatLng());
        }).map(feature => {
          feature.geoJSON = feature.toGeoJSON();
          return feature
        })
        .filter(feature => {
          try {
            return feature.geoJSON.geometry.type === 'Point' ?
              turf.distance(feature.geoJSON, point) < distance :
              turf.intersect(feature.geoJSON, point);
          } catch (e) {
            return false
          }
        }).sort((a, b) => length(a.geoJSON) - length(b.geoJSON))
        .map(layer => {
          geoJSONLayer.addData(layer.toGeoJSON());
          return layer.feature.properties
        });

      resolve({
        source: this.name,
        label: this.label ? this.label : this.name,
        layer: geoJSONLayer,
        data: elements
      });
    });
  }

  getUnderPolygon(polygon, bounds, distance) {
    return new Promise((resolve) => {

      if (this.layer === null || this.type !== this.TYPE.GEOMETRY || !this.visible) {
        resolve([]);
        return;
      }

      let geoJSONLayer = new L.GeoJSON(null, {
        pointToLayer: (feature, latlng) => {

          if (this.divIcon) {
            return L.marker(latlng, {icon: this.divIcon});
          }
          return L.circleMarker(latlng, {
            radius: 4,
            stroke: false,
            fill: true,
            fillOpacity: 0.6
          });
        },
        style(feature) {
          return {
            stroke: false,
            fill: true,
            fillOpacity: 0.6
          }
        }
      });

      let elements = this.layer.getLayers()
        .filter(object => {
          return object.getBounds ? bounds.overlaps(object.getBounds()) : bounds.contains(object.getLatLng());
        }).map(feature => {
          feature.geoJSON = feature.toGeoJSON();
          return feature
        })
        .filter(feature => {
          try {
            return turfcontains(polygon, feature.geoJSON);
            //ask tomas why distance here
            // return feature.geoJSON.geometry.type === 'Polygon' ?
            //     turf.distance(feature.geoJSON, polygon) < distance :
            //     turf.intersect(feature.geoJSON, polygon);
          } catch (e) {
            return false
          }
        }).sort((a, b) => length(a.geoJSON) - length(b.geoJSON))
        .map(layer => {
          geoJSONLayer.addData(layer.toGeoJSON());
          return layer.feature.properties
        });

      resolve({
        source: this.name,
        label: this.label ? this.label : this.name,
        layer: geoJSONLayer,
        data: elements
      });
    });
  }

  leafletToTurfPolygon(polygon) {
    let coords = polygon.getLatLngs()[0].map(latlng => [latlng.lat, latlng.lng]);
    coords.push(coords[0]);
    return turf.polygon([coords]);
  }

  filter(params = []) {
  }

  changeEvent(event) {
    return event.data.map(item => item);
  }

  _registerEventListeners() {
    Object.keys(this.eventCallbacks).forEach(event => {
      this._registerEventListener(event);
    })
  }

  _registerEventListener(eventName) {
    if (this.type === this.TYPE.TILES) {
      if (this.manager.mapless) return console.warn('unable to register events on tile layers on mapless managers');
      this.manager.map.on(eventName, (event) => {
        this._forwardEvent(eventName, event);
      });
    } else {
      if (!this.layer.listens(eventName)) {
        this.layer.on(eventName, (event) => {
          this._forwardEvent(eventName, event);
        });
      }
    }
  }

  _forwardEvent(eventName, event) {
    if (this[`${eventName}Event`]) {
      this.eventCallbacks[eventName].forEach(
        callback => callback(this[`${eventName}Event`](event), this.provider, this.name)
      );
    } else {
      this.eventCallbacks[eventName].forEach(
        callback => callback(event, this.provider, this.name)
      );
    }

    if (eventName === 'change' && this.type === this.TYPE.GEOMETRY) {
      this._sortFeatures();
    }
    return false;
  }

  _sortFeatures() {
    const layersBySize = [];

    this.layer.getLayers().forEach((layer) => {
      if (layer.getBounds) {
        const height = layer.getBounds().getNorth() - layer.getBounds().getSouth();
        const width = layer.getBounds().getEast() - layer.getBounds().getWest();
        layer.size = height * width;
      } else {
        layer.size = -1;
      }
      layersBySize.push(layer);
    });

    layersBySize.sort((layerA, layerB) => {
      return layerB.size - layerA.size
    });

    layersBySize.forEach((layer) => {
      layer.bringToFront();
    });
  }
}
