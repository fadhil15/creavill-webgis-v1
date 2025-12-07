'use client';

import { motion } from 'framer-motion';
import { ShoppingBag, HeartHandshake, ArrowRight, Package } from 'lucide-react';

export default function Support() {
    return (
        <section className="bg-white">
            <div className="flex flex-col lg:flex-row min-h-[500px]">

                {/* Left Column: Donation */}
                <div className="flex-1 bg-gray-50 flex items-center justify-center p-12 md:p-24 relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-64 h-64 bg-creavill-cyan/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 transition-all duration-700 group-hover:scale-150" />

                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="max-w-md relative z-10"
                    >
                        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg mb-8 text-creavill-navy">
                            <ShoppingBag className="w-8 h-8" />
                        </div>

                        <h3 className="text-3xl font-bold text-gray-900 mb-6">Garage Sale Donation</h3>
                        <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                            Punya baju, tas, atau buku layak pakai yang menumpuk? <br />
                            Donasikan ke Creavill! Kami akan menjualnya kembali di event Gasibu (Garage Sale Amal) untuk mendanai program literasi desa.
                        </p>

                        <button className="px-8 py-4 border-2 border-creavill-navy text-creavill-navy font-bold rounded-xl hover:bg-creavill-navy hover:text-white transition-all flex items-center gap-2">
                            Donasi Barang <Package className="w-5 h-5" />
                        </button>
                    </motion.div>
                </div>

                {/* Right Column: Volunteer */}
                <div className="flex-1 bg-creavill-navy flex items-center justify-center p-12 md:p-24 relative overflow-hidden group">
                    {/* Abstract pattern */}
                    <div className="absolute inset-0 opacity-10">
                        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                            <path d="M0 100 L100 0 L100 100 Z" fill="white" />
                        </svg>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="max-w-md relative z-10 text-white"
                    >
                        <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-inner border border-white/20 mb-8 text-creavill-cyan">
                            <HeartHandshake className="w-8 h-8" />
                        </div>

                        <h3 className="text-3xl font-bold mb-6">Gabung Relawan</h3>
                        <p className="text-blue-100 text-lg mb-8 leading-relaxed">
                            Kami mencari pemuda lintas disiplin dengan semangat berbagi.
                            Jadilah bagian dari keluarga besar Creavill dan rasakan pengalaman langsung memberdayakan masyarakat desa.
                        </p>

                        <button className="px-8 py-4 bg-creavill-cyan text-creavill-navy font-bold rounded-xl hover:bg-cyan-400 transition-all flex items-center gap-2 shadow-lg hover:shadow-cyan-500/30 hover:-translate-y-1">
                            Daftar Waiting List <ArrowRight className="w-5 h-5" />
                        </button>
                    </motion.div>
                </div>

            </div>
        </section>
    );
}
