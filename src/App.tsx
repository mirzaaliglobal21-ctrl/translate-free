import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { TranslationTool } from './components/TranslationTool';
import { SeoContentSection } from './components/SeoContentSection';
import { LanguagesDirectory } from './components/LanguagesDirectory';
import { AboutPage, ContactPage, PrivacyPage } from './components/StaticPages';
import { Footer } from './components/Footer';
import { AdminModal } from './components/AdminModal';
import { UrduGlyphsBackground } from './components/UrduGlyphsBackground';
import { POPULAR_SEO_PAIR_MAP, POPULAR_SEO_PAIRS, getSeoPair } from './data/seoPairs';
import { getPairImage } from './data/pairImages';
import { ArrowRight, Sparkles } from 'lucide-react';
import { getLanguage } from './data/languages';

// Helper for unique visitor ID tracking
function getVisitorId(): string {
  try {
    let vid = localStorage.getItem('urdu_visitor_id');
    if (!vid) {
      vid = 'v_' + Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
      localStorage.setItem('urdu_visitor_id', vid);
    }
    return vid;
  } catch {
    return 'v_guest';
  }
}

export default function App() {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return window.location.pathname || '/';
  });

  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>(() => {
    const saved = localStorage.getItem('urdu_theme');
    if (saved === 'light' || saved === 'dark' || saved === 'system') {
      return saved;
    }
    return 'dark';
  });

  const [activeSource, setActiveSource] = useState<string>('auto');
  const [activeTarget, setActiveTarget] = useState<string>('ur');
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    localStorage.setItem('urdu_theme', theme);

    if (theme === 'light') {
      root.classList.remove('dark');
    } else {
      root.classList.add('dark');
    }
  }, [theme]);

  const navigateTo = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
  };

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Track page visit on route changes for Admin Visitor Analytics
  useEffect(() => {
    const vid = getVisitorId();
    fetch('/api/track-visit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        path: currentPath,
        visitorId: vid,
      }),
    }).catch(() => {
      // Ignore background analytics error
    });
  }, [currentPath]);

  // Synchronize dynamic head metadata
  useEffect(() => {
    const cleanSlug = currentPath.replace(/^\//, '').split('#')[0];
    const seoConfig = getSeoPair(cleanSlug);

    const origin = window.location.origin;
    let title = 'Urdu Translate – All Language Translate';
    let description =
      'Translate Urdu, Roman Urdu, English and more than 100 other languages. Paste your text, pick the languages and get a clear translation in seconds.';

    if (seoConfig) {
      title = seoConfig.title;
      description = seoConfig.metaDescription;
      setActiveSource(seoConfig.sourceCode);
      setActiveTarget(seoConfig.targetCode);
    } else if (cleanSlug === 'languages') {
      title = '105 Languages Directory – Urdu Translate';
      description =
        'Explore all 105 world languages supported for bidirectional translation with Urdu, Roman Urdu, and English.';
    } else if (cleanSlug === 'about') {
      title = 'About Urdu Translate – Nastaliq Typography & AI Translation';
      description =
        'Learn how Urdu Translate combines Google Gemini AI and authentic Noto Nastaliq calligraphy for high-fidelity translation.';
    } else if (cleanSlug === 'contact') {
      title = 'Contact & Support – Urdu Translate';
      description =
        'Get in touch with the Urdu Translate engineering team for feedback, language requests, and inquiries.';
    } else if (cleanSlug === 'privacy') {
      title = 'Privacy Policy – Urdu Translate';
      description =
        'Read our strict privacy policy. Translations are processed securely via server proxy and stored only in your private browser.';
    } else {
      setActiveSource('auto');
      setActiveTarget('ur');
    }

    document.title = title;

    let metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', description);
    }

    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', title);

    let ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', description);

    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = `${origin}${currentPath}`;
  }, [currentPath]);

  const cleanSlug = currentPath.replace(/^\//, '').split('#')[0];
  const activeSeoPair = getSeoPair(cleanSlug);

  return (
    <div className="min-h-screen flex flex-col relative text-slate-100 antialiased selection:bg-[#d7a745]/30">
      {/* 
        Fixed Animated Hero Background across the entire site layout!
        "aur ju color hero berner ka he vo sari web ke leout ka ho aur berner web ke sath secrloe na ho"
        This stays locked in place while the content glides over it!
      */}
      <UrduGlyphsBackground />

      {/* Top right "R" admin button - strictly fixed on viewport */}
      <Header
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* Main Content Area: scrolls smoothly above the fixed animated background */}
      <main className="flex-1 relative z-10">
        {cleanSlug === 'languages' ? (
          <LanguagesDirectory
            onNavigate={navigateTo}
            onSelectLanguagePair={(src, tgt) => {
              setActiveSource(src);
              setActiveTarget(tgt);
            }}
          />
        ) : cleanSlug === 'about' ? (
          <AboutPage onNavigate={navigateTo} />
        ) : cleanSlug === 'contact' ? (
          <ContactPage onNavigate={navigateTo} />
        ) : cleanSlug === 'privacy' ? (
          <PrivacyPage onNavigate={navigateTo} />
        ) : (
          <>
            {/* Hero Section: "All Language Translate" */}
            <Hero
              customHeadline="All Language Translate"
              customTagline={
                activeSeoPair
                  ? `${getLanguage(activeSeoPair.sourceCode).name} to ${getLanguage(activeSeoPair.targetCode).name}, ${getLanguage(activeSeoPair.targetCode).name} to ${getLanguage(activeSeoPair.sourceCode).name}`
                  : 'Urdu to English, English to Urdu'
              }
              customSubtitle="Translate Urdu, Roman Urdu, English and more than 100 other languages. Paste your text, pick the languages and get a clear translation in seconds."
              onSelectFeature={(feat) => {
                if (feat === '105 languages') navigateTo('/languages');
              }}
            />

            {/* Translation Tool Card overlapping the Hero */}
            <TranslationTool
              initialSource={activeSource}
              initialTarget={activeTarget}
              onPairChange={(src, tgt) => {
                setActiveSource(src);
                setActiveTarget(tgt);
                const match = POPULAR_SEO_PAIRS.find(
                  (p) => p.sourceCode === src && p.targetCode === tgt
                );
                if (match) {
                  window.history.pushState({}, '', `/${match.slug}`);
                  setCurrentPath(`/${match.slug}`);
                }
              }}
            />

            {/* SEO Pair Content Section (if on a specific pair page) */}
            {activeSeoPair && (
              <SeoContentSection
                seoData={activeSeoPair}
                onNavigate={navigateTo}
              />
            )}

            {/* Popular Translation Pairs Showcase Grid on Homepage */}
            {!activeSeoPair && (
              <section id="popular-pairs" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4 pb-4 border-b border-[#0f3d37]">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0a3530] text-[#f0c25a] text-xs font-semibold uppercase tracking-wider mb-2 border border-[#164e45]">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Dedicated Pair Guides</span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                      Popular Urdu Translation Pairs
                    </h2>
                    <p className="text-sm text-emerald-200/70 mt-1">
                      Each language pair includes grammar guides, Nastaliq typography, and common FAQs.
                    </p>
                  </div>

                  <a
                    href="/languages"
                    onClick={(e) => {
                      e.preventDefault();
                      navigateTo('/languages');
                    }}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#f0c25a] hover:underline shrink-0"
                  >
                    <span>View all 105 languages</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {POPULAR_SEO_PAIRS.map((pair) => (
                    <a
                      key={pair.slug}
                      href={`/${pair.slug}`}
                      onClick={(e) => {
                        e.preventDefault();
                        navigateTo(`/${pair.slug}`);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="p-3.5 sm:p-4 rounded-[20px] bg-[#135d52]/85 backdrop-blur-xl border border-[#2ea08f] hover:border-[#ffe07a] hover:bg-[#1a7366] transition-all group shadow-md hover:shadow-xl flex flex-col justify-between"
                    >
                      <div>
                        {/* AI Generated Pair Illustration with English HUD Display */}
                        <div className="relative w-full aspect-video rounded-xl overflow-hidden mb-3.5 border border-[#3ea696]/60 bg-[#0d473e] group-hover:border-[#ffe07a]/80 transition-all shadow-inner">
                          <img
                            src={getPairImage(pair.slug)}
                            alt={pair.h1}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/35 pointer-events-none" />

                          {/* Top English Tags inside the picture */}
                          <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold font-mono bg-emerald-950/85 backdrop-blur-md text-emerald-300 border border-emerald-500/40 uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                              {pair.sourceCode.toUpperCase()} → {pair.targetCode.toUpperCase()}
                            </span>
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold font-mono bg-black/75 backdrop-blur-md text-[#ffe07a] border border-[#ffe07a]/40 uppercase tracking-wider shadow-sm">
                              DIGITAL AI
                            </span>
                          </div>

                          {/* Bottom English Title inside the picture */}
                          <div className="absolute bottom-2.5 left-2.5 right-2.5 pointer-events-none">
                            <div className="px-2.5 py-1.5 rounded-lg bg-black/80 backdrop-blur-md border border-white/15 shadow-lg flex items-center justify-between">
                              <p className="font-extrabold text-xs sm:text-sm text-white tracking-wide uppercase drop-shadow flex items-center gap-1.5">
                                <span className="text-[#ffe07a] font-black">✦</span>
                                {pair.h1.replace(' Translation', '')}
                              </p>
                              <span className="text-[10px] font-bold text-emerald-400 font-mono tracking-wider">
                                FREE
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between mb-2">
                          <span className="font-bold text-base sm:text-lg text-white group-hover:text-[#ffe07a] transition-colors leading-snug">
                            {pair.h1}
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm text-emerald-100/80 line-clamp-2 leading-relaxed">
                          {pair.metaDescription}
                        </p>
                      </div>
                      <div className="mt-4 pt-3 border-t border-[#23786a] flex items-center justify-between text-xs font-semibold text-[#ffe07a]">
                        <span>Translate & Read Guide</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </a>
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </main>

      {/* Footer with mandatory disclaimer */}
      <div className="relative z-10">
        <Footer
          onNavigate={navigateTo}
          onOpenAdmin={() => setIsAdminOpen(true)}
        />
      </div>

      {/* Admin Modal Dialog */}
      <AdminModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
      />
    </div>
  );
}
