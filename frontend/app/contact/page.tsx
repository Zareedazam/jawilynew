import Header from "../components/Header";
import Footer from "../components/Footer";
import { 
  FiUser, 
  FiMail, 
  FiPhone, 
  FiMessageSquare, 
  FiMapPin, 
  FiClock, 
  FiSend,
  FiCheckCircle 
} from "react-icons/fi";

export default function ContactPage() {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-white text-black relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 right-20 w-96 h-96 bg-black/5 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-20 w-80 h-80 bg-black/5 rounded-full blur-3xl" />
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          {/* Header */}
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight bg-gradient-to-r from-black to-neutral-600 bg-clip-text text-transparent">
              Contact Jawily
            </h1>
            <p className="mt-4 text-black/60 text-lg leading-relaxed">
              Send a message. We’ll reply within 24 hours. Your questions matter to us.
            </p>
          </div>

          <div className="mt-16 grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Form Card */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-black/10 to-transparent rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative rounded-3xl border border-black/10 bg-white/80 backdrop-blur-sm p-8 shadow-xl hover:shadow-2xl transition-all duration-300">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-3 bg-black rounded-xl text-white">
                    <FiMessageSquare className="text-xl" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black">Send us a message</h2>
                    <p className="text-sm text-black/60 mt-1">
                      We're here to help. Fill the form and we'll get back to you.
                    </p>
                  </div>
                </div>

                <form className="mt-8 space-y-5">
                  <Field label="Full Name" icon={FiUser}>
                    <input
                      className="w-full rounded-xl border border-black/15 bg-white px-4 py-3 pl-11 outline-none focus:border-black/40 focus:ring-2 focus:ring-black/5 transition-all"
                      placeholder="Your name"
                    />
                  </Field>

                  <Field label="Email" icon={FiMail}>
                    <input
                      type="email"
                      className="w-full rounded-xl border border-black/15 bg-white px-4 py-3 pl-11 outline-none focus:border-black/40 focus:ring-2 focus:ring-black/5 transition-all"
                      placeholder="you@example.com"
                    />
                  </Field>

                  <Field label="Phone (optional)" icon={FiPhone}>
                    <input
                      className="w-full rounded-xl border border-black/15 bg-white px-4 py-3 pl-11 outline-none focus:border-black/40 focus:ring-2 focus:ring-black/5 transition-all"
                      placeholder="+91 7518838702"
                    />
                  </Field>

                  <Field label="Topic" icon={FiMessageSquare}>
                    <select className="w-full rounded-xl border border-black/15 bg-white px-4 py-3 pl-11 outline-none focus:border-black/40 focus:ring-2 focus:ring-black/5 transition-all appearance-none">
                      <option>General Inquiry</option>
                      <option>Free Consultation</option>
                      <option>Universities</option>
                      <option>Courses</option>
                      <option>Visa Guidance</option>
                      <option>Accommodation</option>
                      <option>Education Loan</option>
                    </select>
                  </Field>

                  <Field label="Message" icon={FiMessageSquare}>
                    <textarea
                      className="w-full rounded-xl border border-black/15 bg-white px-4 py-3 pl-11 outline-none focus:border-black/40 focus:ring-2 focus:ring-black/5 transition-all min-h-[140px] resize-none"
                      placeholder="Write your message..."
                    />
                  </Field>

                  <div className="flex items-start gap-3 pt-2">
                    <input 
                      type="checkbox" 
                      className="mt-1 h-5 w-5 rounded border-black/30 text-black focus:ring-black/20" 
                    />
                    <p className="text-sm text-black/60 leading-relaxed">
                      I agree to be contacted by Jawily. I can opt out anytime.
                    </p>
                  </div>

                  <button
                    type="button"
                    className="group w-full sm:w-auto px-8 py-4 rounded-xl bg-black text-white font-semibold hover:bg-neutral-800 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                  >
                    <FiSend className="group-hover:translate-x-1 transition-transform" />
                    Send Message
                  </button>

                  <p className="text-xs text-black/40 text-center sm:text-left">
                    *UI demo — backend integration coming soon.
                  </p>
                </form>
              </div>
            </div>

            {/* Contact Info & Map */}
            <div className="space-y-6">
              {/* Contact info cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InfoCard 
                  icon={FiPhone} 
                  title="Call us" 
                  value="+91 7518838702" 
                  subtext="Mon–Sat, 10am–7pm"
                />
                <InfoCard 
                  icon={FiMail} 
                  title="Email" 
                  value="info@jawily.com" 
                  subtext="We reply within 24h"
                />
                <InfoCard 
                  icon={FiMapPin} 
                  title="Lucknow Office" 
                  value="Lucknow, India" 
                  subtext="Main office"
                />
                <InfoCard 
                  icon={FiMapPin} 
                  title="London Office" 
                  value="London, UK" 
                  subtext="UK branch"
                />
              </div>

              {/* Stylized Map Placeholder */}
              <div className="relative group h-[280px] rounded-3xl border border-black/10 bg-white/80 backdrop-blur-sm overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-black/5 to-transparent" />
                
                {/* Decorative map grid */}
                <div className="absolute inset-0" style={{
                  backgroundImage: `
                    linear-gradient(to right, black 1px, transparent 1px),
                    linear-gradient(to bottom, black 1px, transparent 1px)
                  `,
                  backgroundSize: '40px 40px',
                  opacity: 0.05
                }} />
                
                {/* Location pin */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="relative">
                    <div className="w-16 h-16 bg-black/10 rounded-full flex items-center justify-center animate-pulse">
                      <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center text-white">
                        <FiMapPin className="w-5 h-5" />
                      </div>
                    </div>
                    <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap bg-black/90 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-lg">
                      Jawily Headquarters
                      <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 rotate-45 w-2 h-2 bg-black/90" />
                    </div>
                  </div>
                </div>

                {/* Floating dots (cities) */}
                <div className="absolute top-1/4 right-1/4 w-3 h-3 bg-black/20 rounded-full" />
                <div className="absolute bottom-1/3 left-1/3 w-2 h-2 bg-black/30 rounded-full" />
                <div className="absolute top-2/3 right-1/3 w-4 h-4 bg-black/10 rounded-full" />

                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg text-sm border border-black/10 shadow-lg">
                  <span className="font-medium">📍 Main Office</span>
                </div>
              </div>

              {/* Quick action (single button) */}
    
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

function Field({ label, icon: Icon, children }: { label: string; icon: React.ElementType; children: React.ReactNode }) {
  return (
    <div className="relative">
      <label className="block text-sm font-semibold text-black/80 mb-2">
        {label}
      </label>
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-black/40">
          <Icon className="w-5 h-5" />
        </div>
        {children}
      </div>
    </div>
  );
}

function InfoCard({ icon: Icon, title, value, subtext }: { icon: React.ElementType; title: string; value: string; subtext: string }) {
  return (
    <div className="group relative rounded-2xl border border-black/10 bg-white/80 backdrop-blur-sm p-5 hover:border-black/30 hover:shadow-lg transition-all duration-300">
      <div className="flex items-start gap-3">
        <div className="p-2 bg-black/5 rounded-lg text-black group-hover:scale-110 transition-transform">
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs text-black/40">{title}</p>
          <p className="font-semibold text-sm mt-0.5">{value}</p>
          <p className="text-xs text-black/50 mt-1">{subtext}</p>
        </div>
      </div>
    </div>
  );
}