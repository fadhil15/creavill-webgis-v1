'use strict';

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::geojson-layer.geojson-layer');
