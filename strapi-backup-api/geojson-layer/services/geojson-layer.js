'use strict';

/**
 * geojson-layer service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::geojson-layer.geojson-layer');
