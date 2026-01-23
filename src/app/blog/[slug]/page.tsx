'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Calendar, User, ArrowLeft, MapPin, Tag } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface BlogAttribute {
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    category: string;
    author: string;
    eventDate: string;
    location: string;
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

export default function BlogDetailPage() {
    const params = useParams();
    const slug = params?.slug as string;

    const [blog, setBlog] = useState<BlogItem | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!slug) return;

        const fetchBlog = async () => {
            try {
                const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
                const res = await fetch(`${strapiUrl}/api/blogs?filters[slug][$eq]=${slug}&populate=*`);

                if (!res.ok) {
                    throw new Error('Failed to fetch blog');
                }

                const data = await res.json();
                if (data.data && data.data.length > 0) {
                    setBlog(data.data[0]);
                } else {
                    setError('Article not found');
                }
            } catch (err) {
                console.error('Error fetching blog:', err);
                setError('Failed to load article.');
            } finally {
                setLoading(false);
            }
        };

        fetchBlog();
    }, [slug]);

    const getImageUrl = (blogItem: BlogItem) => {
        const imageData = blogItem.attributes.featuredImage?.data;
        if (!imageData) return null;
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
            <div className="min-h-screen bg-white">
                <Navbar />
                <div className="container mx-auto px-6 md:px-12 py-32">
                    <div className="animate-pulse space-y-8 max-w-3xl mx-auto">
                        <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                        <div className="h-12 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-64 bg-gray-200 rounded-2xl"></div>
                        <div className="space-y-4">
                            <div className="h-4 bg-gray-200 rounded w-full"></div>
                            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    if (error || !blog) {
        return (
            <div className="min-h-screen bg-white">
                <Navbar />
                <div className="container mx-auto px-6 md:px-12 py-32 text-center">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Artikel Tidak Ditemukan</h1>
                    <p className="text-gray-600 mb-8">Maaf, artikel yang Anda cari tidak tersedia.</p>
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-creavill-cyan text-white rounded-full font-semibold hover:bg-creavill-navy transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Kembali ke Beranda
                    </Link>
                </div>
                <Footer />
            </div>
        );
    }

    const imageUrl = getImageUrl(blog);

    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            {/* Hero Section */}
            <section className="pt-24 pb-12 bg-gradient-to-b from-gray-50 to-white">
                <div className="container mx-auto px-6 md:px-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-4xl mx-auto"
                    >
                        {/* Back Button */}
                        <Link
                            href="/#blog"
                            className="inline-flex items-center gap-2 text-gray-600 hover:text-creavill-cyan transition-colors mb-8"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Kembali ke Beranda
                        </Link>

                        {/* Category */}
                        <span className="inline-block bg-creavill-cyan/10 text-creavill-cyan px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wide mb-6">
                            {blog.attributes.category}
                        </span>

                        {/* Title */}
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                            {blog.attributes.title}
                        </h1>

                        {/* Meta Info */}
                        <div className="flex flex-wrap items-center gap-6 text-gray-500 text-sm mb-8">
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-creavill-cyan" />
                                <span>{formatDate(blog.attributes.eventDate || blog.attributes.publishedAt)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <User className="w-4 h-4 text-creavill-cyan" />
                                <span>{blog.attributes.author || 'Admin'}</span>
                            </div>
                            {blog.attributes.location && (
                                <div className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-creavill-cyan" />
                                    <span>{blog.attributes.location}</span>
                                </div>
                            )}
                        </div>

                        {/* Excerpt */}
                        <p className="text-xl text-gray-600 leading-relaxed border-l-4 border-creavill-cyan pl-6">
                            {blog.attributes.excerpt}
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Featured Image */}
            {imageUrl && (
                <section className="pb-12">
                    <div className="container mx-auto px-6 md:px-12">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 }}
                            className="max-w-4xl mx-auto"
                        >
                            <div className="relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden shadow-xl">
                                <Image
                                    src={imageUrl}
                                    alt={blog.attributes.title}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        </motion.div>
                    </div>
                </section>
            )}

            {/* Content */}
            <section className="pb-24">
                <div className="container mx-auto px-6 md:px-12">
                    <motion.article
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="max-w-3xl mx-auto prose prose-lg prose-gray"
                    >
                        <div
                            className="text-gray-700 leading-relaxed space-y-6"
                            dangerouslySetInnerHTML={{ __html: blog.attributes.content.replace(/\n/g, '<br/>') }}
                        />
                    </motion.article>
                </div>
            </section>

            {/* Back to Home CTA */}
            <section className="pb-24">
                <div className="container mx-auto px-6 md:px-12">
                    <div className="max-w-3xl mx-auto text-center">
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-creavill-navy text-white rounded-full font-semibold hover:bg-creavill-cyan transition-colors shadow-lg"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            Kembali ke Beranda
                        </Link>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
