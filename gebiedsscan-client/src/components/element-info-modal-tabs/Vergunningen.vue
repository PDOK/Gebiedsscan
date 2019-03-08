<template>
  <div v-if="tabloaded" class="uk-section uk-section-xsmall">
        <div class="uk-container">
            <h5 class="sk-color-red uk-text-bold sk-preview-card-title">Vergunningen</h5>
            <table class="uk-table uk-table-small uk-table-divider">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Datum</th>
                    <th>Omschrijving</th>
                    <th>Adres</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody v-if="mapData.Vergunningen">
                <tr v-for="vItem in mapData.Vergunningen.data" 
                    @mouseenter="flyToGeometry(vItem.geo_shape, true)"
                    @mouseleave="flyToGeometry(item.geometry)" :key="vItem.id" >
                    <td>{{vItem.objectid}}</td>
                    <td>{{vItem.datum_binnenkomst}}</td>
                    <td>{{vItem.omschrijving}}</td>
                    <td>{{vItem.adres}}</td>
                    <td>{{vItem.status_omschrijving}}</td>
                </tr>
            </tbody>
            <p v-else> Geen informatie beschikbaar</p>
        </table>
        </div>
    </div>
</template>

<script>
    import Leaflet from 'leaflet';
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
            }
        },
        data() {
            return {
                floughtToGeometry: null,
                highLightedItemLayer: null
            }
        },
        computed: {
        },
        methods: {
            flyToGeometry(geometry, highlight) {
                if (this.floughtToGeometry) {
                    this.floughtToGeometry.remove();
                }
                this.floughtToGeometry = L.geoJson(geometry, {
                    pointToLayer (feature, latlng) {
                        return L.circleMarker(latlng, {
                                radius: 8,
                                fillColor: "#ff7800",
                                color: "#000",
                                weight: 1,
                                opacity: 1,
                                fillOpacity: 0.8
                            }
                        )
                    }
                });
                if (highlight) {
                    this.floughtToGeometry.addTo(this.manager.map);
                }
                this.manager.map.flyToBounds(this.floughtToGeometry.getBounds(), {
                    maxZoom: 13,
                    easeLinearity: 0.1
                }); 
            },
            customDateDdMmmYyyy: (dateString) => {
                var dateParts = dateString.split(/-/);
                return new Date((dateParts[2] * 1), ($.inArray(dateParts[1].toUpperCase(), ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"]) * 1), dateParts[0] * 1);
            }
        },
        mounted() {
        },
        watch: {
            tabloaded (loaded) {
                if (loaded) {
                    if (!this.mapData.Vergunningen) {
                        this.manager.add(["Vergunningen"]);
                        this.manager.getUnderPolygon(this.item.geometry).then(results => {
                            this.manager._hideLayer("Vergunningen");
                            _.each(results, result => {
                                if (result.source === 'Vergunningen') {
                                    result.data = result.data.sort((a, b) => {
                                        let dateA = new Date(a.datum_binnenkomst.split(/-/)[0], a.datum_binnenkomst.split(/-/)[1], a.datum_binnenkomst.split(/-/)[2])
                                        let dateB = new Date(b.datum_binnenkomst.split(/-/)[0], b.datum_binnenkomst.split(/-/)[1], b.datum_binnenkomst.split(/-/)[2])
                                        return dateB - dateA;
                                    });
                                }
                                Vue.set(this.mapData, result.source, result);
                            });
                            if (this.mapData.Vergunningen) {
                                this.highLightedItemLayer = this.mapData.Vergunningen.layer;
                                this.highLightedItemLayer.addTo(this.manager.map);
                            }
                        });
                    } else {
                        this.highLightedItemLayer = this.mapData.Vergunningen.layer;
                        this.highLightedItemLayer.addTo(this.manager.map);
                    }
                } else {
                    if (this.highLightedItemLayer) this.highLightedItemLayer.remove();
                }
            }
        }

    }

</script>