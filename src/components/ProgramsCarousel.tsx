'use client';

import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Palette, TrendingUp, Users, Lightbulb, ArrowRight, ChevronRight, ChevronLeft } from 'lucide-react';

const programs = [
    {
        title: "Rumah Baca Kreatif (Rumba)",
        description: "Program literasi dan kelas mengajar rutin untuk meningkatkan minat baca anak-anak desa melalui metode yang menyenangkan.",
        icon: BookOpen,
        color: "bg-blue-100 text-blue-600"
    },
    {
        title: "VIRAL (Voli & Mural)",
        description: "Penggabungan seni mural dan olahraga voli untuk memotivasi pemuda, memperindah desa, dan membangun kerjasama.",
        icon: Palette,
        color: "bg-pink-100 text-pink-500"
    },
    {
        title: "UMKM Scale Up!",
        description: "Pendampingan digitalisasi, manajemen keuangan sederhana, dan fotografi produk untuk meningkatkan daya saing usaha lokal.",
        icon: TrendingUp,
        color: "bg-green-100 text-green-600"
    },
    {
        title: "Participatory Rural Appraisal",
        description: "Riset partisipatif untuk menggali potensi, aset, dan permasalahan desa secara langsung bersama warga setempat.",
        icon: Users,
        color: "bg-orange-100 text-orange-600"
    },
    {
        title: "Creavitation",
        description: "Workshop kreatif seperti sushi class atau crafting sebagai ajang fundraising mandiri dan branding organisasi.",
        icon: Lightbulb,
        color: "bg-purple-100 text-purple-600"
    }
];

export default function ProgramsCarousel() {
    const carouselRef = useRef<HTMLDivElement>(null);
    const [width, setWidth] = useState(0);

    useEffect(() => {
        if (carouselRef.current) {
            // Calculate scrollable width: total scroll width - visible width
            setWidth(carouselRef.current.scrollWidth - carouselRef.current.offsetWidth);
        }
    }, []);

    return (
        <section className="py-24 bg-creavill-navy relative overflow-hidden scroll-mt-26" id="program">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10 pointer-events-none">
                <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-creavill-cyan blur-3xl opacity-30" />
                <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-blue-500 blur-3xl opacity-20" />
            </div>

            <div className="container mx-auto px-6 md:px-12 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="flex items-center gap-2 mb-4">
                            <span className="w-8 h-1 bg-creavill-cyan rounded-full" />
                            <span className="text-creavill-cyan font-bold tracking-wider uppercase text-sm">Program Unggulan</span>
                        </div>
                        <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight">
                            Inisiatif Nyata <br />
                            <span className="text-gray-400">Untuk Perubahan.</span>
                        </h2>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="hidden md:flex gap-2 text-white/50 text-sm items-center"
                    >
                        <ChevronLeft className="w-5 h-5" />
                        <span>Geser untuk melihat</span>
                        <ChevronRight className="w-5 h-5" />
                    </motion.div>
                </div>

                {/* Carousel Container */}
                <motion.div
                    ref={carouselRef}
                    className="cursor-grab active:cursor-grabbing overflow-hidden rounded-2xl"
                    whileTap={{ cursor: "grabbing" }}
                >
                    <motion.div
                        className="flex gap-6 md:gap-8"
                        drag="x"
                        dragConstraints={{ right: 0, left: -width }}
                        whileTap={{ cursor: "grabbing" }}
                    >
                        {programs.map((program, index) => {
                            const Icon = program.icon;
                            return (
                                <motion.div
                                    key={index}
                                    className="min-w-[300px] md:min-w-[380px] bg-white rounded-2xl p-8 flex flex-col justify-between shadow-xl relative group overflow-hidden border border-white/10"
                                    whileHover={{
                                        scale: 1.02,
                                        y: -5,
                                        transition: { duration: 0.2 }
                                    }}
                                >
                                    {/* Hover Gradient Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                                    <div className="relative z-10">
                                        <div className={`w-14 h-14 rounded-2xl ${program.color} flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                                            <Icon className="w-7 h-7" />
                                        </div>

                                        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-creavill-navy transition-colors">
                                            {program.title}
                                        </h3>

                                        <p className="text-gray-600 leading-relaxed mb-6 text-sm md:text-base">
                                            {program.description}
                                        </p>
                                    </div>

                                    <div className="relative z-10 pt-4 border-t border-gray-100 mt-auto">
                                        <span className="flex items-center gap-2 text-sm font-semibold text-gray-400 group-hover:text-creavill-cyan transition-colors">
                                            Pelajari lebih lanjut <ArrowRight className="w-4 h-4" />
                                        </span>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                </motion.div>

            </div>
        </section>
    );
}
