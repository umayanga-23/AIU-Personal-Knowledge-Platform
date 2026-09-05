import React, { useState } from 'react';
import { Mail, Phone, Github, Linkedin, Send, CheckCircle } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export function ContactSection({ profile }) {
  const { addToast } = useToast();
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    addToast('Thank you! Your message has been sent successfully.', 'success');
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <section id="contact" className="py-24 border-t border-obsidian-border bg-obsidian-base relative overflow-hidden">
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-cyan-500/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
        {/* Header */}
        <div>
          <span className="text-xs font-mono text-cyan uppercase tracking-widest flex items-center gap-2 mb-2">
            <Mail className="w-4 h-4 text-cyan" /> [ GET IN TOUCH ]
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-typo-primary tracking-tight">
            Let's Work Together
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Contact Form */}
          <div className="lg:col-span-7 glass-card p-8 rounded-2xl space-y-6">
            {submitted ? (
              <div className="p-8 text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center shadow-glow-emerald">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-typo-primary">Message Sent Successfully!</h3>
                <p className="text-xs text-typo-secondary max-w-md mx-auto">
                  Thank you for reaching out, Induwara will get back to you shortly.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-5 py-2.5 rounded-xl bg-obsidian-surface border border-obsidian-border text-cyan text-xs font-semibold hover:border-cyan/30 transition-all font-mono"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="text-xs font-mono text-typo-secondary mb-2 block">Your Name</label>
                  <input
                    type="text"
                    required
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-obsidian-surface/80 border border-obsidian-border text-typo-primary text-sm focus:outline-none focus:border-cyan focus:ring-1 focus:ring-cyan transition-all"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono text-typo-secondary mb-2 block">Your Email</label>
                  <input
                    type="email"
                    required
                    placeholder="john@company.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-obsidian-surface/80 border border-obsidian-border text-typo-primary text-sm focus:outline-none focus:border-cyan focus:ring-1 focus:ring-cyan transition-all"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono text-typo-secondary mb-2 block">Message</label>
                  <textarea
                    required
                    rows="4"
                    placeholder="Tell me about your project or opportunity..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-obsidian-surface/80 border border-obsidian-border text-typo-primary text-sm focus:outline-none focus:border-cyan focus:ring-1 focus:ring-cyan transition-all resize-y"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-cyan to-indigo hover:from-cyan-dark hover:to-indigo text-slate-950 font-extrabold text-sm shadow-glow-cyan transition-all flex items-center justify-center gap-2 font-mono"
                >
                  <Send className="w-4 h-4 text-slate-950" /> Send Message
                </button>
              </form>
            )}
          </div>

          {/* Quick Connect Cards */}
          <div className="lg:col-span-5 space-y-4">
            <p className="text-sm text-typo-secondary leading-relaxed">
              I am currently seeking software engineering and business analyst internship opportunities. Feel free to send a message or connect directly!
            </p>

            <a
              href={`mailto:${profile?.email || 'rjklcr003@gmail.com'}`}
              className="glass-card-hover p-4 rounded-xl flex items-center gap-4 group"
            >
              <div className="w-11 h-11 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-glow-cyan">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-mono text-typo-muted">Email</p>
                <p className="text-sm font-semibold text-typo-primary group-hover:text-cyan transition-colors">{profile?.email || 'rjklcr003@gmail.com'}</p>
              </div>
            </a>

            <a
              href={`tel:${profile?.phone || '+94765923995'}`}
              className="glass-card-hover p-4 rounded-xl flex items-center gap-4 group"
            >
              <div className="w-11 h-11 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-glow-cyan">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-mono text-typo-muted">Phone</p>
                <p className="text-sm font-semibold text-typo-primary group-hover:text-cyan transition-colors">{profile?.phone || '+94 76 592 3995'}</p>
              </div>
            </a>

            <a
              href={profile?.linkedin || "https://www.linkedin.com/in/chamathka-ranathunga-a825922aa"}
              target="_blank"
              rel="noreferrer"
              className="glass-card-hover p-4 rounded-xl flex items-center gap-4 group"
            >
              <div className="w-11 h-11 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-glow-indigo">
                <Linkedin className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-mono text-typo-muted">LinkedIn</p>
                <p className="text-sm font-semibold text-typo-primary group-hover:text-indigo transition-colors">Connect on LinkedIn</p>
              </div>
            </a>

            <a
              href={profile?.github || "https://github.com/Rjkl003CR"}
              target="_blank"
              rel="noreferrer"
              className="glass-card-hover p-4 rounded-xl flex items-center gap-4 group"
            >
              <div className="w-11 h-11 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-glow-cyan">
                <Github className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-mono text-typo-muted">GitHub</p>
                <p className="text-sm font-semibold text-typo-primary group-hover:text-cyan transition-colors">Follow on GitHub</p>
              </div>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
