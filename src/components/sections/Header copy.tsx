"use client";
import "../sections-css/Header.css";
import Link from "next/link";
import Image from "next/image";

import { useEffect, useState } from "react";

export default function Header() {

  const [scrolled, setScrolled] = useState(false);


  useEffect(() => {

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };

  }, []);


  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Courses", href: "/courses" },
    { name: "Teachers", href: "/teachers" },
    { name: "About", href: "/about" },
    { name: "Pricing", href: "/pricing" },
    { name: "Blog", href: "/blog" },
    { name: "Contact", href: "/contact" },
    { name: "Careers", href: "/careers" },
    
  ];


  return (

    <header className={`header ${scrolled ? "header-scrolled" : ""}`}>

      <div className="header-container">

        <div className="header-inner">


          {/* Logo */}
          <Link href="/" className="header-logo">
            <Image
              src={
                scrolled
                  ? "/assets/images/AlMaghrib-white-logo-1.png"
                  : "/assets/images/AlMaghrib-blue-logo-1.png"
              }
              alt="AlMaghrib Academy"
              width={300}
              height={250}
              priority
            />
          </Link>



          {/* Navigation */}
          <nav className="header-nav">

            {navLinks.map((link)=>(

              <Link
                key={link.name}
                href={link.href}
                className={`nav-link ${
                  scrolled ? "nav-white" : "nav-blue"
                }`}
              >
                {link.name}
              </Link>

            ))}

          </nav>




          {/* Button */}
          <Link
              href="/trial-form"
              className={`header-button ${
                scrolled
                  ? "button-scrolled"
                  : "button-default"
              }`}
            >
              Book Free Trial
            </Link>


        </div>

      </div>

    </header>

  );
}