<template>
  <div class="uk-section uk-section-xsmall">
        <div class="uk-container">
            <h5 class="sk-color-red uk-text-bold sk-preview-card-title">Omgevingsinformatie</h5>
            <ul uk-accordion="" class="uk-accordion">
                <li @click="selectItem('Bag')">
                    <a
                        class="uk-accordion-title" 
                        href="#">BAG
                    </a>
                    <div class="uk-accordion-content uk-margin-top">
                        <div v-if="accordion.Bag.selectedFeature">
                            <div class="uk-grid-divider" uk-grid>
                                <div class="uk-width-1-3@m uk-first-column">
                                    <h5 class="uk-heading-line"><span>Pand</span></h5>
                                    <ul class="uk-list  uk-margin-remove-bottom">
                                        <li v-for="item in selectedBagFormatted" :key="item.id">
                                            <strong class="uk-text-capitalize">{{item.label}}: </strong>
                                            <span>{{item.value}}</span>
                                        </li>
                                    </ul>
                                </div>
                                <div class="uk-width-2-3@m">
                                    <h5 class="uk-heading-line"><span>Verblijfobjecten</span></h5>
                                    <table class="uk-table uk-table-small uk-table-divider">
                                        <thead>
                                            <tr>
                                                <th class="uk-padding-remove-top">Adress</th>
                                                <th class="uk-padding-remove-top">Functie</th>
                                                <th class="uk-padding-remove-top">Energielabel</th>
                                            </tr>
                                        </thead>
                                        <tbody v-if="!accordion.Bag.loadingVerblijfObjects && accordion.Bag.selectedFeature.properties.vobjects">
                                            <VObject :vobject="vo" v-for="vo in accordion.Bag.selectedFeature.properties.vobjects" :key="vo.id"></VObject>
                                        </tbody>
                                        <tbody v-if="!accordion.Bag.loadingVerblijfObjects &&  !accordion.Bag.selectedFeature.properties.vobjects">
                                            <td>No vb found</td>
                                        </tbody>
                                        <tbody v-if="accordion.Bag.loadingVerblijfObjects">
                                            <td>Loading</td>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                        <div v-else>
                            Selecteer een object-pand op de kaart
                        </div>
                    </div>
                </li>
                <li @click="selectItem('BRK')">
                    <a
                        class="uk-accordion-title" 
                        href="#">BRK
                    </a>
                    <div class="uk-accordion-content uk-margin-top" >
                         <div v-if="accordion.BRK.selectedFeature">
                            <ul class="uk-list  uk-margin-remove-bottom">
                                <li v-for="item in selectedBrkFormatted" :key="item.id">
                                    <strong class="uk-text-capitalize">{{item.label}}: </strong>
                                    <span>{{item.value}}</span>
                                </li>
                            </ul>
                        </div>
                        <div v-else>
                            Selecteer een perceel op de kaart
                        </div>
                    </div>
                </li>
                <li @click="selectItem('Fotos')">
                    <a 
                        class="uk-accordion-title" 
                        href="#">Historische luchtfoto's
                    </a>
                    <div class="uk-accordion-content uk-margin-top" >
                         <div v-if="accordion.Fotos.selectedFeature">
                             <img style="height: 300px;float:left;" :src="accordion.Fotos.selectedFeature.properties.URL" alt="">
                            <ul style="float:left;" class="uk-list uk-padding uk-margin-remove-bottom">
                                <li v-for="item in selectedFotosFormatted" :key="item.id">
                                    <strong class="uk-text-capitalize">{{item.label}}: </strong>
                                    <span>{{item.value}}</span>
                                </li>
                            </ul>
                        </div>
                        <div v-else>
                            Selecteer een foto op de kaart
                        </div>
                    </div>
                </li>
            </ul>
             <h5 class="sk-color-red uk-text-bold sk-preview-card-title">Gebiedsfunctie en bedrijvigheid</h5>
            <ul uk-accordion="" class="uk-accordion">
                <li @click="selectItem('KVK')">
                    <a
                        class="uk-accordion-title" 
                        href="#">SBI-codes
                    </a>
                    <div class="uk-accordion-content uk-margin-top" >
                        <div v-if="accordion.KVK && accordion.KVK.selectedFeature">
                            <ul class="uk-list  uk-margin-remove-bottom">
                                <li v-for="item in selectedKvkFormatted" :key="item.id">
                                    <strong class="uk-text-capitalize">{{item.label}}: </strong>
                                    <span>{{item.value}}</span>
                                </li>
                            </ul>
                        </div>
                        <div v-else>
                            Selecteer een regio op de kaart
                        </div>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
    import axios from 'axios';
    import turf from 'turf';
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
            bus: {
                type: Object
            }
        },
        data() {
            return {
                accordion: {
                    Bag: {
                        loadingVerblijfObjects: true,
                        active: false,
                        selectedFeature: null,
                        layer: null,
                        propsLabels: {
                            identificatiecode: 'Identificatie Code',
                            oorspronkelijkBouwjaar: 'Oorspronkelijk Bouwjaar',
                            status: 'Status',
                            inOnderzoek: 'In Onderzoek',
                            geconstateerd: 'Geconstateerd',
                            aanduidingInactief: 'Aanduiding Inactief',
                            fulladdress: 'fulladdress',
                        }
                    },
                    BRK: {
                        active: false,
                        selectedFeature: null,
                        layer: null,
                        propsLabels: {
                            kadastraleGemeentenaam: 'Kadastrale Gemeentenaam',
                            perceelnummerRotatie: 'Perceelnummer Rotatie',
                            sectie: 'Sectie',
                            kadastraleGemeentecode: 'Kadastrale Gemeentecode',
                            kadastraleGrootte: 'Kadastrale Grootte',
                            perceelnummer: 'Perceel Nummer',
                        }
                    },
                    Fotos: {
                        active: false,
                        selectedFeature: null,
                        layer: null,
                        propsLabels: {
                            OMSCHRIJVING: 'Omschrijving',
                            RICHTING: 'Richting',
                            JAAR: 'Jaar'
                        }
                    },
                    KVK: {
                        active: false,
                        selectedFeature: null,
                        layer: null,
                        propsLabels: {
                            "kvknummer": "KvK" ,
                            "vestigingsnummer": "Vestigingsnummer" ,
                            "businessName": "Handelsnaam" ,
                            "legalFormDescription": "Rechtsvorm" ,
                            "employees": "Werknemers" ,
                            "street": "Straat" ,
                            "houseNumber": "Huisnummer" ,
                            "houseNumberAddition": "Toev." ,
                            "postalCode": "Postcode" ,
                            "city": "Plaats" ,
                            "website": "Website" ,
                            "mainActivitySbiCode": "SBI-code" ,
                            "mainActivitysbiCodeDescription": "Activiteiten" ,
                            "registrationDate": "Startdatum" ,
                            "deregistrationDate": "Einddatum"
                        }
                    },
                    CBS: {
                        active: false,
                        selectedFeature: null,
                        layer: null,
                        propsLabels: {
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
                        }
                    }
                },
                highlightedItem: null
            }
        },
        computed: {
            selectedBagFormatted() {
                if (this.accordion.Bag.selectedFeature) {
                    this.accordion.Bag.loadingVerblijfObjects = true;
                    this.getVerblijfsObject(this.accordion.Bag.selectedFeature.properties.identificatiecode).then(result => {
                        this.accordion.Bag.loadingVerblijfObjects = false;
                        if (result.data.results.bindings.length) {
                            let vobjects = result.data.results.bindings.map(item => {
                                return _.mapValues(item, value => {
                                    return value.value;
                                })
                            })

                            Vue.set(this.accordion.Bag.selectedFeature.properties, 'vobjects', vobjects);
                        }
                    });
                    let props = this.accordion.Bag.selectedFeature.properties;
                    props = _.merge(props, props._embedded.geldigVoorkomen)
                    return _.compact(_.keys(props).map(key => {
                        if (this.accordion.Bag.propsLabels[key]) {
                            return {
                                value: props[key],
                                label: this.accordion.Bag.propsLabels[key]
                            }
                        }  
                    }));
                }
            },
            selectedBrkFormatted() {
                if (this.accordion.BRK.selectedFeature) {
                    let props = this.accordion.BRK.selectedFeature.properties;
                    return _.compact(_.keys(props).map(key => {
                        if (this.accordion.BRK.propsLabels[key]) {
                            return {
                                value: props[key],
                                label: this.accordion.BRK.propsLabels[key]
                            }
                        }  
                    }));
                }
            },
            selectedKvkFormatted() {
                if (this.accordion.KVK.selectedFeature) {
                    let props = this.accordion.KVK.selectedFeature.properties;
                    return _.compact(_.keys(props).map(key => {
                        if (this.accordion.KVK.propsLabels[key]) {
                            return {
                                value: props[key],
                                label: this.accordion.KVK.propsLabels[key]
                            }
                        }  
                    }));
                }
            },
            selectedFotosFormatted() {
                if (this.accordion.Fotos.selectedFeature) {
                    let props = this.accordion.Fotos.selectedFeature.properties;
                    return _.compact(_.keys(props).map(key => {
                        if (this.accordion.Fotos.propsLabels[key]) {
                            return {
                                value: props[key],
                                label: this.accordion.Fotos.propsLabels[key]
                            }
                        }  
                    }));
                }
            },
            selectedCbsFormatted() {
                if (this.accordion.CBS.selectedFeature) {
                    let props = this.accordion.CBS.selectedFeature.properties;
                    return _.compact(_.keys(props).map(key => {
                        if (this.accordion.CBS.propsLabels[key]) {
                            return {
                                value: props[key],
                                label: this.accordion.CBS.propsLabels[key]
                            }
                        }  
                    }));
                }
            }
        },
        methods: {
            unhighlightItem(itemLayer) {
                if (itemLayer) {
                    itemLayer.remove();
                }
            },
            getVerblijfsObject(pandID) {
                let query = `PREFIX%20bag%3A%20%3Chttp%3A%2F%2Fbag.basisregistraties.overheid.nl%2Fdef%2Fbag%23%3E%0APREFIX%20rdfs%3A%20%3Chttp%3A%2F%2Fwww.w3.org%2F2000%2F01%2Frdf-schema%23%3E%0Aselect%20%3Fvo%20%3Fid%20%3Fsubject%20%3Ffulladdress%20%3Fstreetname%20%3Fhousenumber%20%3Fpostcode%20%3Fhouse_letter%0Awhere%20%7B%0A%3Fvo%20bag%3Aidentificatiecode%20%3Fid%20%3B%0Aa%20%3Ftype%20%3B%0Abag%3Ahoofdadres%20%3Fadres%20%3B%0Abag%3Apandrelatering%20%3Fpand%20.%0A%3Fpand%20bag%3Aidentificatiecode%20%22${pandID}%22.%0A%20%20%0A%3Ftype%20rdfs%3Alabel%20%3Fsubject.%0A%0A%3Fadres%20bag%3Ahuisnummer%20%3Fhousenumber%20.%0A%20%20optional%20%7B%3Fadres%20bag%3Ahuisletter%20%3Fhouse_letter%20.%7D%0A%3Fadres%20bag%3Apostcode%20%3Fpostcode%20%3B%0Abag%3AbijbehorendeOpenbareRuimte%20%3Fweg%20.%0A%3Fweg%20rdfs%3Alabel%20%3Fstreetname%20%3B%0Abag%3AbijbehorendeWoonplaats%20%3Fwoonplaats%20.%0A%3Fwoonplaats%20rdfs%3Alabel%20%3Fcityname%20.%0A%0A%20%20BIND(CONCAT(STR(%3Fstreetname)%2C%20%22%20%22%2C%20STR(%3Fhousenumber)%2C%20%22%2C%20%22%2C%20STR(%3Fpostcode)%2C%20STR(%27%2C%20%27)%2C%20STR(%3Fcityname))%20AS%20%3Ffulladdress%20)%0A%0Afilter%20(%3Ftype%20!%3D%20%3Chttp%3A%2F%2Fwww.opengis.net%2Font%2Fgeosparql%23Feature%3E)%0Afilter%20(%3Ftype%20!%3D%20bag%3AVerblijfsobject)%0A%7D`;
                return axios.get('https://data.pdok.nl/sparql?query=' + query, {
                    headers: {
                        'Accept': 'application/json'
                    }
                });
            },
            highlightItem(targetFeature, layer) {
                    if (this.highlightedItem) layer.resetStyle(this.highlightedItem);
                    this.highlightedItem = targetFeature;

                    if (targetFeature && targetFeature.setStyle) {
                        targetFeature.setStyle({
                            weight: 3,
                            color: 'blue',
                            fillOpacity: 0.4
                        });
                    }
            },
            selectItem(item) {
                if (item && !this.accordion[item].active) {
                    Object.keys(this.accordion).forEach((key) => {
                        if (item !== key && this.accordion[key].layer) {
                            this.accordion[key].layer.remove();
                            this.accordion[key].selectedFeature = null;
                        }                        
                        this.accordion[key].active = item === key;
                    });

                    if (!this.mapData[item]) {return;}

                    this.accordion[item].layer = this.manager.cloneLayer(this.mapData[item].layer);

                    if (this.accordion[item] && this.accordion[item].layer) {
                        this.accordion[item].layer.on("click", (event) => {
                            console.log('event', event)
                            Vue.set(this.accordion[item], 'selectedFeature', event.layer.feature);
                            this.highlightItem(event.layer, this.accordion[item].layer);
                        });
                        this.accordion[item].layer.addTo(this.manager.map);
                        this.manager.map.flyToBounds(
                            L.geoJson(this.accordion[item].layer.toGeoJSON()).getBounds(),{ maxZoom: 13, easeLinearity: 0.1 }
                        );
                    }
                }
            }
        },
        mounted() {
            this.bus.$on('ActiveTabChanged', (args) => {
                _.each(["BRK", "Bag", "Fotos", "CBS", "KVK"] , layer => {
                   if (this.accordion[layer] && this.accordion[layer].layer) {
                       this.accordion[layer].layer.remove();
                   }
                });
            });

            this.manager.add([
                 "BRK", "Bag", "Fotos", "CBS", "KVK"
            ]);

            if (this.item.geometry.type == "Point") {
                this.manager.getUnderPoint(turf.flip(this.item.geometry).coordinates).then(results => {     
                    _.each(results, result => {
                        Vue.set(this.mapData, result.source, result);
                    });
                });
            } else if (this.item.geometry.type == "Polygon"){
                this.manager.getUnderPolygon(this.item.geometry).then(results => {     
                    _.each(results, result => {
                        Vue.set(this.mapData, result.source, result);
                    });
                });
            }

            this.manager._hideLayer("Bag");
            this.manager._hideLayer("Fotos");
            this.manager._hideLayer("BRK");
            this.manager._hideLayer("CBS");
            this.manager._hideLayer("KVK");
        }
    }

</script>