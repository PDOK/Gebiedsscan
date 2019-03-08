<template>
  <div v-if="legendaItems.length" @mouseleave="legendShown = false" class="legend-box">
    <i uk-icon="icon: info; ratio: 0.7" @mouseover="legendShown = true"></i>
    <div v-show="legendShown" class="inner">
      <!-- <strong>Legenda (in m)</strong> -->
      <div v-for="item in legendaItems" :key="item.id" class="item">
        <span class="icon" :style="item.style"></span>
        <span class="name">{{item.name}}</span>
      </div>
    </div>
  </div>
</template>
<style lang="scss">
  .legend-box {
    // clear: both;
    display: inline;

    i {
      // float: right;

    }

    .inner {
      position: absolute;
      right:20%;
      display: block;
      width: 120px;
      padding: 5px 8px;
      border-radius: 4px;
      z-index: 3;
      background-color: white;
      -webkit-box-shadow: 0 14px 25px rgba(0, 0, 0, 0.16);
      box-shadow: 0 14px 25px rgba(0, 0, 0, 0.16);

      .item {
        clear: both;
        .name {
          width: 100px;
          word-wrap: break-word;
        }
        .icon {
          float: right;
          height: 10px;
          width: 10px;
          margin: 4px;
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
