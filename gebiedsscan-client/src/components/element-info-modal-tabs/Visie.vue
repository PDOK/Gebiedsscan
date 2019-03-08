<template>
    <div class="uk-section uk-section-xsmall">
        <div class="uk-container">
            <h5 class="sk-color-red uk-text-bold sk-preview-card-title">Visie</h5>
            <p v-if="visie" v-html="visie"></p>
            <p v-else>Geen informatie beschikbaar</p>
        </div>
    </div>
</template>

<script>
import anchorme from "anchorme";
    export default {
        props: {
            item: {
                type: Object,
                default: null
            },
            mapData: {
                type: Object
            }
        },
        computed: {
            visie() {
                if (this.item.properties.extra_vision) {
                    return anchorme(this.item.properties.extra_vision, {
                        attributes:[
                        {
                            name:"target",
                            value:"_blank"
                        }]
                    })
                } else {
                    return null;
                }
                
            }
        }
    }
</script>