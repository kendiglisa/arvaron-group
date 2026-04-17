import React, { useState, useEffect, useRef } from 'react';
import { 
  Menu, X, ChevronRight, Globe, Building, Truck, 
  ShoppingCart, Monitor, Cpu, Package, ArrowRight, 
  Mail, Phone, MapPin, Linkedin, Twitter, CheckCircle2 
} from 'lucide-react';

// --- CUSTOM HOOKS FOR ANIMATIONS ---

// Hook for scroll-triggered fade-in animations
const useScrollFade = (threshold = 0.1) => {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef(null);

  useEffect(() => {
    const currentRef = domRef.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(currentRef);
        }
      },
      { threshold }
    );

    if (currentRef) observer.observe(currentRef);
    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [threshold]);

  return [domRef, isVisible];
};

// Component for animated number counters
const AnimatedCounter = ({ end, duration = 2000, suffix = "" }) => {
  const [count, setCount] = useState(0);
  const [ref, isVisible] = useScrollFade(0.5);

  useEffect(() => {
    if (!isVisible) return;
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // Ease out quad
      const easeProgress = progress * (2 - progress);
      setCount(Math.floor(easeProgress * end));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [isVisible, end, duration]);

  return <span ref={ref}>{count}{suffix}</span>;
};

// --- DATA ---

const brandColors = {
  black: '#000000',
  green: '#00bf63',
  blue: '#0a6cff'
};

const verticals = [
  { id: 'sourcing', name: "Arvaron Sourcing", icon: Globe, desc: "Global procurement, strategic vendor management, and optimized supply networks.", image: "https://static.vecteezy.com/system/resources/previews/071/785/284/large_2x/luminous-plexus-world-map-visualizing-global-digital-connectivity-free-photo.jpg?auto=format&fit=crop&q=80&w=800" },
  { id: 'logistics', name: "Arvaron Logistics", icon: Truck, desc: "End-to-end freight management, warehousing, and next-gen supply chain solutions.", image: "https://images.unsplash.com/photo-1580674285054-bed31e145f59?auto=format&fit=crop&q=80&w=800" },
  { id: 'digital', name: "Arvaron Digital", icon: Monitor, desc: "Transformative digital marketing, media buying, and brand amplification.", image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800" },
  { id: 'infra', name: "Arvaron Infra", icon: Building, desc: "Large-scale infrastructure development, commercial real estate, and heavy engineering.", image: "https://images.pexels.com/photos/373479/pexels-photo-373479.jpeg?auto=format&fit=crop&q=80&w=800" },
  { id: 'retail', name: "Arvaron Retail", icon: ShoppingCart, desc: "Next-generation omnichannel retail experiences and consumer goods distribution.", image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=800" },
  { id: 'tech', name: "Arvaron Technologies", icon: Cpu, desc: "Innovative software solutions, AI integration, and enterprise IT consulting.", image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800" },
  { id: 'exports', name: "Arvaron Exports", icon: Package, desc: "Facilitating international trade and expanding cross-border commercial networks.", image: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&q=80&w=800" },
];

const stats = [
  { label: "Business Verticals", value: 7, suffix: "" },
  { label: "Global Partners", value: 150, suffix: "+" },
  { label: "Countries Served", value: 35, suffix: "+" },
  { label: "Years of Excellence", value: 15, suffix: "+" },
];

// --- COMPONENTS ---

const FadeInSection = ({ children, delay = 0, className = "" }) => {
  const [ref, isVisible] = useScrollFade();
  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  // --- FORM STATE & LOGIC ---
  const [formStatus, setFormStatus] = useState('idle');
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', interest: 'General Inquiry', message: ''
  });

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setFormStatus('submitting');
    
    // Function to encode form data for Netlify
    const encode = (data) => {
      return Object.keys(data)
        .map(key => encodeURIComponent(key) + "=" + encodeURIComponent(data[key]))
        .join("&");
    }

    // Submit data to Netlify via AJAX
    fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: encode({
        "form-name": "contact",
        ...formData,
        "bot-field": "",
      })
    })
      .then(() => {
        setFormStatus('success');
        setFormData({ firstName: '', lastName: '', email: '', interest: 'General Inquiry', message: '' });
        setTimeout(() => setFormStatus('idle'), 5000);
      })
      .catch(error => {
        setFormStatus('error');
        setTimeout(() => setFormStatus('idle'), 5000);
      });
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigateTo = (page) => {
    setCurrentPage(page);
    setIsMobileMenuOpen(false);
    window.scrollTo(0, 0);
  };

  const navLinks = [
    { name: 'Home', id: 'home' },
    { name: 'About Us', id: 'about' },
    { name: 'Our Businesses', id: 'businesses' },
    { name: 'Investors & Media', id: 'investors' },
    { name: 'Contact', id: 'contact' },
  ];

  return (
    <div className="min-h-screen bg-[#000000] text-gray-200 font-sans selection:bg-[#00bf63] selection:text-black overflow-x-hidden">
      
      {/* Navigation */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-black/90 backdrop-blur-md py-4 border-b border-gray-800' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          
          {/* Logo Area */}
          <div className="flex items-center cursor-pointer" onClick={() => navigateTo('home')}>
            <img 
              src="Arvaron.png" 
              alt="Arvaron Logo" 
              className="h-10 md:h-12 object-contain"
              onError={(e) => {
                e.target.onerror = null;
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'block';
              }}
            />
            {/* Text Fallback if image fails */}
            <span style={{display: 'none'}} className="text-3xl font-extrabold tracking-tighter">
              <span className="text-[#00bf63]">AR</span>
              <span className="text-gray-100">VA</span>
              <span className="text-[#0a6cff]">RON</span>
            </span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex space-x-8 items-center">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => navigateTo(link.id)}
                className={`text-sm uppercase tracking-wider font-semibold transition-colors duration-300 ${
                  currentPage === link.id ? 'text-[#00bf63]' : 'text-gray-300 hover:text-[#0a6cff]'
                }`}
              >
                {link.name}
              </button>
            ))}
            <button 
              onClick={() => navigateTo('contact')}
              className="bg-gradient-to-r from-[#00bf63] to-[#0a6cff] text-white px-6 py-2.5 rounded-full font-bold hover:opacity-90 transition-all transform hover:scale-105 shadow-[0_0_15px_rgba(10,108,255,0.4)]"
            >
              Partner With Us
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-white hover:text-[#00bf63] transition-colors">
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-[#050505] border-b border-gray-800 shadow-xl py-4 flex flex-col items-center space-y-4">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => navigateTo(link.id)}
                className={`text-lg uppercase tracking-wide font-semibold w-full py-2 ${
                  currentPage === link.id ? 'text-[#0a6cff]' : 'text-gray-300'
                }`}
              >
                {link.name}
              </button>
            ))}
          </div>
        )}
      </nav>

      {/* Main Content Area */}
      <main className="pt-20 md:pt-0">
        
        {/* === HOME PAGE === */}
        {currentPage === 'home' && (
          <div className="animate-in fade-in duration-1000">
            {/* Hero Section */}
            <section className="relative min-h-[100dvh] lg:h-screen flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 z-0">
                <img 
                  src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=2000" 
                  alt="Mumbai Skyline / Architecture" 
                  className="w-full h-full object-cover opacity-30"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black"></div>
              </div>
              
              <div className="relative z-10 text-center max-w-5xl mx-auto px-4">
                <FadeInSection>
                  <h2 className="text-[#00bf63] font-bold tracking-widest uppercase mb-4 text-sm md:text-base">Welcome to Arvaron Group Holdings</h2>
                  <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight text-white">
                    Engineering The <br />
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#00bf63] to-[#0a6cff]">
                      Future of Business
                    </span>
                  </h1>
                  <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl mx-auto font-light">
                    A diversified conglomerate based in Mumbai, India. We build, scale, and innovate across 7 core verticals, driving sustainable growth globally.
                  </p>
                  <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <button onClick={() => navigateTo('businesses')} className="bg-gradient-to-r from-[#00bf63] to-[#0a6cff] text-white px-8 py-4 rounded-full font-bold text-lg hover:shadow-[0_0_25px_rgba(0,191,99,0.5)] transition-all flex items-center justify-center">
                      Explore Our Verticals <ChevronRight className="ml-2" />
                    </button>
                    <button onClick={() => navigateTo('about')} className="bg-transparent border border-gray-500 text-white px-8 py-4 rounded-full font-bold text-lg hover:border-white hover:bg-white/5 transition-all">
                      Who We Are
                    </button>
                  </div>
                </FadeInSection>
              </div>
            </section>

            {/* Stats Section */}
            <section className="py-20 bg-[#050505] border-y border-gray-900">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                  {stats.map((stat, index) => (
                    <FadeInSection key={index} delay={index * 100}>
                      <div className="p-6 rounded-2xl bg-gradient-to-br from-gray-900 to-black border border-gray-800 hover:border-[#0a6cff]/50 transition-colors">
                        <div className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#00bf63] to-[#0a6cff] mb-2">
                          <AnimatedCounter end={stat.value} />{stat.suffix}
                        </div>
                        <div className="text-gray-400 font-medium tracking-wide uppercase text-sm">{stat.label}</div>
                      </div>
                    </FadeInSection>
                  ))}
                </div>
              </div>
            </section>

            {/* Businesses Preview */}
            <section className="py-24 bg-black">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <FadeInSection>
                  <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold mb-4">Our Business <span className="text-[#0a6cff]">Verticals</span></h2>
                    <p className="text-gray-400 max-w-2xl mx-auto">Operating across critical sectors, Arvaron leverages synergy and innovation to deliver exceptional value across the supply chain, infrastructure, and technology.</p>
                  </div>
                </FadeInSection>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {verticals.map((v, i) => (
                    <FadeInSection key={v.id} delay={i * 100}>
                      <div className="group relative bg-gray-900 rounded-2xl overflow-hidden border border-gray-800 hover:border-[#00bf63] transition-all duration-300 h-full flex flex-col cursor-pointer" onClick={() => navigateTo('businesses')}>
                        <div className="h-48 overflow-hidden relative">
                          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent z-10"></div>
                          <img src={v.image} alt={v.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" loading="lazy" />
                        </div>
                        <div className="p-6 relative z-20 flex-grow flex flex-col">
                          <div className="bg-[#000000] w-12 h-12 rounded-full flex items-center justify-center absolute -top-6 border border-gray-800 group-hover:border-[#0a6cff] transition-colors">
                            <v.icon className="text-[#00bf63]" size={24} />
                          </div>
                          <h3 className="text-xl font-bold mb-2 mt-4 text-white group-hover:text-[#0a6cff] transition-colors">{v.name}</h3>
                          <p className="text-gray-400 text-sm flex-grow mb-4">{v.desc}</p>
                          <div className="flex items-center text-[#00bf63] text-sm font-semibold uppercase tracking-wider group-hover:translate-x-2 transition-transform">
                            Learn More <ArrowRight size={16} className="ml-1" />
                          </div>
                        </div>
                      </div>
                    </FadeInSection>
                  ))}
                </div>
              </div>
            </section>
          </div>
        )}

        {/* === ABOUT PAGE === */}
        {currentPage === 'about' && (
          <div className="animate-in fade-in duration-1000 pt-16">
            <section className="py-20 px-4">
              <div className="max-w-7xl mx-auto">
                <FadeInSection>
                  <h1 className="text-5xl md:text-6xl font-bold mb-6">About <span className="text-[#00bf63]">Arvaron</span></h1>
                  <p className="text-xl text-gray-400 max-w-3xl mb-16">Headquartered in the commercial capital of India, Mumbai, Arvaron is a multifaceted holding group committed to redefining industry standards across seven distinct yet synergistic business verticals.</p>
                </FadeInSection>

                <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
                  <FadeInSection delay={200}>
                    <img src="https://images.unsplash.com/photo-1577903698888-293730e10411?auto=format&fit=crop&q=80&w=1000" alt="Mumbai Headquarters" className="rounded-2xl border border-gray-800 shadow-[0_0_30px_rgba(10,108,255,0.15)]" />
                  </FadeInSection>
                  <FadeInSection delay={400}>
                    <h3 className="text-3xl font-bold mb-4 text-white">Our Vision & Mission</h3>
                    <div className="w-20 h-1 bg-gradient-to-r from-[#00bf63] to-[#0a6cff] mb-6"></div>
                    <p className="text-gray-300 mb-6 leading-relaxed">
                      At Arvaron Group Holdings, our vision is to be the catalyst for global industrial and digital evolution. We strive to integrate traditional business robustness with modern technological agility.
                    </p>
                    <ul className="space-y-4">
                      {['Sustainable Growth & Innovation', 'Excellence in Corporate Governance', 'Empowering Global Supply Chains', 'Fostering Top-tier Talent'].map((item, i) => (
                        <li key={i} className="flex items-center text-gray-300">
                          <CheckCircle2 className="text-[#00bf63] mr-3" size={20} />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </FadeInSection>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* === BUSINESSES PAGE === */}
        {currentPage === 'businesses' && (
          <div className="animate-in fade-in duration-1000 pt-16">
            <section className="py-20 bg-black">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <FadeInSection>
                  <div className="text-center mb-20">
                    <h1 className="text-5xl md:text-6xl font-bold mb-6">Our <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#00bf63] to-[#0a6cff]">Enterprises</span></h1>
                    <p className="text-xl text-gray-400 max-w-3xl mx-auto">Explore the diverse sectors where Arvaron builds, invests, and leads.</p>
                  </div>
                </FadeInSection>

                <div className="space-y-16">
                  {verticals.map((v, i) => (
                    <FadeInSection key={v.id} delay={i % 2 === 0 ? 100 : 200}>
                      <div className={`flex flex-col ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-8 items-center bg-gray-900/50 rounded-3xl p-6 border border-gray-800 hover:border-[#0a6cff]/50 transition-colors`}>
                        <div className="w-full md:w-1/2 h-64 md:h-80 overflow-hidden rounded-2xl relative group">
                          <img src={v.image} alt={v.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
                          <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500"></div>
                        </div>
                        <div className="w-full md:w-1/2 p-6">
                          <div className="flex items-center mb-4">
                            <div className="p-3 bg-black rounded-xl border border-gray-700 mr-4 shadow-lg">
                              <v.icon className="text-[#0a6cff]" size={32} />
                            </div>
                            <h2 className="text-3xl font-bold text-white">{v.name}</h2>
                          </div>
                          <p className="text-lg text-gray-400 mb-6 leading-relaxed">{v.desc} Leveraging cutting-edge methodologies and profound market insights, this vertical continuously outperforms industry benchmarks and sets new paradigms for operational success.</p>
                          <button onClick={() => navigateTo('contact')} className="text-[#00bf63] font-semibold hover:text-white transition-colors flex items-center">
                            Inquire about partnerships <ArrowRight size={18} className="ml-2" />
                          </button>
                        </div>
                      </div>
                    </FadeInSection>
                  ))}
                </div>
              </div>
            </section>
          </div>
        )}

        {/* === INVESTORS PAGE === */}
        {currentPage === 'investors' && (
          <div className="animate-in fade-in duration-1000 pt-16">
             <section className="py-20 bg-black px-4">
              <div className="max-w-7xl mx-auto text-center">
                <FadeInSection>
                  <h1 className="text-5xl font-bold mb-6">Investors & <span className="text-[#0a6cff]">Media</span></h1>
                  <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-16">Transparent reporting, corporate governance, and continuous value creation for our stakeholders.</p>
                  
                  <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    <div className="bg-gray-900 p-10 rounded-3xl border border-gray-800 text-left">
                      <Monitor className="text-[#00bf63] mb-6" size={40} />
                      <h3 className="text-2xl font-bold mb-4 text-white">Media Inquiries</h3>
                      <p className="text-gray-400 mb-6">For press releases, brand assets, and media relations, please connect with our corporate communications team.</p>
                      <button onClick={() => navigateTo('contact')} className="text-white border-b border-[#00bf63] pb-1 hover:text-[#00bf63] transition-colors">Contact Media Desk</button>
                    </div>
                    <div className="bg-gray-900 p-10 rounded-3xl border border-gray-800 text-left">
                      <Building className="text-[#0a6cff] mb-6" size={40} />
                      <h3 className="text-2xl font-bold mb-4 text-white">Investor Relations</h3>
                      <p className="text-gray-400 mb-6">Access financial reports, corporate governance documents, and partnership structuring information.</p>
                      <button onClick={() => navigateTo('contact')} className="text-white border-b border-[#0a6cff] pb-1 hover:text-[#0a6cff] transition-colors">Request Prospectus</button>
                    </div>
                  </div>
                </FadeInSection>
              </div>
             </section>
          </div>
        )}

        {/* === CONTACT PAGE === */}
        {currentPage === 'contact' && (
          <div className="animate-in fade-in duration-1000 pt-16">
            <section className="py-20 px-4">
              <div className="max-w-7xl mx-auto">
                <FadeInSection>
                  <div className="text-center mb-16">
                    <h1 className="text-5xl md:text-6xl font-bold mb-6">Let's <span className="text-[#00bf63]">Connect</span></h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">Whether you're an investor, talent, or seeking business partnerships, Arvaron's global team is ready to engage.</p>
                  </div>
                </FadeInSection>

                <div className="grid lg:grid-cols-2 gap-12 bg-gray-900/40 border border-gray-800 rounded-3xl overflow-hidden shadow-2xl">
                  {/* Form */}
                  <FadeInSection delay={200} className="p-8 md:p-12">
                    <h3 className="text-2xl font-bold mb-6 text-white">Send an Inquiry</h3>
                    <form className="space-y-6" name="contact" method="POST" data-netlify="true" onSubmit={handleFormSubmit}>
                      {/* Required hidden input for Netlify routing */}
                      <input type="hidden" name="form-name" value="contact" />
                      <input type="hidden" name="source" value="website" />
                      <input type="hidden" name="page" value="contact" />
                      {/* Honeypot field (ADD THIS BLOCK) */}
                      <p style={{ display: "none" }}>
                        <label>
                          Don’t fill this out: <input name="bot-field" />
                        </label>
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-400 mb-2">First Name</label>
                          <input type="text" name="firstName" value={formData.firstName} onChange={(e) => setFormData({...formData, firstName: e.target.value})} className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#0a6cff] transition-colors" placeholder="John" required />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-400 mb-2">Last Name</label>
                          <input type="text" name="lastName" value={formData.lastName} onChange={(e) => setFormData({...formData, lastName: e.target.value})} className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#0a6cff] transition-colors" placeholder="Doe" required />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Email Address</label>
                        <input type="email" name="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#00bf63] transition-colors" placeholder="john@example.com" required />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Interest Area</label>
                        <select name="interest" value={formData.interest} onChange={(e) => setFormData({...formData, interest: e.target.value})} className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#0a6cff] transition-colors appearance-none">
                          <option>General Inquiry</option>
                          <option>Investment & Partnership</option>
                          <option>Media & Press</option>
                          <option>Careers</option>
                          {verticals.map(v => <option key={v.id}>{v.name}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Message</label>
                        <textarea name="message" value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} rows="4" className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#00bf63] transition-colors resize-none" placeholder="How can we help you?" required></textarea>
                      </div>
                      {/* Netlify reCAPTCHA */}
                      <div data-netlify-recaptcha="true"></div>
                      <button type="submit" disabled={formStatus === 'submitting'} className="w-full bg-gradient-to-r from-[#00bf63] to-[#0a6cff] text-white font-bold py-4 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 flex justify-center items-center">
                        {formStatus === 'submitting' ? 'Sending...' : 'Submit Inquiry'}
                      </button>
                      
                      {/* Success and Error States */}
                      {formStatus === 'success' && (
                        <div className="p-4 bg-[#00bf63]/10 border border-[#00bf63] text-[#00bf63] rounded-lg text-center mt-4 font-medium">
                          Message sent successfully! We will be in touch.
                        </div>
                      )}
                      {formStatus === 'error' && (
                        <div className="p-4 bg-red-500/10 border border-red-500 text-red-500 rounded-lg text-center mt-4 font-medium">
                          Failed to send message. Please try again.
                        </div>
                      )}
                    </form>
                  </FadeInSection>

                  {/* Info Box */}
                  <FadeInSection delay={400} className="bg-gradient-to-br from-black to-gray-900 p-8 md:p-12 border-l border-gray-800 flex flex-col justify-between">
                    <div>
                      <h3 className="text-2xl font-bold mb-8 text-white">Global Headquarters</h3>
                      <div className="space-y-8">
                        <div className="flex items-start">
                          <div className="bg-gray-800 p-3 rounded-full mr-4 text-[#00bf63]">
                            <MapPin size={24} />
                          </div>
                          <div>
                            <h4 className="text-white font-semibold mb-1">Arvaron Group Holdings</h4>
                            <p className="text-gray-400 leading-relaxed">
                              Bandra Kurla Complex (BKC),<br />
                              Mumbai, Maharashtra 400051<br />
                              India
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <div className="bg-gray-800 p-3 rounded-full mr-4 text-[#0a6cff]">
                            <Mail size={24} />
                          </div>
                          <div>
                            <h4 className="text-white font-semibold mb-1">Email Us</h4>
                            <p className="text-gray-400">contact@arvarongroup.com</p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <div className="bg-gray-800 p-3 rounded-full mr-4 text-[#00bf63]">
                            <Phone size={24} />
                          </div>
                          <div>
                            <h4 className="text-white font-semibold mb-1">Call Us</h4>
                            <p className="text-gray-400">+91 22 1234 5678</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-12 pt-8 border-t border-gray-800">
                      <h4 className="text-white font-semibold mb-4">Connect With Us</h4>
                      <div className="flex space-x-4">
                        <a href="#" className="bg-gray-800 p-3 rounded-full text-white hover:bg-[#0a6cff] transition-colors"><Linkedin size={20} /></a>
                        <a href="#" className="bg-gray-800 p-3 rounded-full text-white hover:bg-black transition-colors border hover:border-white"><X size={20} /></a>
                      </div>
                    </div>
                  </FadeInSection>
                </div>
              </div>
            </section>
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="bg-[#050505] pt-20 pb-10 border-t border-gray-900 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            
            <div className="col-span-1 lg:col-span-1">
              <div className="flex items-center mb-6">
                <img 
                  src="Arvaron.png" 
                  alt="Arvaron Logo" 
                  className="h-8 object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
                  onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block'; }}
                />
                <span style={{display: 'none'}} className="text-2xl font-bold tracking-tighter text-white">ARVARON</span>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed mb-6">
                A leading investment and holding group registered in Mumbai, India. Empowering businesses through strategic capital and innovation across 7 core verticals globally.
              </p>
            </div>

            <div>
              <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">Quick Links</h4>
              <ul className="space-y-3">
                {navLinks.map(link => (
                  <li key={`footer-${link.id}`}>
                    <button onClick={() => navigateTo(link.id)} className="text-gray-500 hover:text-[#00bf63] transition-colors text-sm">
                      {link.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">Our Verticals</h4>
              <ul className="space-y-3">
                {verticals.slice(0, 5).map(v => (
                  <li key={`footer-${v.id}`}>
                    <button onClick={() => navigateTo('businesses')} className="text-gray-500 hover:text-[#0a6cff] transition-colors text-sm">
                      {v.name}
                    </button>
                  </li>
                ))}
                <li>
                  <button onClick={() => navigateTo('businesses')} className="text-gray-500 hover:text-[#0a6cff] transition-colors text-sm">
                    + More Verticals
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">Registered Office</h4>
              <address className="not-italic text-gray-500 text-sm space-y-2">
                <p>Arvaron Group Holdings Pvt. Ltd.</p>
                <p>Bandra Kurla Complex (BKC)</p>
                <p>Mumbai, Maharashtra 400051</p>
                <p>India</p>
                <p className="pt-4 text-[#0a6cff]">contact@arvarongroup.com</p>
              </address>
            </div>
            
          </div>
          
          <div className="border-t border-gray-900 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600 text-sm mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} Arvaron Group Holdings. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-600 hover:text-white text-sm transition-colors">Privacy Policy</a>
              <a href="#" className="text-gray-600 hover:text-white text-sm transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
