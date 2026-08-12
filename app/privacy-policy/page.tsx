import Header from "../../src/components/sections/Header";
import Footer from "../../src/components/sections/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | AlMaghrib Academy",
  description:
    "Read AlMaghrib Academy's Privacy Policy to learn how we collect, use, and protect your personal information.",
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <Header />

      <main
        style={{
          maxWidth: "1200px",
          margin: "80px auto",
          padding: "0 20px",
        }}
      >
        <h1
          style={{
            color: "#0a2e7a",
            fontSize: "48px",
            marginBottom: "20px",
            textAlign: "center",
          }}
        >
          Privacy Policy
        </h1>

        <p
          style={{
            textAlign: "center",
            marginBottom: "50px",
            color: "#666",
          }}
        >
          Last Updated: {new Date().getFullYear()}
        </p>

        {/* Introduction */}
        <section
          style={{
            border: "1px solid #ddd",
            borderRadius: "12px",
            padding: "30px",
            marginBottom: "30px",
          }}
        >
          <h2 style={{ color: "#0a2e7a", marginBottom: "15px" }}>
            1. Introduction
          </h2>

          <p>
            AlMaghrib Academy ("we", "our", or "us") respects your privacy and is
            committed to protecting your personal information. This Privacy
            Policy explains how we collect, use, store, and protect your
            information when you use our website, online Quran classes, Arabic
            language programs, Islamic studies courses, and related services.
          </p>
        </section>

        {/* Information We Collect */}
        <section
          style={{
            border: "1px solid #ddd",
            borderRadius: "12px",
            padding: "30px",
            marginBottom: "30px",
          }}
        >
          <h2 style={{ color: "#0a2e7a", marginBottom: "15px" }}>
            2. Information We Collect
          </h2>

          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginTop: "20px",
            }}
          >
            <thead>
              <tr>
                <th
                  style={{
                    border: "1px solid #ddd",
                    padding: "12px",
                    background: "#0a2e7a",
                    color: "#fff",
                    textAlign: "left",
                  }}
                >
                  Information Type
                </th>

                <th
                  style={{
                    border: "1px solid #ddd",
                    padding: "12px",
                    background: "#0a2e7a",
                    color: "#fff",
                    textAlign: "left",
                  }}
                >
                  Examples
                </th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td
                  style={{
                    border: "1px solid #ddd",
                    padding: "12px",
                  }}
                >
                  Personal Information
                </td>

                <td
                  style={{
                    border: "1px solid #ddd",
                    padding: "12px",
                  }}
                >
                  Name, Email Address, Phone Number, Country
                </td>
              </tr>

              <tr>
                <td
                  style={{
                    border: "1px solid #ddd",
                    padding: "12px",
                  }}
                >
                  Student Information
                </td>

                <td
                  style={{
                    border: "1px solid #ddd",
                    padding: "12px",
                  }}
                >
                  Learning Preferences, Course Selection, Teacher Preference
                </td>
              </tr>

              <tr>
                <td
                  style={{
                    border: "1px solid #ddd",
                    padding: "12px",
                  }}
                >
                  Technical Information
                </td>

                <td
                  style={{
                    border: "1px solid #ddd",
                    padding: "12px",
                  }}
                >
                  Browser Type, Device Information, IP Address
                </td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* How We Use Information */}
        <section
          style={{
            border: "1px solid #ddd",
            borderRadius: "12px",
            padding: "30px",
            marginBottom: "30px",
          }}
        >
          <h2 style={{ color: "#0a2e7a", marginBottom: "15px" }}>
            3. How We Use Your Information
          </h2>

          <ul
            style={{
              paddingLeft: "25px",
              lineHeight: "2",
            }}
          >
            <li>Provide online Quran and Islamic education services.</li>
            <li>Schedule and manage trial classes and regular lessons.</li>
            <li>Communicate regarding courses and student progress.</li>
            <li>Send newsletters and educational resources.</li>
            <li>Improve our website and learning experience.</li>
            <li>Provide customer support and technical assistance.</li>
          </ul>
        </section>

        {/* Data Protection */}
        <section
          style={{
            border: "1px solid #ddd",
            borderRadius: "12px",
            padding: "30px",
            marginBottom: "30px",
          }}
        >
          <h2 style={{ color: "#0a2e7a", marginBottom: "15px" }}>
            4. Data Protection
          </h2>

          <p>
            We implement appropriate security measures to protect your personal
            information against unauthorized access, disclosure, alteration, or
            destruction. While we strive to protect your information, no method
            of transmission over the internet is completely secure.
          </p>
        </section>

        {/* Cookies */}
        <section
          style={{
            border: "1px solid #ddd",
            borderRadius: "12px",
            padding: "30px",
            marginBottom: "30px",
          }}
        >
          <h2 style={{ color: "#0a2e7a", marginBottom: "15px" }}>
            5. Cookies
          </h2>

          <p>
            Our website may use cookies and similar technologies to improve user
            experience, analyze website traffic, and provide personalized
            content. You may disable cookies through your browser settings if
            desired.
          </p>
        </section>

        {/* Third Parties */}
        <section
          style={{
            border: "1px solid #ddd",
            borderRadius: "12px",
            padding: "30px",
            marginBottom: "30px",
          }}
        >
          <h2 style={{ color: "#0a2e7a", marginBottom: "15px" }}>
            6. Third-Party Services
          </h2>

          <p>
            We may use trusted third-party services such as payment processors,
            email providers, video conferencing tools, and analytics platforms
            to operate our academy. These providers only receive information
            necessary to perform their services.
          </p>
        </section>

        {/* Student Privacy */}
        <section
          style={{
            border: "1px solid #ddd",
            borderRadius: "12px",
            padding: "30px",
            marginBottom: "30px",
          }}
        >
          <h2 style={{ color: "#0a2e7a", marginBottom: "15px" }}>
            7. Children's Privacy
          </h2>

          <p>
            Many of our students are children. Parents or guardians are
            responsible for providing information on behalf of minors and
            consenting to their participation in our programs.
          </p>
        </section>

        {/* User Rights */}
        <section
          style={{
            border: "1px solid #ddd",
            borderRadius: "12px",
            padding: "30px",
            marginBottom: "30px",
          }}
        >
          <h2 style={{ color: "#0a2e7a", marginBottom: "15px" }}>
            8. Your Rights
          </h2>

          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
            }}
          >
            <tbody>
              <tr>
                <td
                  style={{
                    border: "1px solid #ddd",
                    padding: "12px",
                    fontWeight: "bold",
                  }}
                >
                  Access
                </td>

                <td
                  style={{
                    border: "1px solid #ddd",
                    padding: "12px",
                  }}
                >
                  Request a copy of your personal information.
                </td>
              </tr>

              <tr>
                <td
                  style={{
                    border: "1px solid #ddd",
                    padding: "12px",
                    fontWeight: "bold",
                  }}
                >
                  Correction
                </td>

                <td
                  style={{
                    border: "1px solid #ddd",
                    padding: "12px",
                  }}
                >
                  Request corrections to inaccurate information.
                </td>
              </tr>

              <tr>
                <td
                  style={{
                    border: "1px solid #ddd",
                    padding: "12px",
                    fontWeight: "bold",
                  }}
                >
                  Deletion
                </td>

                <td
                  style={{
                    border: "1px solid #ddd",
                    padding: "12px",
                  }}
                >
                  Request deletion of your personal information where
                  applicable.
                </td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* Contact */}
        <section
          style={{
            border: "1px solid #ddd",
            borderRadius: "12px",
            padding: "30px",
          }}
        >
          <h2 style={{ color: "#0a2e7a", marginBottom: "15px" }}>
            9. Contact Us
          </h2>

          <p>
            If you have any questions regarding this Privacy Policy, please
            contact us:
          </p>

          <br />

          <p>
            <strong>AlMaghrib Academy</strong>
          </p>

          <p>Email: contact@almaghrib.academy</p>

          <p>Phone: +44 7700 181874</p>
        </section>
      </main>

      <Footer />
    </>
  );
}