<template>
  <div :id="modalId" class="uk-modal-full uk-modal sk-search-modal" uk-modal>
    <div class="uk-modal-dialog" uk-height-viewport>
      <button class="uk-modal-close-full " type="button" uk-close></button>
      <div class="uk-section uk-section-xsmall uk-padding-remove-top">
        <div class="uk-container uk-container-small">
          <form class="uk-search uk-search-large uk-width-1-1">
            <input class="uk-search-input uk-text-center medium-placeholder"
              type="search"
              placeholder="Zoek op plaats, project, deelproject, initiatief of straat en huisnummer"
              autofocus
              v-model="searchQuery"
              @keyup="applySearch"
              @keydown="$event.keyCode === 13 ? $event.preventDefault() : false">
          </form>
        </div>
      </div>

      <div class="uk-section uk-section-small uk-padding-remove-top uk-padding-remove-bottom">
        <div class="uk-container uk-container-medium">
          <div class="uk-grid-divider" uk-grid>
            <div class="uk-width-1-4@m">
              <template>
                <h5>Gemeente / Plaats / Straat</h5>
                <ul class="uk-list">
                  <li v-if="locations.length" v-for="location in locations"
                    :key="location.id">
                    <a class="uk-link-text" v-on:click="select('location', location.weergavenaam)"
                       href="#">{{location.weergavenaam}}</a>
                  </li>
                  <div v-if="!locations.length" class="uk-padding-small uk-text-center"><h4 class="uk-text-muted"> No Results...</h4></div>
                </ul>
              </template>
            </div>
            <div class="uk-width-3-4@m">
              <template>
                <div class="sk-container-results">
                    <h5>Initiatieven</h5>
                    <div v-if="!projectsAndSubProjects.length" class="uk-padding-small uk-text-center"><h4 class="uk-text-muted"> No Results...</h4></div>
                    <div @click="select('element', initiative.properties.name)" v-for="initiative in initiatives" :key="initiative.id" class="sk-initiatief" :uk-tooltip="initiative.properties.name">
                        <img v-if="initiative.properties.hero_image" class="uk-border-circle"
                              :src="initiative.properties.hero_image"
                              style="width:80px;height:80px;" alt="Border circle">
                        <img class="uk-border-circle" v-else style="width:80px;height:80px;" src="https://dummyimage.com/120x120/cccccc/ffffff.png&text=No+Image" alt="" >
                    </div>
                  <h5 class="uk-margin-remove-top">Projects</h5>
                  <div v-if="!projectsAndSubProjects.length" class="uk-padding-small uk-text-center"><h4 class="uk-text-muted"> No Results...</h4></div>
                  <div v-else @click="select('element', project.properties.name)" class="uk-card uk-card-default sk-result-card uk-box-shadow-hover-large" v-for="project in projectsAndSubProjects" :key="project.id">
                    <div class="uk-card-media-top">
                      <img v-if="project.properties.hero_image" style="height:200px;width:100%;" :src="project.properties.hero_image" alt="">
                      <img v-else style="height:200px;width:100%;" src="https://dummyimage.com/600x400/cccccc/ffffff.png&text=No+Image+Found" alt="">
                    </div>
                    <div class="uk-card-body uk-padding-remove-top uk-card-small">
                      <div class="uk-card-badge uk-label uk-label-warning">{{project.properties.category}}</div>
                      <h3 class="uk-card-title uk-margin-remove-bottom sk-result-card-title">{{project.properties.name}}</h3>
                      <p class="uk-margin-remove-top uk-margin-remove-bottom sk-result-card-description">{{project.properties.description || 'No description'}}</p>
                    </div>
                  </div>
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
  /* @import "../../node_modules/leaflet/dist/leaflet.css"; */
</style>

<script>
  import UIkit from 'uikit';
  import Manager from '../GeoDataManager/Manager';

  export default{
    data() {
      return {
        searchQuery: '',
        previousQuery: '',
        projects: [],
        manager: null,
        locations: [],
        loadingProjects: false,
        loadingLocations: false
      }
    },
    props: {
      managerReference: {
        type: Object,
        default: undefined
      },
      targetRoute: {
        type: String,
        default: 'THIS_ROUTE'
      },
      modalId: {
        type: String,
        default: 'full-modal'
      }
    },
    methods: {
      /**
       * runs:
       *      when: on search input key up.
       *      why: User needs to search for projects and addresses
       */
      applySearch(){
        if (this.searchQuery !== this.previousQuery) {
          this.manager.filter({searchQuery: this.searchQuery});
          this.previousQuery = this.searchQuery;
          this.loadingProjects = true;
          this.loadingLocations = true;
        }
      },
      select(type, query) {
        UIkit.modal('#' + this.modalId).hide();
        this.$router.push({
          name: 'explore',
          params: {
            searchtype: type,
            query: query,
            subroute: 'bekijken'
          }
        });
         
        
      },
      updateProjects(projects){
        this.projects = projects;
        this.loadingProjects = false;
      },
      updateLocations(locations){
        this.locations = locations;
        this.loadingLocations = false;
      },
    },
    computed: {
      initiatives(){
        return this.projects.filter(item => {
          if (item.properties.category) {
            return item.properties.category.toLowerCase() === 'initiatief'
          }
        });
      },
      projectsAndSubProjects(){
        return this.projects.filter(item => {
          if (item.properties.category) {
            return item.properties.category.toLowerCase() !== 'initiatief'
          }
        });
      }
    },
    mounted()
    {
      this.manager = new Manager();
      this.manager.add(['ElementsLayer', 'LocationsLayer']);
      this.manager.on('change', 'ElementsLayer', this.updateProjects);
      this.manager.on('change', 'LocationsLayer', this.updateLocations);
      this.manager.filter({searchQuery: ' '});//to show all projects at the beginning

      var el = document.querySelector(".sk-container-results");
    },
  }

</script>