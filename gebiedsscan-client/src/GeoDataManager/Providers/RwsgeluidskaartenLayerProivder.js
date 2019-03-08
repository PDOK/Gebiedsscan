/**
 * Created by TomasDePomas.
 * Using: PhpStorm
 * On: 2/6/18 - 1:42 PM
 */

import LayerProvider from "../LayerProvider";
import axios from 'axios';
import turf from 'turf';
import _ from 'lodash';


export default class extends LayerProvider {

  constructor(manager) {
    super(manager);
    this.name = 'Rwsgeluidskaarten';
    this.type = this.TYPE.TILES;
    this.zIndex = 10;
    this.itemGeoJsonLayer = null;
    // restrict data retrieval to these zoom level bounds:
    this.zoomBounds = [10, 13];

    this.legend = {
      gebiedsgrens: {
        'height': '8px',
        'width': '8px',
        'border-radius': '50%',
        'background-color': 'black',
        'border': '2px solid black'
      }
    };
  }

  render() {
    this.visible = true;
    this.layer = L.tileLayer.wms('https://geodata.nationaalgeoregister.nl/rwsgeluidskaarten/wms', {
      layers: 'Lnight_2016',
      format: 'image/png',
      transparent: true,
      opacity: 0.7
    });
    return this.layer;
  }

  getUnderPoint(point) {
    var url = this.getFeatureInfoUrl(
      this.manager.map,
      this.layer,
      point,
      {
        'info_format': 'application/json'
      }
    );

    return new Promise(resolve => {
      axios.get(url)
        .then(({data}) => {
          if (this.itemGeoJsonLayer)
            this.itemGeoJsonLayer.remove();
          try {
            this.itemGeoJsonLayer = L.Proj.geoJson(data);
          } catch (error) {
            console.error(error, data);
            resolve({});
          }

          let style = {
            stroke: false,
            fillColor: '#000000',
            fill: true,
            fillOpacity: 0.6
          };

          this.itemGeoJsonLayer.setStyle(style);

          if (data.features) {
            resolve({
              label: 'Rwsgeluidskaarten',
              source: this.name,
              layer: this.itemGeoJsonLayer,
              data: data.features.map(feature => feature.properties),
            });
          }
          resolve({});
        });

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

    return layer._url + L.Util.getParamString(params, layer._url, true);

  }

  clickEvent(event) {
    return event.latlng;
  }
}
