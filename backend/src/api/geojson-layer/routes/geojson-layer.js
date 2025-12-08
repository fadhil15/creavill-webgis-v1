'use strict';

/**
 * geojson-layer router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::geojson-layer.geojson-layer');
