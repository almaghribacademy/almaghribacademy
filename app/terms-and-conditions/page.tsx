import Header from "../../src/components/sections/Header";
import Footer from "../../src/components/sections/Footer";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms and Conditions | AlMaghrib Academy",
  description:
    "Review the terms and conditions governing the use of AlMaghrib Academy's website and online Quran learning services.",
};

export default function TermsPage() {
  return (
    <>
      <Header />

      <main
        style={{
          background: "#f8f9fc",
          padding: "80px 20px",
        }}
      >
        <div
          style={{
            maxWidth: "1100px",
            margin: "0 auto",
            background: "#fff",
            border: "1px solid #dbe3f3",
            borderRadius: "20px",
            padding: "50px",
            boxShadow: "0 10px 30px rgba(0,0,0,.05)",
          }}
        >
          <h1
            style={{
              color: "#0a2e7a",
              fontSize: "42px",
              marginBottom: "20px",
            }}
          >
            Terms & Conditions
          </h1>

          <p
            style={{
              color: "#555",
              marginBottom: "40px",
            }}
          >
            Last Updated: {new Date().getFullYear()}
          </p>

          {/* Summary Table */}

          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginBottom: "50px",
            }}
          >
            <thead>
              <tr>
                <th
                  style={{
                    border: "1px solid #dbe3f3",
                    padding: "15px",
                    background: "#0a2e7a",
                    color: "#fff",
                    textAlign: "left",
                  }}
                >
                  Section
                </th>

                <th
                  style={{
                    border: "1px solid #dbe3f3",
                    padding: "15px",
                    background: "#0a2e7a",
                    color: "#fff",
                    textAlign: "left",
                  }}
                >
                  Description
                </th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td
                  style={{
                    border: "1px solid #dbe3f3",
                    padding: "15px",
                  }}
                >
                  Eligibility
                </td>

                <td
                  style={{
                    border: "1px solid #dbe3f3",
                    padding: "15px",
                  }}
                >
                  Rules for students using AlMaghrib Academy.
                </td>
              </tr>

              <tr>
                <td
                  style={{
                    border: "1px solid #dbe3f3",
                    padding: "15px",
                  }}
                >
                  Classes
                </td>

                <td
                  style={{
                    border: "1px solid #dbe3f3",
                    padding: "15px",
                  }}
                >
                  Online Quran, Arabic, and Islamic Studies classes.
                </td>
              </tr>

              <tr>
                <td
                  style={{
                    border: "1px solid #dbe3f3",
                    padding: "15px",
                  }}
                >
                  Payments
                </td>

                <td
                  style={{
                    border: "1px solid #dbe3f3",
                    padding: "15px",
                  }}
                >
                  Fees, refunds, and billing policies.
                </td>
              </tr>

              <tr>
                <td
                  style={{
                    border: "1px solid #dbe3f3",
                    padding: "15px",
                  }}
                >
                  Privacy
                </td>

                <td
                  style={{
                    border: "1px solid #dbe3f3",
                    padding: "15px",
                  }}
                >
                  Protection of student information.
                </td>
              </tr>
            </tbody>
          </table>

          {/* Sections */}

          <section
            style={{
              border: "1px solid #e8edf7",
              borderRadius: "12px",
              padding: "25px",
              marginBottom: "25px",
            }}
          >
            <h2 style={{ color: "#0a2e7a" }}>
              1. Acceptance of Terms
            </h2>

            <p>
              By accessing or using AlMaghrib Academy's website,
              services, trial classes, or educational programs,
              you agree to comply with these Terms and Conditions.
              If you do not agree with any part of these terms,
              you should discontinue use of our services.
            </p>
          </section>

          <section
            style={{
              border: "1px solid #e8edf7",
              borderRadius: "12px",
              padding: "25px",
              marginBottom: "25px",
            }}
          >
            <h2 style={{ color: "#0a2e7a" }}>
              2. Our Services
            </h2>

            <p>
              AlMaghrib Academy provides online Quran classes,
              Quran reading, Tajweed, Hifz Quran,
              Arabic language courses, and Islamic studies
              programs for children and adults worldwide.
            </p>
          </section>

          <section
            style={{
              border: "1px solid #e8edf7",
              borderRadius: "12px",
              padding: "25px",
              marginBottom: "25px",
            }}
          >
            <h2 style={{ color: "#0a2e7a" }}>
              3. Student Responsibilities
            </h2>

            <ul
              style={{
                paddingLeft: "20px",
                lineHeight: "2",
              }}
            >
              <li>Provide accurate registration details.</li>
              <li>Attend scheduled classes on time.</li>
              <li>Maintain respectful behavior with teachers.</li>
              <li>
                Use the learning platform only for educational
                purposes.
              </li>
            </ul>
          </section>

          <section
            style={{
              border: "1px solid #e8edf7",
              borderRadius: "12px",
              padding: "25px",
              marginBottom: "25px",
            }}
          >
            <h2 style={{ color: "#0a2e7a" }}>
              4. Fees & Payments
            </h2>

            <p>
              Students are responsible for paying course fees
              according to their selected learning plan.
              Payment schedules and pricing may change without
              prior notice. Any refund requests are reviewed
              according to our refund policy.
            </p>
          </section>

          <section
            style={{
              border: "1px solid #e8edf7",
              borderRadius: "12px",
              padding: "25px",
              marginBottom: "25px",
            }}
          >
            <h2 style={{ color: "#0a2e7a" }}>
              5. Intellectual Property
            </h2>

            <p>
              All educational materials, website content,
              logos, branding, course resources, and teaching
              materials remain the property of AlMaghrib Academy and
              may not be copied, distributed, or reproduced
              without written permission.
            </p>
          </section>

          <section
            style={{
              border: "1px solid #e8edf7",
              borderRadius: "12px",
              padding: "25px",
              marginBottom: "25px",
            }}
          >
            <h2 style={{ color: "#0a2e7a" }}>
              6. Limitation of Liability
            </h2>

            <p>
              AlMaghrib Academy is not responsible for technical
              interruptions, internet connectivity issues,
              or circumstances beyond our control that may
              affect access to online classes.
            </p>
          </section>

          <section
            style={{
              border: "1px solid #e8edf7",
              borderRadius: "12px",
              padding: "25px",
              marginBottom: "25px",
            }}
          >
            <h2 style={{ color: "#0a2e7a" }}>
              7. Changes to Terms
            </h2>

            <p>
              We reserve the right to modify these Terms &
              Conditions at any time. Updated versions will
              be posted on this page.
            </p>
          </section>

          <section
            style={{
              border: "1px solid #e8edf7",
              borderRadius: "12px",
              padding: "25px",
            }}
          >
            <h2 style={{ color: "#0a2e7a" }}>
              8. Contact Us
            </h2>

            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                marginTop: "15px",
              }}
            >
              <tbody>
                <tr>
                  <td
                    style={{
                      border: "1px solid #dbe3f3",
                      padding: "12px",
                      fontWeight: "600",
                    }}
                  >
                    Academy
                  </td>

                  <td
                    style={{
                      border: "1px solid #dbe3f3",
                      padding: "12px",
                    }}
                  >
                    AlMaghrib Academy
                  </td>
                </tr>

                <tr>
                  <td
                    style={{
                      border: "1px solid #dbe3f3",
                      padding: "12px",
                      fontWeight: "600",
                    }}
                  >
                    Email
                  </td>

                  <td
                    style={{
                      border: "1px solid #dbe3f3",
                      padding: "12px",
                    }}
                  >
                    contact@almaghrib.academy
                  </td>
                </tr>

                <tr>
                  <td
                    style={{
                      border: "1px solid #dbe3f3",
                      padding: "12px",
                      fontWeight: "600",
                    }}
                  >
                    Website
                  </td>

                  <td
                    style={{
                      border: "1px solid #dbe3f3",
                      padding: "12px",
                    }}
                  >
                    www.AlMaghribacademy.co
                  </td>
                </tr>
              </tbody>
            </table>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}