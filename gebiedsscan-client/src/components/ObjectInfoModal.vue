<template>
  <div v-if="item && item.data && item.data.length" class="uk-modal-dialog uk-modal-body sk-modal-body">
    <button class="uk-modal-close-default uk-close uk-icon" type="button" uk-close=""></button>
      <nav  class="sk-info-modal-header">
        <div class="uk-container uk-container-expand">
          <div class="uk-navbar">
            <div class="uk-navbar-left">
              <ul class="uk-navbar-nav sk-info-modal-header-items" >
                <li class="uk-active"><a href="#">{{item.label}}</a></li>
              </ul>
            </div>
          </div>
        </div>
      </nav>
       <div class="sk-modal-content">
        <div v-if="item && item.data && item.data.length">
          <div v-if="item.label === 'Marienhage'">
             <div class="uk-container uk-margin-top">
              <h5 class="sk-color-red uk-text-bold uk-margin-top sk-preview-card-title">{{item.data[0].name}}</h5>
              <p>{{item.data[0].description}}</p>
              <h5 class="sk-color-red uk-text-bold sk-preview-card-title">Historie</h5>
              <p>{{item.data[0].historie}}</p>
             </div>
             <div class="uk-section uk-section-xsmall">
            <div class="uk-container">
              <div v-if="item.data[0].external && item.data[0].external.length" class="uk-grid-small uk-grid-match uk-child-width-1-3@s uk-margin-top" uk-grid>
                <div v-for="article in item.data[0].external" :key="article.id">

                  <div v-if="article.resource_title" class="uk-card uk-card-default uk-box-shadow-hover-large">
                    <div v-if="article.resource_img_url" class="uk-card-media-top uk-cover-container">
                      <img :src="article.resource_img_url" alt="" uk-cover>
                      <canvas height="200"></canvas>
                    </div>
                    <div class="uk-card-body">
                      <h3 class="uk-card-title uk-margin-remove-bottom">{{article.resource_title}} <a target="_blank" :href="article.resource_img_url"><span class="sk-color-red" uk-icon="icon: link;"></span></a></h3>
                      <p v-if="article.resource_description">{{article.resource_description || 'No description'}}</p>
                      <p v-else class="uk-card-body-nieuws">Geen nieuwsberichten</p>
                    </div>
                  </div>
                </div>
              </div>
              <div v-else class="uk-container">
                <p>Geen artikelen gevonden</p>
              </div>
            </div>
          </div>
          </div>
           <ul v-else-if="item.label === 'Bestemmingsplangebied'" class="uk-margin-top">
            <li style="font-size:13px;line-height: 1.8em;" class="uk-list" v-if="bpg.title === 'verwijzingnaarteksturl' ||
              bpg.title === 'naam' ||
              bpg.title === 'plangebied' ||
              bpg.title === 'planstatus' ||
              bpg.title === 'dossierstatus' ||
              bpg.title === 'typeplan' ||
              bpg.title === 'naamoverheid'"
              v-for="bpg in formattedItem" :key="bpg.id">
              <strong class="uk-text-capitalize">{{bpg.title}}: </strong>
              <span v-if="bpg.type === 'text'" >{{bpg.value}}</span>
              <span v-if="bpg.type === 'link'" v-for="value in bpg.value" :key="value.id"> <br /><a :href="value"  target="_blank" > {{value}} </a> </span>
            </li>
          </ul>
          <ul v-else class="uk-margin-top">
            <li class="uk-list" style="font-size:13px;line-height: 1.8em;"
              v-for="item in formattedItem"
              :key="item.id">
              <b>{{item.label}}:</b>
              <template v-if="Array.isArray(item.value)">
                <div
                :key="index"
                v-for="(subItem, index) in item.value"
                >
                  {{subItem}}
                </div>
              </template>
              <template v-else>
                {{item.value}}
              </template>
              </li>
          </ul>
         </div>
       </div>
    </div>
</template>

<style>
  /* @import "../../node_modules/leaflet/dist/leaflet.css"; */
</style>

<script>
  import UIkit from 'uikit';
  import Manager from '../GeoDataManager/Manager';
  import _ from 'lodash';

  export default{
    props: {
      item: {
        required: true
      }

    },
    methods: {
    },
    data(){
      return {
        accordion: {
          Bag: {
            identificatiecode: 'Identificatie Code',
            oorspronkelijkBouwjaar: 'Oorspronkelijk Bouwjaar',
            status: 'Status',
            inOnderzoek: 'In Onderzoek',
            geconstateerd: 'Geconstateerd',
            aanduidingInactief: 'Aanduiding Inactief',
            fulladdress: 'fulladdress'
          },
          BRK: {
            kadastralegemeentenaam: 'Kadastrale Gemeentenaam',
            perceelnummer_rotatie: 'Perceelnummer Rotatie',
            sectie: 'Sectie',
            kadastraleGemeenteCode: 'Kadastrale Gemeentecode',
            kadastralegrootte: 'Kadastrale Grootte',
            perceelnummer: 'Perceel Nummer',
          },
          Fotos: {
              OMSCHRIJVING: 'Omschrijving',
              RICHTING: 'Richting',
              JAAR: 'Jaar'
          },
          CBS: {
              "buurtNaam ": "Buurt naam",
              "AANT_INW ": "Aantal inwoners",
              "AANT_MAN ": "Mannen (aantal)",
              "AANT_VROUW ": "Vrouwen (aantal)",
              "BEV_DICHTH ": "Bevolkingsdichtheid: aantal inwoner (per km2)",
              "P_00_14_JR ": "Personen 0 tot 15 jaar (%)",
              "P_15_24_JR ": "Personen 15 tot 24 jaar (%)",
              "P_25_44_JR ": "Personen 25 tot 45 jaar (%)",
              "P_45_64_JR ": "Personen 45 tot 65 jaar (%)",
              "P_65_EO_JR ": "Personen 65 jaar en ouder",
              "P_ONGEHUWD ": "Ongehuwd (%)",
              "P_GEHUWD ": "Gehuwd (%)",
              "P_GESCHEID ": "Gescheiden (%)",
              "P_VERWEDUW ": "Verweduwd (%)",
              "GEBOO_TOT ": "Geboorte totaal",
              "P_GEBOO ": "Geboorte relatief (per 1000 inw.)",
              "STERFT_TOT ": "Sterfte totaal",
              "P_STERFT ": "Sterfte relatief (per 1000 inw.)",
              "AANTAL_HH ": "Huishoudens totaal",
              "P_EENP_HH ": "Eenpersoonshuishoudens (%)",
              "P_HH_Z_K ": "Huishoudens zonder kinderen (%)",
              "P_HH_M_K ": "Huishoudens met kinderen (%)",
              "GEM_HH_GR ": "Gemiddelde huishoudensgrootte",
              "WONINGEN ": "Woningvoorraad",
              "WOZ ": "Gemiddelde woningwaarde (x1000 EUR)",
              "P_BEWNDW ": "Bewoonde woningen (%)",
              "P_LEEGSW ": "Leegstand woningen (%)",
              "G_GAS_TOT ": "Gemiddeld aardgasverbruik tot. (m3)",
              "G_ELEK_TOT ": "Gemiddeld elektriciteitsverbruik tot. (kWh)",
              "AV1_SUPERM ": "Grote supermarkten binnen 1 km",
              "AV3_SUPERM ": "Grote supermarkten binnen 3 km",
              "AV5_SUPERM ": "Grote supermarkten binnen 5 km",
              "AV1_CAFE ": "Aantal cafés binnen 1 km",
              "AV3_CAFE ": "Aantal cafés binnen 3 km",
              "AV5_CAFE ": "Aantal cafés binnen 5 km",
              "AV1_CAFTAR ": "Aantal cafetaria’s binnen 1 km",
              "AV3_CAFTAR ": "Aantal cafetaria’s binnen 3 km",
              "AV5_CAFTAR ": "Aantal cafetaria’s binnen 5 km",
              "AV1_RESTAU ": "Aantal restaurants binnen 1 km",
              "AV3_RESTAU ": "Aantal restaurants binnen 3 km",
              "AV5_RESTAU ": "Aantal restaurants binnen 5 km",
              "AV5_HOTEL ": "Aantal hotels binnen 5 km",
              "AV10_HOTEL ": "Aantal hotels binnen 10 km",
              "AV20_HOTEL ": "Aantal hotels binnen 20 km",
              "AV1_KDV ": "Aantal kinderdagverbijven binnen 1 km",
              "AV3_KDV ": "Aantal kinderdagverbijven binnen 3 km",
              "AV5_KDV ": "Aantal kinderdagverbijven binnen 5 km"

          },
          Bomen: {
            "OBJECTID": "Bommen ID" ,
            "Level": "Niveau" ,
            "Layer": "Laag" ,
            "Color": "Kleur" ,
            "Elevation": "Verhoging" ,
            "Angle": "Hoek"
          },
          Archeologie: {
            "NR_ARCH_GEBIED": "Nummer Archeologisch gebied" ,
            "NAAM_ARCH_GEBIED": "Naam Archeologisch gebied" ,
            "JAAR_OPGRAVING" : "Jaar Opgraving" ,
            "STATUS": "Status" ,
            "VERWACHTING": "Verwachting" ,
            "RESULTAAT": "Resultaat" ,
          },
          Sonderingen: {
            "BROID": "",
            "addinv_conditions": "Addinv conditions",
            "addinv_groundwaterlevel": "Addinv groundwaterlevel",
            "addinv_investigationdate": "Addinv investigationdate",
            "cpsurv_conepen_description": "Conepen description",
            "cpsurv_cptmethod": "Cpsurv cptmethod",
            "cpsurv_trajectory_finaldepth": "Cpsurv trajectory finaldepth"
          },
          GrondwaterPolution: {
            "ID": "ID",
            "NAAM": "Naam",
            "CONT_TYP_N": "Type",
            "STOFFEN": "Stoffen",
            "COMPONENTS": "Components",
            "VERONTAARD": "Verontaard",
            "OPPERVLAKT": "Oppervlakte",
            "VOLUME": "Volume",
            "BOVENKANT": "Bovenkant",
            "ONDERKANT": "Onderkant",
            "DAT_MUT": "Datum"
          },
          GrondwaterPolutionSanitation: {
            "ID": "ID",
            "NAAM": "Naam",
            "CONT_TYP_N": "Type",
            "OPPERVLAKT": "Oppervlakte",
            "VOLUME_GR": "Volume",
            "BOVENKANT": "Bovenkant",
            "ONDERKANT": "Onderkant",
            "WRK_SANB_N": "",
            "WRK_SANO_N": "",
            "STARTDATUM": "Start datum",
            "EINDDATUM_": "Eind datum"
          },
          GrondwaterPolutionCareMeasures: {
            "ID": "ID",
            "NAAM": "Naam",
            "ZORGMAATRE": "Zorgmaatregel",
            "STARTDATUM": "Start datum",
            "EINDDATUM_": "Eind datum",
            "NAZORGKADE": "Nazorgkade",
            "NAZORGDUUR": "Nazorgduur",
            "OPPERVLAKT": "Oppervlakte"
          },
          WarmteKoudeopslag: {
            "NAAM": "Naam",
            "STRAAT": "Straat",
            //"NAZCACODE": "Nazcacode",
            "KWO_STATUS": "KWO Status",
            "KWO_TYPE": "KWO Type",
            "KWO_BODEMZ": "Bodem" ,
            //"BODEMZIJDI": "Bodem",
            "BOVENKANT": "Diepte bovenkant",
            "ONDERKANT": "Diepte onderkant",
            "CAPACITEIT": "Capaciteit",
            "M3_JAAR": "Onttrekking water (m³/jr)",
            "VERMOGEN": "Vermogen",
            "OPMERKING": "Opmerking"
          },
          Rwsgeluidskaarten: {
            "ondergrens": "Ondergrens (dB)" ,
            "bovengrens": "Bovengrens (dB)" ,
            "min_max": "Min-Max (dB)"
          },
          GemeentelijkeMonumenten: {
            "CATEGORIE": "Categorie" ,
            "ADRES": "Adres" ,
            "AANDUIDIN": "Aanduiding" ,
            "NAAM": "Naam" ,
            "COMPLEX": "Complex" ,
            "BOUWJAAR": "Bouwjaar" ,
            "ARCHITECT": "Architect" ,
            "AANWIJSDATUM": "Aanwijsdatum" ,
            "OBJECT_NUMMER": "Object nummer" ,
            "LINK_PDF": "Link",
            "MONID": "Munument ID",
            //"F2kolum_AD": "F2kolum_AD",
            //"ADRESSEN": "ADRESSEN",
            //"MONKODE1": "MONKODE1",
            //"MONKODE1_O": "MONKODE1_O",
            //"MONKODE2": "MONKODE2",
            //"MONKODE2_O": "MONKODE2_O",
            //"GemMon_ADR": "GemMon_ADR",
            //"BOUWTKWA": "BOUWTKWA",
            //"RIJKS_MONN": "RIJKS_MONN",
            //"GEM_MONNR": "GEM_MONNR",
            //"WIJK": "WIJK",
            //"BUURT": "BUURT",
            //"LOKATIE1": "LOKATIE1",
            //"LOKATIE2": "LOKATIE2",
            //"LOKATIE3": "LOKATIE3",
            //"LOKATIE4": "LOKATIE4",
            //"VOLUME": "VOLUME",
            //"CBS_CATEGO": "CBS_CATEGO",
            //"BOUWJR_VAN": "BOUWJR_VAN",
            //"BOUWJR_TOT": "BOUWJR_TOT",
            //"MONWACHT": "MONWACHT",
            //"DDPLAATSIN": "DDPLAATSIN",
            //"DDWIJZIGIN": "DDWIJZIGIN",
            //"BESLUITJR": "BESLUITJR",
            //"BESLUITNR": "BESLUITNR",
            //"AANTEKENIN": "AANTEKENIN",
            //"REDENG_OMS": "REDENG_OMS",
            "Monnr": "Monument Nr",
            "gemnr": "gemnr"

          },
          Vergunningen: {
            "datum_verzenden": "Datum verzenden" ,
            "adres": "Adres" ,
            "zaaknummer": "Zaaknummer" ,
            "datum_binnenkomst": "Datum binnenkomst" ,
            "status_omschrijving": "Status" ,
            "type_omschrijving": "Type" ,
            "omschrijving": "Omschrijving"
          },
          Woningbouw: {
            "PROJECTNUMMER": "Projectnummer" ,
            "NAAMPROJECT": "Projectnaam" ,
            "TOTAALAANTALWONINGEN": "Aantalwoningen" ,
            "AFDELING": "Afdeling"
          },
          KVK: {
            "kvknummer": "KvK" ,
            "vestigingsnummer": "Vestigingsnummer" ,
            "businessName": "Handelsnaam" ,
            "legalFormDescription": "Rechtsvorm" ,
            "employees": "Werknemers" ,
            "street": "Straat" ,
            "houseNumber": "Hiusnummer" ,
            "houseNumberAddition": "Toev." ,
            "postalCode": "Postcode" ,
            "city": "Plaats" ,
            "website": "Website" ,
            "mainActivitySbiCode": "SBI-code" ,
            "mainActivitysbiCodeDescription": "Activiteiten" ,
            "registrationDate": "Startdatum" ,
            "deregistrationDate": "Einddatum"
          },
          RijksMonumenten: {
            "RIJKSMONNR": "Rijksmonument nummer" ,
            "NAAM": "Naam" ,
            "TYPEMONUM": "Type monument" ,
            "CBSCATEGOR": "CBS-categorie" ,
            "OORSPRFUNC": "Oorspronkelijke functie" ,
            "SUBCATOMS": "Sub categorie" ,
            "HFDCATOMS": "Hoofd categorie" ,
            "TYPECHOBJ": "Type cultuurhistorisch object" ,
            "BEGBOUWJR": "Begin bouwjaar" ,
            "EINDBOUWJR": "Eind bouwjaar" ,
            "BOUWJAAR": "Bouwjaar",
            BOUWJR_VAN: 'Bouwjaar van',
            BOUWJR_TOT: 'Bouwjaar tot',
            "GEMEENTE": "Gemeente" ,
            "PROVINCIE": "Provincie" ,
            "PLAATS": "Plaats" ,
            "STRAAT": "Straat" ,
            "HUISNUMMER": "Huisnummer" ,
            "TOEVOEGING": "Toevoeging" ,
            "POSTCODE": "Postcode" ,
            "KICH_URL": "Uittreksel van het rijksmonument URL" ,
            "STATUS": "Status" , //==== for EIN monuments after this line
            "CATEGORIE": "Categorie" ,
            "ADRES": "Adres" ,
            "AANDUIDIN": "Aanduiding" ,
            "NAAM": "Naam" ,
            "COMPLEX": "Complex" ,
            "BOUWJAAR": "Bouwjaar" ,
            "ARCHITECT": "Architect" ,
            "AANWIJSDATUM": "Aanwijsdatum" ,
            "OBJECT_NUMMER": "Object nummer" ,
            "LINK_PDF": "Link",
            "MONID": "Munument ID"
          },
          Rce: {
            "RIJKSMONNR": "Rijksmonument nummer" ,
            "NAAM": "Naam" ,
            "TYPEMONUM": "Type monument" ,
            "CBSCATEGOR": "CBS-categorie" ,
            "OORSPRFUNC": "Oorspronkelijke functie" ,
            "SUBCATOMS": "Sub categorie" ,
            "HFDCATOMS": "Hoofd categorie" ,
            "TYPECHOBJ": "Type cultuurhistorisch object" ,
            "BEGBOUWJR": "Begin bouw jaar" ,
            "EINDBOUWJR": "Eind bouw jaar" ,
            "GEMEENTE": "Gemeente" ,
            "PROVINCIE": "Provincie" ,
            "PLAATS": "Plaats" ,
            "STRAAT": "Straat" ,
            "HUISNUMMER": "Huisnummer" ,
            "TOEVOEGING": "Toevoeging" ,
            "POSTCODE": "Postcode" ,
            "KICH_URL": "Uittreksel van het rijksmonument URL" ,
            "STATUS": "Status"
          },
          Bekendmakingen: {
            oid: 'Vergunningen ID',
            categorie: 'Categorie',
            onderwerp: 'Onderwerp',
            titel: 'Title',
            beschrijving: 'Beschrijving',
            url: 'Url',
            postcodehuisnummer: 'Postcode & huisnummer',
            plaats: 'Plaats',
            straat: 'Straat',
            datum: 'Datum',
            overheid: 'Overheid'
          },
          GemeenteSonderingen: {
            BOTTOM_DEPTH_DRP: 'Bottom depth DRP',
            BOTTOM_DEPTH_MV: 'Bottom depth MV',
            //BOTTOM_HEIGHT_NAP: 'BOTTOM_HEIGHT_NAP',
            //COORD_SYSTEM_CD: 'COORD_SYSTEM_CD',
            DINO_NR: 'Dino #',
            DISSIPATION_TST_CNT: 'Dissipation',
            DOCUMENT_CNT: 'Aantal documenten',
            DOCUMENT_SIZE: 'Document grootte',
            DRP_TYPE_CD: 'DRP type',
            //GDW_DBK: 'GDW_DBK',
            //GEOMETRY: 'GEOMETRY',
            INDICATIVE_BLN: 'Indicative',
            INFORMATION_TYPE_CD: 'Information type',
            NORM_CD: 'Norm',
            OBJECT_ID: 'Object ID',
            //POSITION_CD: 'POSITION_CD',
            //REGISTRATION_DATE: 'REGISTRATION_DATE',
            SURFACE_ELEVATION: 'Surface elevation',
            SURVEYING_DATE: 'Surveying date',
            //TOP_DEPTH_DRP: 'TOP_DEPTH_DRP',
            //TOP_DEPTH_MV: 'TOP_DEPTH_MV',
            //TOP_HEIGHT_NAP: 'TOP_HEIGHT_NAP',
            //TRACE_CNT: 'TRACE_CNT',
            //TRACE_TYPE_LST: 'TRACE_TYPE_LST',
            //X_RD_CRD: 'X_RD_CRD',
            //X_UTM31_WGS84_CRD: 'X_UTM31_WGS84_CRD',
            //Y_RD_CRD: 'Y_RD_CRD',
            //Y_UTM31_WGS84_CRD: 'Y_UTM31_WGS84_CRD',
          },
          'meetpunten': {
            "OBJECT_ID": "Object ID",
            //"GDW_DBK": "GDW_DBK",
            "DINO_NR": "Nr",
            "CLUSTER_ID": "Cluster ID",
            "CLUSTER_LST": "Cluster list",
            //"X_RD_CRD": "X_RD_CRD",
            //"Y_RD_CRD": "Y_RD_CRD",
            "SURFACE_ELEVATION": "Surface Elevation",
            "SA_CNT": "SA_CNT",
            "ST_CNT": "ST_CNT",
            //"GEOMETRY": "GEOMETRY",
          },
          BooronderzoekDinoLoket: {
            "OBJECT_ID": "Object ID",
            //"GDW_DBK": "GDW_DBK",
            "DINO_NR": "Dino nr",
            //"X_RD_CRD": "X_RD_CRD",
            //"Y_RD_CRD": "Y_RD_CRD",
            //"X_UTM31_WGS84_CRD": "X_UTM31_WGS84_CRD",
            //"Y_UTM31_WGS84_CRD": "Y_UTM31_WGS84_CRD",
            "POSITION_CD": "Position",
            "DRILLING_DATE": "Drilling date",
            "DRILL_METHOD_LST": "Drill method",
            "SURFACE_ELEVATION": "Surface Elevation",
            "END_DEPTH_MV": "End Depth MV",
            //"END_HEIGHT_NAP": "END_HEIGHT_NAP",
            "END_DEPTH_DRP": "End Depth DRP",
            "DRP_TYPE_CD": "DRP type code",
            "BM_CNT": "BM_CNT",
            "CA_CNT": "CA_CNT",
            "KA_CNT": "KA_CNT",
            "MF_CNT": "MF_CNT",
            "MP_CNT": "MP_CNT",
            //"GEOMETRY": "GEOMETRY",
            "boringProfile": 'Boor profiel',
          },
          'RijksSonderingen': {
            //addinv_conditions: 'addinv_conditions',
            //addinv_groundwaterlevel: 'addinv_groundwaterlevel',
            //addinv_investigationdate: 'addinv_investigationdate',
            //addinvperformed: 'addinvperformed',
            broid: 'BRO ID',
            //cpsurv_cptest_cptresult_elementcount_type: 'cpsurv_cptest_cptresult_elementcount_type',
            //cpsurv_cptest_cptresult_elementtype_href: 'cpsurv_cptest_cptresult_elementtype_href',
            //cpsurv_cptest_cptresult_elementtype_name: 'cpsurv_cptest_cptresult_elementtype_name',
            //cpsurv_cptest_cptresult_elementtype_type: 'cpsurv_cptest_cptresult_elementtype_type',
            //cpsurv_cptest_featureofinterest_nil: 'cpsurv_cptest_featureofinterest_nil',
            //cpsurv_cptest_observedproperty_nil: 'cpsurv_cptest_observedproperty_nil',
            //cpsurv_cptest_phenomenontime: 'cpsurv_cptest_phenomenontime',
            //cpsurv_cptest_procedure_nil: 'cpsurv_cptest_procedure_nil',
            //cpsurv_cptest_resulttime: 'cpsurv_cptest_resulttime',
            //cpsurv_conepen_conediameter: 'cpsurv_conepen_conediameter',
            cpsurv_conepen_conepentype: 'Conepen type',
            cpsurv_conepen_conesurfacearea: 'Conepen conesurfacearea',
            cpsurv_conepen_conesurfacequotient: 'Conepen cone surface quotient',
            cpsurv_conepen_conetofrictionsleevedistance: 'Conepen cone to friction sleeve distance',
            cpsurv_conepen_description: 'Conepen Description',
            cpsurv_conepen_frictionsleevesurfacearea: 'Friction sleeve surface area',
            cpsurv_conepen_frictionsleevesurfacequotient: 'Friction sleeve surface quotient',
            cpsurv_conepen_zlmeas_coneresistanceafter: 'Cone resistance after',
            cpsurv_conepen_zlmeas_coneresistancebefore: 'Cone resistance before',
            //cpsurv_conepen_zlmeas_inclinationewafter: 'cpsurv_conepen_zlmeas_inclinationewafter',
            //cpsurv_conepen_zlmeas_inclinationewbefore: 'cpsurv_conepen_zlmeas_inclinationewbefore',
            //cpsurv_conepen_zlmeas_inclinationnsafter: 'cpsurv_conepen_zlmeas_inclinationnsafter',
            //cpsurv_conepen_zlmeas_inclinationnsbefore: 'cpsurv_conepen_zlmeas_inclinationnsbefore',
            //cpsurv_conepen_zlmeas_inclinationresultantafter: 'cpsurv_conepen_zlmeas_inclinationresultantafter',
            //cpsurv_conepen_zlmeas_inclinationresultantbefore: 'cpsurv_conepen_zlmeas_inclinationresultantbefore',
            //cpsurv_conepen_zlmeas_localfrictionafter: 'cpsurv_conepen_zlmeas_localfrictionafter',
            //cpsurv_conepen_zlmeas_localfrictionbefore: 'cpsurv_conepen_zlmeas_localfrictionbefore',
            //cpsurv_conepen_zlmeas_porepressureu1after: 'cpsurv_conepen_zlmeas_porepressureu1after',
            //cpsurv_conepen_zlmeas_porepressureu1before: 'cpsurv_conepen_zlmeas_porepressureu1before',
            //cpsurv_conepen_zlmeas_porepressureu2after: 'cpsurv_conepen_zlmeas_porepressureu2after',
            //cpsurv_conepen_zlmeas_porepressureu2before: 'cpsurv_conepen_zlmeas_porepressureu2before',
            //cpsurv_conepen_zlmeas_porepressureu3after: 'cpsurv_conepen_zlmeas_porepressureu3after',
            //cpsurv_conepen_zlmeas_porepressureu3before: 'cpsurv_conepen_zlmeas_porepressureu3before',
            //cpsurv_cptmethod: 'cpsurv_cptmethod',
            //cpsurv_dissipationtest_procedure_nil: 'cpsurv_dissipationtest_procedure_nil',
            //cpsurv_dissipationtestperformed: 'cpsurv_dissipationtestperformed',
            //cpsurv_dissipationtest{}_procedure_nil': 'cpsurv_dissipationtest{}_procedure_nil',
            //cpsurv_finalprocessingdate: 'cpsurv_finalprocessingdate',
            //cpsurv_par_coneresistance: 'cpsurv_par_coneresistance',
            //cpsurv_par_correctedconeresistance: 'cpsurv_par_correctedconeresistance',
            //cpsurv_par_depth: 'cpsurv_par_depth',
            //cpsurv_par_elapsedtime: 'cpsurv_par_elapsedtime',
            //cpsurv_par_electricalconductivity: 'cpsurv_par_electricalconductivity',
            //cpsurv_par_frictionratio: 'cpsurv_par_frictionratio',
            //cpsurv_par_inclinationew: 'cpsurv_par_inclinationew',
            //cpsurv_par_inclinationns: 'cpsurv_par_inclinationns',
            //cpsurv_par_inclinationresultant: 'cpsurv_par_inclinationresultant',
            //cpsurv_par_inclinationx: 'cpsurv_par_inclinationx',
            //cpsurv_par_inclinationy: 'cpsurv_par_inclinationy',
            //cpsurv_par_localfriction: 'cpsurv_par_localfriction',
            //cpsurv_par_magneticdeclination: 'cpsurv_par_magneticdeclination',
            //cpsurv_par_magneticfieldstrengthtotal: 'cpsurv_par_magneticfieldstrengthtotal',
            //cpsurv_par_magneticfieldstrengthx: 'cpsurv_par_magneticfieldstrengthx',
            //cpsurv_par_magneticfieldstrengthy: 'cpsurv_par_magneticfieldstrengthy',
            //cpsurv_par_magneticfieldstrengthz: 'cpsurv_par_magneticfieldstrengthz',
            //cpsurv_par_magneticinclination: 'cpsurv_par_magneticinclination',
            //cpsurv_par_netconeresistance: 'cpsurv_par_netconeresistance',
            //cpsurv_par_penetrationlength: 'cpsurv_par_penetrationlength',
            //cpsurv_par_porepressureu1: 'cpsurv_par_porepressureu1',
            //cpsurv_par_porepressureu2: 'cpsurv_par_porepressureu2',
            //cpsurv_par_porepressureu3: 'cpsurv_par_porepressureu3',
            //cpsurv_par_poreratio: 'cpsurv_par_poreratio',
            //cpsurv_par_temperature: 'cpsurv_par_temperature',
            //cpsurv_procedure_expertcorrectionperformed: 'cpsurv_procedure_expertcorrectionperformed',
            //cpsurv_procedure_interruptionprocessingperformed: 'cpsurv_procedure_interruptionprocessingperformed',
            //cpsurv_procedure_signalprocessingperformed: 'cpsurv_procedure_signalprocessingperformed',
            //cpsurv_qualityclass: 'cpsurv_qualityclass',
            //cpsurv_sampledfeature_nil: 'cpsurv_sampledfeature_nil',
            //cpsurv_sensorazimuth: 'cpsurv_sensorazimuth',
            //cpsurv_stopcriterion: 'cpsurv_stopcriterion',
            //cpsurv_trajectory_finaldepth: 'cpsurv_trajectory_finaldepth',
            //cpsurv_trajectory_predrilleddepth: 'cpsurv_trajectory_predrilleddepth',
            cptstandard: 'CPT standard',
            //delloc_horizontalpositioningdate: 'delloc_horizontalpositioningdate',
            //delloc_horizontalpositioningmethod: 'delloc_horizontalpositioningmethod',
            //delvpos_localverticalreferencepoint: 'delvpos_localverticalreferencepoint',
            //delvpos_offset: 'delvpos_offset',
            //delvpos_verticaldatum: 'delvpos_verticaldatum',
            //delvpos_verticalpositioningdate: 'delvpos_verticalpositioningdate',
            //delvpos_verticalpositioningmethod: 'delvpos_verticalpositioningmethod',
            //deliveryaccountableparty: 'deliveryaccountableparty',
            //deliverycontext: 'deliverycontext',
            //qualityregime: 'qualityregime',
            //reghis_corrected: 'reghis_corrected',
            //reghis_deregistered: 'reghis_deregistered',
            //reghis_objectregistrationtime: 'reghis_objectregistrationtime',
            reghis_registrationcompletiontime: 'Registration completion time',
            //reghis_registrationstatus: 'reghis_registrationstatus',
            //reghis_reregistered: 'reghis_reregistered',
            //reghis_underreview: 'reghis_underreview',
            researchreportdate: 'Research report date',
            //stdloc_coordinatetransformation: 'stdloc_coordinatetransformation',
            //surveypurpose: 'surveypurpose',
          },
        }
      }
    },
    computed: {
      keys() {
        if (this.item.data && this.item.data.length) {
          return Object.keys(this.item.data[0]);
        } else {
          return [];
        }
      },
      formattedItem() {
        let props = this.item.data[0];
        //only for Bestemmingsplangebied
        if (this.item.label === 'Bestemmingsplangebied') {
          return props.formattedProps;
        }
        //others
        if (this.accordion[this.item.source]) {
          return _.compact(_.keys(props).map(key => {
            if (this.accordion[this.item.source][key]) {
               if (props[key] && props[key] !== '') {
              return {
                value: props[key],
                label: this.accordion[this.item.source][key]
              }
               }
            }
          }));
        } else {
          return _.compact(_.keys(props).map(key => {
            return {
              value: props[key],
              label: key
            }
          }));
        }
        return _.compact(_.keys(props).map(key => {
          if (this.accordion[this.item.source][key]) {
            return {
              value: props[key],
              label: this.accordion[this.item.source][key]
            }
          }
        }));
      }
    },
    mounted()
    {

    },
    watch: {
      item: {
        handler(newItem) {
          // this.item2 = newItem;
          // this.test = 'yess?';
        }
      },
      deep: true
    }
  }

</script>
