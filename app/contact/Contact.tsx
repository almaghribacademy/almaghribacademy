"use client";
import Header from "../../src/components/sections/Header";
import Footer from "../../src/components/sections/Footer";
import "../globals.css";
import "../pages-css/contact.css";
import Link from "next/link";
import React, { useState } from "react";
import Swal from "sweetalert2";



export default function ContactPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateField = (name: string, value: string): string => {
    switch (name) {
      case "fullName":
        if (!value.trim()) {
          return "Full name is required";
        }
        if (!/^[A-Za-z\s'-]{2,50}$/.test(value.trim())) {
          return "Full name must contain only letters, spaces, hyphens, or apostrophes (2-50 characters)";
        }
        return "";

      case "email":
        if (!value.trim()) {
          return "Email is required";
        }
        if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value.trim())) {
          return "Please enter a valid email address (e.g., name@domain.com)";
        }
        return "";

      case "phone":
        if (!value.trim()) {
          return "Phone number is required";
        }
        if (!/^[0-9]{7,15}$/.test(value.trim())) {
          return "Phone number must contain only numbers (7-15 digits)";
        }
        return "";

      case "subject":
        if (!value.trim()) {
          return "Subject is required";
        }
        if (value.trim().length < 3) {
          return "Subject must be at least 3 characters";
        }
        return "";

      case "message":
        if (!value.trim()) {
          return "Message is required";
        }
        if (value.trim().length < 10) {
          return "Message must be at least 10 characters";
        }
        if (value.trim().length > 1000) {
          return "Message cannot exceed 1000 characters";
        }
        return "";

      default:
        return "";
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Apply input restrictions
    let sanitizedValue = value;
    if (name === "fullName") {
      sanitizedValue = value.replace(/[^A-Za-z\s'-]/g, "");
    } else if (name === "phone") {
      sanitizedValue = value.replace(/[^0-9]/g, "");
    }

    setFormData({
      ...formData,
      [name]: sanitizedValue,
    });

    // Clear error on change
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    if (error) {
      setErrors({ ...errors, [name]: error });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    const fields = ["fullName", "email", "phone", "subject", "message"];

    fields.forEach((field) => {
      const error = validateField(field, formData[field as keyof typeof formData]);
      if (error) {
        newErrors[field] = error;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      // Scroll to first error
      const firstError = Object.keys(errors)[0];
      const element = document.querySelector(`[name="${firstError}"]`);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
        (element as HTMLElement).focus();
      }
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Message Sent! 🎉",
          text: "Thank you for contacting us! We'll reach out to you soon.",
          confirmButtonColor: "#0a2e7a",
        });

        setFormData({
          fullName: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
        });
        setErrors({});
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: data.message || "Failed to send message. Please try again.",
          confirmButtonColor: "#0a2e7a",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Something went wrong. Please try again.",
        confirmButtonColor: "#0a2e7a",
      });
    }

    setLoading(false);
  };

  return (
    <>
      <Header />

      <main className="contact-page">
        {/* Hero Section */}
        <section className="contact-hero">
          <div className="contact-container">
            <h1 className="contact-hero-title">We'd Love To Hear From You</h1>
            <p className="contact-hero-text">
              Have questions about our Quran, Arabic, or Islamic Studies
              programs? Our team is here to help.
            </p>
            <Link href="/trial-form">
              <button className="contact-cta-button">Book Free Trial</button>
            </Link>
          </div>
        </section>

        {/* Contact Section */}
        <section className="contact-section">
          <div className="contact-container">
            <div className="contact-grid">
              {/* Contact Info */}
              <div className="contact-info">
                <h2>Get In Touch</h2>
                <p>
                  Reach out to us for course details, trial classes,
                  admissions, or any questions regarding AlMaghrib Academy.
                </p>

                <div className="info-card">
                  <h3>📧 Email</h3>
                  <p>contact@AlMaghribacademy.co</p>
                </div>

                <div className="info-card">
                  <h3>📞 Phone</h3>
                  <p>+44 7700 181874</p>
                </div>

                <div className="info-card">
                  <h3>💬 WhatsApp</h3>
                  <p>+44 7700 181874</p>
                </div>

                <div className="info-card">
                  <h3>🕐 Working Hours</h3>
                  <p>Monday - Sunday | 24/7 Support</p>
                </div>
              </div>

              {/* Contact Form */}
              <div className="contact-form-card">
                <h2>Send Message</h2>

                <form className="contact-form" onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label htmlFor="fullName">
                      Full Name <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      placeholder="Enter your full name"
                      value={formData.fullName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={errors.fullName ? "error" : ""}
                      required
                    />
                    {errors.fullName && <span className="error-message">{errors.fullName}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">
                      Email Address <span className="required">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      placeholder="Enter your email address"
                      value={formData.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={errors.email ? "error" : ""}
                      required
                    />
                    {errors.email && <span className="error-message">{errors.email}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="phone">
                      Phone Number <span className="required">*</span>
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      placeholder="Enter your phone number (e.g., 07700181874)"
                      value={formData.phone}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={errors.phone ? "error" : ""}
                      required
                    />
                    {errors.phone && <span className="error-message">{errors.phone}</span>}
                    <small className="helper-text">Only numbers (7-15 digits)</small>
                  </div>

                  <div className="form-group">
                    <label htmlFor="subject">
                      Subject <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      placeholder="Enter subject"
                      value={formData.subject}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={errors.subject ? "error" : ""}
                      required
                    />
                    {errors.subject && <span className="error-message">{errors.subject}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="message">
                      Message <span className="required">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={6}
                      placeholder="Write your message..."
                      value={formData.message}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={errors.message ? "error" : ""}
                      required
                    ></textarea>
                    {errors.message && <span className="error-message">{errors.message}</span>}
                    <div className="char-count">
                      <span className={formData.message.length > 1000 ? "over-limit" : ""}>
                        {formData.message.length}/1000
                      </span>
                    </div>
                  </div>

                  <button type="submit" disabled={loading}>
                    {loading ? "Sending..." : "Send Message"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      
    </>
  );
}