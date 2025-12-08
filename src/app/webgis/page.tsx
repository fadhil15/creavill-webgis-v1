'use client';

import React, { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Search, Layers, Eye, Table, Settings, X, EyeOff } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

// Village data - each will be loaded separately and EXCLUSIVELY
const villages = [
    {
        id: 0,
        name: "Rumah Baca Desa Pasirlangu",
        coords: [107.53231346568899, -6.807800429399588] as [number, number],
        desc: "Pusat kegiatan literasi warga Pasirlangu",
        legendColor: "#22c55e",
        legendItems: [
            { color: "#22c55e", label: "Rumah Baca", type: "", layerId: "marker" },
        ]
    },
    {
        id: 1,
        name: "Rumah Baca Kelurahan Braga",
        coords: [107.6082051971451, -6.918478596352733] as [number, number],
        desc: "Ruang baca di tengah hiruk pikuk kota",
        legendColor: "#3b82f6",
        geojsonLayers: {
            boundary: "/data_geojson/batas_wilayah_braga.geojson",
            roads: "/data_geojson/jalan_braga.geojson",
            tourism: "/data_geojson/pariwisata_braga.geojson",
            minimarket: "/data_geojson/minimarket_braga.geojson",
            resto: "/data_geojson/resto_braga.geojson"
        },
        legendItems: [
            { color: "#3b82f6", label: "Rumah Baca", type: "", layerId: "marker" },
            { color: "#1f2937", label: "Batas Wilayah", type: "line-dashed", layerId: "boundary" },
            { color: "#ef4444", label: "Jalan Umum", type: "line", layerId: "roads-general" },
            { color: "#dc2626", label: "Jalan Braga", type: "line-thick", layerId: "roads-braga" },
            { color: "#8b5cf6", label: "Pariwisata", type: "point", layerId: "tourism" },
            { color: "#10b981", label: "Minimarket", type: "point", layerId: "minimarket" },
            { color: "#f59e0b", label: "Restoran", type: "point", layerId: "resto" },
        ]
    },
    {
        id: 2,
        name: "Rumah Baca Desa Cimenyan",
        coords: [107.67596651962229, -6.848672272627501] as [number, number],
        desc: "Membaca dengan pemandangan Bandung",
        legendColor: "#f97316",
        legendItems: [
            { color: "#f97316", label: "Rumah Baca", type: "", layerId: "marker" },
        ]
    }
];

// Available basemap styles
const basemapStyles = [
    { id: 'liberty', name: 'Street', url: 'https://tiles.openfreemap.org/styles/liberty', thumb: '🗺️' },
    { id: 'bright', name: 'Bright', url: 'https://tiles.openfreemap.org/styles/bright', thumb: '☀️' },
    { id: 'positron', name: 'Light', url: 'https://tiles.openfreemap.org/styles/positron', thumb: '⬜' },
    { id: 'satellite', name: 'Satellite', url: 'google-satellite', thumb: '🛰️' },
];

export default function WebGISPage() {
    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<maplibregl.Map | null>(null);
    const currentMarker = useRef<maplibregl.Marker | null>(null);

    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [controlPanelOpen, setControlPanelOpen] = useState(false);
    const [activeVillage, setActiveVillage] = useState<number | null>(null); // Only ONE active at a time
    const [activeBasemap, setActiveBasemap] = useState('liberty');
    const [language, setLanguage] = useState<'id' | 'en'>('id');
    const [layerVisibility, setLayerVisibility] = useState<Record<string, boolean>>({
        marker: true,
        boundary: true,
        'roads-general': true,
        'roads-braga': true,
        tourism: true,
        minimarket: false,
        resto: false
    });

    // Initialize map (without markers)
    useEffect(() => {
        if (map.current || !mapContainer.current) return;

        map.current = new maplibregl.Map({
            container: mapContainer.current,
            style: 'https://tiles.openfreemap.org/styles/liberty',
            center: [107.6082, -6.9184] as [number, number],
            zoom: 11
        });

        map.current.addControl(new maplibregl.NavigationControl(), 'top-right');
    }, []);

    // Function to show a village's data (EXCLUSIVE - removes previous)
    const showVillageData = (villageIndex: number) => {
        if (!map.current) return;

        const village = villages[villageIndex];

        // Remove existing marker if any
        if (currentMarker.current) {
            currentMarker.current.remove();
            currentMarker.current = null;
        }

        // Create marker element
        const el = document.createElement('div');
        el.className = 'marker';
        el.style.width = '40px';
        el.style.height = '40px';
        el.innerHTML = `
            <svg viewBox="0 0 24 24" fill="${village.legendColor}" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-10 h-10 drop-shadow-lg filter">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
        `;

        // Create popup
        const popup = new maplibregl.Popup({ offset: 25 })
            .setHTML(`
                <div class="p-2">
                    <h3 class="font-bold text-sm">${village.name}</h3>
                    <p class="text-xs text-gray-600">${village.desc}</p>
                </div>
            `);

        // Add marker to map
        currentMarker.current = new maplibregl.Marker({ element: el })
            .setLngLat(village.coords)
            .setPopup(popup)
            .addTo(map.current);

        // Update state
        setActiveVillage(villageIndex);

        // Load GeoJSON layers if available
        if (village.geojsonLayers && map.current) {
            const mapInstance = map.current;
            const layers = village.geojsonLayers;

            // Load boundary layer
            if (layers.boundary) {
                fetch(layers.boundary)
                    .then(res => res.json())
                    .then(data => {
                        // Remove existing if any
                        if (mapInstance.getLayer('boundary-line')) mapInstance.removeLayer('boundary-line');
                        if (mapInstance.getSource('boundary-source')) mapInstance.removeSource('boundary-source');

                        mapInstance.addSource('boundary-source', { type: 'geojson', data });
                        mapInstance.addLayer({
                            id: 'boundary-line',
                            type: 'line',
                            source: 'boundary-source',
                            paint: {
                                'line-color': '#1f2937',
                                'line-width': 3,
                                'line-dasharray': [4, 4]
                            }
                        });
                    })
                    .catch(err => console.error('Error loading boundary:', err));
            }

            // Load roads layer
            if (layers.roads) {
                fetch(layers.roads)
                    .then(res => res.json())
                    .then(data => {
                        if (mapInstance.getLayer('roads-braga')) mapInstance.removeLayer('roads-braga');
                        if (mapInstance.getLayer('roads-general')) mapInstance.removeLayer('roads-general');
                        if (mapInstance.getSource('roads-source')) mapInstance.removeSource('roads-source');

                        mapInstance.addSource('roads-source', { type: 'geojson', data });

                        // General roads layer
                        mapInstance.addLayer({
                            id: 'roads-general',
                            type: 'line',
                            source: 'roads-source',
                            filter: ['!=', ['get', 'NAMRJL'], 'JALANBRAGA'],
                            paint: {
                                'line-color': '#ef4444',
                                'line-width': 2
                            }
                        });

                        // Jalan Braga - thicker
                        mapInstance.addLayer({
                            id: 'roads-braga',
                            type: 'line',
                            source: 'roads-source',
                            filter: ['==', ['get', 'NAMRJL'], 'JALANBRAGA'],
                            paint: {
                                'line-color': '#dc2626',
                                'line-width': 5
                            }
                        });
                    })
                    .catch(err => console.error('Error loading roads:', err));
            }

            // Load tourism layer
            if (layers.tourism) {
                fetch(layers.tourism)
                    .then(res => res.json())
                    .then(data => {
                        if (mapInstance.getLayer('tourism-labels')) mapInstance.removeLayer('tourism-labels');
                        if (mapInstance.getLayer('tourism-points')) mapInstance.removeLayer('tourism-points');
                        if (mapInstance.getSource('tourism-source')) mapInstance.removeSource('tourism-source');

                        mapInstance.addSource('tourism-source', { type: 'geojson', data });

                        // Tourism points
                        mapInstance.addLayer({
                            id: 'tourism-points',
                            type: 'circle',
                            source: 'tourism-source',
                            paint: {
                                'circle-radius': 10,
                                'circle-color': '#8b5cf6',
                                'circle-stroke-width': 3,
                                'circle-stroke-color': '#ffffff'
                            }
                        });

                        // Tourism labels
                        mapInstance.addLayer({
                            id: 'tourism-labels',
                            type: 'symbol',
                            source: 'tourism-source',
                            layout: {
                                'text-field': ['get', 'NAMA'],
                                'text-size': 11,
                                'text-offset': [0, 1.5],
                                'text-anchor': 'top',
                                'text-max-width': 10
                            },
                            paint: {
                                'text-color': '#1f2937',
                                'text-halo-color': '#ffffff',
                                'text-halo-width': 2
                            }
                        });

                        // Add click handler for tourism points
                        mapInstance.on('click', 'tourism-points', (e) => {
                            if (!e.features || e.features.length === 0) return;
                            const props = e.features[0].properties;
                            const coords = e.lngLat;

                            // Tourism info with opening hours
                            const tourismInfo: Record<string, { desc: string; hours: string; photo: string }> = {
                                'MUSEUM KONPERENSI ASIA AFRIKA': {
                                    desc: 'Museum yang menyimpan sejarah Konferensi Asia Afrika 1955, momen penting dalam sejarah diplomasi Indonesia.',
                                    hours: 'Rabu-Sabtu: 09:00-15:00 (Tutup Minggu-Selasa)',
                                    photo: '/images/tourism/museum_kaa.png'
                                },
                                'BRAGA CITY WALK': {
                                    desc: 'Pusat perbelanjaan modern dengan bioskop XXI dan berbagai retail di kawasan wisata Braga.',
                                    hours: 'Setiap hari: 10:00-22:00',
                                    photo: '/images/tourism/braga_city_walk.png'
                                },
                                'GEDUNG YPK': {
                                    desc: 'Gedung bersejarah pusat kesenian dan kebudayaan Jawa Barat.',
                                    hours: 'Sementara tutup untuk renovasi',
                                    photo: '/images/tourism/gedung_ypk.png'
                                },
                                'TAMAN BRAGA': {
                                    desc: 'Taman kota yang nyaman untuk bersantai di tengah kawasan wisata Braga.',
                                    hours: 'Buka 24 jam',
                                    photo: '/images/tourism/taman_braga.png'
                                },
                                'MONUMEN DASASILA BANDUNG': {
                                    desc: 'Monumen bersejarah yang memperingati 10 prinsip dari Konferensi Asia Afrika.',
                                    hours: 'Area terbuka',
                                    photo: '/images/tourism/monumen_dasasila.png'
                                },
                                'MUSEUM MANDALA WANGSIT SILIWANGI': {
                                    desc: 'Museum militer yang menyimpan koleksi sejarah perjuangan TNI di Jawa Barat.',
                                    hours: 'Selasa-Minggu: 08:00-15:00 (Tutup Senin)',
                                    photo: '/images/tourism/museum_siliwangi.png'
                                },
                                'GEDUNG GAS NEGARA': {
                                    desc: 'Bangunan bersejarah dengan arsitektur kolonial Belanda di Jalan Braga.',
                                    hours: 'Area eksternal dapat dilihat kapan saja',
                                    photo: '/images/tourism/gedung_gas.png'
                                },
                                'PURA PUSER DAYEUH SILIWANGI': {
                                    desc: 'Pura Hindu yang menjadi tempat ibadah umat Hindu di kota Bandung.',
                                    hours: 'Setiap hari: 06:00-18:00',
                                    photo: '/images/tourism/pura_siliwangi.png'
                                },
                                'MUSEUM WOLFF SCHOEMAKER (PREANGER)': {
                                    desc: 'Museum tentang arsitek Belanda Wolff Schoemaker yang merancang banyak bangunan ikonik di Bandung.',
                                    hours: 'Hubungi Hotel Preanger untuk kunjungan',
                                    photo: '/images/tourism/museum_preanger.png'
                                }
                            };

                            const info = tourismInfo[props.NAMA] || {
                                desc: props.TIPE_3 || 'Lokasi wisata di kawasan Braga',
                                hours: 'Hubungi tempat untuk informasi jam buka',
                                photo: '/images/tourism/museum_kaa.png'
                            };

                            const popupHtml = `
                                <div style="width: 280px; font-family: system-ui, sans-serif;">
                                    <img src="${info.photo}" alt="${props.NAMA}" style="width: 100%; height: 140px; object-fit: cover; border-radius: 8px 8px 0 0;" onerror="this.style.display='none'"/>
                                    <div style="padding: 12px;">
                                        <h3 style="margin: 0 0 4px 0; font-size: 14px; font-weight: bold; color: #1f2937;">${props.NAMA}</h3>
                                        <span style="display: inline-block; background: #8b5cf6; color: white; font-size: 10px; padding: 2px 6px; border-radius: 4px; margin-bottom: 8px;">${props.TIPE_3 || 'Wisata'}</span>
                                        <p style="margin: 8px 0; font-size: 12px; color: #4b5563; line-height: 1.4;">${info.desc}</p>
                                        <div style="display: flex; align-items: center; gap: 6px; margin-top: 8px; padding-top: 8px; border-top: 1px solid #e5e7eb;">
                                            <span style="font-size: 12px;">🕐</span>
                                            <span style="font-size: 11px; color: #6b7280;">${info.hours}</span>
                                        </div>
                                        <div style="display: flex; align-items: flex-start; gap: 6px; margin-top: 6px;">
                                            <span style="font-size: 12px;">📍</span>
                                            <span style="font-size: 10px; color: #9ca3af; line-height: 1.3;">${props.ALAMAT || 'Kelurahan Braga, Bandung'}</span>
                                        </div>
                                    </div>
                                </div>
                            `;

                            new maplibregl.Popup({ maxWidth: '320px' })
                                .setLngLat(coords)
                                .setHTML(popupHtml)
                                .addTo(mapInstance);
                        });

                        // Change cursor on hover
                        mapInstance.on('mouseenter', 'tourism-points', () => {
                            mapInstance.getCanvas().style.cursor = 'pointer';
                        });
                        mapInstance.on('mouseleave', 'tourism-points', () => {
                            mapInstance.getCanvas().style.cursor = '';
                        });
                    })
                    .catch(err => console.error('Error loading tourism:', err));
            }

            // Load minimarket layer
            if (layers.minimarket) {
                fetch(layers.minimarket)
                    .then(res => res.json())
                    .then(data => {
                        if (mapInstance.getLayer('minimarket-labels')) mapInstance.removeLayer('minimarket-labels');
                        if (mapInstance.getLayer('minimarket-points')) mapInstance.removeLayer('minimarket-points');
                        if (mapInstance.getSource('minimarket-source')) mapInstance.removeSource('minimarket-source');

                        mapInstance.addSource('minimarket-source', { type: 'geojson', data });

                        mapInstance.addLayer({
                            id: 'minimarket-points',
                            type: 'circle',
                            source: 'minimarket-source',
                            layout: { visibility: 'none' },
                            paint: {
                                'circle-radius': 8,
                                'circle-color': '#10b981',
                                'circle-stroke-width': 2,
                                'circle-stroke-color': '#ffffff'
                            }
                        });

                        mapInstance.addLayer({
                            id: 'minimarket-labels',
                            type: 'symbol',
                            source: 'minimarket-source',
                            layout: {
                                visibility: 'none',
                                'text-field': ['get', 'NAMA'],
                                'text-size': 10,
                                'text-offset': [0, 1.2],
                                'text-anchor': 'top',
                                'text-max-width': 8
                            },
                            paint: {
                                'text-color': '#047857',
                                'text-halo-color': '#ffffff',
                                'text-halo-width': 1.5
                            }
                        });

                        // Simple popup for minimarket
                        mapInstance.on('click', 'minimarket-points', (e) => {
                            if (!e.features || e.features.length === 0) return;
                            const props = e.features[0].properties;
                            const popupHtml = `
                                <div style="padding: 8px; font-family: system-ui, sans-serif; max-width: 220px;">
                                    <h4 style="margin: 0 0 4px 0; font-size: 13px; font-weight: bold; color: #047857;">${props.NAMA}</h4>
                                    <span style="display: inline-block; background: #10b981; color: white; font-size: 9px; padding: 2px 6px; border-radius: 4px; margin-bottom: 6px;">${props.TIPE_3 || 'Minimarket'}</span>
                                    <p style="margin: 0; font-size: 11px; color: #6b7280;">📍 ${props.ALAMAT || 'Kelurahan Braga, Bandung'}</p>
                                </div>
                            `;
                            new maplibregl.Popup({ maxWidth: '250px' }).setLngLat(e.lngLat).setHTML(popupHtml).addTo(mapInstance);
                        });

                        mapInstance.on('mouseenter', 'minimarket-points', () => { mapInstance.getCanvas().style.cursor = 'pointer'; });
                        mapInstance.on('mouseleave', 'minimarket-points', () => { mapInstance.getCanvas().style.cursor = ''; });
                    })
                    .catch(err => console.error('Error loading minimarket:', err));
            }

            // Load resto layer
            if (layers.resto) {
                fetch(layers.resto)
                    .then(res => res.json())
                    .then(data => {
                        if (mapInstance.getLayer('resto-labels')) mapInstance.removeLayer('resto-labels');
                        if (mapInstance.getLayer('resto-points')) mapInstance.removeLayer('resto-points');
                        if (mapInstance.getSource('resto-source')) mapInstance.removeSource('resto-source');

                        mapInstance.addSource('resto-source', { type: 'geojson', data });

                        mapInstance.addLayer({
                            id: 'resto-points',
                            type: 'circle',
                            source: 'resto-source',
                            layout: { visibility: 'none' },
                            paint: {
                                'circle-radius': 8,
                                'circle-color': '#f59e0b',
                                'circle-stroke-width': 2,
                                'circle-stroke-color': '#ffffff'
                            }
                        });

                        mapInstance.addLayer({
                            id: 'resto-labels',
                            type: 'symbol',
                            source: 'resto-source',
                            layout: {
                                visibility: 'none',
                                'text-field': ['get', 'NAMA'],
                                'text-size': 10,
                                'text-offset': [0, 1.2],
                                'text-anchor': 'top',
                                'text-max-width': 8
                            },
                            paint: {
                                'text-color': '#b45309',
                                'text-halo-color': '#ffffff',
                                'text-halo-width': 1.5
                            }
                        });

                        // Simple popup for resto
                        mapInstance.on('click', 'resto-points', (e) => {
                            if (!e.features || e.features.length === 0) return;
                            const props = e.features[0].properties;
                            const popupHtml = `
                                <div style="padding: 8px; font-family: system-ui, sans-serif; max-width: 220px;">
                                    <h4 style="margin: 0 0 4px 0; font-size: 13px; font-weight: bold; color: #b45309;">${props.NAMA}</h4>
                                    <span style="display: inline-block; background: #f59e0b; color: white; font-size: 9px; padding: 2px 6px; border-radius: 4px; margin-bottom: 6px;">${props.TIPE_3 || 'Restoran'}</span>
                                    <p style="margin: 0; font-size: 11px; color: #6b7280;">📍 ${props.ALAMAT || 'Kelurahan Braga, Bandung'}</p>
                                </div>
                            `;
                            new maplibregl.Popup({ maxWidth: '250px' }).setLngLat(e.lngLat).setHTML(popupHtml).addTo(mapInstance);
                        });

                        mapInstance.on('mouseenter', 'resto-points', () => { mapInstance.getCanvas().style.cursor = 'pointer'; });
                        mapInstance.on('mouseleave', 'resto-points', () => { mapInstance.getCanvas().style.cursor = ''; });
                    })
                    .catch(err => console.error('Error loading resto:', err));
            }
        }

        // Fly to location
        map.current.flyTo({ center: village.coords, zoom: 15, essential: true });
    };

    // Function to hide current village data
    const hideVillageData = () => {
        if (currentMarker.current) {
            currentMarker.current.remove();
            currentMarker.current = null;
        }

        // Remove all GeoJSON layers
        if (map.current) {
            const layersToRemove = ['boundary-line', 'roads-general', 'roads-braga', 'tourism-points', 'tourism-labels', 'minimarket-points', 'minimarket-labels', 'resto-points', 'resto-labels'];
            const sourcesToRemove = ['boundary-source', 'roads-source', 'tourism-source', 'minimarket-source', 'resto-source'];

            layersToRemove.forEach(layer => {
                if (map.current!.getLayer(layer)) map.current!.removeLayer(layer);
            });
            sourcesToRemove.forEach(source => {
                if (map.current!.getSource(source)) map.current!.removeSource(source);
            });
        }

        setActiveVillage(null);

        // Zoom out to overview
        if (map.current) {
            map.current.flyTo({ center: [107.6082, -6.9184], zoom: 11, essential: true });
        }
    };

    // Function to toggle layer visibility
    const toggleLayerVisibility = (layerId: string) => {
        if (!map.current) return;

        const newVisibility = !layerVisibility[layerId];
        setLayerVisibility(prev => ({ ...prev, [layerId]: newVisibility }));

        // Map layerId to actual map layer IDs
        const layerMapping: Record<string, string[]> = {
            'marker': [], // Marker is handled separately
            'boundary': ['boundary-line'],
            'roads-general': ['roads-general'],
            'roads-braga': ['roads-braga'],
            'tourism': ['tourism-points', 'tourism-labels'],
            'minimarket': ['minimarket-points', 'minimarket-labels'],
            'resto': ['resto-points', 'resto-labels']
        };

        const mapLayers = layerMapping[layerId] || [];
        mapLayers.forEach(layer => {
            if (map.current!.getLayer(layer)) {
                map.current!.setLayoutProperty(layer, 'visibility', newVisibility ? 'visible' : 'none');
            }
        });

        // Handle marker visibility
        if (layerId === 'marker' && currentMarker.current) {
            const markerEl = currentMarker.current.getElement();
            markerEl.style.display = newVisibility ? 'block' : 'none';
        }
    };
    const changeBasemap = (styleId: string) => {
        if (!map.current) return;
        const style = basemapStyles.find(s => s.id === styleId);
        if (style) {
            // For satellite, use Google XYZ tiles
            if (styleId === 'satellite') {
                map.current.setStyle({
                    version: 8,
                    sources: {
                        'google-satellite': {
                            type: 'raster',
                            tiles: ['http://mt0.google.com/vt/lyrs=s&hl=en&x={x}&y={y}&z={z}'],
                            tileSize: 256,
                            attribution: '© Google'
                        }
                    },
                    layers: [{
                        id: 'google-satellite-layer',
                        type: 'raster',
                        source: 'google-satellite',
                        minzoom: 0,
                        maxzoom: 22
                    }]
                });
                setActiveBasemap(styleId);
            } else {
                map.current.setStyle(style.url);
                setActiveBasemap(styleId);
            }

            // Re-add active marker after style change
            map.current.once('styledata', () => {
                if (activeVillage !== null) {
                    const village = villages[activeVillage];
                    const el = document.createElement('div');
                    el.className = 'marker';
                    el.style.width = '40px';
                    el.style.height = '40px';
                    el.innerHTML = `
                        <svg viewBox="0 0 24 24" fill="${village.legendColor}" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-10 h-10 drop-shadow-lg filter">
                            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                            <polyline points="9 22 9 12 15 12 15 22"></polyline>
                        </svg>
                    `;
                    const popup = new maplibregl.Popup({ offset: 25 })
                        .setHTML(`<div class="p-2"><h3 class="font-bold text-sm">${village.name}</h3><p class="text-xs text-gray-600">${village.desc}</p></div>`);

                    currentMarker.current = new maplibregl.Marker({ element: el })
                        .setLngLat(village.coords)
                        .setPopup(popup)
                        .addTo(map.current!);
                }
            });
        }
    };

    // Function to change language
    const changeLanguage = (lang: 'id' | 'en') => {
        setLanguage(lang);
        // Note: Actual map label language change depends on the tile provider
        // OpenFreeMap may not support dynamic language switching
        // This would work with MapTiler/Mapbox with proper configuration
    };

    const activeVillageData = activeVillage !== null ? villages[activeVillage] : null;

    return (
        <div className="flex h-screen w-full bg-gray-50 overflow-hidden font-sans">
            {/* Sidebar */}
            {sidebarOpen && (
                <div className="w-80 bg-white shadow-xl flex flex-col z-20 border-r border-gray-200">
                    <div className="p-6 border-b border-gray-100 flex flex-col justify-center items-center text-center bg-gray-900 text-white relative">
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="absolute top-4 right-4 hover:bg-gray-800 p-1 rounded text-gray-400 hover:text-white transition-colors"
                        >
                            <X size={18} />
                        </button>

                        <Image
                            src="/images/logo-creavill-bandung.png"
                            alt="Logo Creavill Bandung"
                            width={80}
                            height={80}
                            className="mb-4 w-auto h-auto"
                            priority
                        />

                        <h1 className="font-bold text-lg tracking-tight mb-2">
                            {language === 'id' ? 'WEBGIS : Peta Lokasi Desa Binaan' : 'WEBGIS : Partner Village Map'}
                        </h1>

                        <p className="text-xs text-gray-400 font-light leading-relaxed max-w-[240px]">
                            {language === 'id'
                                ? 'WebGIS ini menampilkan lokasi desa binaan Creavill Bandung yang relawan Creavill Bandung aktif sampai saat ini.'
                                : 'This WebGIS displays the locations of partner villages where Creavill Bandung volunteers are currently active.'}
                        </p>
                    </div>

                    <div className="p-4 space-y-4 flex-1 overflow-y-auto bg-gray-50/50">
                        {villages.map((village, index) => {
                            const isActive = activeVillage === index;
                            return (
                                <div
                                    key={index}
                                    className={`bg-white rounded-xl shadow-sm border p-4 transition-all ${isActive ? 'border-blue-500 ring-2 ring-blue-100' : 'border-gray-200 hover:shadow-md'}`}
                                >
                                    <div className="flex justify-between items-start mb-3">
                                        <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded border border-blue-200 font-semibold">Point</span>
                                        {isActive && (
                                            <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded border border-green-200 font-semibold">
                                                {language === 'id' ? 'Aktif' : 'Active'}
                                            </span>
                                        )}
                                    </div>
                                    <h4 className="text-sm font-bold text-gray-800 mb-1 leading-snug uppercase">{village.name}</h4>
                                    <p className="text-[10px] text-gray-500 mb-4">
                                        {language === 'id' ? 'Klik "Lihat" untuk menampilkan data' : 'Click "View" to show data'}
                                    </p>

                                    <div className="flex justify-center gap-4 text-gray-500 border-t border-gray-100 pt-3">
                                        {!isActive ? (
                                            <button
                                                onClick={() => showVillageData(index)}
                                                className="flex flex-col items-center gap-1 cursor-pointer hover:text-blue-600 group"
                                            >
                                                <Eye size={16} className="group-hover:scale-110 transition-transform" />
                                                <span className="text-[10px] font-medium">{language === 'id' ? 'Lihat' : 'View'}</span>
                                            </button>
                                        ) : (
                                            <button
                                                onClick={hideVillageData}
                                                className="flex flex-col items-center gap-1 cursor-pointer hover:text-red-600 group text-red-500"
                                            >
                                                <EyeOff size={16} className="group-hover:scale-110 transition-transform" />
                                                <span className="text-[10px] font-medium">{language === 'id' ? 'Sembunyikan' : 'Hide'}</span>
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Map Area */}
            <div className="flex-1 relative">
                {!sidebarOpen && (
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="absolute top-4 left-4 z-10 bg-white p-2 rounded-md shadow-lg hover:bg-gray-50"
                    >
                        <Layers size={20} />
                    </button>
                )}

                {/* Search Bar Floating */}
                <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 w-full max-w-md px-4">
                    <div className="bg-white rounded-full shadow-lg flex items-center px-4 py-2 w-full border border-gray-200">
                        <Search className="text-gray-400 w-5 h-5 mr-3" />
                        <input
                            type="text"
                            placeholder={language === 'id' ? 'Cari lokasi...' : 'Search location...'}
                            className="flex-1 outline-none text-sm text-gray-700 placeholder-gray-400"
                        />
                    </div>
                </div>

                {/* Map Control Center Toggle */}
                <button
                    onClick={() => setControlPanelOpen(!controlPanelOpen)}
                    className="absolute top-4 right-14 z-10 bg-white p-2 rounded-md shadow-lg hover:bg-gray-50 border border-gray-200"
                >
                    <Settings size={20} className="text-gray-600" />
                </button>

                {/* Map Control Center Panel */}
                {controlPanelOpen && (
                    <div className="absolute top-16 right-4 z-10 bg-white rounded-xl shadow-xl border border-gray-200 p-4 w-64">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-sm text-gray-800">Map Control Center</h3>
                            <button onClick={() => setControlPanelOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <X size={16} />
                            </button>
                        </div>

                        {/* Basemap Styles */}
                        <div className="mb-4">
                            <p className="text-xs font-semibold text-gray-600 mb-2">Style Basemap</p>
                            <div className="grid grid-cols-4 gap-2">
                                {basemapStyles.map(style => (
                                    <button
                                        key={style.id}
                                        onClick={() => changeBasemap(style.id)}
                                        className={`p-2 rounded-lg border-2 text-xl flex items-center justify-center transition-all ${activeBasemap === style.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}
                                        title={style.name}
                                    >
                                        {style.thumb}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Language */}
                        <div>
                            <p className="text-xs font-semibold text-gray-600 mb-2">{language === 'id' ? 'Bahasa' : 'Language'}</p>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => changeLanguage('id')}
                                    className={`p-2 rounded-lg border-2 text-xs font-bold flex-1 ${language === 'id' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}
                                >
                                    🇮🇩 Indonesia
                                </button>
                                <button
                                    onClick={() => changeLanguage('en')}
                                    className={`p-2 rounded-lg border-2 text-xs font-bold flex-1 ${language === 'en' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}
                                >
                                    🇬🇧 English
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <div ref={mapContainer} className="w-full h-full" />

                {/* Legend Panel - Only shows when a village is active */}
                {activeVillageData && (
                    <div className="absolute bottom-20 left-6 z-10 bg-white/95 backdrop-blur rounded-xl shadow-lg border border-gray-200 p-4 w-64">
                        <h4 className="font-bold text-sm text-gray-800 mb-1">
                            {language === 'id' ? 'Legenda' : 'Legend'}
                        </h4>
                        <p className="text-[10px] text-gray-500 mb-3">{activeVillageData.name}</p>
                        <div className="space-y-2">
                            {activeVillageData.legendItems.map((item, idx) => (
                                <div key={idx} className="flex items-center justify-between gap-2">
                                    <div className="flex items-center gap-2">
                                        {item.type === 'line-dashed' ? (
                                            <div
                                                className="w-5 h-0 border-t-2 border-dashed"
                                                style={{ borderColor: item.color, opacity: layerVisibility[item.layerId] ? 1 : 0.3 }}
                                            />
                                        ) : item.type === 'line' ? (
                                            <div
                                                className="w-5 h-0 border-t-2"
                                                style={{ borderColor: item.color, opacity: layerVisibility[item.layerId] ? 1 : 0.3 }}
                                            />
                                        ) : item.type === 'line-thick' ? (
                                            <div
                                                className="w-5 h-1 rounded"
                                                style={{ backgroundColor: item.color, opacity: layerVisibility[item.layerId] ? 1 : 0.3 }}
                                            />
                                        ) : (
                                            <div
                                                className="w-3 h-3 rounded-full border border-white shadow-sm"
                                                style={{ backgroundColor: item.color, opacity: layerVisibility[item.layerId] ? 1 : 0.3 }}
                                            />
                                        )}
                                        <span className={`text-xs ${layerVisibility[item.layerId] ? 'text-gray-700' : 'text-gray-400'}`}>{item.label}</span>
                                    </div>
                                    <button
                                        onClick={() => toggleLayerVisibility(item.layerId)}
                                        className={`relative w-8 h-4 rounded-full transition-colors ${layerVisibility[item.layerId] ? 'bg-blue-500' : 'bg-gray-300'}`}
                                    >
                                        <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white shadow transition-transform ${layerVisibility[item.layerId] ? 'translate-x-4' : 'translate-x-0.5'}`} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <Link
                    href="/"
                    className="absolute bottom-6 left-6 z-10 bg-white/90 backdrop-blur px-4 py-2 rounded-lg shadow-lg text-sm font-medium hover:bg-white transition-colors border border-gray-200 text-gray-700"
                >
                    &larr; {language === 'id' ? 'Kembali ke Beranda' : 'Back to Home'}
                </Link>
            </div>
        </div>
    );
}
