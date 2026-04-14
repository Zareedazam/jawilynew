import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { 
  FiShield, 
  FiInfo, 
  FiDatabase, 
  FiShare2, 
  FiLock, 
  FiUserCheck, 
  FiCoffee, 
  FiEdit3, 
  FiMail,
  FiFileText
} from "react-icons/fi";

export default function PrivacyPage() {
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
                Privacy Policy
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
              title="Introduction" 
              icon={FiInfo}
            >
              Jawily (“we”, “our”, “us”) respects your privacy and is committed to
              protecting your personal data. This policy explains how we collect,
              use, and safeguard your information when you use our website and
              services.
            </Section>

            <Section 
              title="Information We Collect" 
              icon={FiDatabase}
            >
              <ul className="list-disc pl-6 space-y-2">
                <li>Personal details (name, email, phone number)</li>
                <li>Educational background and study preferences</li>
                <li>Documents you upload (SOPs, transcripts, etc.)</li>
                <li>Communication data (messages with counsellors)</li>
              </ul>
            </Section>

            <Section 
              title="How We Use Your Information" 
              icon={FiUserCheck}
            >
              <ul className="list-disc pl-6 space-y-2">
                <li>To provide study abroad counselling services</li>
                <li>To process applications and documentation</li>
                <li>To communicate updates and important information</li>
                <li>To improve our platform and user experience</li>
              </ul>
            </Section>

            <Section 
              title="Data Sharing" 
              icon={FiShare2}
            >
              We do not sell your personal data. Your information may be shared
              only with trusted partners such as universities or visa service
              providers, strictly for application-related purposes.
            </Section>

            <Section 
              title="Data Security" 
              icon={FiLock}
            >
              We use reasonable technical and organisational measures to protect
              your data. However, no online system is 100% secure, and we cannot
              guarantee absolute security.
            </Section>

            <Section 
              title="Your Rights" 
              icon={FiShield}
            >
              You have the right to access, update, or request deletion of your
              personal information. You may also opt out of non-essential
              communications at any time.
            </Section>

            <Section 
              title="Cookies" 
              icon={FiCoffee}
            >
              Jawily may use cookies to enhance site performance and user
              experience. You can disable cookies in your browser settings.
            </Section>

            <Section 
              title="Changes to This Policy" 
              icon={FiEdit3}
            >
              We may update this Privacy Policy from time to time. Any changes will
              be posted on this page with an updated date.
            </Section>

            <Section 
              title="Contact Us" 
              icon={FiMail}
            >
              If you have any questions about this Privacy Policy or how your data
              is handled, please contact us at{" "}
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