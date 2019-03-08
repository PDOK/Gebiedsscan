<template>
  <div data-component="LayerDropdown">
    <div>
    <strong>
      <slot></slot>
    </strong>
    <select v-model="selected">
      <option v-for="(layer, index) in layers" :key="index">
        {{ layer }}
      </option>
    </select>

    </div>
    <OndergrondLegend v-if="selected" :layer="selected" :manager="manager"></OndergrondLegend>
  </div>
</template>
<script>
  export default{
    props: {
      manager: null,
      params: {
        type: Object,
        required: true
      },
      preSelected: {
        type: Boolean,
      },
      layers: {
        type: Array,
        required:true
      },
      newSelectedLayer: '',
      oldSelectedLayer: ''

    },
    data() {
      return {
        selected: null
      }
    },
    watch: {
      selected(newSelectedLayer, oldSelectedLayer) {
        this.params.layers[newSelectedLayer] = true
        this.params.layers[oldSelectedLayer] = false
      },

      preSelected (newValue) {
        if (newValue) {
          this.selected = this.layers[0]
        } else {
          this.selected = null
        }
      },
    }
  }
</script>