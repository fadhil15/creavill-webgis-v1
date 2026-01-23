'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, User, ArrowLeft, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface BlogAttribute {
    title: string;
    slug: string;
    excerpt: string;
    category: string;
    author: string;
    eventDate: string;
    publishedAt: string;
    featuredImage?: {
        data?: {
            attributes: {
                url: string;
            };
        };
    };
}

interface BlogItem {
    id: number;
    attributes: BlogAttribute;
}

export default function BlogListPage() {
    const [blogs, setBlogs] = useState<BlogItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
                const res = await fetch(`${strapiUrl}/api/blogs?populate=*&sort[0]=createdAt:desc`);

                if (!res.ok) throw new Error('Failed to fetch blogs');

                const data = await res.json();
                setBlogs(data.data || []);
            } catch (err) {
                console.error('Error fetching blogs:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchBlogs();
    }, []);

    const getImageUrl = (blog: BlogItem) => {
        const imageData = blog.attributes.featuredImage?.data;
        if (!imageData) return null;
        const url = imageData.attributes.url;
        const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
        return url.startsWith('http') ? url : `${strapiUrl}${url}`;
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }).format(date);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            {/* Header */}
            <section className="pt-32 pb-16 bg-gradient-to-b from-creavill-navy to-gray-900 text-white">
                <div className="container mx-auto px-6 md:px-12">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors mb-8"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Kembali ke Beranda
                    </Link>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl font-bold mb-4"
                    >
                        Berita & Kegiatan <span className="text-creavill-cyan">Creavill Bandung</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-white/70 text-lg max-w-2xl"
                    >
                        Ikuti update terbaru dari kegiatan, program, dan pencapaian komunitas kami.
                    </motion.p>
                </div>
            </section>

            {/* Blog Grid */}
            <section className="py-16">
                <div className="container mx-auto px-6 md:px-12">
                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <div key={i} className="h-96 bg-gray-200 rounded-2xl animate-pulse"></div>
                            ))}
                        </div>
                    ) : blogs.length === 0 ? (
                        <div className="text-center py-16">
                            <p className="text-gray-500 text-lg">Belum ada artikel yang dipublikasikan.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {blogs.map((blog, index) => {
                                const imageUrl = getImageUrl(blog);
                                return (
                                    <motion.article
                                        key={blog.id}
                                        initial={{ opacity: 0, y: 30 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group border border-gray-100 flex flex-col"
                                    >
                                        {/* Image */}
                                        <div className="relative h-56 overflow-hidden bg-gray-100">
                                            <div className="absolute top-4 left-4 z-10">
                                                <span className="bg-white/90 backdrop-blur-sm text-creavill-navy px-3 py-1 rounded-full text-xs font-bold shadow-sm uppercase tracking-wide">
                                                    {blog.attributes.category}
                                                </span>
                                            </div>
                                            {imageUrl ? (
                                                <Image
                                                    src={imageUrl}
                                                    alt={blog.attributes.title}
                                                    fill
                                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-creavill-cyan/20 to-creavill-navy/20">
                                                    <span className="text-4xl">📰</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Content */}
                                        <div className="p-6 flex flex-col flex-grow">
                                            <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                                                <div className="flex items-center gap-1.5">
                                                    <Calendar className="w-3.5 h-3.5 text-creavill-cyan" />
                                                    <span>{formatDate(blog.attributes.eventDate || blog.attributes.publishedAt)}</span>
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <User className="w-3.5 h-3.5 text-creavill-cyan" />
                                                    <span>{blog.attributes.author || 'Admin'}</span>
                                                </div>
                                            </div>

                                            <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-creavill-cyan transition-colors">
                                                <Link href={`/blog/${blog.attributes.slug}`}>
                                                    {blog.attributes.title}
                                                </Link>
                                            </h2>

                                            <p className="text-gray-600 text-sm mb-6 line-clamp-3 flex-grow">
                                                {blog.attributes.excerpt}
                                            </p>

                                            <Link
                                                href={`/blog/${blog.attributes.slug}`}
                                                className="inline-flex items-center gap-2 text-sm font-semibold text-creavill-navy hover:text-creavill-cyan transition-colors"
                                            >
                                                Baca Selengkapnya
                                                <ArrowRight className="w-4 h-4" />
                                            </Link>
                                        </div>
                                    </motion.article>
                                );
                            })}
                        </div>
                    )}
                </div>
            </section>

            <Footer />
        </div>
    );
}
