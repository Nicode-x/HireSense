import React, { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../utils/api";

const UploadForm = ({ setResults }) => {
  const [files, setFiles] = useState([]);
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const addFiles = (newFiles) => {
    const pdfs = Array.from(newFiles).filter((f) => f.type === "application/pdf" || f.name.endsWith(".pdf"));
    if (pdfs.length !== newFiles.length) {
      alert("Only PDF files are accepted.");
    }
    setFiles((prev) => {
      const names = new Set(prev.map((f) => f.name));
      return [...prev, ...pdfs.filter((f) => !names.has(f.name))];
    });
  };

  const removeFile = (name) => setFiles((prev) => prev.filter((f) => f.name !== name));

  const onDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    addFiles(e.dataTransfer.files);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!files.length || !jobDescription.trim()) {
      alert("Please provide a job description and at least one resume.");
      return;
    }

    const formData = new FormData();
    formData.append("job_description", jobDescription);
    files.forEach((f) => formData.append("files", f));

    try {
      setLoading(true);
      const res = await api.post("/analyze", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResults(res.data);
      setTimeout(() => {
        document.getElementById("results")?.scrollIntoView({ behavior: "smooth" });
      }, 300);
    } catch (err) {
      alert(err.response?.data?.message || "Error analyzing resumes. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="analyze"
      className="min-h-screen px-6 py-28 flex items-center justify-center relative z-10"
      style={{ background: "linear-gradient(160deg, #fefae0 0%, #faedcd 50%, #e9edc9 100%)" }}
    >
      <div className="w-full max-w-5xl">
        {/* Header */}
        <div className="text-center mb-12 reveal">
          <span className="section-eyebrow">Candidate Screening Engine</span>
          <h2 className="section-title mt-2">Analyze Candidates Instantly</h2>
          <p className="section-sub mx-auto mt-4">
            Paste your job description and upload multiple resumes to generate AI-powered
            rankings, skill gaps, and recruiter-ready insights.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="glass-card p-8 md:p-12 space-y-8">
          {/* Job Description */}
          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: "#6b5f3e" }}>
              Job Description
            </label>
            <textarea
              rows={7}
              placeholder="Paste the job description here — include required skills, responsibilities, and qualifications..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              className="input-premium resize-none"
              style={{ borderRadius: "1rem" }}
            />
          </div>

          {/* Drop Zone */}
          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: "#6b5f3e" }}>
              Resume Files (PDF)
            </label>
            <div
              className={`drop-zone p-8 text-center transition-all ${dragOver ? "drag-over" : ""}`}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={onDrop}
              onClick={() => fileInputRef.current?.click()}
              style={{ cursor: "none" }}
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".pdf,application/pdf"
                onChange={(e) => addFiles(e.target.files)}
                className="hidden"
              />
              <div className="flex flex-col items-center gap-3">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center transition-all"
                  style={{ background: dragOver ? "rgba(212,163,115,0.2)" : "rgba(212,163,115,0.08)" }}
                >
                  <svg className="w-7 h-7" style={{ color: "#d4a373" }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium" style={{ color: "#3d3522" }}>
                    {dragOver ? "Drop files here" : "Drag & drop PDFs, or click to browse"}
                  </p>
                  <p className="text-xs mt-1" style={{ color: "#a08c6a" }}>
                    PDF only · Max 10MB per file · Up to 20 files
                  </p>
                </div>
              </div>
            </div>

            {/* File list */}
            <AnimatePresence>
              {files.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 space-y-2"
                >
                  {files.map((f) => (
                    <motion.div
                      key={f.name}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      className="flex items-center justify-between px-4 py-3 rounded-xl"
                      style={{
                        background: "rgba(212,163,115,0.08)",
                        border: "1px solid rgba(212,163,115,0.2)"
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-lg">📄</span>
                        <div>
                          <p className="text-sm font-medium truncate max-w-xs" style={{ color: "#3d3522" }}>{f.name}</p>
                          <p className="text-xs" style={{ color: "#a08c6a" }}>{(f.size / 1024).toFixed(0)} KB</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); removeFile(f.name); }}
                        className="transition p-1 rounded-lg"
                        style={{ color: "#a08c6a" }}
                        onMouseEnter={e => e.currentTarget.style.color = "#c0392b"}
                        onMouseLeave={e => e.currentTarget.style.color = "#a08c6a"}
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="btn-premium w-full py-4 text-base disabled:opacity-60 disabled:cursor-not-allowed"
            style={{ borderRadius: "1rem" }}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-3">
                <span className="spinner" />
                Analyzing Candidates...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Analyze {files.length > 0 ? `${files.length} Resume${files.length > 1 ? "s" : ""}` : "Resumes"}
              </span>
            )}
          </button>
        </form>
      </div>
    </section>
  );
};

export default UploadForm;