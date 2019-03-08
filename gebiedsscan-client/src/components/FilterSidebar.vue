<template>
  <div class="sk-filter-sidebar-control uk-visible@m">
    <div class="uk-card uk-card-default uk-card-small uk-card-body sk-filter-sidebar-card uk-box-shadow-large">
      <ul uk-tab class="uk-navbar-nav sk-filter-sidebar-header">
        <li class="uk-active uk-width-1-2"><a href="#">FILTERS</a></li>
        <li class="uk-width-1-2" style="padding-left: 0;"><a href="#">DATASETS</a></li>
      </ul>
      <ul class="uk-switcher uk-margin">
        <li class="uk-padding-small uk-padding-remove-top">
          <ul uk-accordion="multiple: true">
            <li class="uk-open">
              <a class="uk-accordion-title" href="#">Ontwikkelingsthema</a>
              <div class="uk-accordion-content">
                <div class="uk-margin-small-top">
                  <h6 class="uk-margin-small-bottom"><b></b></h6>
                  <CheckboxFilter :params="params" :manager="manager"
                          property="project_theme"></CheckboxFilter>
                </div>
              </div>
            </li>
            <!-- END: Gebiedsfunctie en Other -->

            <!-- START: Gebiedsfunctie en Other -->
            <li class="uk-open">
              <a class="uk-accordion-title" href="#">Soort initatief <Legend layer="ElementsLayer" :manager="manager"></Legend></a>
              <div class="uk-accordion-content">
                <div class="uk-margin-small-top">
                  <h6 class="uk-margin-small-bottom"><b></b></h6>
                  <CheckboxFilter :params="params" :manager="manager"
                          property="project_type"></CheckboxFilter>
                </div>
              </div>
            </li>
            <!-- END: Gebiedsfunctie en Other -->

            <!-- START: Gebiedsfunctie en Other -->
            <li class="uk-open">
              <a class="uk-accordion-title" href="#">Status initatief</a>
              <div class="uk-accordion-content">
                <div class="uk-margin-small-top">
                  <h6 class="uk-margin-small-bottom"><b></b></h6>
                  <CheckboxFilter :params="params" :manager="manager"
                          property="project_status"></CheckboxFilter>
                </div>
              </div>
            </li>
            <!-- END: Gebiedsfunctie en Other -->
          </ul>
        </li>

        <li class="uk-padding-small uk-padding-remove-top">
          <ul uk-accordion="multiple: true">
            <li class="uk-open">
              <a class="uk-accordion-title" href="#">Omgevingsinformatie</a>
              <div class="uk-accordion-content">
                <div class="uk-margin-small-top">
                  <h6 class="uk-margin-small-bottom"><b></b></h6>
                  <LayerToggle :params="params" :manager="manager" layer="Bestemmingsplangebied">
                    Ruimtelijke plangebieden
                  </LayerToggle>
                  <LayerToggle :params="params" :manager="manager" layer="Bag">
                    BAG informatie
                  </LayerToggle>
                  <LayerToggle :params="params" :manager="manager" layer="BRK">
                    Kadastrale grenzen
                  </LayerToggle>
                  <LayerToggle :params="params" :manager="manager"
                        layer="Rwsgeluidskaarten">
                    Rwsgeluidskaarten
                  </LayerToggle>
                  <LayerToggle :params="params" :manager="manager"
                        layer="Bomen">
                    Bomen
                  </LayerToggle>
                </div>
              </div>
            </li>

            <li class="uk-open">
              <ul uk-accordion="multiple: true">
                <li class="uk-open">
                  <a class="uk-accordion-title" href="#">Ondergrond</a>
                    <div class="uk-accordion-content">
                      <LayerToggle :params="params" :manager="manager" layer="Archeologie">
                        Archeologie
                      </LayerToggle>
                      <LayerToggle :params="params" :manager="manager" layer="GemeenteSonderingen">
                        Sonderingen (gemeenteniveau)
                      </LayerToggle>
                      <LayerToggle :params="params" :manager="manager" layer="RijksSonderingen">
                        Sonderingen (rijksniveau)
                      </LayerToggle>
                      <LayerToggle :params="params" :manager="manager" layer="WarmteKoudeopslag">
                        Warmte- en koudeopslag
                      </LayerToggle>
                      <LayerToggle :params="params" :manager="manager" layer="BooronderzoekDinoLoket">
                        Booronderzoek
                      </LayerToggle>
                      <br>
                      <ul class="uk-nav">
                        <li class="uk-active">
                          <h6 class="uk-margin-remove-bottom">Grondwater</h6>
                            <LayerToggle :params="params" :manager="manager" layer="GrondwaterLevels">
                            Grondwaterstanden
                            </LayerToggle>
                            <LayerToggle :params="params" :manager="manager" layer="GrondwaterPolution">
                            Verontreiniging gebieden
                            </LayerToggle>
                            <LayerToggle :params="params" :manager="manager" layer="GrondwaterPolutionSanitation">
                            Verontreiniging saneringen
                            </LayerToggle>
                            <LayerToggle :params="params" :manager="manager" layer="GrondwaterPolutionCareMeasures">
                            Verontreiniging zorgmaatregelen
                            </LayerToggle>
                            <LayerToggle :params="params" :manager="manager" layer="meetpunten">
                            Meetpunten
                            </LayerToggle>
                        </li>
                      </ul>
                  </div>
                </li>
              </ul>
            </li>

            <li class="uk-open">
              <ul uk-accordion="multiple: true">
                <li class="uk-open">
                  <a class="uk-accordion-title" href="#">Historie</a>
                  <div class="uk-accordion-content">
                    <div class="">
                      <LayerToggle :params="params" :manager="manager"
                            layer="GemeentelijkeMonumenten">
                        Gemeentelijke monumenten
                      </LayerToggle>
                      <SearchCheckboxFilter :params="params" :manager="manager"
                                property="aanduiding">
                        Aanduiding
                      </SearchCheckboxFilter>

                      <RangeFilter :params="params" :manager="manager"
                              property="bouwjaar">
                        Bouwjaar
                      </RangeFilter>
                    </div>

                    <div class="">
                      <!-- <LayerToggle :params="params" :manager="manager"
                            layer="Rce">
                        Rijksmonumenten (landelijk)
                      </LayerToggle> -->
                      <LayerToggle :params="params" :manager="manager"
                            layer="RijksMonumenten">
                        Rijksmonumenten
                      </LayerToggle>
                      <SearchCheckboxFilter :params="params" :manager="manager"
                                property="rijksaanduiding">
                        Aanduiding
                      </SearchCheckboxFilter>

                      <RangeFilter :params="params" :manager="manager"
                            property="rijksbouwjaar">
                        Bouwjaar
                      </RangeFilter>
                    </div>

                    <div class="">
                      <LayerToggle :params="params" :manager="manager"
                            layer="Fotos">
                        Historische luchtfoto's
                      </LayerToggle>
                      <RangeFilter :params="params" :manager="manager"
                            property="JAAR">
                        Bouwjaar
                      </RangeFilter>
                    </div>
                    <div class="">
                      <LayerToggle :params="params" :manager="manager"
                            layer="Marienhage">
                        Cultuurhistorie (monumenten en archeologie)
                      </LayerToggle>
                    </div>
                  </div>
                </li>
              </ul>
            </li>

             <li class="uk-open">
              <ul uk-accordion="multiple: true">
                <li class="uk-open">
                  <a class="uk-accordion-title" href="#">Gebiedsfunctie en bedrijvigheid</a>
                  <div class="uk-accordion-content">
                    <LayerToggle :params="params" :manager="manager"
                        layer="KVK">
                        SBI-codes
                      </LayerToggle>
                  </div>
                </li>
              </ul>
            </li>

            <li class="uk-open">
              <ul uk-accordion="multiple: true">
                <li class="uk-open">
                  <a class="uk-accordion-title" href="#">Vergunningen</a>
                  <div class="uk-accordion-content">
                    <LayerToggle :params="params" :manager="manager"
                        layer="Vergunningen">
                      Vergunningen
                    </LayerToggle>
                    <LayerToggle :params="params" :manager="manager"
                        layer="Bekendmakingen">
                    Bekendmakingen
                    </LayerToggle>
                  </div>
                </li>
              </ul>
            </li>
            <li class="uk-open">
              <ul uk-accordion="multiple: true">
                <li class="uk-open">
                  <a class="uk-accordion-title" href="#">Woningbouwprojecten</a>
                  <div class="uk-accordion-content">
                    <LayerToggle :params="params" :manager="manager"
                          layer="Woningbouw">
                      Woningbouwprojecten
                    </LayerToggle>
                  </div>
                </li>
              </ul>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  export default{
    props: {
      manager: null,
      availableLayers: {
        type: [Array, Object],
        default: () => []
      },
      params: {
        type: Object,
        default: () => {
          return {
            query: {},
            layers: {},
            filterOptions: {}
          }
        },
      }
    },
    mounted(){
      Vue.set(this.params, 'layers', this.availableLayers.reduce((layers, layer) => {
          if (layer instanceof Object) {
            layers[layer.name] = !!layer.standard;
            return layers;
          }

          layers[layer] = false;
          return layers;
        }, {})
      );
    }
  }
</script>
