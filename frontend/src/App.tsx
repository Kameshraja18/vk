import React, { useState, useRef } from 'react';
import axios from 'axios';
import {
  Upload,
  ShieldCheck,
  ShieldAlert,
  FileSearch,
  Info,
  Maximize2,
  RefreshCcw,
  Zap,
  Activity,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Finding {
  type: string;
  status: string;
  message: string;
  description?: string;
}

interface AnalysisResult {
  filename: string;
  is_forged: boolean;
  confidence: string;
  ela_image: string;
  noise_image: string;
  findings: Finding[];
}

type DocCategory = 'identity' | 'financial' | 'certificate' | 'seal' | null;

const CATEGORIES = [
  { id: 'identity', label: 'Identity Documents', desc: 'Passports, DL, ID Cards', icon: ShieldCheck, color: '#3b82f6' },
  { id: 'financial', label: 'Financial Records', desc: 'Bank Statements, Invoices', icon: Activity, color: '#10b981' },
  { id: 'certificate', label: 'Certificates', desc: 'Educational & Legal Docs', icon: FileSearch, color: '#f59e0b' },
  { id: 'seal', label: 'Seals & Stamps', desc: 'Signature / Stamp Cloning', icon: ShieldAlert, color: '#ef4444' }
] as const;

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [category, setCategory] = useState<DocCategory>(null);
  const [fileType, setFileType] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [activeForensicTab, setActiveForensicTab] = useState<'ela' | 'noise'>('ela');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setFileType(selectedFile.type);

      // Generate a blob URL for any supported type (Image or PDF)
      const url = URL.createObjectURL(selectedFile);
      setPreview(url);
      setResult(null);
    }
  };

  const handleUpload = async () => {
    if (!file || !category) return;

    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('category', category);

    try {
      const response = await axios.post('http://localhost:8000/analyze', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setResult(response.data);
    } catch (error) {
      console.error('Error analyzing document:', error);
      alert('Failed to analyze document. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setFile(null);
    setPreview(null);
    setResult(null);
    setCategory(null);
    setFileType(null);
  };

  return (
    <div className="min-h-screen p-6 md:p-12 font-sans overflow-x-hidden">
      {/* Dynamic Background */}
      <div className="fixed inset-0 -z-10 bg-[#050507]">
        <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(#1e293b 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-900/20 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-900/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <header className="max-w-7xl mx-auto flex justify-between items-center mb-16 px-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-4 cursor-pointer"
          onClick={reset}
        >
          <div className="relative">
            <div className="absolute inset-0 bg-blue-500 rounded-lg blur-lg opacity-50 animate-pulse"></div>
            <div className="relative bg-gradient-to-br from-blue-500 to-indigo-600 p-2.5 rounded-lg shadow-xl shadow-blue-500/20">
              <ShieldCheck size={32} className="text-white" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tighter text-white">VERIDOC <span className="text-blue-500">PRO</span></h1>
            <p className="text-[10px] uppercase tracking-[0.3em] text-muted font-bold">Neural Forensics Lab</p>
          </div>
        </motion.div>

        <div className="hidden md:flex items-center gap-8 px-6 py-3 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-ping"></div>
            <span className="text-[11px] font-bold text-white/70 uppercase">Service Status: Ready</span>
          </div>
          <div className="h-4 w-px bg-white/10"></div>
          <div className="flex items-center gap-4">
            <Maximize2 size={16} className="text-muted hover:text-white transition-colors cursor-pointer" />
            <Activity size={16} className="text-muted hover:text-white transition-colors cursor-pointer" />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4">
        <AnimatePresence mode="wait">
          {!category ? (
            <motion.div
              key="category-selection"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-12"
            >
              <div className="text-center space-y-4">
                <h2 className="text-4xl font-black text-white">Select Forensic Service</h2>
                <p className="text-muted max-w-lg mx-auto leading-relaxed">Choose the specific specialized engine to optimize accuracy for your document type.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {CATEGORIES.map((cat) => (
                  <motion.div
                    key={cat.id}
                    whileHover={{ scale: 1.02, y: -5 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setCategory(cat.id as DocCategory)}
                    className="glass-card p-8 border border-white/5 hover:border-blue-500/50 transition-all cursor-pointer group relative overflow-hidden"
                  >
                    <div className="absolute -right-2 -top-2 opacity-5 scale-150 rotate-12 group-hover:scale-110 transition-transform">
                      <cat.icon size={120} />
                    </div>
                    <div className={`w-12 h-12 rounded-xl mb-6 flex items-center justify-center`} style={{ backgroundColor: `${cat.color}20`, color: cat.color }}>
                      <cat.icon size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">{cat.label}</h3>
                    <p className="text-xs text-muted leading-relaxed font-medium">{cat.desc}</p>
                    <div className="mt-8 flex items-center gap-2 text-[10px] font-black uppercase text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span>Select Engine</span>
                      <Zap size={10} fill="currentColor" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ) : !result ? (
            <motion.div
              key="uploader"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, y: -20 }}
              className="relative"
            >
              <div className="mb-6 flex items-center gap-4">
                <button onClick={() => setCategory(null)} className="text-muted hover:text-white transition-colors flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
                  <RefreshCcw size={14} className="rotate-180" /> Back to Services
                </button>
                <div className="h-1 w-1 rounded-full bg-white/20"></div>
                <span className="text-[10px] font-black uppercase tracking-widest text-blue-500">Service: {CATEGORIES.find(c => c.id === category)?.label}</span>
              </div>
              <div
                className="glass-card min-h-[500px] flex flex-col items-center justify-center border-dashed border-2 border-white/10 hover:border-blue-500/50 transition-all duration-500 cursor-pointer group"
                onClick={() => !file && fileInputRef.current?.click()}
              >
                <input
                  type="file"
                  hidden
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*,application/pdf"
                />

                {!preview ? (
                  <div className="text-center space-y-6">
                    <div className="relative mx-auto w-24 h-24 mb-8">
                      <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-2xl group-hover:bg-blue-500/40 transition-colors"></div>
                      <div className="relative bg-secondary/50 p-6 rounded-full border border-white/10 group-hover:scale-110 group-hover:border-blue-500/50 transition-all duration-500">
                        <Upload size={48} className="text-blue-400" />
                      </div>
                    </div>
                    <h2 className="text-3xl font-bold text-white">Analyze Assets</h2>
                    <p className="text-muted max-w-sm mx-auto leading-relaxed">
                      Upload document scans to detect microscopic clones, compression artifacts, and semantic inconsistencies.
                    </p>
                  </div>
                ) : (
                  <div className="w-full max-w-3xl p-8 flex flex-col items-center">
                    <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-black/40 shadow-2xl group mb-10 min-h-[400px] w-full flex items-center justify-center">
                      {fileType === 'application/pdf' ? (
                        <iframe
                          src={`${preview}#toolbar=0&navpanes=0&scrollbar=0`}
                          className="w-full h-[500px] rounded-xl border-none"
                          title="PDF Preview"
                        />
                      ) : (
                        <img src={preview!} alt="Preview" className="max-h-[400px] object-contain" />
                      )}
                      {loading && (
                        <div className="absolute inset-0">
                          <div className="scanner-line"></div>
                          <div className="absolute inset-0 bg-blue-500/10 backdrop-blur-[1px] animate-pulse"></div>
                          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-3 bg-black/80 px-6 py-3 rounded-full border border-white/10">
                            <RefreshCcw className="animate-spin text-blue-500" size={20} />
                            <span className="text-sm font-bold tracking-widest uppercase">Cross-Referencing Neural Nodes...</span>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-4">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleUpload}
                        disabled={loading}
                        className="bg-blue-600 hover:bg-blue-500 text-white px-10 py-4 rounded-xl font-bold flex items-center gap-3 transition-all shadow-lg shadow-blue-500/25 disabled:opacity-50"
                      >
                        <Zap size={20} fill="currentColor" />
                        Initiate Forensic Scan
                      </motion.button>
                      <button
                        onClick={(e) => { e.stopPropagation(); reset(); }}
                        className="px-8 py-4 rounded-xl font-bold bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
                      >
                        Clear
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-12"
            >
              {/* Left Sidebar: Verdict & Findings */}
              <div className="lg:col-span-4 space-y-6">
                <div className={`glass-card p-8 border-t-4 shadow-2xl ${result.is_forged ? 'border-red-500 ring-1 ring-red-500/20' : 'border-green-500 ring-1 ring-green-500/20'}`}>
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted mb-1">Expert Consensus</p>
                      <h3 className={`text-4xl font-black ${result.is_forged ? 'text-red-500' : 'text-green-500'}`}>
                        {result.is_forged ? 'THREAT FOUND' : 'VERIFIED'}
                      </h3>
                    </div>
                    <div className={`p-3 rounded-xl ${result.is_forged ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'}`}>
                      {result.is_forged ? <ShieldAlert size={32} /> : <ShieldCheck size={32} />}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-end">
                      <span className="text-xs font-bold text-muted uppercase">Confidence Level</span>
                      <span className="text-sm font-black text-white">{result.confidence}</span>
                    </div>
                    <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: result.confidence }}
                        className={`h-full ${result.is_forged ? 'bg-red-500' : 'bg-green-500'}`}
                      ></motion.div>
                    </div>
                  </div>
                </div>

                <div className="glass-card p-6 border border-white/5">
                  <h4 className="flex items-center gap-3 text-[11px] font-black text-white/50 mb-8 uppercase tracking-[0.4em]">
                    <Activity size={16} className="text-blue-500" /> Evidence Logs
                  </h4>
                  <div className="space-y-6">
                    {result.findings.map((f, i) => (
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        key={i}
                        className="group relative"
                      >
                        <div className="flex gap-4">
                          <div className={`mt-1 h-2 w-2 rounded-full ${f.status === 'Pass' ? 'bg-green-500' : f.status === 'Warning' ? 'bg-yellow-500' : 'bg-red-500'
                            } shadow-[0_0_8px_currentColor]`}></div>
                          <div className="flex-1">
                            <div className="flex justify-between items-center mb-1">
                              <p className="text-[12px] font-black text-white/90 uppercase">{f.type}</p>
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${f.status === 'Pass' ? 'text-green-500 bg-green-500/10' : f.status === 'Warning' ? 'text-yellow-500 bg-yellow-500/10' : 'text-red-500 bg-red-500/10'
                                }`}>{f.status}</span>
                            </div>
                            <p className="text-[11px] text-white/70 leading-relaxed mb-1 font-bold">{f.message}</p>
                            {f.description && (
                              <p className="text-[9px] text-muted leading-relaxed italic opacity-80 group-hover:opacity-100 transition-opacity">
                                {f.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={reset}
                  className="w-full bg-white/5 hover:bg-white/10 text-white p-5 rounded-2xl font-bold flex items-center justify-center gap-3 border border-white/10 transition-all backdrop-blur-xl"
                >
                  <RefreshCcw size={18} /> Run New Operation
                </motion.button>
              </div>

              {/* Right: Forensic Visualizers */}
              <div className="lg:col-span-8 space-y-8">
                <div className="glass-card p-8 border border-white/5 shadow-inner">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
                    <h4 className="flex items-center gap-3 text-[11px] font-black text-white/50 uppercase tracking-[0.4em]">
                      <FileSearch size={18} className="text-blue-500" /> Forensic Visualizer
                    </h4>
                    <div className="flex p-1 bg-black/40 rounded-xl border border-white/10 backdrop-blur-md">
                      <button
                        onClick={() => setActiveForensicTab('ela')}
                        className={`px-5 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeForensicTab === 'ela' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-muted hover:text-white'}`}
                      >
                        ELA Mode
                      </button>
                      <button
                        onClick={() => setActiveForensicTab('noise')}
                        className={`px-5 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeForensicTab === 'noise' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-muted hover:text-white'}`}
                      >
                        Noise Profile
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center px-1">
                        <span className="text-[10px] font-black text-muted uppercase">Reference.img</span>
                        <span className="text-[10px] font-mono text-blue-500/50">CH_01</span>
                      </div>
                      <div className="rounded-2xl overflow-hidden border border-white/10 bg-black/20 group h-full flex items-center justify-center min-h-[300px]">
                        {fileType === 'application/pdf' ? (
                          <iframe
                            src={`${preview}#toolbar=0&navpanes=0&scrollbar=0`}
                            className="w-full h-full min-h-[400px] rounded-xl border-none grayscale-[0.3] group-hover:grayscale-0 transition-all duration-700"
                            title="Reference PDF"
                          />
                        ) : (
                          <img src={preview!} alt="Original" className="w-full h-auto grayscale-[0.5] group-hover:grayscale-0 transition-all duration-700" />
                        )}
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center px-1">
                        <span className="text-[10px] font-black text-muted uppercase">Forensic_Output.vrs</span>
                        <span className="text-[10px] font-mono text-accent/50">{activeForensicTab === 'ela' ? 'ELA_MAP' : 'NOISE_MAP'}</span>
                      </div>
                      <div className="rounded-2xl overflow-hidden border border-white/10 bg-black shadow-2xl relative">
                        {activeForensicTab === 'ela' ? (
                          <motion.img
                            key="ela"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            src={result.ela_image} alt="ELA Map" className="w-full h-auto"
                          />
                        ) : (
                          <motion.img
                            key="noise"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            src={result.noise_image} alt="Noise Map" className="w-full h-auto"
                          />
                        )}
                        <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                          <span className="text-[9px] font-black text-white uppercase tracking-tighter italic">Deep Scanning...</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-12 p-6 bg-gradient-to-r from-blue-500/5 to-transparent rounded-2xl border border-blue-500/10">
                    <div className="flex gap-4">
                      <Info size={20} className="text-blue-500 shrink-0" />
                      <p className="text-[11px] text-white/60 leading-relaxed font-medium">
                        {activeForensicTab === 'ela'
                          ? "Error Level Analysis reveals inconsistencies in pixel compression. Bright hotspots often indicate 'copy-paste' operations or text injections performed outside the original capture environment."
                          : "Noise Analysis identifies unique sensor artifacts. Discontinuities in the noise floor (observed as jagged or smooth patches in this map) typically point to localized regional tampering."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="max-w-7xl mx-auto mt-20 pb-16 px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 border-t border-white/5 pt-12">
          <div className="flex items-center gap-6">
            <p className="text-[10px] font-bold text-muted uppercase tracking-[0.2em]">&copy; 2025 VERIDOC AI INDUSTRIES</p>
            <div className="hidden md:block h-3 w-px bg-white/10"></div>
            <p className="hidden md:block text-[10px] font-bold text-muted uppercase tracking-[0.2em]">Privacy Protocols Active</p>
          </div>
          <div className="flex items-center gap-6 text-[10px] font-black text-white/30 uppercase tracking-widest">
            <span className="hover:text-blue-500 cursor-pointer transition-colors">Documentation</span>
            <span className="hover:text-blue-500 cursor-pointer transition-colors">API Keys</span>
            <span className="hover:text-blue-500 cursor-pointer transition-colors">Support</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
