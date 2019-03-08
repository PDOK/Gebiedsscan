<template>
   <div class="uk-navbar-container sk-explore-navbar-container">
      <div class="uk-container uk-container-expand">
        <nav class="uk-navbar">
          <div class="uk-navbar-left">
            <a class="uk-navbar-toggle uk-hidden@m" uk-navbar-toggle-icon href="#" uk-toggle="target: #offcanvas-filtermenu"></a>
             <!-- shown on bigger devices -->
             <router-link class="uk-navbar-item uk-logo uk-logo-home uk-text-uppercase" :to="{name: 'home'}">Gebiedsscan</router-link>
            <ul class="uk-navbar-nav">
              <li v-if="gemeente === 'Gemeente Utrecht'" class="uk-active uk-visible@m"><a href="#"><img style="height:40px;" src="https://www.utrecht.nl/typo3conf/ext/alternet_sitepackage/Resources/Public/Images/svg/wapen-utrecht-rood.svg" alt=""></a></li>
              <li v-if="gemeente === 'Gemeente Eindhoven'" class="uk-active uk-visible@m"><a href="#"><img style="height:24px;" src="https://www.eindhoven.nl/themes/eindhoven/logo.svg" alt=""></a></li>
              <li v-if="gemeente !== 'Gemeente Eindhoven' && gemeente !== 'Gemeente Utrecht'" class="uk-active uk-visible@m">{{gemeente}}</li>
            </ul>
            <a href="#search-window"  uk-toggle class="uk-visible@m">
              <div class="uk-navbar-item">
                <form class="uk-search uk-search-navbar uk-width-large">
                  <span uk-search-icon class="uk-search-icon uk-icon uk-search-icon-small"></span>
                  <input class="uk-search-input uk-search-input-small xsmall-placeholder" type="search" placeholder="Zoek op plaats, project, deelproject, initiatief of straat en huisnummer">
                  <SearchWindow modalId="search-window"></SearchWindow>
                </form>
              </div>
            </a>
          </div>
          <div class="uk-navbar-right">
            <div class="uk-navbar-item uk-visible@m">
               <router-link :to="{name: 'explore', 
              params: { subroute: 'bekijken'}}" 
              class="uk-button uk-button-small sk-button sk-button-gray" >Initiatieven bekijken</router-link>
            </div>
            <div class="uk-navbar-item uk-visible@m uk-padding-remove-horizontal">
              <router-link :to="{name: 'explore', 
              params: { subroute: 'mijnplan'}}" 
              class="uk-button uk-button-secondary uk-button-small sk-fill-red-button" 
              uk-toggle="target: #offcanvas-flip">Mijn plan</router-link>
            </div>
          </div>
        </nav>
      </div>
    </div>
</template>
<script>
  export default{
    props: {
      bus: {
        type: Object
      }
    },
    data() {
      return {
        elements: null,
        gemeente: null
      }
    },
    computed: {
      navbarLogo() {
        let filtered = require("../assets/data/projects.json").features.filter(feature => {
             if (this.$route.params.query) {
              let searchQuery = this.$route.params.query.toLowerCase();
              return (
                  feature.properties.name &&
                  feature.properties.name.toLowerCase().indexOf(searchQuery) !== -1
                ) || (
                  feature.properties.city &&
                  feature.properties.address[0][0].city.toLowerCase().indexOf(searchQuery) !== -1
                ) || (
                  feature.properties.description &&
                  feature.properties.description.toLowerCase().indexOf(searchQuery) !== -1
                );
            }
        });
        if (filtered.length) {
          return filtered[0].properties.address[0][0].city;
        } else {
          return '';
        }
      }
    },
    mounted() {
      // 
      this.bus.$on('gemeenteChanged', (gemeente) => {
        this.gemeente = gemeente;
      });
    }
  }

</script>