'use client';

import { useRef, useEffect } from 'react';
import { motion, useInView, useSpring, useMotionValue } from 'framer-motion';
import { Network, Users, GraduationCap, Baby } from 'lucide-react';

const stats = [
    { label: 'Desa Binaan', value: 3, icon: Network, suffix: '' },
    { label: 'Relawan Aktif', value: 39, icon: Users, suffix: '+' },
    { label: 'Angkatan Relawan', value: 8, icon: GraduationCap, suffix: '' },
    { label: 'Anak Terdampak', value: 150, icon: Baby, suffix: '+' },
];

const mediaPartners = [
    'CNN Indonesia', 'TRANS7', 'Ardan Radio', 'Republika'
];

function Counter({ value, suffix }: { value: number; suffix: string }) {
    const ref = useRef<HTMLSpanElement>(null);
    const motionValue = useMotionValue(0);
    const springValue = useSpring(motionValue, { stiffness: 50, damping: 20 });
    const isInView = useInView(ref, { once: true, margin: "-50px" });

    useEffect(() => {
        if (isInView) {
            motionValue.set(value);
        }
    }, [isInView, value, motionValue]);

    useEffect(() => {
        return springValue.on("change", (latest) => {
            if (ref.current) {
                ref.current.textContent = Math.round(latest).toString() + suffix;
            }
        });
    }, [springValue, suffix]);

    return <span ref={ref} className="text-4xl md:text-5xl font-bold text-creavill-cyan" />;
}

export default function AboutImpact() {
    return (
        <section id="tentang" className="relative py-20 bg-gray-50 overflow-hidden scroll-mt-20">

            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-creavill-cyan/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-creavill-navy/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

            <div className="container mx-auto px-6 md:px-12 relative z-10">

                {/* About Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24 items-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="text-4xl font-bold text-gray-900 mb-6">
                            Siapa <span className="text-creavill-cyan">Creavill Bandung?</span>
                        </h2>
                        <div className="text-lg text-gray-600 space-y-4 leading-relaxed">
                            <p>
                                Creavill Bandung adalah komunitas relawan pemuda yang telah bergerak sejak 2017.
                                Kami percaya bahwa perubahan besar dimulai dari langkah kecil yang konsisten.
                            </p>
                            <p>
                                Fokus utama kami adalah memberdayakan <strong>3 desa binaan</strong> melalui pendekatan
                                partisipatif (Participatory Rural Appraisal - PRA). Kami hadir bukan sebagai pahlawan,
                                tetapi sebagai fasilitator untuk menciptakan kemandirian ekonomi dan literasi bersama masyarakat.
                            </p>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="relative"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-creavill-cyan to-creavill-navy rounded-2xl transform rotate-3 opacity-20 blur-sm" />
                        <div className="relative bg-white p-8 md:p-10 rounded-2xl shadow-xl border-l-8 border-creavill-navy overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-creavill-cyan/10 rounded-bl-full -mr-8 -mt-8" />

                            <h3 className="text-xl font-bold text-gray-400 uppercase tracking-widest mb-4">Visi Kami</h3>
                            <p className="text-2xl md:text-3xl font-bold text-gray-800 italic leading-snug">
                                &quot;Mewujudkan desa kreatif dan mandiri dengan semangat kewirausahaan.&quot;
                            </p>
                        </div>
                    </motion.div>
                </div>

                <div id="dampak" className="mb-24 scroll-mt-44">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-3xl font-bold text-gray-900">Jejak Dampak Kami</h2>
                        <p className="text-gray-500 mt-2">Perjalanan panjang memberdayakan sesama</p>
                    </motion.div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                        {stats.map((stat, index) => {
                            const Icon = stat.icon;
                            return (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className="bg-white/40 backdrop-blur-md border border-white/50 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow text-center group"
                                >
                                    <div className="inline-flex p-3 rounded-full bg-cyan-100 text-creavill-cyan mb-4 group-hover:scale-110 transition-transform">
                                        <Icon className="w-6 h-6" />
                                    </div>
                                    <div className="mb-2">
                                        <Counter value={stat.value} suffix={stat.suffix} />
                                    </div>
                                    <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">{stat.label}</p>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>

                {/* Media Coverage */}
                <div className="text-center">
                    <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-8">Diliput Oleh</p>
                    <div className="flex flex-wrap justify-center gap-8 md:gap-16 items-center opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
                        {mediaPartners.map((media, idx) => (
                            <motion.span
                                key={idx}
                                whileHover={{ scale: 1.1 }}
                                className="text-xl md:text-2xl font-bold text-gray-400 hover:text-creavill-navy transition-colors cursor-default"
                            >
                                {media}
                            </motion.span>
                        ))}
                    </div>
                </div>

            </div>
        </section>
    );
}