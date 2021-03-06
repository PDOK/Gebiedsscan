import LayerProvider from "../LayerProvider";
import turf from 'turf';
import axios from 'axios';

export default class extends LayerProvider {

  constructor(manager) {
    super(manager);
    this.label = 'Grondwater Saneringscontouren';
    this.name = 'GrondwaterPolutionSanitation';
    this.type = this.TYPE.GEOMETRY;
    this.filters = {};
    this.zoomBounds = [6, 15];
    this.legend = {
      'Saneringen': {
        'backgroundColor': '#fcef84',
        'border': '2px solid #e4b200'
      }
    };
  }
  render() {
    const geoJSONPolygons = require("../../assets/data/saneringscontour_eindhoven_epsg4326.json");

    this.layer = new L.GeoJSON(geoJSONPolygons, {
      pointToLayer(feature, latlng) {
        return L.circleMarker(latlng, {
          radius: 4,
          fillColor: "#E4B200",
          weight: 0,
          opacity: 1,
          fillOpacity: 0.6
        });
      },
      style(feature) {
        return {
          color: "#E4B200",
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
