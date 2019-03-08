<template>
  <div class="flexbox-parent">
     <div>
      <ExploreNavbar :bus="bus"></ExploreNavbar>
     </div>

     <div class="flexbox-item-grow map-container skcontainer">
      <FilterSidebar
          v-show="$route.params.subroute !== 'mijnplan'"
          :manager="manager"
          :params="params"
          :availableLayers="layers"
      ></FilterSidebar>

      <!-- <MobileFilterSidebar
          v-show="$route.params.subroute !== 'mijnplan'"
          :manager="manager"
          :params="params"
          :availableLayers="layers"
      ></MobileFilterSidebar> -->

      <BaseMap :bounds="bounds"
           :params="params"
           @managerSetup="managerSetup"
           @availableFiltersUpdated="availableFiltersUpdated"
           @LocationsLayerChange="locationsChanged"
           @BRTBackgroundClick="mapClicked"
           @ElementsLayerClick="projectClicked"
           @ElementsLayerChange="projectsChanged"
      >
      </BaseMap>

       <ElementsList 
        :closed="elementListClosed"
        :bus="bus"
        :content="projects">
      </ElementsList>

      <PreviewBox 
            v-show="$route.params.subroute !== 'mijnplan'"
            v-if="mapPreviewData"
            :manager="manager"
            :content="mapPreviewData"
            :infoObjects="infoObjects"
            @dismiss="projectPreviewClosed">
      </PreviewBox>
    
      <MijnPlan v-if="manager"
        :manager="manager"
        :bus="bus">
      </MijnPlan>
      
     </div>

     

  </div>
</template>

<script>
  import Manager from '../../GeoDataManager/Manager';
  var WKT = require('terraformer-wkt-parser');
  import UIkit from 'uikit';
  import axios from 'axios';
  
  export default {
    data () {
      return {
        bus: new Vue(),
        manager: null,
        bounds: null,
        elementListClosed: true,
        projects: [],
        infoObjects: [],
        mapPreviewData: null,
        
        params: {
          query: {},
          layers: {},
          filterOptions: {},
          options: {
            flyToBoundsAnimated: true
          }
        },
        layers: [
          {
            name: "LocationsLayer", standard: true
          }, 
          {
            name: "Bestemmingsplangebied", standard: false
          }, 
          {
            name: "Bag", standard: false
          }, 
          {
            name: "BRK", standard: false
          }, 
          {
            name: "GemeentelijkeMonumenten", standard: false
          }, 
          {
            name: "RijksMonumenten", standard: false
          }, 
          {
            name: "Woningbouw", standard: false
          },
          {
            name: "Vergunningen", standard: false
          },
          {
            name: "Archeologie", standard: false
          },
          {
            name: "GemeenteSonderingen", standard: false
          },
          {
            name: "RijksSonderingen", standard: false
          },
          {
            name: "Sondeeronderzoek", standard: false
          },
          {
            name: "GrondwaterPeilbuizenTab", standard: false
          },
          {
            name: "GrondwaterPolution", standard: false
          },
          {
            name: "GrondwaterPolutionSanitation", standard: false
          },
          {
            name: "GrondwaterPolutionCareMeasures", standard: false
          },
          {
            name: "GrondwaterLevels", standard: false
          },
          {
            name: "meetpunten", standard: false
          },
          {
            name: "WarmteKoudeopslag", standard: false
          },
          {
            name: "Rwsgeluidskaarten", standard: false
          },
          {
            name: "Fotos", standard: false
          },
          {
            name: "CBS", standard: false
          },
          {
            name: "Bomen", standard: false
          },
          {
            name: "ElementsLayer", standard: true
          },
          {
            name: "KVK", standard: false
          },
          {
            name: "Marienhage", standard: false
          },
          {
            name: "Rce", standard: false
          },
          {
            name: "Bekendmakingen", standard: false
          },
          {
            name: "BooronderzoekDinoLoket", standard: false
          },
        ]
      }
    },
    methods: {

      projectClicked(project){

      },
      mapClicked(point){
        this.elementListClosed = true;
        this.manager.getUnderPoint([point.lat, point.lng])
          .then(results => {
            this.bus.$emit('infoUnderPoint', results);
            if (this.$route.params.subroute === 'mijnplan') return;
            this.infoObjects = results;

            let elementResult = results.find((result) => result.source === 'ElementsLayer');

            if (elementResult) {
              let project = elementResult.data;
              this.$router.push({
                name: 'explore', params: {
                  subroute: 'bekijken', searchtype: 'element', query: project[0].name
                }
              })
            } else {

              if (this.$route.params.subroute !== 'mijnplan') {
                this.$router.push({name: 'explore', params: {subroute: 'bekijken'}})
                this.mapPreviewData = results;
              }
            }
          })
          .catch(error => console.error(error));
      },
      projectsChanged(projects)
      {
        this.projects = projects;
      },
      locationsChanged(locations)
      {
        if (locations[0]) {
          let location = locations[0].centroide_ll;
          this.bounds = WKT.parse(location);
        }
      },
      projectPreviewClosed()
      {
        this.$router.push({name: 'explore', params: {subroute: 'bekijken'}})
        this.mapPreviewData = null;
      },
      infoPreviewClosed()
      {
        this.showInfoPreview = false;
      },
      managerSetup(managerReference)
      {
        this.manager = managerReference;

        this.manager.map.on('moveend', (event) => {
          let point = event.target._lastCenter;
          if (point && point.lng && point.lat) {
            const params = {
              lat: point.lat,
              lon: point.lng,
              rows: 1,
            }
            axios.get(`https://geodata.nationaalgeoregister.nl/locatieserver/v3/suggest?bq=type:gemeente`,{
              params,
            })
            .then(({data}) => {
              let gemeente = data.response.docs[0].weergavenaam;
              this.bus.$emit('gemeenteChanged', gemeente);
            });
          }
        });

      },
      availableFiltersUpdated(filters){
        this.params.filterOptions = filters;
      },
      goToItem() {
        if (this.$route.params.subroute === 'mijnplan') {
          return; //if my plan then dont select project.
        }
        switch (this.$route.params.searchtype) {
          case 'element':
            let searchQuery = this.$route.params.query;
            if (!searchQuery)
              break;

            let project = this.projects.find(project => {
              return project.properties.name &&
                project.properties.name.toLowerCase() === searchQuery.toLowerCase()
            });

            if (project) {
              this.bounds = project;
              this.mapPreviewData = project;
              return project;
            }
            break;
          case 'location':
            this.manager.filter({address: this.$route.params.query}) //used to get the location of the query in the url
            break;
        }
      }
    },
    watch: {
      $route()
      {
        this.manager._showLayer("ElementsLayer"); //used when user comes from 'mijnplan' route.
        this.goToItem()
      },
      projects(newItem, oldItem) { //Runs goToItem when projetcs are loaded from manager SHOULD BE IMPROVED
        if (newItem !== oldItem) {
          this.goToItem();
        }
      }
    },
    activated() {
      // this.goToItem();
      // UIkit.util.on('#offcanvas', 'show', function () {
      //         // do something
      //     });
    },
    computed: {},
    beforeRouteLeave(to, from, next) {
      UIkit.offcanvas('#offcanvas-flip').hide();
      next();
    }
  }
</script>
