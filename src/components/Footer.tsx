import React from 'react';
import { ArrowUpRight, Heart, Shield, Globe } from 'lucide-react';
import { POPULAR_SEO_PAIRS } from '../data/seoPairs';

interface FooterProps {
  onNavigate: (path: string) => void;
  onOpenAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenAdmin }) => {
  const handleLink = (e: React.MouseEvent, path: string) => {
    e.preventDefault();
    onNavigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#104d43]/95 text-emerald-100 border-t border-[#238173] pt-14 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Machine Translation Disclaimer Banner */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#165a4f] border border-[#2ea08f] text-center mb-12 max-w-3xl mx-auto shadow-xs">
          <p className="text-xs sm:text-sm font-medium text-emerald-100/90 leading-relaxed">
            &ldquo;Machine translation can make mistakes. Check names, numbers, and legal or medical text before you rely on it.&rdquo;
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Column */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#e8b950] to-[#c9942a] flex items-center justify-center text-[#061e1c] font-nastaliq font-bold text-xl leading-none pt-0.5">
                ا
              </div>
              <span className="text-lg font-bold text-white font-sans tracking-tight">
                Urdu Translate
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Premium, neural translation between Urdu script, conversational Roman Urdu, English, and 105 world languages.
            </p>
            <p dir="rtl" className="font-nastaliq text-base text-[#d7a745] leading-loose">
              اردو زبان کی خدمت کے لیے وقف
            </p>
          </div>

          {/* Popular Pairs Column 1 */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#e8b950] mb-3">
              Core Urdu Pairs
            </h3>
            <ul className="space-y-2 text-xs">
              {POPULAR_SEO_PAIRS.slice(0, 5).map((pair) => (
                <li key={pair.slug}>
                  <a
                    href={`/${pair.slug}`}
                    onClick={(e) => handleLink(e, `/${pair.slug}`)}
                    className="hover:text-white transition-colors flex items-center justify-between group"
                  >
                    <span>{pair.h1}</span>
                    <ArrowUpRight className="w-3 h-3 text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular Pairs Column 2 */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#e8b950] mb-3">
              Regional & World Pairs
            </h3>
            <ul className="space-y-2 text-xs">
              {POPULAR_SEO_PAIRS.slice(5, 10).map((pair) => (
                <li key={pair.slug}>
                  <a
                    href={`/${pair.slug}`}
                    onClick={(e) => handleLink(e, `/${pair.slug}`)}
                    className="hover:text-white transition-colors flex items-center justify-between group"
                  >
                    <span>{pair.h1}</span>
                    <ArrowUpRight className="w-3 h-3 text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links Column */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#e8b950] mb-3">
              Site Navigation
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href="/languages"
                  onClick={(e) => handleLink(e, '/languages')}
                  className="hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <Globe className="w-3.5 h-3.5 text-slate-400" />
                  <span>105 Languages Directory</span>
                </a>
              </li>
              <li>
                <a
                  href="/about"
                  onClick={(e) => handleLink(e, '/about')}
                  className="hover:text-white transition-colors"
                >
                  About Our Engine & Typography
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  onClick={(e) => handleLink(e, '/contact')}
                  className="hover:text-white transition-colors"
                >
                  Contact & Support
                </a>
              </li>
              <li>
                <a
                  href="/privacy"
                  onClick={(e) => handleLink(e, '/privacy')}
                  className="hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <Shield className="w-3.5 h-3.5 text-slate-400" />
                  <span>Privacy Policy</span>
                </a>
              </li>
              <li>
                <a
                  href="/sitemap.xml"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors text-slate-400"
                >
                  XML Sitemap
                </a>
              </li>
              {onOpenAdmin && (
                <li>
                  <button
                    onClick={onOpenAdmin}
                    className="hover:text-[#ffe07a] transition-colors text-slate-400 flex items-center gap-1.5 cursor-pointer"
                  >
                    <span className="w-4 h-4 rounded-full bg-gradient-to-br from-[#ffe07a] to-[#c9942a] text-[#061e1c] font-black text-[9px] flex items-center justify-center">
                      R
                    </span>
                    <span>Admin Dashboard</span>
                  </button>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-[#0e302b] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Urdu Translate. All rights reserved.</p>
          <div className="flex items-center gap-3">
            {onOpenAdmin && (
              <button
                onClick={onOpenAdmin}
                className="text-emerald-400/60 hover:text-[#ffe07a] text-[11px] font-mono transition-colors cursor-pointer"
              >
                [Admin Analytics]
              </button>
            )}
            <p className="flex items-center gap-1 text-slate-400">
              <span>Crafted for Urdu & South Asian linguistic clarity</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
