import { Instagram, MapPin } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-[#0D1245] border-t border-white/5 pt-16 pb-8">
            <div className="container mx-auto px-6 md:px-12">
                <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-16">

                    {/* Brand */}
                    <div className="max-w-sm">
                        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                            <span className="w-8 h-8 bg-creavill-cyan rounded-lg" />
                            Creavill Bandung
                        </h2>
                        <p className="text-gray-400 leading-relaxed mb-6">
                            Komunitas relawan pemuda yang bergerak memberdayakan masyarakat desa melalui literasi, ekonomi, dan seni sejak 2017.
                        </p>
                        <div className="flex items-center gap-3 text-gray-400 text-sm">
                            <MapPin className="w-4 h-4 text-creavill-cyan" />
                            <span>Bandung, Jawa Barat, Indonesia</span>
                        </div>
                    </div>

                    {/* Links */}
                    <div className="flex flex-col sm:flex-row gap-16">
                        <div>
                            <h4 className="text-white font-bold mb-6">Program</h4>
                            <ul className="space-y-4 text-gray-400 text-sm">
                                <li className="hover:text-creavill-cyan cursor-pointer transition-colors">Rumah Baca (Rumba)</li>
                                <li className="hover:text-creavill-cyan cursor-pointer transition-colors">VIRAL (Voli Mural)</li>
                                <li className="hover:text-creavill-cyan cursor-pointer transition-colors">UMKM Scale Up</li>
                                <li className="hover:text-creavill-cyan cursor-pointer transition-colors">Creavitation</li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-white font-bold mb-6">Ikuti Kami</h4>
                            <div className="flex gap-4">
                                <a href="https://instagram.com/creavill.bdg" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-creavill-cyan hover:text-creavill-navy transition-all">
                                    <Instagram className="w-5 h-5" />
                                </a>
                                {/* Placeholder for TikTok since Lucide might not have it or standard usage varies */}
                                <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-creavill-cyan hover:text-creavill-navy transition-all font-bold text-xs">
                                    TT
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
                    <p>&copy; 2024 Creavill Bandung. All rights reserved.</p>
                    <div className="flex gap-6">
                        <span className="hover:text-white cursor-pointer transition-colors">Privacy Policy</span>
                        <span className="hover:text-white cursor-pointer transition-colors">Terms of Service</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
