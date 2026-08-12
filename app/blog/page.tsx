import Link from "next/link";
import Header from "../../src/components/sections/Header";
import Footer from "../../src/components/sections/Footer";
import Image from "next/image";
import "../pages-css/blog.css";
import "../globals.css";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Islamic Blog | AlMaghrib Academy",
  description:
    "Read educational articles about Quran, Tajweed, Salah, Islamic parenting, duas, and Islamic lifestyle.",
};

export const posts = [
  {
    title: "How to Improve Your Quran Recitation",
    slug: "improve-quran-recitation",
    category: "Quran",
    date: "July 2026",
    image: "blog6.png",
    fullDescription: "This comprehensive guide covers essential techniques and practices to improve your Quran recitation skills with proper Tajweed rules."
  },
  {
    title: "Benefits of Learning Tajweed",
    slug: "benefits-of-learning-tajweed",
    category: "Tajweed",
    date: "July 2026",
    image: "blog2.png",
    fullDescription: "Discover the numerous benefits of learning Tajweed and how it enhances your Quran recitation and understanding."
  },
  {
    title: "Daily Duas Every Muslim Should Know",
    slug: "daily-duas",
    category: "Islamic Life",
    date: "June 2026",
    image: "blog3.png",
    fullDescription: "Learn the essential daily duas that every Muslim should know and incorporate into their daily life."
  },
  {
    title: "Tips for Memorizing the Quran",
    slug: "memorizing-quran",
    category: "Hifz",
    date: "June 2026",
    image: "blog4.png",
    fullDescription: "Effective strategies and tips for memorizing the Quran with proper techniques and consistency."
  },
  {
    title: "The Importance of Salah in Daily Life",
    slug: "importance-of-salah",
    category: "Islamic Studies",
    date: "May 2026",
    image: "blog5.png",
    fullDescription: "Understanding the significance of Salah and how it transforms your daily life and spiritual connection."
  },
  {
    title: "How to Teach Islam to Children",
    slug: "teach-islam-to-children",
    category: "Kids",
    date: "May 2026",
    image: "blog1.png",
    fullDescription: "Practical methods and approaches for teaching Islamic values and teachings to children effectively."
  },
];

export default function BlogPage() {
  // Get featured post (first one)
  const featuredPost = posts[0];
  const remainingPosts = posts.slice(1);

  return (
    <>
      <Header />

      <main className="blog-page">
        {/* Hero */}
        <section className="blog-hero">
          <div className="blog-container">
            <h1 className="blog-hero-title">Islamic Blog & Resources</h1>
            <p className="blog-hero-text">
              Explore articles about Quran learning, Tajweed,
              Islamic Studies, Arabic language and spiritual growth.
            </p>
          </div>
        </section>

        {/* Featured Article */}
        <section className="featured-section">
          <div className="blog-container">
            <div className="featured-card">
              <div className="featured-image">
                <Image
                  src="/assets/images/blog-banner-2.png"
                  alt="AlMaghrib Academy"
                  width={700}
                  height={600}
                  priority
                />
              </div>
              <div className="featured-content">
                <span className="featured-badge">Featured Article</span>
                <h2>{featuredPost.title}</h2>
                <p>
                  {featuredPost.fullDescription || `Learn about ${featuredPost.title} with AlMaghrib Academy.`}
                </p>
                <Link href={`/blog/${featuredPost.slug}`} className="post-button">
                  Read More →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Blog Posts */}
        <section className="posts-section">
          <div className="blog-container">
            <h2 className="section-title">Latest Articles</h2>
            <div className="posts-grid">
              {remainingPosts.map((post) => (
                <div key={post.slug} className="post-card">
                  <div className="post-image">
                    <Image
                      src={`/assets/images/${post.image}`}
                      alt={post.title}
                      width={700}
                      height={600}
                    />
                  </div>
                  <div className="post-content">
                    <span className="post-category">{post.category}</span>
                    <h3 className="post-title">{post.title}</h3>
                    <p className="post-date">{post.date}</p>
                    <Link href={`/blog/${post.slug}`} className="post-button">
                      Read More →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}