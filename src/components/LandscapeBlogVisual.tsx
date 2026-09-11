import React, { useState } from 'react';
import { Image, Layers, Maximize2, ExternalLink, Sparkles, Activity, Workflow, ShieldCheck, Database, Compass } from 'lucide-react';
import type { BlogPost, ThemeMode } from '../types';
import { useTheme } from '../utils/useTheme';

interface LandscapeBlogVisualProps {
  post: BlogPost;
  theme?: ThemeMode;
  variant?: 'card' | 'hero' | 'compact';
  showToggle?: boolean;
  className?: string;
  onClick?: () => void;
}

export const LandscapeBlogVisual: React.FC<LandscapeBlogVisualProps> = ({
  post,
  theme: propTheme,
  variant = 'card',
  showToggle = false,
  className = '',
  onClick
}) => {
  const theme = useTheme(propTheme);
  const isDark = theme === 'dark';
  const [imageError, setImageError] = useState(false);
  const [viewMode, setViewMode] = useState<'image' | 'illustration'>(
    post.coverImage ? 'image' : 'illustration'
  );

  const hasImage = Boolean(post.coverImage && !imageError);

  // Render SVG landscape illustration tailored to category or illustrationType
  const renderIllustration = () => {
    const type = post.illustrationType || 
      (post.category.toLowerCase().includes('sme') || post.category.toLowerCase().includes('phd') ? 'supply-chain' :
       post.category.toLowerCase().includes('banking') || post.category.toLowerCase().includes('service') ? 'analytics' :
       post.category.toLowerCase().includes('method') || post.category.toLowerCase().includes('visual') ? 'qualitative' :
       post.category.toLowerCase().includes('hospitality') ? 'hospitality' : 'operations');

    return (
      <div className={`w-full h-full relative overflow-hidden flex items-center justify-center p-2 sm:p-4 md:p-6 min-w-0 max-w-full ${
        isDark 
          ? 'bg-gradient-to-br from-slate-900 via-blue-950/80 to-slate-950 text-slate-200' 
          : 'bg-gradient-to-br from-slate-100 via-blue-50/70 to-indigo-50 text-slate-800'
      }`}>
        {/* Subtle grid background pattern */}
        <div 
          className="absolute inset-0 opacity-20 pointer-events-none" 
          style={{
            backgroundImage: `radial-gradient(${isDark ? '#60a5fa' : '#3b82f6'} 1px, transparent 1px)`,
            backgroundSize: '20px 20px'
          }}
        />

        {/* Ambient Glow */}
        <div className="absolute -top-4 -right-4 w-36 sm:w-48 h-36 sm:h-48 bg-blue-500/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-4 -left-4 w-36 sm:w-48 h-36 sm:h-48 bg-emerald-500/15 rounded-full blur-2xl pointer-events-none" />

        {/* Content based on illustration schematic */}
        {type === 'supply-chain' && (
          <div className="relative z-10 w-full max-w-lg flex flex-col items-center justify-center space-y-2 sm:space-y-4 min-w-0">
            <div className="flex items-center justify-between w-full px-0.5 sm:px-4 gap-1 sm:gap-2 min-w-0">
              <div className={`p-1.5 sm:p-3 rounded-lg sm:rounded-xl border flex flex-col items-center text-center shadow transition-transform hover:scale-105 min-w-0 ${
                isDark ? 'bg-slate-900/90 border-blue-400/30' : 'bg-white border-blue-200 shadow-sm'
              }`}>
                <Database className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-blue-400 mb-0.5 sm:mb-1" />
                <span className="text-[8px] sm:text-[10px] font-mono font-bold uppercase tracking-wider text-blue-500 truncate max-w-[60px] sm:max-w-none">Tier-1 Node</span>
                <span className="text-[9px] sm:text-xs font-semibold truncate max-w-[68px] sm:max-w-none">SME Origin</span>
              </div>

              <div className="flex-1 flex flex-col items-center px-1 min-w-0">
                <span className="text-[8px] sm:text-[9px] font-mono text-slate-400 mb-0.5 hidden xs:inline">Flow</span>
                <div className="w-full h-0.5 bg-gradient-to-r from-blue-500 via-emerald-400 to-indigo-500 relative">
                  <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full bg-emerald-400 animate-ping" />
                </div>
              </div>

              <div className={`p-1.5 sm:p-3 rounded-lg sm:rounded-xl border flex flex-col items-center text-center shadow transition-transform hover:scale-105 min-w-0 ${
                isDark ? 'bg-slate-900/90 border-emerald-400/30' : 'bg-white border-emerald-200 shadow-sm'
              }`}>
                <Workflow className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-emerald-400 mb-0.5 sm:mb-1" />
                <span className="text-[8px] sm:text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-500 truncate max-w-[60px] sm:max-w-none">Processing</span>
                <span className="text-[9px] sm:text-xs font-semibold truncate max-w-[68px] sm:max-w-none">Agility Hub</span>
              </div>

              <div className="flex-1 flex flex-col items-center px-1 min-w-0">
                <span className="text-[8px] sm:text-[9px] font-mono text-slate-400 mb-0.5 hidden xs:inline">Loop</span>
                <div className="w-full h-0.5 bg-gradient-to-r from-emerald-400 to-purple-500" />
              </div>

              <div className={`p-1.5 sm:p-3 rounded-lg sm:rounded-xl border flex flex-col items-center text-center shadow transition-transform hover:scale-105 min-w-0 ${
                isDark ? 'bg-slate-900/90 border-purple-400/30' : 'bg-white border-purple-200 shadow-sm'
              }`}>
                <Compass className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-purple-400 mb-0.5 sm:mb-1" />
                <span className="text-[8px] sm:text-[10px] font-mono font-bold uppercase tracking-wider text-purple-500 truncate max-w-[60px] sm:max-w-none">Sink</span>
                <span className="text-[9px] sm:text-xs font-semibold truncate max-w-[68px] sm:max-w-none">Trust</span>
              </div>
            </div>

            <div className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[9px] sm:text-[10px] font-mono border flex items-center gap-1.5 max-w-full min-w-0 overflow-hidden ${
              isDark ? 'bg-white/5 border-white/10 text-slate-300' : 'bg-white/80 border-slate-200 text-slate-600'
            }`}>
              <Sparkles className="w-3 h-3 text-blue-400 shrink-0" />
              <span className="truncate">Grounded Operations &bull; UK Doctoral Research Diagram</span>
            </div>
          </div>
        )}

        {type === 'analytics' && (
          <div className="relative z-10 w-full max-w-md flex flex-col items-center justify-center space-y-2 sm:space-y-3 min-w-0">
            <div className="grid grid-cols-3 gap-1.5 sm:gap-3 w-full min-w-0">
              <div className={`p-1.5 sm:p-2.5 rounded-lg sm:rounded-xl border text-center ${
                isDark ? 'bg-slate-900/80 border-blue-400/30' : 'bg-white border-blue-200 shadow-sm'
              }`}>
                <span className="text-[8px] sm:text-[9px] font-mono text-slate-400 uppercase block truncate">E-SERVQUAL</span>
                <p className="text-xs sm:text-sm font-bold text-blue-500 truncate">4.2 &rarr; 1.1</p>
                <span className="text-[8px] sm:text-[9px] text-emerald-500 font-semibold block truncate">&uarr; -74%</span>
              </div>

              <div className={`p-1.5 sm:p-2.5 rounded-lg sm:rounded-xl border text-center ${
                isDark ? 'bg-slate-900/80 border-emerald-400/30' : 'bg-white border-emerald-200 shadow-sm'
              }`}>
                <span className="text-[8px] sm:text-[9px] font-mono text-slate-400 uppercase block truncate">SLA</span>
                <p className="text-xs sm:text-sm font-bold text-emerald-500 truncate">&lt; 45 Sec</p>
                <span className="text-[8px] sm:text-[9px] text-slate-400 block truncate">Human</span>
              </div>

              <div className={`p-1.5 sm:p-2.5 rounded-lg sm:rounded-xl border text-center ${
                isDark ? 'bg-slate-900/80 border-purple-400/30' : 'bg-white border-purple-200 shadow-sm'
              }`}>
                <span className="text-[8px] sm:text-[9px] font-mono text-slate-400 uppercase block truncate">Trust</span>
                <p className="text-xs sm:text-sm font-bold text-purple-500 truncate">94.8%</p>
                <span className="text-[8px] sm:text-[9px] text-purple-400 font-semibold block truncate">Index</span>
              </div>
            </div>

            <div className={`w-full p-2 sm:p-2.5 rounded-lg sm:rounded-xl border flex items-center justify-between text-[10px] sm:text-xs font-mono ${
              isDark ? 'bg-slate-900/90 border-white/10' : 'bg-white border-slate-200'
            }`}>
              <span className="flex items-center gap-1 text-blue-400 truncate">
                <ShieldCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
                <span className="truncate">Algorithmic Trust Triangulation</span>
              </span>
              <span className="text-[9px] sm:text-[10px] text-slate-400 shrink-0">n = 1,200</span>
            </div>
          </div>
        )}

        {type !== 'supply-chain' && type !== 'analytics' && (
          <div className="relative z-10 text-center space-y-1.5 sm:space-y-2 max-w-sm px-2">
            <div className="inline-flex p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-blue-500/10 border border-blue-500/30 text-blue-400">
              <Layers className="w-4 h-4 sm:w-6 sm:h-6" />
            </div>
            <h4 className="text-xs sm:text-sm font-bold tracking-tight">Qualitative Visual Epistemology</h4>
            <p className="text-[10px] sm:text-xs text-slate-400 leading-relaxed font-mono line-clamp-2">
              Diagrammatic Mapping &bull; Grounded Visual Coding &bull; Multi-Case Triangulation
            </p>
          </div>
        )}
      </div>
    );
  };

  const isHero = variant === 'hero';

  return (
    <div className={`w-full overflow-hidden relative group ${
      isHero 
        ? 'rounded-2xl border shadow-xl' 
        : 'rounded-xl border'
    } ${
      isDark 
        ? 'border-white/15 bg-slate-900/60' 
        : 'border-slate-200 bg-slate-50'
    } ${className}`}>
      
      {/* 16:9 Landscape Aspect Ratio Box */}
      <div 
        onClick={onClick}
        className={`w-full relative aspect-[16/9] overflow-hidden min-w-0 max-w-full ${onClick ? 'cursor-pointer' : ''}`}
      >
        {viewMode === 'image' && hasImage ? (
          <div className="w-full h-full relative overflow-hidden bg-slate-900">
            <img
              src={post.coverImage}
              alt={post.title}
              onError={() => setImageError(true)}
              className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
              loading={isHero || variant === 'hero' ? 'eager' : 'lazy'}
            />
            {/* Subtle Gradient Shade for Text Readability and Contrast */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

            {/* Top Right Badges */}
            <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-black/60 backdrop-blur-md text-white border border-white/20">
                Landscape {variant === 'hero' ? 'HD Photo' : '16:9'}
              </span>
            </div>

            {/* Bottom Left Category & Post Title Overlay for Compact or Hero */}
            {isHero && (
              <div className="absolute bottom-3 left-4 right-4 z-10 flex items-center justify-between text-white/90">
                <span className="text-xs font-mono text-slate-200 flex items-center gap-1.5 drop-shadow">
                  <Image className="w-3.5 h-3.5 text-blue-400" />
                  <span>{post.imageCaption || `Empirical Fieldwork & Research: ${post.category}`}</span>
                </span>
              </div>
            )}
          </div>
        ) : (
          renderIllustration()
        )}

        {/* Mode Toggle Button if image exists and showToggle enabled */}
        {showToggle && post.coverImage && !imageError && (
          <div className="absolute bottom-3 right-3 z-20">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setViewMode(prev => prev === 'image' ? 'illustration' : 'image');
              }}
              className="px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold flex items-center gap-1.5 transition-all bg-black/70 hover:bg-black/90 text-white border border-white/25 backdrop-blur-md shadow-lg"
              title="Toggle Photo / Schematic Illustration"
            >
              {viewMode === 'image' ? (
                <>
                  <Layers className="w-3 h-3 text-emerald-400" />
                  <span>Show Schematic</span>
                </>
              ) : (
                <>
                  <Image className="w-3 h-3 text-blue-400" />
                  <span>Show Photo</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Caption footer for Hero Variant */}
      {isHero && post.imageCaption && (
        <div className={`px-4 py-2 border-t text-[11px] font-mono flex items-center justify-between ${
          isDark ? 'border-white/10 bg-white/5 text-slate-400' : 'border-slate-200 bg-slate-50 text-slate-600'
        }`}>
          <span className="italic flex items-center gap-1.5">
            <span>&bull;</span>
            <span>{post.imageCaption}</span>
          </span>
          <span className="text-[10px] text-blue-500 font-semibold uppercase tracking-wider">
            Verified Scholarly Visual
          </span>
        </div>
      )}
    </div>
  );
};
