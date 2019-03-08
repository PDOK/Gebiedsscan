<template>
  <div class="ondergrond-legend-box">
    <strong> Legenda </strong>
    <div class="inner">
      <div
        v-for="(item, index) in legendaItems"
        :key="index"
        class="item"
      >
        <span class="icon" :style="item.style"></span>
        <span class="name">{{item.name}}</span>
      </div>
    </div>
  </div>
</template>
<style lang="scss">
  .ondergrond-legend-box {
    // clear: both;
    display: block;
    font-size: 0.8em;

    .inner {
      height: auto;
      display: block;
      margin-top: 2px;
      overflow: hidden;


      .item {
        margin-top: 5px;
        .name {
          width: 100px;
          margin-left: 6px;
        }
        .icon {
          display: inline-block;
          vertical-align: middle;
          height: 10px;
          width: 10px;
          margin: 0 4px;
        }
      }
    }

  }
</style>

<script>
  export default{
    data() {
      return {
        legendShown: false
      }
    },
    props: {
      manager: null,
      layer: {
        type: String,
        required: true
      },
    },
    computed: {
      legendaItems(){
        return this.manager ? this.manager.getLayerLegend(this.layer) : [];
      }
    }
  }
</script>
