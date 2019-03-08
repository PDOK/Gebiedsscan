<template>
  <div>
    <slot></slot>
      <select @change="toggle()">
        <option v-for="option in renderableOptions" :key="option.value" 
        :value="option.value"
        :for="`filter${property}${option.name}`"
        :selected="activeFilters.indexOf(option.value) !== -1">
          {{option.name}}
        </option>
      </select>

  </div>
</template>

<script>
  export default{
    data(){
      return {
        activeFilters: [],
        defaultsSet: false
      }
    },
    props: {
      manager: null,
      params: {
        type: Object,
        required: true
      },
      property: {
        type: String,
        required: true
      }
    },
    computed: {
      renderableOptions(){
        if (!_.isObject(this.options[0])) {
          return this.options.map(name => {
            return {name: name, value: name}
          });
        }
        return this.options
      },
      options(){
        let options = this.params.filterOptions[this.property];

        if (options && !this.defaultsSet) {
          this.defaultsSet = true;

          let defaults = options.filter(option => option.standard).map(option => option.value);
          Vue.set(this.params.query, this.property, defaults || options.map(option => option.value));
          this.activeFilters = this.params.query[this.property];
        }
        return options || [];
      }
    },
    methods: {
      toggle(event){
        return event.target.value;
      }
    }
  }
</script>