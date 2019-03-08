<template>
   <div class="uk-section uk-section-xsmall">
        <div class="uk-container">
            <h5 class="sk-color-red uk-text-bold sk-preview-card-title uk-margin-bottom">Nieuws</h5>
        </div>
        <div class="uk-container">
            <div v-if="item.properties.external && item.properties.external.length" class="uk-grid-small uk-grid-match uk-child-width-1-3@s uk-margin-top" uk-grid>
                <div v-for="article in item.properties.external" :key="article.id">
                    <div v-if="article.resource_title" class="uk-card uk-card-default uk-box-shadow-hover-large">
                        <div v-if="article.resource_img_url" class="uk-card-media-top uk-cover-container">
                            <img :src="article.resource_img_url" alt="" uk-cover>
                            <canvas height="200"></canvas>
                        </div>
                        <div class="uk-card-body">
                            <h3 class="uk-card-title uk-margin-remove-bottom">{{article.resource_title}} <a target="_blank" :href="article.resource_url"><span class="sk-color-red" uk-icon="icon: link;"></span></a></h3>
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
</template>

<script>
    import Leaflet from 'leaflet';
    import axios from 'axios';
    export default {
        props: {
            tabloaded: {
                type: Boolean
            },
            item: {
                type: Object
            }
        },
        computed: {
        },
        methods: {
        },

    }

</script>