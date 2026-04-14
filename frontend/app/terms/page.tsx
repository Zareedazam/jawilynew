import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { 
  FiCheckCircle, 
  FiSettings, 
  FiUser, 
  FiDollarSign, 
  FiLock, 
  FiAlertCircle, 
  FiLink, 
  FiXCircle, 
  FiEdit3, 
  FiGlobe, 
  FiMail,
  FiFileText
} from "react-icons/fi";

export default function TermsPage() {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-white text-black relative overflow-hidden">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 right-20 w-96 h-96 bg-black/5 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-20 w-80 h-80 bg-black/5 rounded-full blur-3xl" />
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, black 1px, transparent 0)`,
            backgroundSize: '40px 40px',
            opacity: 0.02
          }} />
        </div>

        <div className="mx-auto max-w-4xl px-4 sm:px-6 py-16 md:py-20">
          {/* Header with icon */}
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-black rounded-xl text-white">
              <FiFileText className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tight">
                Terms & Conditions
              </h1>
              <p className="mt-2 text-black/50 flex items-center gap-2">
                <span>Last updated:</span>
                <span className="font-medium text-black/70">{new Date().toLocaleDateString()}</span>
              </p>
            </div>
          </div>

          {/* Content sections */}
          <div className="mt-12 space-y-6">
            <Section 
              title="Acceptance of Terms" 
              icon={FiCheckCircle}
            >
              By accessing or using Jawily’s website and services, you agree to be
              bound by these Terms & Conditions. If you do not agree, please do not
              use our platform.
            </Section>

            <Section 
              title="Services" 
              icon={FiSettings}
            >
              Jawily provides study abroad counselling, application guidance,
              documentation support, and related services. All services are
              provided on a best-effort basis and do not guarantee admission,
              scholarships, or visas.
            </Section>

            <Section 
              title="User Responsibilities" 
              icon={FiUser}
            >
              <ul className="list-disc pl-6 space-y-2">
                <li>Provide accurate and complete information</li>
                <li>Ensure uploaded documents are genuine and correct</li>
                <li>Use the platform only for lawful purposes</li>
                <li>Maintain confidentiality of your login credentials</li>
              </ul>
            </Section>

            <Section 
              title="Fees & Payments" 
              icon={FiDollarSign}
            >
              Some services may be free, while others may require payment. Any
              applicable fees will be clearly communicated before you proceed.
              Payments, once made, are generally non-refundable unless stated
              otherwise.
            </Section>

            <Section 
              title="Intellectual Property" 
              icon={FiLock}
            >
              All content on this website, including text, design, logos, and
              software, is the property of Jawily. You may not copy, reproduce, or
              distribute any content without written permission.
            </Section>

            <Section 
              title="Limitation of Liability" 
              icon={FiAlertCircle}
            >
              Jawily is not responsible for decisions made by universities,
              embassies, or third-party service providers. We are not liable for
              any direct or indirect losses arising from the use of our services.
            </Section>

            <Section 
              title="Third-Party Links" 
              icon={FiLink}
            >
              Our website may contain links to third-party websites. Jawily has no
              control over these sites and is not responsible for their content or
              policies.
            </Section>

            <Section 
              title="Termination" 
              icon={FiXCircle}
            >
              We reserve the right to suspend or terminate access to our services
              if these Terms are violated or if misuse of the platform is
              detected.
            </Section>

            <Section 
              title="Changes to Terms" 
              icon={FiEdit3}
            >
              Jawily may update these Terms & Conditions at any time. Continued use
              of the website after changes are posted constitutes acceptance of
              the revised terms.
            </Section>

            <Section 
              title="Governing Law" 
              icon={FiGlobe}
            >
              These Terms & Conditions shall be governed by and interpreted in
              accordance with the laws applicable in your jurisdiction.
            </Section>

            <Section 
              title="Contact Information" 
              icon={FiMail}
            >
              If you have any questions about these Terms & Conditions, please
              contact us at{" "}
              <a href="mailto:support@jawily.com" className="font-semibold text-black underline underline-offset-4 hover:text-black/80 transition-colors">
                support@jawily.com
              </a>.
            </Section>
          </div>

          {/* Removed back to home button as requested */}
        </div>
      </div>
      <Footer />
    </>
  );
}

/* Enhanced Section component with icon and card styling */
function Section({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <div className="group relative rounded-2xl border border-black/10 bg-white/80 backdrop-blur-sm p-6 hover:border-black/30 hover:shadow-lg transition-all duration-300">
      <div className="flex items-start gap-4">
        <div className="p-2.5 bg-black/5 rounded-lg text-black group-hover:scale-110 transition-transform">
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-black tracking-tight mb-3">
            {title}
          </h2>
          <div className="text-black/70 leading-relaxed">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}