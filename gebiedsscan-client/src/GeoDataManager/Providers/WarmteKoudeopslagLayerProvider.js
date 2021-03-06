import LayerProvider from "../LayerProvider";
import turf from 'turf';
import axios from 'axios';

export default class extends LayerProvider {

  constructor(manager) {
    super(manager);
    this.label = 'WarmteKoudeopslag';
    this.name = 'WarmteKoudeopslag';

    this.type = this.TYPE.GEOMETRY;
    this.legend = {
      legend: '#d5463d'
    };
    this.filters = {};

    this.zoomBounds = [6, 15];

  }
  render() {
    const geoJSONPolygons = require("../../assets/data/kwo_eindhoven_epsg4326.json");

    this.layer = new L.GeoJSON(geoJSONPolygons, {
      pointToLayer(feature, latlng) {
        return L.circleMarker(latlng, {
          radius: 8,
          fillColor: "#D62C1F",
          color: "#000",
          dashArray: '3',
          weight: 1,
          opacity: 1,
          fillOpacity: 0.9
        });
      },
      style(feature) {
        return {
          stroke: false,
          fillColor: '#D62C1F',
          fill: true,
          fillOpacity: 0.6
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