'use client';

import { motion } from 'framer-motion';
import { Building2, Sprout, Mountain, MapPin, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const villages = [
    {
        id: 'braga',
        name: "Kelurahan Braga",
        location: "Kota Bandung",
        tag: "#UrbanVillage",
        focus: "Wisata Heritage & Literasi",
        highlight: "Lokasi bersejarah di tengah kota, namun warga perlu pemberdayaan pendidikan.",
        icon: Building2,
        image: "/images/braga.png",
        color: "from-blue-600/80 to-blue-900/90"
    },
    {
        id: 'pasirlangu',
        name: "Desa Pasirlangu",
        location: "Kab. Bandung Barat",
        tag: "#Agriculture",
        focus: "Pertanian & Ekonomi",
        highlight: "Penghasil komoditas Paprika dan Labu Siam. Fokus pada pengembangan UMKM tani.",
        icon: Sprout,
        image: "/images/pasirlangu.png",
        color: "from-green-600/80 to-green-900/90"
    },
    {
        id: 'cimenyan',
        name: "Desa Cimenyan",
        location: "Kab. Bandung",
        tag: "#Tourism",
        focus: "Pariwisata & Hortikultura",
        highlight: "Dataran tinggi dengan view kota Bandung, potensi wisata outdoor dan kafe.",
        icon: Mountain,
        image: "/images/cimenyan.png",
        color: "from-orange-600/80 to-orange-900/90"
    }
];

export default function Villages() {
    return (
                <section className="py-24 bg-white overflow-hidden scroll-mt-12" id="desa-binaan"> 
        <div className="container mx-auto px-6 md:px-12">

                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                    <div>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
                        >
                            Desa Binaan <span className="text-creavill-cyan">Kita.</span>
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="text-gray-500 max-w-lg text-lg"
                        >
                            Menyebar dampak melalui kolaborasi langsung dengan warga lokal di berbagai bentang alam.
                        </motion.p>
                    </div>

                    <Link
                        href="/webgis"
                        className="px-6 py-3 border border-gray-200 rounded-full hover:bg-gray-50 transition-colors text-gray-600 font-medium hidden md:block"
                    >
                        Lihat Peta Sebaran
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {villages.map((village, index) => {
                        const Icon = village.icon;
                        return (
                            <motion.div
                                key={village.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.2 }}
                                className="group relative h-[500px] rounded-3xl overflow-hidden cursor-pointer"
                            >
                                {/* Background Image */}
                                <div
                                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                                    style={{ backgroundImage: `url(${village.image})` }}
                                />

                                {/* Gradient Overlay */}
                                <div className={`absolute inset-0 bg-gradient-to-t ${village.color} opacity-60 group-hover:opacity-80 transition-opacity duration-300`} />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                                {/* Content */}
                                <div className="absolute inset-0 p-8 flex flex-col justify-end text-white relative z-10">

                                    <motion.div
                                        className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300"
                                    >
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase mb-2 inline-block border border-white/30">
                                                {village.tag}
                                            </div>
                                            <Icon className="w-6 h-6 text-white/80" />
                                        </div>

                                        <h3 className="text-3xl font-bold mb-1">{village.name}</h3>
                                        <p className="text-white/70 flex items-center gap-2 text-sm mb-6">
                                            <MapPin className="w-3 h-3" /> {village.location}
                                        </p>

                                        <div className="space-y-4 max-h-0 opacity-0 group-hover:max-h-40 group-hover:opacity-100 transition-all duration-500 overflow-hidden">
                                            <div>
                                                <p className="text-xs text-white/60 uppercase font-semibold">Fokus</p>
                                                <p className="font-medium">{village.focus}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-white/60 uppercase font-semibold">Highlight</p>
                                                <p className="text-sm text-white/80 leading-snug">
                                                    {village.highlight}
                                                </p>
                                            </div>

                                            <button className="flex items-center gap-2 text-sm font-bold text-creavill-cyan hover:text-white transition-colors pt-2">
                                                Lihat Profil Desa <ArrowRight className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </motion.div>

                                </div>
                            </motion.div>
                        );
                    })}
                </div>

            </div>
        </section>
    );
}
