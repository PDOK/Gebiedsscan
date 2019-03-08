<template>
      <div v-if="item" class="uk-modal-dialog uk-modal-body sk-modal-body">
        <button class="uk-modal-close-default uk-close uk-icon" type="button" uk-close=""></button>
        <nav class="sk-info-modal-header">
          <div class="uk-container uk-container-expand">
            <div class="uk-navbar">
                <ul class="uk-navbar-nav sk-info-modal-header-items" >
                  <li class="uk-active"><a href="#">{{item.properties.name}}</a></li>
                  <li>
                    <a href="#" >
                      <svg style="padding-right: 5px;" width="13" height="16" viewBox="0 0 13 16" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><title>Vector</title><desc>Created using Figma</desc><g id="Canvas" transform="translate(-13565 -2337)"><g id="Vector2"><use xlink:href="#path0_fill2" transform="translate(13565 2337)" fill="#2A5587"/></g></g><defs><path id="path0_fill2" d="M 6.5 16C 7.39375 16 8.125 15.2615 8.125 14.359L 4.875 14.359C 4.875 15.2615 5.59812 16 6.5 16ZM 11.375 11.0769L 11.375 6.97436C 11.375 4.45538 10.0425 2.34667 7.71875 1.78872L 7.71875 1.23077C 7.71875 0.549744 7.17438 0 6.5 0C 5.82562 0 5.28125 0.549744 5.28125 1.23077L 5.28125 1.78872C 2.94938 2.34667 1.625 4.44718 1.625 6.97436L 1.625 11.0769L 0 12.7179L 0 13.5385L 13 13.5385L 13 12.7179L 11.375 11.0769Z"/></defs></svg>
                      HOU MIJ OP DE HOOGTE
                    </a>
                     <div uk-dropdown="mode: click" style="z-index:2500;">
                       <form class="uk-form-horizontal interested-users-form">
                        <div class="uk-margin">
                          <label class="uk-form-label" for="form-h-text">Email:</label>
                          <div class="uk-form-controls">
                            <input v-model="interested_user.email" class="uk-input uk-form-width-large" id="form-h-text" type="text" placeholder="john_doe@example.com">
                          </div>
                        </div>

                         <div class="uk-margin">
                          <label class="uk-form-label" for="form-h-text">Voornaam:</label>
                          <div class="uk-form-controls">
                            <input v-model="interested_user.first_name" class="uk-input uk-form-width-large" id="form-h-text" type="text" placeholder="John">
                          </div>
                        </div>

                         <div class="uk-margin">
                          <label class="uk-form-label" for="form-h-text">Achternaam:</label>
                          <div class="uk-form-controls">
                            <input v-model="interested_user.last_name" class="uk-input uk-form-width-large" id="form-h-text" type="text" placeholder="Doe">
                          </div>
                        </div>

                        <div class="uk-margin">
                          <label class="uk-form-label" for="form-h-select">
                            Openbaar <i uk-icon="icon: info; ratio: 0.7" uk-tooltip="Uw contactgegevens worden gedeeld met andere geïnteresseerde zodat u de mogelijkheid heeft om in contact te treden"></i>
                          </label>
                          <div class="uk-form-controls">
                            <select v-model="interested_user.public" class="uk-select uk-form-width-large" id="form-h-select" required>
                              <option value="true">Ja</option>
                              <option value="false">Nee</option>
                            </select>
                          </div>
                        </div>
                        
                      </form>
                      <button @click="submitInterested" class="uk-button uk-button-secondary uk-button-small sk-fill-red-button uk-float-left uk-hidden@m">Verstuur</button>
                      <button @click="submitInterested" class="uk-button uk-button-secondary uk-button-small sk-fill-red-button uk-float-right uk-visible@m">Verstuur</button>
                     </div>
                  </li>
                  <li>
                    <a v-bind:class="likedProjectClass" @click="likeProject()">
                      <svg style="padding-right: 5px;" width="16" height="15" viewBox="0 0 16 15" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><title>Vector</title><desc>Created using Figma</desc><g id="Canvas" transform="translate(-13792 -2338)"><g id="Vector"><use xlink:href="#path0_fill3" transform="translate(13792 2338)" fill="#2A5587"/></g></g><defs><path id="path0_fill3" d="M 8 14.72L 6.88 13.6C 2.72 9.92 0 7.44 0 4.4C 0 1.92 1.92 -1.19677e-08 4.4 -1.19677e-08C 5.76 -1.19677e-08 7.12 0.64 8 1.68C 8.88 0.64 10.24 -1.19677e-08 11.6 -1.19677e-08C 14.08 -1.19677e-08 16 1.92 16 4.4C 16 7.44 13.28 9.92 9.12 13.6L 8 14.72Z"/></defs></svg>
                      ({{likes}}) LIKE 
                    </a>
                  </li>
                  <li>
                    <a href="#">
                      <svg style="padding-right: 5px;" width="16" height="16" viewBox="0 0 16 16" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><title>Vector</title><desc>Created using Figma</desc><g id="Canvas" transform="translate(-13886 -2337)"><g id="Vector"><use xlink:href="#path0_fill" transform="translate(13886 2337)" fill="#2A5587"/></g></g><defs><path id="path0_fill" d="M 13.0578 10.169C 12.1236 10.169 11.2995 10.6103 10.7612 11.2861L 5.76763 8.75407C 5.833 8.51231 5.87999 8.26252 5.87999 7.99963C 5.87999 7.71344 5.82419 7.444 5.74632 7.18182L 10.7178 4.66143C 11.2532 5.36782 12.0986 5.82953 13.0585 5.82953C 14.6846 5.82953 16 4.52527 16 2.91441C 16 1.305 14.6846 0 13.0586 0C 11.4361 0 10.1193 1.305 10.1193 2.91438C 10.1193 3.17801 10.1663 3.42851 10.2324 3.67101L 5.23957 6.20308C 4.70049 5.52657 3.87495 5.0838 2.93926 5.0838C 1.31464 5.0838 1.42873e-09 6.38951 1.42873e-09 7.99963C 1.42873e-09 9.60975 1.31468 10.9147 2.93926 10.9147C 3.90066 10.9147 4.74529 10.4516 5.28288 9.74449L 10.2522 12.2649C 10.1743 12.5263 10.1178 12.798 10.1178 13.0849C 10.1178 14.695 11.4347 16 13.0571 16C 14.6831 16 15.9985 14.695 15.9985 13.0849C 15.9993 11.4733 14.6839 10.169 13.0578 10.169Z"/></defs></svg>
                      DELEN
                    </a>
                    <div uk-dropdown="mode: click" style="z-index:2500;">

                     
                        <social-sharing :url="itemUrl"
                        :title="item.properties.name"
                        :description="item.properties.description"
                        inline-template>
                      <div>
                        <network network="email">
                           <div class="social__item">
                              <a target="_blank" href="#" class="social__icon--email"><i class="icon--email"></i></a>
                          </div>
                        </network>
                        <network network="facebook">
                          <div class="social__item">
                              <a target="_blank" href="#" class="social__icon--facebook"><i class="icon--facebook"></i></a>
                          </div>
                        </network>
                        <network network="googleplus">
                          <div class="social__item">
                              <a target="_blank" href="#" class="social__icon--googleplus"><i class="icon--googleplus"></i></a>
                          </div>
                        </network>
                        <network network="linkedin">
                          <div class="social__item">
                              <a target="_blank" href="#" class="social__icon--linkedin"><i class="icon--linkedin"></i></a>
                          </div>
                        </network>
                        <network network="skype">
                          <div class="social__item">
                              <a target="_blank" href="#" class="social__icon--skype"><i class="icon--skype"></i></a>
                          </div>
                        </network>
                        <network network="twitter">
                          <div class="social__item">
                              <a target="_blank" href="#" class="social__icon--twitter"><i class="icon--twitter"></i></a>
                          </div>
                        </network>
                        <network network="whatsapp">
                           <div class="social__item">
                              <a target="_blank" href="#" class="social__icon--whatsapp"><i class="icon--whatsapp"></i></a>
                          </div>
                        </network>
                      </div>
                      </social-sharing>
                     </div>
                  </li>
                </ul>
            </div>
          </div>
        </nav>
         <div class="sk-modal-content">
           <div class="uk-section uk-section-xsmall">
            <div class="uk-container">
              <ul id="element-switch" uk-tab="connect: .switcher-container">
                <li @click="selectTab('overzicht')" class="uk-active"><a href="#">Overzicht</a></li>
                <li @click="selectTab('visie')"><a href="#">Visie</a></li>
                <li @click="selectTab('toetsingskaders')"><a href="#">Toetsingskaders</a></li>
                <li @click="selectTab('ondergrond')"><a href="#">Ondergrond</a></li>
                <li @click="selectTab('vergunningen')"><a href="#">Vergunningen</a></li>
                <li @click="selectTab('omgevingsinformatie')"><a href="#">Omgevingsinformatie</a></li>
                <li @click="selectTab('nieuws')"><a href="#">Nieuws</a></li>
                <li @click="selectTab('deelnemers')"><a href="#">Deelnemers</a></li>
                <li @click="selectTab('contact')"><a href="#">Contact</a></li>
              </ul>
            </div>
           </div>

           <div class="sk-image-map-container">
            <div class="uk-flex uk-flex-wrap uk-flex-wrap-around">

              <div class="image-map-item">
                <template v-if="!streetViewVisible">
                  <img class="hero-image" :src="item.properties.hero_image" alt="">
                </template>
                
                <gmap-street-view-panorama v-if="streetViewVisible"
                  ref="pano"
                  :position="sreetViewInitialPoint"
                  :options="panoOptions"
                  @position_changed="updateCenter"
                  class="streetview-container">
                </gmap-street-view-panorama>
              </div>
              <div class="uk-width-expand@m image-map-item">
                <BaseMap 
                  :bounds="item.geometry" 
                  :params="params"
                  @managerSetup="managerSetup"
                ></BaseMap>

                <img v-if="streetViewVisible && 
                  !loadedTabs['ondergrond']" 
                  @click="toggleStreetView()" 
                  class="street-view-image" 
                  :src="item.properties.hero_image" alt="">
                <img v-if="!streetViewVisible  && !loadedTabs['ondergrond']" 
                  @click="toggleStreetView()" 
                  class="street-view-image"
                  :src="panoImage" alt="">
              </div>
            </div>
          </div>
           <div class="uk-switcher switcher-container">
            <div>
              <Overzicht v-if="loadedTabs['overzicht']" :item="item" :mapData="mapData"></Overzicht>   
            </div>
            <div>
              <Visie v-if="loadedTabs['visie']" :item="item" :mapData="mapData"></Visie>
            </div>
            <div>
              <Toetsingskaders :tabloaded="loadedTabs['toetsingskaders']" :manager="manager" :item="item" :mapData="mapData"></Toetsingskaders>
            </div>
            <div>
              <Ondergrond :params="params" :tabloaded="loadedTabs['ondergrond']" :manager="manager" :item="item" :mapData="mapData"></Ondergrond>
            </div>
            <div>
              <Vergunningen :tabloaded="loadedTabs['vergunningen']" :manager="manager" :item="item" :mapData="mapData"></Vergunningen>
            </div>
            <div>
              <Omgevingsinformatie  v-if="loadedTabs['omgevingsinformatie']" :bus="bus" :manager="manager" :item="item" :mapData="mapData"></Omgevingsinformatie>
            </div>
            <div>
              <Nieuws :tabloaded="loadedTabs['nieuws']" :item="item"></Nieuws>
            </div>
            <div>
               <Deelnemers :tabloaded="loadedTabs['deelnemers']" :item="item"></Deelnemers>
            </div>
             <div>
              <Contact :tabloaded="loadedTabs['contact']" :item="item"></Contact>
            </div>
          </div>
         </div>
      </div>
</template>

<style>
.streetview-container {
  width: 500px;
  height: 100%;
  display: inline-block;
}
</style>

<script>
import UIkit from "uikit";
import Manager from "../GeoDataManager/Manager";
import _ from "lodash";
import turf from "turf";
import Leaflet from 'leaflet';
import axios from 'axios';
import config from '../config'

export default {
  data() {
  return {
    loadedTabs: {
      overzicht: false,
      visie: false,
      toetsingskaders: false,
      ondergrond: false,
      vergunningen: false,
      omgevingsinformatie: false,
      nieuws: false,
      deelnemers: false,
      contact: false
    },
    bus: new Vue(),
    projectLiked: false,
    deelnemers: null,
    interested_user: {
    email: null,
    project_name: this.item.properties.name,
    first_name: null,
    last_name: null,
    public: null
    },
    streetViewMarker: null,
    streetViewIcon: L.icon({
      iconUrl: require('../assets/img/leaflet/pegman.png'), //https://www.fractuslearning.com/2014/12/03/class-tour-google-street-view/ icon url
      iconSize: [50, 40], // size of the icon
    }),
    sreetViewInitialPoint: { //by default in reality we use the panoid
        lat: 0,
        lng: 0,
      },
    likes: 0,
    streetViewVisible: false,
    manager: null,
    params: {
    query: {},
    layers: {
      Bestemmingsplangebied: false,
      Sondeeronderzoek: false,
      Verontreiniging: false,
      Grondwaterstand: false
    },
    filterOptions: {},
    options: {
      flyToBoundsAnimated: false
    }
    },
    mapData: {},
    highLightedLayer: null
  };
  },
  props: {
  item: {
    type: Object,
    default: null
  }
  },
  methods: {
  managerSetup(managerReference) {
    this.manager = managerReference;
    this.selectTab('overzicht');
    this.likes = this.item.properties.likes;
    this.manager.add([
    "ElementsLayer"
    ]);
    setTimeout(()=> {
    this.manager.getUnderPolygon(this.item.geometry).then(results => {
      _.each(results, result => {
      Vue.set(this.mapData, result.source, result);
      });
      this.manager.filter({ searchQuery: this.item.properties.name });
    });
    }, 1000);
  },
  selectTab(tab) {
    this.bus.$emit('ActiveTabChanged');
    this.loadedTabs[tab] = true;
    Object.keys(this.loadedTabs).forEach((key) => {
      Vue.set(this.loadedTabs, key, key === tab);
      // this.loadedTabs[key] = key === tab;
    })
    this.manager._hideLayer("Grondwaterstand");
    this.manager._hideLayer("Verontreiniging");
    this.manager._hideLayer("Sondeeronderzoek");
    this.manager._hideLayer("Bestemmingsplangebied");
    this.manager._hideLayer("Archeologie");
    this.manager._hideLayer("Rwsgeluidskaarten");
    this.manager._hideLayer("GemeentelijkeMonumenten");
    this.manager._hideLayer("GemeentelijkeMonumenten");
    this.manager._hideLayer("RijksMonumenten");
    this.manager._hideLayer("Bag");
    this.manager._hideLayer("BRK");
    this.manager._hideLayer("Vergunningen");

  },
  toggleStreetView() {
    this.streetViewVisible = !this.streetViewVisible;
  },
  updateCenter(newCenter) {
    if (this.streetViewMarker) {
      this.streetViewMarker.remove();
    }
    
    this.streetViewMarker = Leaflet.marker([newCenter.lat(), newCenter.lng()], {icon: this.streetViewIcon}),
    this.streetViewMarker.addTo(this.manager.map);
  },
  submitInterested() {
    axios.post(
      config.baseUrl + '/gebiedscan/project/interested-users', 
      this.interested_user).then(({data}) => {
        if (data.responseCode === 200) {
          UIkit.notification("Deelnemer succesvol aangemaakt", {status: 'success'})
        } else {
          UIkit.notification("Excuus er is iets fout gegaan - "+ data.error.detail, {status: 'danger'})
        }
      });
  },
  likeProject() {
    this.projectLiked = true;
    this.likes = this.item.properties.likes;
    axios.post(config.baseUrl +'/gebiedscan/likeProject/'+this.item.id).then(({data}) => {
      this.likes+=1;
    });

  }

  },
  computed: {
  keys() {
    if (this.item && this.item.properties) {
    return Object.keys(this.item.properties);
    } else {
    return [];
    }
  },
  streetViewCoords() {
    let coords = this.item.geometry.coordinates;

    if (this.item.geometry.type === "Polygon") {
    let polygon = this.item.geometry;
    polygon = turf.flip(polygon);
    let q = "";
    _.each(polygon.coordinates[0], coord => {
      q += `${coord[0]},${coord[1]},`;
    });
    coords = turf.centroid(this.item.geometry).geometry.coordinates;
    }
    return { lng: coords[0], lat: coords[1] };
  },
  panoOptions() {
    return { pano: this.item.properties.pano_id };
  },
  panoImage() {
    let panoid = this.item.properties.pano_id;
    return `https://maps.googleapis.com/maps/api/streetview?size=600x300&pano=${ panoid }&key=AIzaSyDcBTTexnELsgjN3iRTdqxwxrjDovUcb_U`;
    
  },
  likedProjectClass() {
    return {liked: this.item.properties.likes > 0 || this.projectLiked}
  },
  itemUrl() {
    var protocol = location.protocol;
    var slashes = protocol.concat("//");
    var host = slashes.concat(window.location.hostname);
    return host + this.$route.path;
  }
  },
  mounted() {

  },
  watch: {}
};
</script>
