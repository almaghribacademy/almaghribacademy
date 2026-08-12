import "../sections-css/Blog.css";
import Link from "next/link";
import Image from "next/image";
const posts = [
  {
    title: "Benefits of Learning Quran Online With Expert Teachers",
    description:
      "Discover how online Quran classes help children and adults learn Quran with Tajweed, flexible schedules, and qualified Quran teachers from anywhere in the world.",
    image:"artical-1.png",
  },
  {
    title: "Islamic Parenting Guide: Raising Children With Quranic Values",
    description:
      "Learn practical Islamic parenting tips to help children develop strong faith, good character, and a deeper connection with Quran and Islamic teachings.",
    image:"artical-2.png",
  },
  {
    title: "Tajweed Essentials: Learn Quran Recitation Correctly",
    description:
      "Understand the basic rules of Tajweed and improve your Quran recitation with proper pronunciation, fluency, and guidance from experienced instructors.",
    image:"artical-3.png",
  },
];

export default function Blog() {
  return (
    <section className="articles-section">

      <div className="articles-container">

        <h2 className="articles-title">
          Latest Quran & Islamic Education Articles
        </h2>


        <p className="articles-description">
          Explore helpful articles about Quran learning, Tajweed, Islamic
          studies, parenting, and spiritual growth. Our resources help students
          and families improve their Quran knowledge and Islamic understanding.
        </p>


        <div className="articles-grid">

          {posts.map((post) => (

            <div
              key={post.title}
              className="article-card"
            >

              <div className="article-image">
                <Image
                  src={`/assets/images/${post.image}`}
                  alt="AlMaghrib Academy"
                  width={500}
                  height={250}
                  priority
                />
              </div>


              <div className="article-content">


                <h3 className="article-heading">
                  {post.title}
                </h3>


                <p className="article-description">
                  {post.description}
                </p>


                {/*<button className="article-button">
                  Read More →
                </button>*/}

                <Link
              href="/blog"
              className={`article-button`}
            >
              Read More →
            </Link>

              </div>

            </div>

          ))}


        </div>


      </div>

    </section>
  );
}