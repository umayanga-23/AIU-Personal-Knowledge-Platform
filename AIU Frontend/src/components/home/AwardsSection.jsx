import React, { useState, useEffect } from 'react';
import { Award, ExternalLink, Eye, X, FileText } from 'lucide-react';
import { pdfStorage } from '../../utils/pdfStorage';

export function AwardsSection({ awards }) {
  const [selectedMedia, setSelectedMedia] = useState(null); // { url, title, isPdf }
  const [hydratedAwards, setHydratedAwards] = useState([]);

  const defaultAwards = [
    {
      id: "award-1",
      title: "HackElite 2.0 Finalist",
      issuer: "LevelUp LMS EdTech Project - IEEE WIE Student Affinity Group",
      year: "2026",
      imageUrl: "https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?auto=format&fit=crop&w=800&q=80",
      credentialUrl: "https://ieee.org"
    },
    {
      id: "award-2",
      title: "InspiHER{Tech} V3.0 Finalist",
      issuer: "IEEE WIE Student Branch Affinity Group (SLTC)",
      year: "2026",
      imageUrl: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&w=800&q=80",
      credentialUrl: "https://ieee.org"
    },
    {
      id: "award-3",
      title: "Innovate with Ballerina Coding Challenge",
      issuer: "IEEE CS Student Branch Chapter & WSO2",
      year: "2025",
      imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
      credentialUrl: "https://wso2.com"
    },
    {
      id: "award-4",
      title: "Introduction to SQL Certification",
      issuer: "Sololearn",
      year: "2025",
      imageUrl: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80",
      credentialUrl: "https://sololearn.com"
    },
    {
      id: "award-5",
      title: "FIT Expo Active Participant",
      issuer: "Lora10 Microcontroller Project - IT Faculty",
      year: "2025",
      imageUrl: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80",
      credentialUrl: ""
    }
  ];

  useEffect(() => {
    const list = awards || [];
    const hydrate = async () => {
      const items = await Promise.all(
        list.map(async (item) => {
          let img = item.imageUrl;
          let cred = item.credentialUrl;
          if (img === 'PERSISTED_IN_INDEXEDDB') {
            const dbImg = await pdfStorage.getPdf('award_img_' + item.id);
            if (dbImg) img = dbImg;
          }
          if (cred === 'PERSISTED_IN_INDEXEDDB') {
            const dbCred = await pdfStorage.getPdf('award_cred_' + item.id);
            if (dbCred) cred = dbCred;
          }
          return { ...item, imageUrl: img, credentialUrl: cred };
        })
      );
      setHydratedAwards(items);
    };
    hydrate();
  }, [awards]);

  const isPdf = (url = '') => {
    return url && (url.startsWith('data:application/pdf') || url.toLowerCase().includes('.pdf'));
  };

  const createBlobUrl = (dataUrl) => {
    if (!dataUrl) return '';
    if (dataUrl.startsWith('http') || dataUrl.startsWith('blob:')) return dataUrl;
    try {
      const parts = dataUrl.split(';base64,');
      const type = parts[0].replace('data:', '') || 'application/pdf';
      const base64Str = parts[1] || parts[0];
      const binaryStr = atob(base64Str);
      const len = binaryStr.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryStr.charCodeAt(i);
      }
      const blob = new Blob([bytes], { type });
      return URL.createObjectURL(blob);
    } catch (e) {
      return dataUrl;
    }
  };

  const handleOpenPreview = (url, title, checkPdf = false) => {
    if (!url) return;
    const pdfCheck = checkPdf || isPdf(url);
    const viewUrl = pdfCheck ? createBlobUrl(url) : url;
    setSelectedMedia({ url: viewUrl, title, isPdf: pdfCheck });
  };

  return (
    <section id="awards" className="py-20 border-t border-obsidian-border bg-obsidian-base relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10 font-sans">
        {/* Header */}
        <div>
          <span className="text-xs font-mono text-cyan uppercase tracking-widest flex items-center gap-2 mb-2">
            <Award className="w-4 h-4 text-cyan" /> [ HONORS & RECOGNITION ]
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-typo-primary tracking-tight">
            Certifications & Awards
          </h2>
        </div>

        {/* Awards Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hydratedAwards.map((award, idx) => {
            const hasPdf = isPdf(award.imageUrl) || isPdf(award.credentialUrl);
            const pdfUrl = isPdf(award.imageUrl) ? award.imageUrl : award.credentialUrl;

            return (
              <div
                key={award.id || idx}
                className="glass-card-hover p-6 rounded-2xl flex flex-col justify-between space-y-5 group relative border border-obsidian-border hover:border-cyan/40 transition-all duration-300 shadow-xl"
              >
                {/* PDF Certificate Badge / Image Banner */}
                {hasPdf ? (
                  <div className="relative w-full h-36 rounded-xl overflow-hidden bg-emerald-500/10 border border-emerald-500/30 p-4 flex flex-col items-center justify-center text-center space-y-2">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-emerald-400" />
                    </div>
                    <span className="text-xs font-mono text-emerald-400 font-bold">PDF Certificate Document</span>
                    <button
                      onClick={() => handleOpenPreview(pdfUrl, award.title, true)}
                      className="px-4 py-1.5 rounded-xl bg-cyan text-slate-950 text-xs font-mono font-extrabold shadow-glow-cyan hover:bg-cyan-dark transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-slate-950" /> View Certificate PDF
                    </button>
                  </div>
                ) : award.imageUrl && !award.imageUrl.startsWith('data:application/pdf') ? (
                  <div className="relative w-full h-40 rounded-xl overflow-hidden bg-black/50 border border-cyan/20 group-hover:border-cyan/50 transition-all">
                    <img
                      src={award.imageUrl}
                      alt={award.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-obsidian-base via-transparent to-transparent opacity-60" />
                    
                    {/* Image View Badge Overlay */}
                    <button
                      onClick={() => handleOpenPreview(award.imageUrl, award.title, false)}
                      className="absolute top-3 right-3 px-3 py-1.5 rounded-xl bg-obsidian-base/80 backdrop-blur-md text-cyan text-[11px] font-mono border border-cyan/30 hover:bg-cyan hover:text-obsidian-base transition-all flex items-center gap-1.5 shadow-lg cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" /> View Certificate
                    </button>
                  </div>
                ) : null}

                {/* Title & Organization Details */}
                <div className="space-y-3 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan border border-cyan-500/20 group-hover:scale-110 transition-transform shadow-glow-cyan">
                        <Award className="w-4 h-4" />
                      </div>
                      <h3 className="font-bold text-base text-typo-primary group-hover:text-cyan transition-colors leading-snug">{award.title}</h3>
                    </div>

                    <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold bg-obsidian-surface text-cyan border border-obsidian-border shrink-0">
                      {award.year}
                    </span>
                  </div>

                  <p className="text-xs text-typo-secondary font-sans leading-relaxed pl-1">{award.issuer}</p>
                </div>

                {/* Action Links */}
                {award.credentialUrl && !isPdf(award.credentialUrl) && (
                  <div className="pt-3 border-t border-obsidian-border flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => handleOpenPreview(award.credentialUrl, award.title, false)}
                      className="inline-flex items-center gap-1.5 text-xs font-mono text-cyan hover:text-typo-primary transition-colors cursor-pointer"
                    >
                      <span>View Credential</span>
                      <ExternalLink className="w-3.5 h-3.5 text-cyan" />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Certificate Viewer Lightbox Modal (For Images & PDF Documents) */}
      {selectedMedia && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="relative max-w-5xl w-full glass-card p-4 sm:p-6 rounded-3xl border border-cyan/40 shadow-2xl space-y-4 max-h-[92vh] flex flex-col">
            <div className="flex items-center justify-between px-2 shrink-0">
              <h3 className="text-base font-bold text-typo-primary font-mono flex items-center gap-2">
                <Award className="w-5 h-5 text-cyan" /> {selectedMedia.title}
              </h3>
              <button
                onClick={() => {
                  if (selectedMedia.isPdf && selectedMedia.url.startsWith('blob:')) {
                    URL.revokeObjectURL(selectedMedia.url);
                  }
                  setSelectedMedia(null);
                }}
                className="p-2 rounded-xl bg-obsidian-surface border border-obsidian-border text-typo-secondary hover:text-cyan transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="w-full flex-1 min-h-[60vh] max-h-[75vh] overflow-hidden rounded-2xl bg-black/90 border border-obsidian-border flex items-center justify-center">
              {selectedMedia.isPdf ? (
                <iframe
                  src={selectedMedia.url}
                  title={selectedMedia.title}
                  className="w-full h-full min-h-[60vh] rounded-2xl border-none"
                />
              ) : (
                <img
                  src={selectedMedia.url}
                  alt={selectedMedia.title}
                  className="w-full h-full object-contain max-h-[75vh]"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
