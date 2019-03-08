import LayerProvider from "../LayerProvider";
import turf from 'turf';
import axios from 'axios';

export default class extends LayerProvider {

  constructor(manager) {
    super(manager);
    this.label = 'Zorgmaatregelingen';
    this.name = 'GrondwaterPolutionCareMeasures';
    this.type = this.TYPE.GEOMETRY;
    this.filters = {};
    this.zoomBounds = [6, 15];
    this.legend = {
      'Zorgmaatregelingen': {
        'backgroundColor': '#f6d4a3',
        'border': '2px solid #e69113',
      }
    };
  }
  render() {
    const geoJSONPolygons = require("../../assets/data/zorgmaatregel_eindhoven_epsg4326.json");

    this.layer = new L.GeoJSON(geoJSONPolygons, {
      pointToLayer(feature, latlng) {
        return L.circleMarker(latlng, {
          radius: 4,
          fillColor: "#E48900",
          weight: 0,
          opacity: 1,
          fillOpacity: 0.8
        });
      },
      style(feature) {
        return {
          color: "#E48900",
          weight: 2,
          opacity: 1,
        }
      },
    });

    this.layer.addData(geoJSONPolygons);

    return this.layer;
  }

  clickEvent(event) {
    return event.layer.feature.properties;
  }
}
