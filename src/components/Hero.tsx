'use client';

import { motion } from 'framer-motion';
import Scene3D from './Scene3D';
import { ArrowRight, Heart } from 'lucide-react';

export default function Hero() {
    return (
        <section className="relative w-full min-h-screen bg-gradient-to-br from-creavill-navy to-[#0D1245] overflow-hidden flex items-center">

            {/* 3D Scene Background - Positioned on the right for desktop, full/behind for mobile */}
            <div className="absolute inset-0 md:left-1/3 z-0">
                <Scene3D />
            </div>

            {/* Content Container */}
            <div className="container mx-auto px-6 md:px-12 relative z-10 w-full h-full pointer-events-none">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center min-h-[calc(100vh-80px)]">

                    {/* Left Column: Text */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="text-white pointer-events-auto max-w-xl"
                    >
                        <div className="mb-6 inline-block px-4 py-1.5 rounded-full bg-creavill-cyan/20 border border-creavill-cyan/30 backdrop-blur-sm">
                            <span className="text-creavill-cyan text-sm font-semibold tracking-wide uppercase">Community & Impact</span>
                        </div>

                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
                            Mewujudkan <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-creavill-cyan to-teal-400">
                                Desa Kreatif & Mandiri
                            </span>
                        </h1>

                        <p className="text-lg md:text-xl text-gray-300 mb-8 leading-relaxed">
                            Komunitas relawan pemuda lintas disiplin yang bergerak memberdayakan masyarakat desa melalui literasi, ekonomi, dan seni.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <button className="group relative px-8 py-4 bg-creavill-cyan hover:bg-cyan-500 text-creavill-navy font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(29,184,198,0.3)] hover:shadow-[0_0_30px_rgba(29,184,198,0.5)] flex items-center justify-center gap-2">
                                Gabung Relawan
                                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                            </button>

                            <button className="px-8 py-4 bg-transparent border-2 border-white/20 hover:border-white/50 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 hover:bg-white/5">
                                <Heart className="w-5 h-5 text-pink-500" />
                                Dukung Donasi
                            </button>
                        </div>
                    </motion.div>

                    {/* Right Column: Spacer for 3D Scene */}
                    <div className="hidden md:block">
                        {/* The 3D scene occupies this space visually */}
                    </div>
                </div>
            </div>

        </section>
    );
}
