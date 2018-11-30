/**
 * Created by TomasDePomas.
 * Using: PhpStorm
 * On: 2/6/18 - 1:42 PM
 */

import LayerProvider from "../LayerProvider";
import axios from 'axios';
import _ from 'lodash';

export default class extends LayerProvider {

  constructor(manager) {
    super(manager);

    // ------------------------------------- For the manager
    // applicable filters
    this.filters = {
      project_theme: [
        {
          name: "Inclusiviteit",
          value: "inclusiviteit",
          standard: true
        },
        {
          name: "Innovatie",
          value: "innovatie",
          standard: true

        },
        {
          name: "Duurzamheid",
          value: "duurzamheid",
          standard: true

        },
        {
          name: "Economie en werkgelegenheid",
          value: "economie en werkgelegenheid",
          standard: true
        }

      ],
      project_type: [
        {
          name: "Deelproject",
          value: "deelproject",
          standard: true
        },
        {
          name: "Project",
          value: "project",
          standard: true

        },
        {
          name: "Initiatief",
          value: "initiatief",
          standard: true

        }
      ],
      project_status: [
        {
          name: "In ontwikkeling",
          value: "in ontwikkeling",
          standard: true
        },
        {

          name: "Wijk in ontwikkeling",
          value: "wijk in ontwikkeling",
          standard: true
        },
        {
          name: "Positief beoordeeld",
          value: "positief beoordeeld",
          standard: true
        }
      ],
      project_participants: [
        {
          name: "Investors",
          value: "investors",
          standard: true
        },
        {
          name: "Ontwikkelaars",
          value: "ontwikkelaars",
          standard: true

        },
        {
          name: "Other",
          value: "other",
          standard: true
        }
      ],
      searchQuery: null
    };

    this.legend = {
      Project: {
        border: 'none',
        backgroundColor: "rgba(78,144,73,.8)",
      },
      Deelproject: {
        border: 'none',
        backgroundColor: "rgba(202,66,66,.9)",
      },
      Initiatief: {
        border: '1px solid black',
        borderRadius: '50%',
        backgroundColor: '#D62C1F'
      }
    };
    // the name you use to add this layer
    this.name = 'ElementsLayer';

    // the type of data in this layer, we might use this at some point for something
    this.type = this.TYPE.GEOMETRY;
    this.zIndex = 10;

    // Register the zoomBounds either as an array or by setting this.zoomMax and/or this.zoomMin
    // set only one if the other is not applicable. These values are inclusive
    this.zoomBounds = [8, 14];
  }

  // General render function that is called when the layer is added to the map. Needs to return a LeafletLayer
  render() {
    this.visible = true;
    this.geoJSON = this.formatProjects(require("../../assets/data/projects.json"));

    let dehighlight = (layer) => {
      if (this.selected && this.selected._leaflet_id !== layer._leaflet_id) {
        this.layer.resetStyle(layer);
      }
    }
    
    this.layer = new L.GeoJSON(this.geoJSON, {
      pointToLayer: (feature, latlng) => {
        return L.circleMarker(latlng, {
          radius: 8,
          fillColor: "#D62C1F",
          color: "#000",
          dashArray: '3',
          weight: 1,
          opacity: 1,
          fillOpacity: 0.8
        });
      },
      onEachFeature: (feature, layer) => {
        layer.on({
          mouseover: (e) => {
            var layer = e.target;
            layer.setStyle({
              weight: 2,
              dashArray: '3',
              color: '#000',
            });

            // See if there is already a selection
            if (this.selected !== null) {
              // Store for now
              this.previous = this.selected;
            }
            // Set new selection
            this.selected = layer;

            // If there was a previous selection
            if (this.previous) {
              // Dehighlight previous
              dehighlight(this.previous);
            }
          },
          mouseout: (e) => {
            dehighlight(e.target);
          }
        });

      },
      style: function (feature) {
        switch (feature.properties.category) {
          case 'project':
            return {fillColor: "#4e9049", weight: 0, 'opacity': 0.8};
          case 'deelproject':
            return {fillColor: "#ca4242", weight: 0, 'fill-opacity': 0.9};
        }
      },
      pane: "ElementsPane"
    });
    this.filter(this.manager.params);
    return this.layer;
  }


  filter(params = null) {
    let filtered = this.geoJSON.features.filter(feature => {
      if (params.query.project_type && params.query.project_type.indexOf(feature.properties.category.toLowerCase()) === -1) {
        return false
      }

      if (params.query.searchQuery) {
        let searchQuery = params.query.searchQuery.toLowerCase();
        return (
            feature.properties.name &&
            feature.properties.name.toLowerCase().indexOf(searchQuery) !== -1
          ) || (
            feature.properties.address.city &&
            feature.properties.address.city.toLowerCase().indexOf(searchQuery) !== -1
          ) || (
            feature.properties.description &&
            feature.properties.description.toLowerCase().indexOf(searchQuery) !== -1
          );
      }

      if (params.query.development_theme &&
        params.query.development_theme.length !== 4 && (
        !feature.properties.development_theme ||
        params.query.development_theme.indexOf(feature.properties.development_theme.toLowerCase()) === -1)) {
        return false
      }
      if (params.query.project_status &&
        params.query.project_status.length !== 3 && (
        !feature.properties.status ||
        params.query.project_status.indexOf(feature.properties.status.toLowerCase()) === -1)) {
        return false
      }

      if (params.query.project_participants &&
        params.query.project_participants.length !== 3 && (
        !feature.properties.project_participants ||
        params.query.project_participants.indexOf(
          feature.properties.types_of_participants.toLowerCase()
        ) === -1)
      ) {
        return false
      }

      return true;
    });

    this.layer.clearLayers();
    this.layer.addData({...this.geoJSON, features: filtered});
    this.layer.fire('change', {data: filtered});
  }

  clickEvent(event) {
    return event.layer.feature.properties;
  }

  formatProjects(projects) {
    projects = _.cloneDeep(projects);

    projects.features.map(project => {            
      Object.keys(project.properties).forEach(function (key) {
        let obj = project.properties[key];
        
        if (Array.isArray(obj)) {
          if (project.properties[key].length && project.properties[key][0] && Array.isArray(project.properties[key][0])) {
            project.properties[key] = project.properties[key][0];

            switch (key) {
              case 'address':
              project.properties[key] = project.properties[key][0];
                break;
            }
          }
        }
      });
      
      return project;
    })
    return projects;        
  }
}