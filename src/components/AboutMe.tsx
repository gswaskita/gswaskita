import React from 'react';
import { 
  Compass, 
  Lightbulb, 
  Eye, 
  Target, 
  BookMarked, 
  Layers, 
  Workflow 
} from 'lucide-react';

export const AboutMe: React.FC = () => {
  return (
    <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/10">
      
      {/* Section Heading */}
      <div className="max-w-3xl mb-12 space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-white/10 border border-white/15 text-xs font-semibold text-blue-300">
          <Compass className="w-3.5 h-3.5" />
          <span>Academic Foundation &amp; Research Pillars</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-light tracking-tight text-white">
          About <span className="font-bold text-blue-400">Me</span>
        </h2>
        <p className="text-sm text-slate-400">
          Bridging operational rigor with qualitative depth for doctoral inquiries in the United Kingdom.
        </p>
      </div>

      {/* Two Paragraph Glassmorphic Bento Cards in Editorial Styling */}
      <div className="grid md:grid-cols-2 gap-8">
        
        {/* Paragraph 1: Operations Management & Consumer Behavior */}
        <div className="p-7 sm:p-9 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-xl text-white space-y-6 hover:border-white/40 transition-all flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-xl bg-blue-600/30 border border-white/20 flex items-center justify-center text-blue-300 shadow-inner">
                <Workflow className="w-6 h-6" />
              </div>
              <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-slate-300">
                Pillar 01
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-white leading-snug">
              Operations Management &amp; Consumer Behavior
            </h3>

            <p className="text-slate-200 text-sm sm:text-base leading-relaxed">
              My academic career is devoted to bridging operations management with consumer behavior dynamics. Over years of university lecturing and field investigation, I have rigorously examined banking service quality (SERVQUAL / E-SERVQUAL dimensions) and the complex operational realities of digital transformation within Small and Medium Enterprises (SMEs) and family-owned enterprises.
            </p>

            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed italic font-editorial-serif text-base">
              &ldquo;By deconstructing how digital friction disrupts consumer trust in automated interfaces, my published research offers operational frameworks that balance technological speed with human-centric service recovery.&rdquo;
            </p>
          </div>

          <div className="pt-4 border-t border-white/15 flex flex-wrap gap-2">
            <span className="text-xs px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-blue-200 font-medium">
              E-Service Quality
            </span>
            <span className="text-xs px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-blue-200 font-medium">
              SME Digital Readiness
            </span>
            <span className="text-xs px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-blue-200 font-medium">
              Family Enterprise Ops
            </span>
          </div>
        </div>

        {/* Paragraph 2: Qualitative Research & Visual Conceptualization */}
        <div className="p-7 sm:p-9 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-xl text-white space-y-6 hover:border-white/40 transition-all flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-xl bg-indigo-600/30 border border-white/20 flex items-center justify-center text-indigo-300 shadow-inner">
                <Eye className="w-6 h-6" />
              </div>
              <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-slate-300">
                Pillar 02
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-white leading-snug">
              Qualitative Rigor &amp; Upcoming PhD Vision
            </h3>

            <p className="text-slate-200 text-sm sm:text-base leading-relaxed">
              A distinctive strength of my scholarly work is a deep mastery of qualitative field methodologies and visual conceptualization. Rather than treating operational workflows as abstract formulas, I employ diagrammatic process mapping and grounded visual theory to capture non-linear logistics bottlenecks and social dynamics in emerging economy supply networks.
            </p>

            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed italic font-editorial-serif text-base">
              &ldquo;My forthcoming PhD research at a UK institution aims to advance sustainable operations, circular value chains, and managerial dynamic capabilities under severe volatility.&rdquo;
            </p>
          </div>

          <div className="pt-4 border-t border-white/15 flex flex-wrap gap-2">
            <span className="text-xs px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-indigo-200 font-medium">
              Visual Qualitative Methods
            </span>
            <span className="text-xs px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-indigo-200 font-medium">
              Circular Value Chains
            </span>
            <span className="text-xs px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-indigo-200 font-medium">
              UK PhD Alignment
            </span>
          </div>
        </div>

      </div>

      {/* PhD Aspirations Summary Banner */}
      <div className="mt-8 p-6 sm:p-7 rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 border border-white/20 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
              Doctoral Research Proposal Focus
            </span>
          </div>
          <p className="text-sm font-bold text-white leading-relaxed">
            &ldquo;Sustaining Dynamic Capabilities in Decentralized SME Value Networks: A Multi-Method Qualitative Investigation&rdquo;
          </p>
        </div>
        <a
          href="#scholar"
          className="shrink-0 px-5 py-2.5 rounded-full bg-white text-blue-950 hover:bg-blue-50 text-xs font-bold transition-all shadow"
        >
          Explore Published Papers &rarr;
        </a>
      </div>

    </section>
  );
};
