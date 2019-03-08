import LayerProvider from "../LayerProvider";
import turf from 'turf';
import axios from 'axios';

export default class extends LayerProvider {

  constructor(manager) {
    super(manager);
    this.label = 'Grondwater Verontreiningingscontouren';
    this.name = 'GrondwaterPolution';
    this.type = this.TYPE.GEOMETRY;
    this.filters = {};
    this.zoomBounds = [6, 15];
    this.legend = {
      'Vervuilde': {
        'backgroundColor': '#c0ba95',
        'border': '2px solid #a9a26b'
      }
    };
  }
  render() {
    const geoJSONPolygons = require("../../assets/data/verontreiningingscontour_eindhoven_epsg4326.json");

    this.layer = new L.GeoJSON(geoJSONPolygons, {
      pointToLayer(feature, latlng) {
        return L.circleMarker(latlng, {
          radius: 4,
          fillColor: "#958D49",
          weight: 0,
          opacity: 1,
          fillOpacity: 0.8
        });
      },
      style(feature) {
        return {
          color: "#958D49",
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
