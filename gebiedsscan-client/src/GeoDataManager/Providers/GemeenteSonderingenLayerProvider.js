import LayerProvider from "../LayerProvider";
import axios from 'axios';
import turf from 'turf';
import _ from 'lodash';

export default class extends LayerProvider {

  constructor(manager) {
    super(manager);
    this.name = 'GemeenteSonderingen';
    this.type = this.TYPE.TILES;
    this.zIndex = 10;
    this.itemGeoJsonLayer = null;
    this.legend = {
      Gemeentelijk: {
        width: '0',
        height: '0',
        borderLeft: '5px solid transparent',
        borderRight: '5px solid transparent',
        borderTop: '10px solid #a87000',
      },
    };
  }

  render() {
    this.visible = true;
    this.layer = L.tileLayer.wms('https://www.dinoloket.nl/arcgis/rest/services/dinoloket/lks_gso_rd/MapServer/export', {
      layers: 'show%3A0%2C1',
      f: 'image',
      dpi: '220',
      format: 'png32',
      transparent: true
    });

    return this.layer;
  }

  getUnderPoint(point) {
    // this.manager.map,
    // this.layer,
    // point,
    const mapBounds = this.manager.map.getBounds()
    const mapExtent = [
      mapBounds.getWest(),
      mapBounds.getSouth(),
      mapBounds.getEast(),
      mapBounds.getNorth(),
    ]
    const geometry = {
      x: point[1],
      y: point[0],
    }
    const params = {
      'f':'json',
      tolerance: '10',
      returnGeometry: 'true',
      returnFieldName: 'false',
      returnUnformattedValues: 'false',
      imageDisplay: '2020,698,96',
      geometry: JSON.stringify(geometry),
      geometryType: 'esriGeometryPoint',
      sr: '4326',
      mapExtent: `${mapExtent[0]},${mapExtent[1]},${mapExtent[2]},${mapExtent[3]}`,
      layers: 'top:0',
    }

    return new Promise((resolve, reject) => {
      axios.get(`https://www.dinoloket.nl/arcgis/rest/services/dinoloket/lks_gso_rd/MapServer/identify`, {
        params,
      })
        .then(({data}) => {
          if (this.itemGeoJsonLayer) {
            this.itemGeoJsonLayer.remove();
          }

          try {
            if (data.results && data.results[0]) {
              this.itemGeoJsonLayer = L.circleMarker(
                L.latLng(data.results[0].geometry.x, data.results[0].geometry.y),
                {
                  radius: 8,
                  fillColor: "#D62C1F",
                  color: "#000",
                  dashArray: '3',
                  weight: 1,
                  opacity: 1,
                  fillOpacity: 0.9
              });
            }
          } catch (error) {
            reject(error, data);
          }

          let style = {
            stroke: false,
            fillColor: '#000000',
            fill: true,
            fillOpacity: 0.6
          };

          this.itemGeoJsonLayer.setStyle(style);

          if (data.results[0].attributes) {
            resolve({
              label: 'Gemeente sonderingen',
              source: this.name,
              layer: this.itemGeoJsonLayer,
              data: [data.results[0].attributes],
            });
          }
          resolve({});
        }).catch(reject);

    });
  }

  getUnderPolygon(polygon) {

    let point = turf.flip(turf.centroid(polygon)).geometry.coordinates;
    return this.getUnderPoint(point);
  }

  getFeatureInfoUrl(map, layer, latlng, params) {
    var point = map.latLngToContainerPoint(latlng, map.getZoom()),
      size = map.getSize(),
      bounds = map.getBounds(),
      sw1 = bounds.getSouthWest(),
      ne1 = bounds.getNorthEast(),
      sw = map.options.crs.projection._proj.forward([sw1.lng, sw1.lat]),
      ne = map.options.crs.projection._proj.forward([ne1.lng, ne1.lat]);

    var defaultParams = {
      request: 'GetFeatureInfo',
      service: 'WMS',
      srs: layer._crs.code,
      styles: '',
      version: layer._wmsVersion,
      format: layer.options.format,
      bbox: [sw.join(','), ne.join(',')].join(','),
      height: size.y,
      width: size.x,
      layers: layer.options.layers,
      query_layers: layer.options.layers,
      info_format: 'text/html'
    };

    params = L.Util.extend(defaultParams, params || {});

    params[params.version === '1.3.0' ? 'i' : 'x'] = Math.round(point.x);
    params[params.version === '1.3.0' ? 'j' : 'y'] = Math.round(point.y);

    console.log('params', params)

    return layer._url + L.Util.getParamString(params, layer._url, true);

  }

  clickEvent(event) {
    return event.latlng;
  }
}
