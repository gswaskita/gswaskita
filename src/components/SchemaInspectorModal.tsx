import React, { useState } from 'react';
import { 
  X, 
  Copy, 
  Check, 
  Sparkles, 
  ExternalLink, 
  ShieldCheck, 
  Network 
} from 'lucide-react';
import { SCHOLAR_DATA } from '../data/portfolioData';

interface SchemaInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SchemaInspectorModal: React.FC<SchemaInspectorModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const jsonLdSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": "https://gautamawaskita.ac.id/#person",
        "name": "Gautama Sastra Waskita",
        "jobTitle": "Lecturer & Operations Management Researcher",
        "description": "Researcher and author specializing in operations management, service quality, SME digitalization, and sustainable digital business for UK PhD inquiries.",
        "url": "https://gautamawaskita.ac.id",
        "sameAs": [
          `https://scholar.google.com/citations?user=${SCHOLAR_DATA.scholarId}&hl=id`,
          `https://orcid.org/${SCHOLAR_DATA.orcidId}`,
          `https://sinta.kemdiktisaintek.go.id/authors/profile/${SCHOLAR_DATA.sintaId}`,
          "https://www.researchgate.net/profile/Gautama-Waskita"
        ],
        "knowsAbout": [
          "Operations Management",
          "SME Digital Transformation",
          "Service Quality (SERVQUAL)",
          "Sustainable Hospitality Management",
          "Qualitative Visual Research Methods"
        ],
        "hasCredential": [
          {
            "@type": "EducationalOccupationalCredential",
            "name": "Master of Management (MM) in Operations Management"
          }
        ],
        "memberOf": [
          {
            "@type": "Organization",
            "name": "WKO Shinkyokushinkai Karate"
          },
          {
            "@type": "Organization",
            "name": "Persaudaraan Setia Hati Terate (PSHT)"
          },
          {
            "@type": "Organization",
            "name": "Pertina Boxing Federation"
          }
        ]
      },
      {
        "@type": "ProfilePage",
        "@id": "https://gautamawaskita.ac.id/#profilepage",
        "url": "https://gautamawaskita.ac.id",
        "name": "Gautama Sastra Waskita - Academic Portfolio & PhD Research",
        "mainEntity": {
          "@id": "https://gautamawaskita.ac.id/#person"
        }
      }
    ]
  };

  const schemaString = JSON.stringify(jsonLdSchema, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(schemaString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative max-w-3xl w-full max-h-[85vh] rounded-2xl bg-[#0A192F] border border-white/20 shadow-2xl flex flex-col overflow-hidden text-white">
        
        {/* Modal Header */}
        <div className="p-6 bg-slate-950/80 border-b border-white/15 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600/30 border border-emerald-400/40 flex items-center justify-center text-emerald-300">
              <Network className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-white flex items-center gap-2">
                <span>Google Knowledge Graph JSON-LD Schema</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 font-mono">
                  Schema.org v2.0
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                SEO Entity Building linking Scholar, ORCID, and SINTA to trigger Google Knowledge Panels.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Entity Triangulation Badges */}
        <div className="px-6 py-3 bg-blue-950/50 border-b border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
          <span className="text-slate-300 font-medium">Verified Knowledge Graph Nodes:</span>
          <div className="flex items-center gap-3 font-mono">
            <span className="text-blue-300">&bull; Scholar jUvO-FEAAAAJ</span>
            <span className="text-emerald-300">&bull; ORCID 0009-0003-6479-7936</span>
            <span className="text-amber-300">&bull; SINTA 6801795</span>
          </div>
        </div>

        {/* Schema Code Display */}
        <div className="flex-1 p-6 overflow-auto bg-[#071120] font-mono text-xs text-emerald-300 leading-relaxed">
          <pre className="whitespace-pre overflow-x-auto">
            <code>{schemaString}</code>
          </pre>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-950/80 border-t border-white/15 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            Automatically embedded inside <code className="text-blue-300">src/layouts/Layout.astro</code>
          </span>
          <button
            onClick={handleCopy}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white flex items-center gap-2 transition-all shadow-md shadow-blue-600/30"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Schema Copied!' : 'Copy JSON-LD'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
