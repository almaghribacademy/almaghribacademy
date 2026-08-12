// app/(public)/layout.tsx
import { ReactNode } from 'react';
import Link from 'next/link';

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="public-layout">
      {/* Public Header */}
      <header className="public-header">
        <div className="container">
          <Link href="/" className="logo">
            AlMaghrib Academy
          </Link>
          <div className="nav-links">
            <Link href="/auth/login">Login</Link>
            <Link href="/auth/register" className="btn-primary">
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>{children}</main>

      {/* Public Footer */}
      <footer className="public-footer">
        <div className="container">
          <div className="footer-grid">
            <div>
              <h3>AlMaghrib Academy</h3>
              <p>
                Learn Quran, Arabic, and Islamic Studies online with expert tutors.
              </p>
            </div>
            <div>
              <h4>Quick Links</h4>
              <ul>
                <li><Link href="/courses">Courses</Link></li>
                <li><Link href="/teachers">Teachers</Link></li>
                <li><Link href="/about">About Us</Link></li>
                <li><Link href="/contact">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4>Support</h4>
              <ul>
                <li><Link href="/faq">FAQ</Link></li>
                <li><Link href="/privacy">Privacy Policy</Link></li>
                <li><Link href="/terms">Terms of Service</Link></li>
              </ul>
            </div>
            <div>
              <h4>Contact Us</h4>
              <ul>
                <li>Email: info@AlMaghribacademy.co</li>
                <li>Phone: +1 (555) 123-4567</li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; {new Date().getFullYear()} AlMaghrib Academy. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}