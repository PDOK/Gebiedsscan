/**
 * Created by TomasDePomas.
 * Using: PhpStorm
 * On: 2/6/18 - 1:42 PM
 */

import LayerProvider from "../LayerProvider";


export default class extends LayerProvider {

  constructor(manager) {
    super(manager);
    this.label = 'Rijksmonument';
    this.name = 'RijksMonumenten';
    this.legend = {
      Monument: {
        border: '2px solid #4e2e7c',
        backgroundColor: "#c2c3c4"
      }
    }

    this.type = this.TYPE.GEOMETRY;
    this.filters = {
      rijksaanduiding: [
        "Woonhuis", "Villa", "School", "Herenhuis", "Dienstwoning", "Poortgebouw/Woonhuis",
        "Grafmonument", "Klooster", "Pastorie", "Kerk", "Woonhuis/Fabriek", "Fabriek", "Boerderij",
        "Winkel/Woonhuis", "Kantoor", "Gemeentehuis", "Brug", "Watermolen", "Landhuis", "Gerechtsgebouw",
        "Kapel", "Kosterswoning", "Gezellenhuis", "Joodse begraafplaats", "Legeringsgebouw", "Standbeeld",
        "Oranjerie", "Koetshuis", "Bankgebouw", "Woonhuis/Atelier", "Museum", "Begraafplaats", "Station",
        "Luchthavengebouw", "Kerktoren", "Poortgebouw", "Paviljoen", "Herberg", "Gedenkteken", "Observatorium",
        "Kasteel", "tuin bij kasteel", "Ommuring met poort en brug", "Boerderij/herberg", "Kapel/Foyer",
        "Hoofdgebouw", "Ketelhuis", "Windmolen", "Stuw", "Kloosterterrein met gracht", "Klooster/School",
        "Winkel"
      ],
      rijksbouwjaar: [{
        min: 10,
        max: 2018
      }]
    };
    this.zoomBounds = [6, 15];

  }

  render() {
    this.visible = true;

    const geoJSONEindhoven = require("../../assets/data/Eindhoven_rijksmonumenten.json");
    const geoJSONUtrecht = require("../../assets/data/rijksmonumenten/utrecht_rijksmonum_epsg4326.json");
    this.geoJSON = geoJSONEindhoven;
    this.geoJSON.features = [...this.geoJSON.features, ...geoJSONUtrecht.features];

    this.layer = new L.GeoJSON(this.geoJSON, {
      pointToLayer(feature, latlng) {
        return L.circleMarker(latlng, {
          radius: 4,
          fillColor: "#4e2e7c",
          weight: 0,
          opacity: 1,
          fillOpacity: 0.8
        });
      },
      style(feature) {
        return {
          color: "#4e2e7c",
          weight: 2,
          opacity: 1,
        }
      }
    });
    this.layer.addData(geoJSONUtrecht);

    return this.layer;
  }


  clickEvent(event) {
    return event.layer.feature.properties;
  }

  filter(params = null) {
    params = params || this.manager.params;
    let filtered = this.geoJSON.features.filter(feature => {
      // if (params.query.rijksaanduiding &&
      //   (
      //     feature.properties.AANDUIDING &&
      //     params.query.rijksaanduiding.indexOf(feature.properties.AANDUIDING) === -1
      //   )
      // ) {
      //   return false;
      // }

      // if (params.query.rijksbouwjaar) {
      //   let year = null;
      //   if (feature.properties.BOUWJAAR) {
      //     year = feature.properties.BOUWJAAR.match(/[0-9]{4}/);
      //     if (year) {
      //       year = year[0];
      //     }
      //   } else {
      //     year = feature.properties.BOUWJR_VAN ||
      //       feature.properties.BOUWJR_TOT ||
      //       feature.properties.BEGBOUWJR ||
      //       feature.properties.EINDBOUWJR;

      //   }

      //   if (year) {
      //     year = parseInt(year);
      //     if (
      //       parseInt(params.query.rijksbouwjaar.max) < year ||
      //       parseInt(params.query.rijksbouwjaar.min) > year) {
      //       return false;
      //     }
      //   } else {
      //     console.log(feature)
      //     return false;
      //   }
      // }
      return true;
    });

    this.layer.clearLayers();
    this.layer.addData({...this.geoJSON, features: filtered});
    this.layer.fire('change', {data: filtered});
  }
}