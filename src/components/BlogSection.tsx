'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, User, ArrowRight, Tag } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface BlogAttribute {
    title: string;
    slug: string;
    excerpt: string;
    content: string;
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

export default function BlogSection() {
    const [blogs, setBlogs] = useState<BlogItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
                const res = await fetch(`${strapiUrl}/api/blogs?populate=*&sort[0]=createdAt:desc&pagination[limit]=3`);

                if (!res.ok) {
                    throw new Error('Failed to fetch blogs');
                }

                const data = await res.json();
                setBlogs(data.data);
            } catch (err) {
                console.error('Error fetching blogs:', err);
                setError('Failed to load updates.');
            } finally {
                setLoading(false);
            }
        };

        fetchBlogs();
    }, []);

    // Helper to get image URL
    const getImageUrl = (blog: BlogItem) => {
        const imageData = blog.attributes.featuredImage?.data;
        if (!imageData) return null; // Return null if no image
        const url = imageData.attributes.url;
        const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
        return url.startsWith('http') ? url : `${strapiUrl}${url}`;
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }).format(date);
    };

    if (loading) {
        return (
            <section className="py-24 bg-gray-50">
                <div className="container mx-auto px-6 md:px-12">
                    <div className="animate-pulse space-y-8">
                        <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="h-96 bg-gray-200 rounded-2xl"></div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    // Don't render section if no blogs and not loading (optional, but better to show empty state or nothing)
    if (!loading && blogs.length === 0) return null;

    return (
        <section className="py-24 bg-gray-50 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-creavill-cyan/5 rounded-full blur-3xl" />
                <div className="absolute bottom-20 left-0 w-[300px] h-[300px] bg-creavill-navy/5 rounded-full blur-3xl" />
            </div>

            <div className="container mx-auto px-6 md:px-12 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                    <div>
                        <motion.span
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-creavill-cyan font-bold tracking-wider text-sm uppercase mb-2 block"
                        >
                            Insight & Berita
                        </motion.span>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-4xl md:text-5xl font-bold text-gray-900"
                        >
                            Update Terkini <span className="text-creavill-cyan">Creavill Bandung.</span>
                        </motion.h2>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <Link
                            href="/blog"
                            className="group flex items-center gap-2 text-creavill-navy font-semibold hover:text-creavill-cyan transition-colors"
                        >
                            Lihat Semua Artikel
                            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                        </Link>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {blogs.map((blog, index) => (
                        <motion.article
                            key={blog.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.15 }}
                            className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group border border-gray-100 flex flex-col h-full"
                        >
                            {/* Image Container */}
                            <div className="relative h-56 overflow-hidden bg-gradient-to-br from-creavill-cyan/20 to-creavill-navy/20">
                                <div className="absolute top-4 left-4 z-10">
                                    <span className="bg-white/90 backdrop-blur-sm text-creavill-navy px-3 py-1 rounded-full text-xs font-bold shadow-sm uppercase tracking-wide border border-gray-100/50">
                                        {blog.attributes.category}
                                    </span>
                                </div>

                                {getImageUrl(blog) ? (
                                    <Image
                                        src={getImageUrl(blog)!}
                                        alt={blog.attributes.title}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <span className="text-5xl">📰</span>
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
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

                                <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-creavill-cyan transition-colors">
                                    <Link href={`/blog/${blog.attributes.slug}`}>
                                        {blog.attributes.title}
                                    </Link>
                                </h3>

                                <p className="text-gray-600 text-sm mb-6 line-clamp-3">
                                    {blog.attributes.excerpt}
                                </p>

                                <div className="mt-auto pt-6 border-t border-gray-100 flex justify-between items-center">
                                    <Link
                                        href={`/blog/${blog.attributes.slug}`}
                                        className="text-sm font-semibold text-creavill-navy group-hover:text-creavill-cyan transition-colors flex items-center gap-1"
                                    >
                                        Baca Selengkapnya
                                    </Link>
                                </div>
                            </div>
                        </motion.article>
                    ))}
                </div>
            </div>
        </section>
    );
}
