/**
 * Created by TomasDePomas.
 * Using: PhpStorm
 * On: 2/6/18 - 1:42 PM
 */

import BRTBackgroundLayerProvider from "./Providers/BRTBackgroundLayerProvider";
import OSMLayerProvider from "./Providers/OSMLayerProvider";
import ExamplePointsLayerProvider from "./Providers/ExamplePointsLayerProvider";
import ExamplePolygonsLayerProvider from "./Providers/ExamplePolygonsLayerProvider";
import LocationsLayerProvider from "./Providers/LocationsLayerProvider";
import BestemingsplanGebiedLayerProvider from "./Providers/BestemingsplanGebiedLayerProivder";
import BRKLayerProivder from "./Providers/BRKLayerProivder";
import BagLayerProivder from "./Providers/BagLayerProivder";
import GemeentelijkeMonumentenLayerProvider from "./Providers/GemeentelijkeMonumentenLayerProvider";
import RijksMonumentenLayerProvider from "./Providers/RijksMonumentenLayerProvider";
import WoningbouwLayerProvider from "./Providers/WoningbouwLayerProvider";
import VergunningenLayerProvider from "./Providers/VergunningenLayerProvider";
import ArcheologieLayerProvider from "./Providers/ArcheologieLayerProvider";
import RwsgeluidskaartenLayerProivder from "./Providers/RwsgeluidskaartenLayerProivder";
import FotosLayerProivder from "./Providers/FotosLayerProivder";
import BomenLayerProvider from "./Providers/BomenLayerProvider";
import MarienhageLayerProvider from "./Providers/MarienhageLayerProvider";
import IPDElementsLayerProvider from "./Providers/IPDElementsLayerProvider";
import RceLayerProvider from "./Providers/RceLayerProvider";
import BekendmakingenLayerProvider from "./Providers/BekendmakingenLayerProvider";
// import IPDElementsLayerProvider from "./Providers/ElementsLayerProvider";
import KvkLayerProvider from "./Providers/KvkLayerProvider";
import GemeenteSonderingenLayerProvider from "./Providers/GemeenteSonderingenLayerProvider";
import RijksSonderingenLayerProvider from "./Providers/RijksSonderingenLayerProvider";
import WarmteKoudeopslagLayerProvider from "./Providers/WarmteKoudeopslagLayerProvider";
import GrondwaterLevelsLayerProvider from "./Providers/GrondwaterLevelsLayerProvider";
import GrondwaterMeetpuntenLayerProvider from "./Providers/GrondwaterMeetpuntenLayerProvider";
import GrondwaterPolutionLayerProvider from "./Providers/GrondwaterPolutionLayerProvider";
import GrondwaterPolutionSanitationLayerProvider from "./Providers/GrondwaterPolutionSanitationLayerProvider";
import GrondwaterPolutionCareMeasuresLayerProvider from './Providers/GrondwaterPolutionCareMeasuresLayerProvider';
import GrondwaterPolutionTab from "./Providers/GrondwaterPolutionTab";
import SondeeronderzoekLayerProvider from "./Providers/SondeeronderzoekLayerProvider";
import GrondwaterstandLayerProvider from "./Providers/GrondwaterstandLayerProvider";
import VerontreinigingLayerProvider from "./Providers/VerontreinigingLayerProvider";
import BooronderzoekDinoLoketLayerProvider from './Providers/BooronderzoekDinoLoketLayerProvider'

export default class {
  constructor(map) {
  this.map = map;
  this.mapLess = !map;
  this.params = {
    boundingBox: [],
    zoom: null,
    query: {},
    layers: {},
    filterOptions: {}
  };
  this.events = {};
  this.providerClasses = [
    BagLayerProivder,
    BestemingsplanGebiedLayerProvider,
    BRKLayerProivder,
    BRTBackgroundLayerProvider,
    ExamplePointsLayerProvider,
    ExamplePolygonsLayerProvider,
    LocationsLayerProvider,
    OSMLayerProvider,
    GemeentelijkeMonumentenLayerProvider,
    RijksMonumentenLayerProvider,
    WoningbouwLayerProvider,
    VergunningenLayerProvider,
    ArcheologieLayerProvider,
    RwsgeluidskaartenLayerProivder,
    FotosLayerProivder,
    BomenLayerProvider,
    IPDElementsLayerProvider,
    KvkLayerProvider,
    MarienhageLayerProvider,
    RceLayerProvider,
    BekendmakingenLayerProvider,
    GemeenteSonderingenLayerProvider,
    RijksSonderingenLayerProvider,
    WarmteKoudeopslagLayerProvider,
    GrondwaterLevelsLayerProvider,
    GrondwaterMeetpuntenLayerProvider,
    GrondwaterPolutionLayerProvider,
    GrondwaterPolutionCareMeasuresLayerProvider,
    GrondwaterPolutionSanitationLayerProvider,
    GrondwaterPolutionTab,
    SondeeronderzoekLayerProvider,
    GrondwaterstandLayerProvider,
    VerontreinigingLayerProvider,
    BooronderzoekDinoLoketLayerProvider,
  ];

  if (!this.mapLess) {
    this.map.on('zoomend', () => this._enforceZoomBounds());
  }

  this._registerProviders();
  }

  set mapOptions(options) {
  this.map.options = {...this.map.options, ...options};
  }

  add(names) {
  names = names instanceof Array ? names : [names];
  names.forEach(name => this._addLayer(name));
  if (!this.mapLess) {
    this._restack();
  }
  return this;
  }

  applyParams(params) {
  for (let layerName in params.layers) {
    if (params.layers[layerName]) {
    this._showLayer(layerName);
    } else {
    this._hideLayer(layerName);
    }
  }
  this.params.layers = params.layers;
  this.params.query = params.query;
  this.filter(params.query);
  if (!this.mapLess) {
    this._enforceZoomBounds();
    this._restack();
  }
  return this;
  }

  filter(query = {}) {
  this.params.query = {...this.params.query, ...query};
  for (let filter in query) {
    if (this.filterProviders[filter]) {
    this.filterProviders[filter].forEach(provider => {
      if (provider.visible) {
      provider.filter(this.params);
      }
    });
    }
  }
  return this;
  }

  find(query, layer) {
  let result = null;
  for (let filter in query) {
    if (this.filterProviders[filter] && result === null) {
    this.filterProviders[filter].find(provider => {
      if (provider.visible && (
        !layer || provider.name === layer
      )) {
      let providerResult = provider.filter(this.params, false);
      if (providerResult && providerResult.length) {
        result = providerResult[0];
      }
      }
    });
    }
  }
  return result;
  }

  panToUserLocation(callback) {
    if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(({coords}) => {
      let userBounds = L.latLng(coords.latitude, coords.longitude).toBounds(coords.accuracy);
      this.map.flyToBounds(userBounds, {maxZoom: 13, easeLinearity: 0.1});
      callback();
    });
    } 

  }

  onClick(layers, callback) {
  this.on('click', layers, callback);
  return this;
  }

  on(event, layers, callback) {
  if (layers instanceof Function) {
    callback = layers;
    layers = Object.keys(this.providers);
  } else {
    layers = layers instanceof Array ? layers : [layers];
  }
  layers.forEach(name => {
    const provider = this.providers[name];
    if (provider) {
    provider.on(event, callback);
    } else {
    // console.warn(`Unkown layer in event listener: ${name}`);
    }
  });
  return this;
  }

  onManager(event, callback) {
  if (!this.events[event]) {
    this.events[event] = [];
  }
  this.events[event].push(callback);
  }

  getUnderPoint(point, layers = null) {
  layers = layers ? layers.reduce((layers, layer) => {
    if (this.addedLayers[layer]) {
    layers.push(this.addedLayers[layer]);
    } else {
    console.warn(`Getting info under point form a layer that is not added to the map: ${layer}`)
    }
    return layers;
  }, []) : Object.keys(this.addedLayers).map(key => this.addedLayers[key]);
  point = point instanceof L.LatLng ? [point.lat, point.lng] : point;

  let distance = (1 / this.map.getZoom()) * 0.1;
  let bounds = this.getBoundingBox();

  return new Promise((resolve, reject) => {
    Promise.all(layers.filter(layer => layer.provider.visible)
    .map(layer => layer.provider.getUnderPoint(point, bounds, distance))
    ).then(results => {
    resolve(
      results.filter((result) => {
      if (result.data && result.data.length) {
        return result;
      }
      })
    );
    }).catch(error => {
    reject(error);
    })
  });
  }

  getUnderPolygon(polygon, layers = null) {
  layers = layers ? layers.reduce((layers, layer) => {
    if (this.addedLayers[layer]) {
    layers.push(this.addedLayers[layer]);
    } else {
    console.warn(`Getting info under point form a layer that is not added to the map: ${layer}`)
    }
    return layers;
  }, []) : Object.keys(this.addedLayers).map(key => this.addedLayers[key]);
  
  // point = point instanceof L.LatLng ? [point.lat, point.lng] : point;

  let distance = (1 / this.map.getZoom()) * 0.1;
  let bounds = this.getBoundingBox();

  return new Promise((resolve, reject) => {
    Promise.all(layers.filter(layer => layer.provider.visible)
    .map(layer => layer.provider.getUnderPolygon(polygon, bounds, distance))
    ).then(results => {
    resolve(
      results.filter((result) => {
      if (result.data && result.data.length) {
        return result;
      }
      })
    );
    }).catch(error => {
    reject(error);
    })
  });
  }

  getBoundingBox(string = false) {
  if (this.mapless) {
    return string ?
    `${this.params.boundingBox[0].lat},${this.params.boundingBox[0].lng},
    ${this.params.boundingBox[1].lat},${this.params.boundingBox[1].lng}` :
    this.params.boundingBox;
  }
  return string ? this.map.getBounds().toBBoxString() : this.map.getBounds();
  }

  getLayer(layer) {
  if (this.addedLayers[layer]) {
    return this.addedLayers[layer].layer;
  }
  throw new Error(`Unknown layer ${layer}: ${Object.keys(this.addedLayers)}`)
  }

  getLayerLegend(layer) {
  if (this.providers[layer]) {
    return this.providers[layer].getLegend();
  }
  throw new Error(`Unknown layer ${layer}: ${Object.keys(this.providers)}`)
  }

  cloneOptions (options) {
  var ret = {};
  for (var i in options) {
    var item = options[i];
    if (item && item.clone) {
    ret[i] = item.clone();
    } else if (item instanceof L.Layer) {
    ret[i] = cloneLayer(item);
    } else {
    ret[i] = item;
    }
  }
  return ret;
  }

  cloneLayer (layer) {
  var options = this.cloneOptions(layer.options);

  if (layer instanceof L.GeoJSON) {
    return L.geoJson(layer.toGeoJSON(), options);
  }

  throw 'Unknown layer, cannot clone this layer. Leaflet-version: ' + L.version;
  }

  _updateAvailableFilters() {
  this.params.filterOptions = Object.keys(this.filterProviders).reduce((total, filter) => {
    let options = [];
    this.filterProviders[filter].forEach(provider => {
    if (provider.visible && provider.filters[filter]) {
      options = [...options, ...provider.filters[filter]];
    }
    });
    total[filter] = options;
    return total;
  }, {});

  this._emit('availableFiltersUpdated', this.params.filterOptions);
  }

  _registerProviders() {
  this.providers = {};
  this.addedLayers = {};
  this.filterProviders = {};

  this.providerClasses.forEach(providerClass => {
    let instance = new providerClass(this);
    if (this.providers[instance.name]) {
    throw new Error(`Duplicate provider name: ${instance.name}`);
    } else {
    this.providers[instance.name] = instance;

    if (!this.mapLess) {
      Object.keys(instance.listeners).forEach(listener => {
      this.map.on(listener, () => {
        if (instance.visible) {
        instance.listeners[listener](...arguments);
        }
      });
      });
    }
    }
  });
  }

  _addLayer(name) {
  const provider = this.providers[name];
  if (provider && !this.addedLayers[name]) {
    if (provider.filters) {
    this._registerFilters(provider);
    }

    let layer = this.providers[name].render(this.mapless);
    if (!this.mapLess) {
    layer.addTo(this.map);
    layer.bringToFront();
    }

    this.addedLayers[name] = {
    layer,
    provider,
    zoomBounds: provider.getZoomBounds()
    };
    provider._registerEventListeners();
    this._updateAvailableFilters();
    return this;
  }
  console.warn(`Provider is unknown or already added to the map: ${name}`);
  }

  _registerFilters(provider) {
  Object.keys(provider.filters).forEach(filter => {
    if (!this.filterProviders[filter]) {
    this.filterProviders[filter] = [];
    }
    this.filterProviders[filter].push(provider);
  });
  }

  _enforceZoomBounds() {
  let zoom = this.map.getZoom();
  let layers = Object.values(this.addedLayers).filter(layer => layer.zoomBounds);
  let hiddenLayers = layers.filter(layer =>
    (!layer.zoomBounds.min || layer.zoomBounds.min > zoom ) ||
    (!layer.zoomBounds.max || layer.zoomBounds.max < zoom)
  );

  let shownLayers = layers.filter(layer =>
    this.params.layers[layer.provider.name] &&
    (
    (!layer.zoomBounds.min || layer.zoomBounds.min <= zoom ) &&
    (!layer.zoomBounds.max || layer.zoomBounds.max >= zoom)
    )
  );
  shownLayers.forEach(layer => {
    layer.provider.show();
  });
  hiddenLayers.forEach(layer => {
    layer.provider.hide();
  });
  this._restack();

  }

  _showLayer(layerName) {
  if (this.addedLayers[layerName]) {
    this.addedLayers[layerName].provider.show();
  } else {
    this._addLayer(layerName);
  }
  this._updateAvailableFilters();
  }

  _hideLayer(layerName) {
  if (this.addedLayers[layerName]) {
    this.addedLayers[layerName].provider.hide();
    this._updateAvailableFilters();
  }
  }

  _dissapearLayer(layerName) {
  if (this.addedLayers[layerName]) {

    this.addedLayers[layerName].provider.dissapear();
  }
  }

  _restack() {
  Object.values(this.addedLayers)
    .filter(layer => layer.provider.visible)
    .sort((a, b) => {
      return a.provider.type === b.provider.type ?
      a.provider.zIndex ? b.provider.zIndex ?
        a.provider.zIndex > b.provider.zIndex : true :
        b.provider.zIndex ? false : 0
      : a.provider.type > b.provider.type;
    }
    ).forEach((layer, i) => {
    layer.layer.bringToFront();
    }
  );
  }

  _emit(event, payload) {
  if (this.events[event]) {
    this.events[event].forEach(callback => callback(payload))
  }
  }

  addDrawingComponents () {
  var options = {
    position: 'topleft', // toolbar position, options are 'topleft', 'topright', 'bottomleft', 'bottomright'
    drawPolyline: false, // adds button to draw a polyline
    drawRectangle: true, // adds button to draw a rectangle
    drawPolygon: true, // adds button to draw a polygon
    drawCircle: false, // adds button to draw a cricle
    cutPolygon: true, // adds button to cut a hole in a polygon
    editMode: false, // adds button to toggle edit mode for all layers
    drawMarker: false, // adds button to toggle edit mode for all layers
    removalMode: true, // adds a button to remove layers
  };

  let geoJsonLayer = L.geoJson(null, { pmIgnore: false });
  geoJsonLayer.addTo(this.map);
  // add leaflet.pm controls to the map
  this.map.pm.addControls(options);
  return geoJsonLayer;
  }

  removeDrawingComponents () {
  this.map.pm.removeControls();
  }
}