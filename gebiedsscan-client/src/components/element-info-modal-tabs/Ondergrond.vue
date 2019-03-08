<template>
  <div class="uk-container uk-section-xsmall">

    <div
      v-if="tabloaded"
      class="uk-panel dropdown-ondergrond">
      <LayerDropdown
        :preSelected="tabloaded"
        :params="params"
        :manager="manager"
        :layers="['Grondsoort','Verontreiniging','Grondwaterstand']">
        Kies ondergrond:
      </LayerDropdown>
    </div>

    <div
      v-if="item.properties.name === 'Kanaaldijk noord'"
      class="uk-container"
    >
      <svg style="display:none">
        <defs>
          <symbol id="thumbsup" width="18" height="16" viewBox="0 0 18 16" fill="none">
            <path d="M9.76458 0.357517L5.30123 4.82086C5.00314 5.11896 4.83395 5.52984 4.83395 5.95684V14.0054C4.83395 14.8916 5.55904 15.6167 6.44527 15.6167H13.6962C14.3407 15.6167 14.9208 15.23 15.1786 14.6418L17.805 8.51078C18.4818 6.91558 17.3136 5.14313 15.5814 5.14313H11.0295L11.7948 1.45321C11.8754 1.05038 11.7546 0.639498 11.4645 0.349461C10.9892 -0.117821 10.2319 -0.117821 9.76458 0.357517ZM1.61132 15.6167C2.49754 15.6167 3.22263 14.8916 3.22263 14.0054V7.5601C3.22263 6.67388 2.49754 5.94879 1.61132 5.94879C0.725092 5.94879 0 6.67388 0 7.5601V14.0054C0 14.8916 0.725092 15.6167 1.61132 15.6167Z" fill="#27AE60"/>
          </symbol>
          <symbol id="thumbsdown" width="18" height="16" viewBox="0 0 18 16" fill="none">
            <path d="M8.23316 15.2627L12.6895 10.7983C12.9876 10.5002 13.1569 10.0892 13.1569 9.66208V1.61169C13.1569 0.72526 12.4316 0 11.5452 0H4.30064C3.65597 0 3.07576 0.386805 2.82595 0.975072L0.198893 7.10755C-0.486075 8.70312 0.6824 10.476 2.41497 10.476H6.96799L6.20244 14.1667C6.12185 14.5697 6.24273 14.9807 6.53283 15.2708C7.00828 15.7381 7.76577 15.7381 8.23316 15.2627ZM16.3883 0C15.5019 0 14.7766 0.72526 14.7766 1.61169V8.05845C14.7766 8.94487 15.5019 9.67014 16.3883 9.67014C17.2747 9.67014 18 8.94487 18 8.05845V1.61169C18 0.72526 17.2747 0 16.3883 0Z" fill="#FF8A00"/>
          </symbol>

        </defs>
      </svg>

      <h5 class="uk-text-bold sk-preview-card-title uk-padding-remove-left uk-padding-small">Regelgeving</h5>
      <span>Krijg inzicht in de mogelijkheden en voorwaarden omtrent gebiedsontwikkeling op basis van de ondergrond van het gebied.</span>
      <br>
      <div class="uk-margin-top"><span class="info-modal-ondergrond-header">Sonderingen</span><hr class="hr-border"></div>
      <ul uk-accordion="" class="uk-accordion">
        <li>
          <a class="uk-accordion-title" href="#">
            <svg class="svg-icon">
              <use xlink:href="#thumbsup" />
            </svg>
            De stabiliteit van de bodem is voldoende voor bouwinitiatieven
          </a>
          <div class="uk-background-muted uk-accordion-content uk-margin-top">
            <div class="uk-padding-small"><p>Zandgronden kennen een goede draagkracht: het is een stevig materiaal en weinig zettingsgevoelig.</p>
          Buiten de grote aaneengesloten leemgebieden en veengebieden is de bodem van Eindhoven zeer heterogeen opgebouwd.
          De deklaag (ca. 0-20 m-mv) is over het algemeen zandig met veel leemlenzen en hier en daar wat veen.</div></div>
        </li>
        <li>
          <a class="uk-accordion-title" href="#">
            <svg class="svg-icon">
              <use xlink:href="#thumbsup" />
            </svg>De bodem is geschikt om regenwater op te vangen
          </a>
          <div class="uk-accordion-content uk-margin-top uk-background-muted" >
              <div class="uk-padding-small">
            <p> Een zandbodem is geschikt om water te bergen. </p>
              In het algemeen is de Eindhovense bodem goed geschikt om water te bergen. Waterberging in de stad is echter lastig. Dit komt door de grote verdichting in de stad en door het grote aantal leemlenzen.
              Bepalende factoren voor waterberging in de ondergrond zijn:
              <ul>
                <li>grondsoort;</li>
                <li>hoeveelheid organische stof in de bodem;</li>
                <li>ondergrondopbouw;</li>
                <li>grondwatertrap;</li>
                <li>verdichting (door berijden en betreden)</li>
                <li>bodemafdekking (bebouwing en asfalt en andere vormen van bestrating).</li>
              </ul>
            </div>
          </div>
      </li>
      </ul>
      <div class="uk-margin-top"><span class="info-modal-ondergrond-header">Warmte- en koudeopslag</span><hr class="hr-border"></div>
      <ul uk-accordion="" class="uk-accordion">
        <li>
          <a class="uk-accordion-title" href="#">
            <svg class="svg-icon down">
              <use xlink:href="#thumbsup" />
            </svg>
            Warmte- en koudeopslag is mogelijk
          </a>
          <div class="uk-accordion-content uk-margin-top uk-background-muted uk-padding" >
              <div class="uk-padding-small">
              <p>De watervoerende bodemlagen tussen 30 en 80 meter diep (tot 80 meter beneden maaiveld) zijn geschikt om koude en warmte in op te slaan. In potentie is de hele Eindhovense ondergrond geschikt voor de toepassing van warmtekoude-opslagsystemen (WKO's).</p>
              Een temperatuur van ongeveer 11 graden is geschikt om grondwater in de zomer te gebruiken om gebouwen af te koelen.
            </div>
          </div>
      </li>
      </ul>
      <div class="uk-margin-top"><span class="info-modal-ondergrond-header">Grondwaterverontreiniging</span><hr class="hr-border"></div>
      <ul uk-accordion="" class="uk-accordion">
                <li>
          <a class="uk-accordion-title" href="#">
            <svg class="svg-icon down">
              <use xlink:href="#thumbsdown" />
            </svg>
            Er is grondwater- en bodemverontreiniging
          </a>
          <div class="uk-background-muted uk-accordion-content uk-margin-top"><div class="uk-padding-small">

            <p>De informatie laat zien dat er sprake is van verontreiniging (waterverontreiniging) o.a. bepaald door chlooretheen waarden boven 170 mg/l.</p>
            <p>
            <strong>Grondwater</strong><br>
            locatie:0.655_Hugo van der Goeslaan 1_VOCL<br>
            componenents: Zware metalen,PAK (10-VROM),Minerale olie,BETX,VOCL,Overige verontreinigingen<br>
            volume: 999999<br>
            </p>
            <p>

            <strong>Grondwater</strong><br>
            locatie: 0.702 Rogier van der Weydenstraat 45<br>
            components: Zware metalen,Minerale olie,BETX<br>
            opmerking: De vlekken zijn niet volledig ingekaderd<br>
            volume 650.000
            </p>
            <p>
            <strong>Grond</strong><br>
            locatie: 0.702 Rogier vd Wijdestraat_ PCB<br>
            components: PCB's / OCB's<br>
            volume: 710.000
            </p>
            <p>

            <strong>Grond sanerings</strong><br>
            locatie: 0.702 Rogier van der Weydenstraat 45<br>
            WRK_SANB_N: De verontreiniging in de grond is volledig verwijderd, er heeft echter geen aanvulling plaatsgevonden
            </p>
          </div></div>
        </li>

        <li>
          <a class="uk-accordion-title" href="#">
            <svg class="svg-icon">
              <use xlink:href="#thumbsdown" />
            </svg>
            Moet ik grondwater onttrekken voor de bouw van de parkeerkelder
          </a>
          <div class="uk-background-muted uk-accordion-content uk-margin-top">
            <div class="uk-padding-small">
            Indien de parkeerkelder fundering niet onder de 1,5 uitkomt is volgens de grondwaterstanden data bebouwing mogelijk. Echter biedt deze data niet voldoende detailinformatie waarop zo’n beslissing gebaseerd kan zijn. Vandaar dat aanvullend grondonderzoek (middels sonderingen) benodigd is om te komen tot een gedetailleerd advies.
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>

  export default {
    props: {
      item: {
        type: Object,
        default: null
      },
      mapData: {
        type: Object
      },
      manager: {
        type: Object
      },
      tabloaded: {
        type: Boolean
      },
      layers: {
        Grondsoort: false,
        Verontreiniging: false,
        Grondwaterstand: false
      },
      params: {
        type: Object,
        required: true
      },

    },
    data() {
      return {
        highLightedItemLayer: null,
      }
    },
  }

</script>
