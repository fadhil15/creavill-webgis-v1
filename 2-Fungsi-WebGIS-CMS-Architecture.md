# 🏗️ ARSITEKTUR 2-FUNGSI: WebGIS + CMS Landing Page

**Status**: ✅ Production-Ready  
**Date**: January 2026  
**Pattern**: Separation of Concerns (SoC)

---

## 📋 OVERVIEW

```
┌─────────────────────────────────────────────────────────────┐
│                    SINGLE DATABASE                          │
│  (creavilldb - DigitalOcean PostgreSQL)                     │
└──────────────┬──────────────────────────────┬───────────────┘
               │                              │
      ┌────────▼────────┐          ┌──────────▼──────────┐
      │  BACKEND API 1  │          │  BACKEND API 2      │
      │   /api/gis/*    │          │  /api/cms/*         │
      │  (WebGIS Data)  │          │  (Landing Page)     │
      └────────┬────────┘          └──────────┬──────────┘
               │                              │
      ┌────────▼────────┐          ┌──────────▼──────────┐
      │   WebGIS App    │          │  Landing Page CMS   │
      │ (Leaflet Map)   │          │  (Next.js/Vue/etc)  │
      └─────────────────┘          └─────────────────────┘
```

---

## 🗄️ DATABASE SCHEMA (2 TABEL)

### Tabel 1: `creavill_properties` (WebGIS - LEAN)

Hanya berisi **koordinat geografis minimal** untuk performa map loading.

```sql
CREATE TABLE creavill_properties (
  id SERIAL PRIMARY KEY,
  
  -- Basic info (required untuk WebGIS)
  name VARCHAR(255) NOT NULL,
  location VARCHAR(255) NOT NULL,
  lat NUMERIC(10, 8) NOT NULL,
  lng NUMERIC(11, 8) NOT NULL,
  
  -- Metadata
  property_type VARCHAR(100),      -- 'rumah', 'apartemen', 'ruko'
  status VARCHAR(50) DEFAULT 'available',
  price BIGINT,
  
  -- Tracking
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ⭐ Index untuk GIS queries (PENTING!)
CREATE INDEX idx_creavill_geo ON creavill_properties(lat, lng);
CREATE INDEX idx_creavill_status ON creavill_properties(status);

-- Sample data
INSERT INTO creavill_properties 
(name, location, lat, lng, property_type, status, price)
VALUES 
('Rumah Modern Bandung', 'Jalan Merdeka', -6.8952, 107.6107, 'rumah', 'available', 850000000),
('Apartemen City Center', 'Jalan Sudirman', -6.9010, 107.6068, 'apartemen', 'available', 650000000);
```

### Tabel 2: `creavill_cms_content` (Landing Page - RICH)

Berisi **semua konten untuk landing page** dengan relasi ke tabel 1.

```sql
CREATE TABLE creavill_cms_content (
  id SERIAL PRIMARY KEY,
  
  -- Foreign Key ke properties
  property_id INT NOT NULL UNIQUE,
  
  -- Rich Content untuk Landing Page
  description TEXT,                    -- Short desc (untuk preview)
  full_description TEXT,               -- Long desc (untuk detail page)
  content_html TEXT,                   -- Rich HTML editor output
  
  -- Images
  image_url VARCHAR(500),              -- Full image
  thumbnail_url VARCHAR(500),          -- Thumbnail
  gallery_urls TEXT ARRAY,             -- Multiple images
  
  -- Structured data (JSON)
  amenities JSONB DEFAULT '[]'::jsonb, -- ['AC', 'Pool', 'Gym']
  specifications JSONB DEFAULT '{}'::jsonb, -- {bedrooms: 3, ...}
  floor_plan JSONB DEFAULT '{}'::jsonb, -- Floor plan data
  
  -- SEO & Publishing
  seo_title VARCHAR(255),
  seo_description VARCHAR(500),
  seo_keywords VARCHAR(500),
  meta_image VARCHAR(500),
  
  -- Content Control
  published BOOLEAN DEFAULT false,
  featured BOOLEAN DEFAULT false,
  featured_order INT,
  
  -- Analytics
  view_count INT DEFAULT 0,
  last_viewed_at TIMESTAMP,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  published_at TIMESTAMP,
  
  -- Foreign Key
  FOREIGN KEY (property_id) REFERENCES creavill_properties(id) ON DELETE CASCADE
);

-- ⭐ Index untuk CMS queries
CREATE INDEX idx_cms_published ON creavill_cms_content(published);
CREATE INDEX idx_cms_featured ON creavill_cms_content(featured, featured_order);
CREATE INDEX idx_cms_property ON creavill_cms_content(property_id);

-- Sample CMS content
INSERT INTO creavill_cms_content 
(property_id, description, full_description, image_url, thumbnail_url,
 amenities, specifications, seo_title, seo_description, published, featured)
VALUES 
(1,
 'Rumah 2 lantai modern dengan taman luas',
 'Rumah modern yang nyaman dengan design minimalis. Dilengkapi AC pendingin, taman luas 200 m², parkir 2 mobil, dapur modern, ruang tamu luas dengan sofa custom...',
 'https://cdn.creavill.com/rumah-modern-1-full.jpg',
 'https://cdn.creavill.com/rumah-modern-1-thumb.jpg',
 '["AC", "Taman 200m²", "Parkir 2 Mobil", "Dapur Modern", "Teras Luas", "Kamar Mandi Modern"]'::jsonb,
 '{
   "bedrooms": 3,
   "bathrooms": 2,
   "land_area_m2": 200,
   "building_area_m2": 150,
   "floors": 2,
   "garage_slots": 2,
   "year_built": 2023
 }'::jsonb,
 'Rumah Modern Bandung 850 Juta di Jalan Merdeka - Creavill',
 'Rumah modern 3 kamar di lokasi strategis Jalan Merdeka, harga 850 juta dengan fasilitas lengkap dan taman luas',
 true, true),

(2,
 'Apartemen luxury di pusat kota Bandung',
 'Apartemen City Center dengan view spektakuler terhadap kota. Unit menghadap taman hijau dengan akses langsung ke fasilitas umum. Keamanan 24 jam, CCTV, dan sistem akses otomatis. Dilengkapi kolam renang Olympic, gym modern, food court, dan community room...',
 'https://cdn.creavill.com/apartemen-city-full.jpg',
 'https://cdn.creavill.com/apartemen-city-thumb.jpg',
 '["AC Central", "Kolam Renang Olympic", "Gym 24 Jam", "Keamanan 24/7", "Food Court", "Lobby Modern", "Parking Basement"]'::jsonb,
 '{
   "bedrooms": 3,
   "bathrooms": 2,
   "unit_area_m2": 120,
   "balcony_area_m2": 12,
   "floor_number": 8,
   "total_floors": 28,
   "year_built": 2022
 }'::jsonb,
 'Apartemen City Center Bandung 650 Juta - Luxury Modern - Creavill',
 'Apartemen 3 kamar luxury di Jalan Sudirman Bandung, 650 juta dengan fasilitas premium dan keamanan terpadu',
 true, false);
```

---

## 🔗 DATABASE RELATIONSHIP

```sql
-- Query JOIN untuk landing page (detail properti):
SELECT 
  p.id, p.name, p.price, p.location, p.lat, p.lng,
  c.description, c.full_description, c.image_url,
  c.amenities, c.specifications, c.seo_title
FROM creavill_properties p
LEFT JOIN creavill_cms_content c ON p.id = c.property_id
WHERE p.id = 1 AND c.published = true;

-- Query untuk WebGIS map (hanya geo + basic):
SELECT id, name, location, lat, lng, price, property_type
FROM creavill_properties
WHERE status = 'available'
ORDER BY id;
```

---

## 🚀 BACKEND API: 2 FUNGSI TERPISAH

### Fungsi 1: WebGIS API (`/routes/gis.js`)

**Purpose**: Supply data untuk WebGIS map - LEAN & FAST

```javascript
const express = require('express');
const pool = require('../db');
const router = express.Router();

/**
 * GET /api/gis/geojson
 * ✅ Untuk WebGIS: Semua properti available sebagai GeoJSON
 * ⚡ OPTIMIZED: Hanya ambil field minimal
 */
router.get('/geojson', async (req, res) => {
  try {
    // Query MINIMAL untuk performa (hanya geo + basic)
    const result = await pool.query(`
      SELECT id, name, location, lat, lng, price, property_type
      FROM creavill_properties
      WHERE status = 'available'
      ORDER BY id
    `);
    
    // Convert ke GeoJSON
    const features = result.rows.map(row => ({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [row.lng, row.lat]  // GeoJSON format: [lng, lat]
      },
      properties: {
        id: row.id,
        name: row.name,
        location: row.location,
        price: row.price,
        property_type: row.property_type
      }
    }));
    
    res.json({
      type: 'FeatureCollection',
      features: features,
      meta: {
        total: result.rows.length,
        timestamp: new Date().toISOString()
      }
    });
    
  } catch (error) {
    console.error('GeoJSON error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/gis/search?lat=-6.8&lng=107.6&radius=5
 * ✅ Cari properti dalam radius tertentu (dalam KM)
 * Gunakan PostgreSQL geographic distance
 */
router.get('/search', async (req, res) => {
  const { lat, lng, radius = 5 } = req.query;
  
  if (!lat || !lng) {
    return res.status(400).json({ error: 'lat and lng required' });
  }
  
  try {
    const result = await pool.query(`
      SELECT id, name, location, lat, lng, price, property_type,
             ROUND(
               CAST(6371 * acos(
                 cos(radians($1)) * cos(radians(lat)) * 
                 cos(radians(lng) - radians($2)) + 
                 sin(radians($1)) * sin(radians(lat))
               ) AS numeric), 2
             ) AS distance_km
      FROM creavill_properties
      WHERE status = 'available'
      HAVING CAST(6371 * acos(
        cos(radians($1)) * cos(radians(lat)) * 
        cos(radians(lng) - radians($2)) + 
        sin(radians($1)) * sin(radians(lat))
      ) AS numeric) <= $3
      ORDER BY distance_km ASC
    `, [lat, lng, radius]);
    
    const features = result.rows.map(row => ({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [row.lng, row.lat]
      },
      properties: {
        id: row.id,
        name: row.name,
        distance_km: row.distance_km,
        price: row.price
      }
    }));
    
    res.json({
      type: 'FeatureCollection',
      features: features
    });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/gis/bounds
 * ✅ Ambil batas geografis semua properti
 * Gunakan untuk auto-zoom map
 */
router.get('/bounds', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        MIN(lat) as min_lat, MAX(lat) as max_lat,
        MIN(lng) as min_lng, MAX(lng) as max_lng
      FROM creavill_properties
      WHERE status = 'available'
    `);
    
    const bounds = result.rows[0];
    
    res.json({
      success: true,
      bounds: {
        southwest: [bounds.min_lat, bounds.min_lng],
        northeast: [bounds.max_lat, bounds.max_lng]
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
```

---

### Fungsi 2: CMS Landing Page API (`/routes/cms.js`)

**Purpose**: Supply rich content untuk landing page

```javascript
const express = require('express');
const pool = require('../db');
const router = express.Router();

/**
 * GET /api/cms/properties
 * ✅ Untuk Landing Page: Semua properti dengan content lengkap
 */
router.get('/properties', async (req, res) => {
  const { featured = false, limit = 12, offset = 0 } = req.query;
  
  try {
    let query = `
      SELECT 
        p.id, p.name, p.price, p.location,
        c.description, c.thumbnail_url, c.featured,
        c.amenities, c.seo_title
      FROM creavill_properties p
      LEFT JOIN creavill_cms_content c ON p.id = c.property_id
      WHERE c.published = true
    `;
    
    const params = [];
    
    if (featured === 'true') {
      query += ` AND c.featured = true ORDER BY c.featured_order ASC`;
    } else {
      query += ` ORDER BY c.created_at DESC`;
    }
    
    query += ` LIMIT $1 OFFSET $2`;
    params.push(limit, offset);
    
    const result = await pool.query(query, params);
    
    res.json({
      success: true,
      total: result.rows.length,
      data: result.rows
    });
    
  } catch (error) {
    console.error('CMS error:', error);
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
});

/**
 * GET /api/cms/property/:id
 * ✅ Detail properti lengkap + SEO + analytics
 * Untuk: Single property page di landing
 */
router.get('/property/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    // Get property detail dengan semua CMS content
    const result = await pool.query(`
      SELECT 
        p.id, p.name, p.price, p.location, p.lat, p.lng,
        p.property_type, p.status,
        c.description, c.full_description, c.content_html,
        c.image_url, c.gallery_urls,
        c.amenities, c.specifications,
        c.seo_title, c.seo_description, c.seo_keywords,
        c.view_count, c.featured
      FROM creavill_properties p
      LEFT JOIN creavill_cms_content c ON p.id = c.property_id
      WHERE p.id = $1 AND c.published = true
    `, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Property not found'
      });
    }
    
    const property = result.rows[0];
    
    // Update view count (analytics)
    await pool.query(
      `UPDATE creavill_cms_content 
       SET view_count = view_count + 1, 
           last_viewed_at = NOW()
       WHERE property_id = $1`,
      [id]
    );
    
    res.json({
      success: true,
      data: property
    });
    
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
});

/**
 * GET /api/cms/featured
 * ✅ Properti featured untuk homepage carousel
 */
router.get('/featured', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        p.id, p.name, p.price,
        c.image_url, c.description, c.featured_order
      FROM creavill_properties p
      LEFT JOIN creavill_cms_content c ON p.id = c.property_id
      WHERE c.published = true AND c.featured = true
      ORDER BY c.featured_order ASC
      LIMIT 5
    `);
    
    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/cms/property/:id/view
 * ✅ Track view analytics
 */
router.post('/property/:id/view', async (req, res) => {
  const { id } = req.params;
  
  try {
    await pool.query(
      `UPDATE creavill_cms_content 
       SET view_count = view_count + 1
       WHERE property_id = $1`,
      [id]
    );
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
```

---

## 🎯 UPDATE `server.js`

Tambahkan kedua routes:

```javascript
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.SERVER_PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running ✓' });
});

// ⭐ IMPORT 2 ROUTES
const gisRoutes = require('./routes/gis');    // WebGIS API
const cmsRoutes = require('./routes/cms');    // Landing Page CMS API

// ⭐ USE 2 ROUTES
app.use('/api/gis', gisRoutes);      // WebGIS endpoints
app.use('/api/cms', cmsRoutes);      // CMS endpoints

// 404
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Start
app.listen(PORT, () => {
  console.log(`✓ Server running on http://localhost:${PORT}`);
  console.log('✓ GIS API: /api/gis/*');
  console.log('✓ CMS API: /api/cms/*');
});
```

---

## 📱 FRONTEND USAGE

### WebGIS Component

```javascript
// Load map dengan GeoJSON dari API 1
async function loadWebGIS() {
  const response = await fetch('http://localhost:3000/api/gis/geojson');
  const geojson = await response.json();
  
  // Display di Leaflet map
  geojson.features.forEach(feature => {
    L.marker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]])
      .addTo(map)
      .bindPopup(`${feature.properties.name}`);
  });
}
```

### Landing Page CMS Component

```javascript
// Load featured properties dari API 2
async function loadFeaturedProperties() {
  const response = await fetch('http://localhost:3000/api/cms/featured');
  const result = await response.json();
  
  // Display carousel/grid
  result.data.forEach(property => {
    console.log(property.name, property.price, property.image_url);
  });
}

// Load single property detail dari API 2
async function loadPropertyDetail(id) {
  const response = await fetch(`http://localhost:3000/api/cms/property/${id}`);
  const result = await response.json();
  
  // Display rich content
  document.getElementById('description').innerHTML = result.data.full_description;
  document.getElementById('amenities').innerHTML = JSON.stringify(result.data.amenities);
}
```

---

## ✅ SECURITY & BEST PRACTICES

### 1. Separate API Concerns
- **WebGIS API**: Public, simple, fast queries
- **CMS API**: Can add authentication if needed

### 2. Query Optimization
```javascript
// ✓ GOOD: Index pada kolom yang sering di-query
CREATE INDEX idx_creavill_geo ON creavill_properties(lat, lng);
CREATE INDEX idx_cms_published ON creavill_cms_content(published);

// ✓ GOOD: Minimal field selection
SELECT id, name, lat, lng FROM creavill_properties
// vs
SELECT * FROM creavill_properties  // SLOW!
```

### 3. Caching Strategy
```javascript
// Cache GeoJSON for 5 minutes
const cache = {};
const CACHE_TTL = 5 * 60 * 1000;

router.get('/geojson', async (req, res) => {
  if (cache.geojson && Date.now() - cache.geojson.time < CACHE_TTL) {
    return res.json(cache.geojson.data);
  }
  // ... fetch from DB
  cache.geojson = { data: result, time: Date.now() };
});
```

### 4. Rate Limiting
```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

---

## 📊 API ENDPOINTS SUMMARY

| Endpoint | Method | Purpose | Response |
|----------|--------|---------|----------|
| `/api/gis/geojson` | GET | WebGIS map data | GeoJSON |
| `/api/gis/search?lat=X&lng=Y&radius=5` | GET | Search nearby | GeoJSON |
| `/api/gis/bounds` | GET | Map bounds | Coordinates |
| `/api/cms/properties` | GET | Landing grid | Properties array |
| `/api/cms/property/:id` | GET | Detail page | Full property object |
| `/api/cms/featured` | GET | Homepage carousel | Featured properties |
| `/api/cms/property/:id/view` | POST | Track analytics | Success |

---

## 🚀 DEPLOYMENT

**Kedua API di server yang sama:**

```bash
# DigitalOcean App Platform
npm install
npm start
```

**Atau split ke microservices (advanced):**
- Service 1: GIS API (lightweight)
- Service 2: CMS API (heavier)

---

## 🎓 KESIMPULAN

✅ **Aman & Recommended!**

**Keuntungan 2-Fungsi:**
- 🎯 Clear separation of concerns
- ⚡ WebGIS API tetap fast (minimal fields)
- 🛡️ CMS data independent (bisa di-update tanpa affect map)
- 📊 Analytics terpisah
- 🔐 Easier to secure/cache
- 🚀 Scalable untuk future growth

**Struktur ini siap untuk:**
- Landing page + CMS
- WebGIS visualization
- Analytics tracking
- Future mobile app

---

**Status**: Production-Ready ✅  
**Created**: January 2026  
**Last Updated**: January 15, 2026
