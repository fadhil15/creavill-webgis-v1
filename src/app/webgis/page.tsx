'use client';

import React, { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Search, Layers, Eye, Table, Settings, X, EyeOff } from 'lucide-react';
import Link from 'next/link';

// Village data - each will be loaded separately and EXCLUSIVELY
const villages = [
    {
        id: 0,
        name: "Rumah Baca Desa Pasirlangu",
        coords: [107.53231346568899, -6.807800429399588] as [number, number],
        desc: "Pusat kegiatan literasi warga Pasirlangu",
        legendColor: "#22c55e",
        legendItems: [
            { color: "#22c55e", label: "Rumah Baca" },
            // Future: more legend items per village
        ]
    },
    {
        id: 1,
        name: "Rumah Baca Kelurahan Braga",
        coords: [107.6082051971451, -6.918478596352733] as [number, number],
        desc: "Ruang baca di tengah hiruk pikuk kota",
        legendColor: "#3b82f6",
        legendItems: [
            { color: "#3b82f6", label: "Rumah Baca" },
        ]
    },
    {
        id: 2,
        name: "Rumah Baca Desa Cimenyan",
        coords: [107.67596651962229, -6.848672272627501] as [number, number],
        desc: "Membaca dengan pemandangan Bandung",
        legendColor: "#f97316",
        legendItems: [
            { color: "#f97316", label: "Rumah Baca" },
        ]
    }
];

// Available basemap styles
const basemapStyles = [
    { id: 'liberty', name: 'Street', url: 'https://tiles.openfreemap.org/styles/liberty', thumb: '🗺️' },
    { id: 'bright', name: 'Bright', url: 'https://tiles.openfreemap.org/styles/bright', thumb: '☀️' },
    { id: 'positron', name: 'Light', url: 'https://tiles.openfreemap.org/styles/positron', thumb: '⬜' },
    { id: 'satellite', name: 'Satellite', url: 'https://api.maptiler.com/maps/hybrid/style.json?key=get_your_own_OpIi9ZULNHzrESv6T2vL', thumb: '🛰️' },
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

        // Fly to location
        map.current.flyTo({ center: village.coords, zoom: 15, essential: true });
    };

    // Function to hide current village data
    const hideVillageData = () => {
        if (currentMarker.current) {
            currentMarker.current.remove();
            currentMarker.current = null;
        }
        setActiveVillage(null);

        // Zoom out to overview
        if (map.current) {
            map.current.flyTo({ center: [107.6082, -6.9184], zoom: 11, essential: true });
        }
    };

    // Function to change basemap
    const changeBasemap = (styleId: string) => {
        if (!map.current) return;
        const style = basemapStyles.find(s => s.id === styleId);
        if (style) {
            // For satellite, we use a different approach since it needs an API key
            // Using OpenFreeMap for now, satellite would need MapTiler/Mapbox key
            if (styleId === 'satellite') {
                // Fallback to a free satellite-like style or show message
                alert('Satellite basemap requires an API key. Using Street style instead.');
                return;
            }

            map.current.setStyle(style.url);
            setActiveBasemap(styleId);

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
                    <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-900 text-white">
                        <span className="font-bold text-sm tracking-tight">
                            {language === 'id' ? 'WEBGIS : Peta Lokasi Desa Binaan' : 'WEBGIS : Partner Village Map'}
                        </span>
                        <button onClick={() => setSidebarOpen(false)} className="hover:bg-gray-800 p-1 rounded">
                            <X size={18} />
                        </button>
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

                                    <div className="flex gap-4 text-gray-500 border-t border-gray-100 pt-3">
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
                                        <button className="flex flex-col items-center gap-1 cursor-pointer hover:text-blue-600 group">
                                            <Table size={16} className="group-hover:scale-110 transition-transform" />
                                            <span className="text-[10px] font-medium">Tabel</span>
                                        </button>
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
                                <div key={idx} className="flex items-center gap-3">
                                    <div
                                        className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                                        style={{ backgroundColor: item.color }}
                                    />
                                    <span className="text-xs text-gray-700">{item.label}</span>
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
