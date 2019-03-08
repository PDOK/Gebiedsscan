<template>
   <div class="uk-visible@m">
     <div class="uk-button-group sk-project-list-control-collapsed" v-bind:class="{ 'uk-box-shadow-large': !visible}">
      <button v-bind:class="{ 'sk-button-red': !visible, 'sk-button-bold': !visible }" @click="visible = false" class="uk-button uk-button-small sk-button ">Kaart</button>
      <button v-bind:class="{ 'sk-button-red': visible, 'sk-button-bold': visible }" @click="visible = true;" class="uk-button uk-button-small sk-button">Lijst</button>
    </div>
    <div id="waterlevels" class="sk-legend-list uk-box-shadow-large" style="visibility: hidden">
        <ul class="uk-list"> Legenda (in m):
          <li>
            <span class="item" style="background-color: #2A5587"></span> 0 - 0,5
          </li>
           <li>
            <span class="item" style="background-color: #2FA9ED"></span> 0,5 - 0,7
          </li>
           <li>
            <span class="item" style="background-color: #63DF58"></span> 0,7 - 0,9
          </li>
           <li>
            <span class="item" style="background-color: #EFF34B"></span> 0.9 - 1.1
          </li>
          <li>
            <span class="item" style="background-color: #FFC960"></span> 1,1 - 1,3
          </li>
          <li>
            <span class="item" style="background-color: #ffa77f"></span> 1,3 - 1,5
          </li>
          <li>
            <span class="item" style="background-color: #ff7f7f"></span> >1,5
          </li>
        </ul>
      </div>
     <div v-show="visible" class="uk-card uk-card-default uk-card-body uk-card-small uk-width-1-3@m sk-project-list-control uk-box-shadow-large">
      <h3 class="uk-card-title uk-card-title-small">Activiteit op kaart</h3>
      <ul uk-tab class="uk-flex-nowrap">
        <li @click="setList('project')" class="uk-active"><a class="uk-text-small" href="#">Projecten ({{projectCount}})</a></li>
        <li @click="setList('deelproject')"><a href="#" class="uk-text-small">DeelProjecten ({{subprojectCount}})</a></li>
        <li @click="setList('initiatief')"><a href="#" class="uk-text-small">Initiatief ({{initiativeCount}})</a></li>
      </ul>
      <ul class="uk-list uk-list-large uk-list-divider sk-elements-list uk-height-large uk-overflow-auto">
        <router-link class="uk-link-reset" v-for="item in currentList" :key="item.id" :to="{ name: 'explore', params: { subroute: 'bekijken', searchtype: 'element', query: item.properties.name }}" >
          <li @click="visible = false" class="sk-elements-item">
            <h6 class="sk-color-red uk-text-bold uk-margin-remove-bottom">
              {{item.properties.name}}
            </h6>
            <p class="sk-elements-list-item-description"><span class="uk-text-capitalize">{{item.properties.category}}</span> <span v-if="item.properties.address">in <strong>{{item.properties.address.city}}</strong></span></p>
            <div class="uk-grid-small uk-grid" uk-grid="">
              <div class="uk-width-1-5@m">
                <img v-if="item.properties.hero_image" :src="item.properties.hero_image" alt="">
                <img v-else src="https://dummyimage.com/200x160/cccccc/ffffff.png&text=No+Image" alt="">
              </div>
              <div class="uk-width-4-5@m">
                <span style="font-size:12px;">{{item.properties.short_description}}</span>
              </div>
            </div>
            <hr class="uk-margin-remove-bottom uk-margin-small-bottom">
          </li>
        </router-link>
      </ul>
    </div>
   </div>
</template>

<script>
  export default {
    props: {
      content: Array,
      closed: Boolean,
      bus: {
        type: Object
      },
    },
    data() {
      return {
        selectedList: 'project',
        visible: false
      }
    },
    computed: {
      projectCount(){
        return this.content.filter(item => item.properties.category === 'project').length
      },
      subprojectCount(){
        return this.content.filter(item => item.properties.category === 'deelproject').length
      },
      initiativeCount(){
        return this.content.filter(item => item.properties.category !== 'project' && item.properties.category !== 'deelproject').length
      },
      currentList(){
        if (this.selectedList === 'initiatief') {
          return this.content.filter(item => {
            if (item.properties.category) {
              return this.content.filter(item => item.properties.category !== 'deelproject' && item.properties.category !== 'project')
            }
          });
        } else {
          return this.content.filter(item => {
            if (item.properties.category) {
              return item.properties.category.includes(this.selectedList)
            }
          });
        }
      },
    },
    methods: {
      setList(list){
        this.selectedList = list;
      },
    },
    mounted() {
      console.log(this.content)

      this.bus.$on('gemeenteChanged', (gemeente) => {
        // this.gemeente = gemeente;
        // console.log('gemeente')
      });
    },
    watch: {
      closed: {
         //used to notify internally if the element needs to be closed (parent's order)
         //hacky but effective
        handler(closed) {
          this.visible = false;
        }
      }
    }

  }

</script>
