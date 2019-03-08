// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex';
import _ from 'lodash';
window.Vue = Vue;
window._ = _;
import * as VueGoogleMaps from 'vue2-google-maps'
import VueLocalStorage from 'vue-localstorage'
import SocialSharing from 'vue-social-sharing';

import App from './views/layout/app'
import routes from './routes.js'
import VueRouter from 'vue-router';
import SearchWindow from './components/SearchWindow.vue';
import ExploreNavbar from './components/ExploreNavbar.vue';

import BaseMap from './components/BaseMap.vue';
import FilterSidebar from './components/FilterSidebar.vue';
import MobileFilterSidebar from './components/MobileFilterSidebar.vue';
import MapControls from './components/map-controls/MapControls.vue';
import LayerToggle from './components/filters/LayerToggle.vue';
import CheckboxFilter from './components/filters/CheckboxFilter.vue';
import SearchCheckboxFilter from './components/filters/SearchCheckboxFilter.vue';
import RangeFilter from './components/filters/RangeFilter.vue';
import Legend from './components/Legend.vue';
import ElementsList from './components/map-controls/ElementsList.vue';
import PreviewBox from './components/map-controls/PreviewBox.vue';
import ObjectInfoModal from './components/ObjectInfoModal.vue';
import ElementInfoModal from './components/ElementInfoModal.vue';
import MijnPlan from './components/MijnPlan.vue';
import Overzicht from './components/element-info-modal-tabs/Overzicht.vue';
import Visie from './components/element-info-modal-tabs/Visie.vue';
import Toetsingskaders from './components/element-info-modal-tabs/Toetsingskaders.vue';
import Ondergrond from './components/element-info-modal-tabs/Ondergrond';
import Vergunningen from './components/element-info-modal-tabs/Vergunningen.vue';
import Omgevingsinformatie from './components/element-info-modal-tabs/Omgevingsinformatie.vue';
import Nieuws from './components/element-info-modal-tabs/Nieuws.vue';
import Deelnemers from './components/element-info-modal-tabs/Deelnemers.vue';
import Contact from './components/element-info-modal-tabs/Contact.vue';
import VObject from './components/element-info-modal-tabs/subcomponents/VObject';
import LayerDropdown from './components/filters/LayerDropdown.vue';
import OndergrondLegend from './components/filters/OndergrondLegend.vue';
import DropdownFilter from './components/filters/DropdownFilter.vue';

Vue.use(VueRouter);
Vue.use(VueLocalStorage)
Vue.use(SocialSharing)
Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyA3Z64h9uA1cJD4t_O4ZulAN9lg1rTsvow',
  }
  });

Vue.config.productionTip = false;

const router = new VueRouter({
  mode: 'history',
  routes
});
Vue.component('DropdownFilter', DropdownFilter);
Vue.component('LayerDropdown', LayerDropdown);
Vue.component('SearchWindow', SearchWindow);
Vue.component('BaseMap', BaseMap);
Vue.component('FilterSidebar', FilterSidebar);
Vue.component('MobileFilterSidebar', MobileFilterSidebar);
Vue.component('MapControls', MapControls);
Vue.component('LayerToggle', LayerToggle);
Vue.component('CheckboxFilter', CheckboxFilter);
Vue.component('SearchCheckboxFilter', SearchCheckboxFilter);
Vue.component('RangeFilter', RangeFilter);
Vue.component('Legend', Legend);
Vue.component('ExploreNavbar', ExploreNavbar);
Vue.component('ElementsList', ElementsList);
Vue.component('PreviewBox', PreviewBox);
Vue.component('ObjectInfoModal', ObjectInfoModal);
Vue.component('ElementInfoModal', ElementInfoModal);
Vue.component('MijnPlan', MijnPlan);
Vue.component('OndergrondLegend', OndergrondLegend);

//modalTabs
Vue.component('Overzicht', Overzicht);
Vue.component('Visie', Visie);
Vue.component('Toetsingskaders', Toetsingskaders);
Vue.component('Ondergrond', Ondergrond);
Vue.component('Vergunningen', Vergunningen);
Vue.component('Omgevingsinformatie', Omgevingsinformatie);
Vue.component('VObject', VObject);
Vue.component('Nieuws', Nieuws);
Vue.component('Deelnemers', Deelnemers);
Vue.component('Contact', Contact);

const app = new Vue({
  components: {App},
  router,
  el: '#app'
});