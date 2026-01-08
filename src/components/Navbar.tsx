'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

const navLinks = [
    { name: 'Beranda', href: '/' }, 
    { name: 'Tentang', href: '#tentang' },
    { name: 'Program', href: '#program' },
    { name: 'Dampak', href: '#dampak' },
    { name: 'Desa Binaan', href: '#desa-binaan' },
    { name: 'Kontak', href: '#kontak' },
];

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const pathname = usePathname();

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 20) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    if (pathname === '/webgis') return null;

    return (
        <>
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5 }}
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
                    ? 'bg-white/80 backdrop-blur-md shadow-md py-4'
                    : 'bg-transparent py-6'
                    }`}
            >
                <div className="container mx-auto px-6 md:px-12 flex items-center justify-between">

                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3">
                        <Image
                            src="/images/logo-creavillbdg-fix.png"
                            alt="Creavill Bandung"
                            width={180}
                            height={60}
                            className="object-contain h-12 w-auto"
                            priority
                        />
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden lg:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={`text-sm font-medium transition-colors hover:text-creavill-cyan ${isScrolled ? 'text-gray-600' : 'text-white/90'
                                    }`}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    {/* Desktop CTA */}
                    <div className="hidden lg:block">
                        <button className="px-6 py-2.5 bg-creavill-green text-white font-semibold rounded-full hover:bg-green-600 transition-colors shadow-lg hover:shadow-green-500/30">
                            Gabung Relawan
                        </button>
                    </div>

                    {/* Mobile Toggle */}
                    <button
                        className="lg:hidden p-2"
                        onClick={() => setIsMobileMenuOpen(true)}
                    >
                        <Menu className={`w-8 h-8 ${isScrolled ? 'text-creavill-navy' : 'text-white'}`} />
                    </button>
                </div>
            </motion.nav>

            {/* Mobile Menu Drawer */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: '100%' }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: '100%' }}
                        transition={{ type: 'tween', duration: 0.3 }}
                        className="fixed inset-0 z-[60] bg-white flex flex-col p-6"
                    >
                        <div className="flex justify-between items-center mb-8">
                            <span className="font-bold text-2xl text-creavill-navy">Menu</span>
                            <button
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="p-2 bg-gray-100 rounded-full hover:bg-gray-200"
                            >
                                <X className="w-6 h-6 text-gray-700" />
                            </button>
                        </div>

                        <div className="flex flex-col gap-6 flex-1">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className="text-2xl font-bold text-gray-800 hover:text-creavill-cyan"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </div>

                        <div className="mt-8">
                            <button className="w-full py-4 bg-creavill-green text-white font-bold text-lg rounded-xl shadow-lg">
                                Gabung Relawan
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}