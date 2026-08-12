  import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "../../../src/components/sections/Header";
import Footer from "../../../src/components/sections/Footer";
import { posts } from "../page";
import "../../pages-css/blog-details.css";
import "../../globals.css";

import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: BlogDetailPageProps): Promise<Metadata> {
  const { slug } = await params;

  const post = getPost(slug);

  if (!post) {
    return {
      title: "Blog Not Found | AlMaghrib Academy",
      description: "The requested blog article could not be found.",
    };
  }

  return {
    title: `${post.title} | AlMaghrib Academy`,
    description: post.fullDescription,

    openGraph: {
      title: `${post.title} | AlMaghrib Academy`,
      description: post.fullDescription,
      url: `https://AlMaghribacademy.co/blog/${post.slug}`,
      siteName: "AlMaghrib Academy",
      type: "article",
      images: [
        {
          url: `/assets/images/${post.image}`,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title: `${post.title} | AlMaghrib Academy`,
      description: post.fullDescription,
      images: [`/assets/images/${post.image}`],
    },
  };
}

// Generate static paths for all blog posts
export async function generateStaticParams() {
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

interface BlogDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Find post by slug
function getPost(slug: string) {
  return posts.find((post) => post.slug === slug);
}

// Get related posts (excluding current)
function getRelatedPosts(currentSlug: string, limit: number = 3) {
  return posts
    .filter((post) => post.slug !== currentSlug)
    .slice(0, limit);
}

export default async function BlogDetailsPage({ params }: BlogDetailPageProps) {
  const { slug } = await params;
  const post = getPost(slug);

  // If post not found, show 404
  if (!post) {
    notFound();
  }

  const relatedPosts = getRelatedPosts(slug);

  return (
    <>
      <Header />

      <main className="blog-details-page">
        {/* Hero Section */}
        <section className="blog-hero">
          <div className="blog-container">
            <span className="blog-category">{post.category}</span>
            <h1 className="blog-title">{post.title}</h1>
            <p className="blog-meta">
              By AlMaghrib Academy • {post.date} • 5 Min Read
            </p>
          </div>
        </section>

        {/* Featured Image */}
        <section className="featured-image-section">
          <div className="blog-container">
            <div className="featured-image">
              <Image
                src={`/assets/images/${post.image}`}
                alt={post.title}
                fill
                className="blog-image"
                priority
              />
            </div>
          </div>
        </section>

        {/* Blog Content */}
        <section className="blog-content-section">
          <div className="blog-content-container">
            <p>
              {post.fullDescription || `Learn about ${post.title} with AlMaghrib Academy. 
              This comprehensive guide covers everything you need to know about 
              ${post.title.toLowerCase()} and its importance in Islamic education.`}
            </p>

            <h2>Why This Matters</h2>
            <p>
              Understanding and implementing {post.title.toLowerCase()} is essential 
              for every Muslim seeking to strengthen their connection with Allah 
              and improve their Islamic knowledge.
            </p>

            <h2>Key Benefits</h2>
            <ul>
              <li>Flexible learning options with qualified teachers</li>
              <li>One-to-one personalized support</li>
              <li>Progress tracking and regular assessments</li>
              <li>Qualified instructors with years of experience</li>
              <li>Interactive and engaging learning environment</li>
            </ul>

            <blockquote>
              “The best among you are those who learn the Quran and teach it.”
            </blockquote>

            <h2>How AlMaghrib Academy Can Help</h2>
            <p>
              At AlMaghrib Academy, our experienced teachers guide students step by
              step through their learning journey. We offer personalized one-to-one
              classes, flexible schedules, and comprehensive support to help
              you achieve your goals.
            </p>
          </div>
        </section>

        {/* Author Section */}
        <section className="author-section">
          <div className="blog-container">
            <div className="author-card">
              <div className="author-avatar">ZA</div>
              <div>
                <h3>AlMaghrib Academy</h3>
                <p>
                  Dedicated to Quran Learning, Islamic Studies,
                  and Arabic Education worldwide.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Related Posts */}
        <section className="related-section">
          <div className="blog-container">
            <h2 className="section-title">Related Articles</h2>
            <div className="related-grid">
              {relatedPosts.map((relatedPost) => (
                <div key={relatedPost.slug} className="related-card">
                  <div className="related-image">
                    <Image
                      src={`/assets/images/${relatedPost.image}`}
                      alt={relatedPost.title}
                      width={400}
                      height={200}
                    />
                  </div>
                  <span className="related-category">{relatedPost.category}</span>
                  <h3>{relatedPost.title}</h3>
                  <Link href={`/blog/${relatedPost.slug}`} className="related-link">
                    Read More →
                  </Link>
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