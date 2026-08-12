"use client";
import "../sections-css/Header.css";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [isDiscoverOpen, setIsDiscoverOpen] = useState(false);
  const dropdownRef = useRef<HTMLLIElement>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDiscoverOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Close dropdown on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsDiscoverOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  const toggleDiscover = () => {
    setIsDiscoverOpen(!isDiscoverOpen);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    // Close dropdown when closing mobile menu
    if (isMobileMenuOpen) {
      setIsDiscoverOpen(false);
    }
  };

  const discoverLinks = [
    { name: "About", href: "/about" },
    { name: "Teachers", href: "/teachers" },
    { name: "Testimonials", href: "/testimonials" },
    { name: "FAQ", href: "/faqs" },
    { name: "Blog", href: "/blog" },
    { name: "Careers", href: "/careers" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <header className={`header-wrapper-outer ${scrolled ? "header-scrolled" : ""}`}>
      <div className="header-pill-container">
        {/* Logo */}
        <Link href="/" className="header-logo-link">
          <Image
            src="/assets/images/AlMaghrib-blue-logo-1.png"
            alt="AlMaghrib Academy"
            width={230}
            height={150}
            priority
          />
        </Link>

        {/* Navigation Menu */}
        <nav className={`header-nav-menu ${isMobileMenuOpen ? "mobile-open" : ""}`}>
          {/* Home link - Only visible on mobile */}
          <li className="mobile-home-link">
            <Link 
              href="/" 
              className="header-nav-link"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
          </li>

          <li className="mobile-divider">
            <span className="header-item-divider"></span>
          </li>

          <li>
            <Link 
              href="/courses" 
              className="header-nav-link"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Courses
            </Link>
          </li>

          <li>
            <span className="header-item-divider"></span>
          </li>

          <li>
            <Link 
              href="/pricing" 
              className="header-nav-link"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Pricing
            </Link>
          </li>

          <li>
            <span className="header-item-divider"></span>
          </li>

          <li className="nav-dropdown" ref={dropdownRef}>
            <button
              type="button"
              className={`nav-dropdown-trigger ${isDiscoverOpen ? "open" : ""}`}
              onClick={toggleDiscover}
              aria-expanded={isDiscoverOpen}
              aria-haspopup="true"
            >
              Discover
              <svg
                className={`caret ${isDiscoverOpen ? "open" : ""}`}
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>

            {/* Dropdown Menu */}
            <div className={`nav-dropdown-menu ${isDiscoverOpen ? "open" : ""}`}>
              {discoverLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => {
                    setIsDiscoverOpen(false);
                    setIsMobileMenuOpen(false);
                  }}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </li>
        </nav>

        {/* Header Actions */}
        <div className="header-actions">
          {/* Phone Pill */}
          <a href="tel:+447700181874" className="header-phone-pill">
            <span className="header-phone-icon-badge">
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13 1 .37 1.98.72 2.91a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.93.35 1.9.59 2.91.72A2 2 0 0 1 22 16.92z"></path>
              </svg>
            </span>
            +44 7700 181874
          </a>

          {/* Book Free Trial Button */}
          <Link 
            href="/trial-form" 
            className="header-cta-pill"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Book a Free Trial
          </Link>

          {/* Mobile Toggle */}
          <button
            className={`mobile-toggle ${isMobileMenuOpen ? "active" : ""}`}
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
            aria-expanded={isMobileMenuOpen}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
    </header>
  );
}