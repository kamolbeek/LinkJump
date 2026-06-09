"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { detectPlatform, PLATFORM_ICONS, PLATFORM_COLORS } from "@/lib/platforms";
import { translations, LangType } from "@/lib/translations";
import { parseVoiceCommand } from "@/lib/voice-commands";

interface LinkResult {
  code: string;
  shortUrl: string;
  platform: string;
  originalUrl: string;
  maxClicks: number | null;
  expiresAt: string | null;
}

export default function HomePage() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<LinkResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [detectedPlatform, setDetectedPlatform] = useState<string | null>(null);
  const [isLight, setIsLight] = useState(false);
  const [lang, setLang] = useState<LangType>("uz");
  const [isListening, setIsListening] = useState(false);
  const [voiceLog, setVoiceLog] = useState<string | null>(null);
  const scrollBarRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const [maxClicks, setMaxClicks] = useState<string>("");
  const [expiresIn, setExpiresIn] = useState<string>("");
  const [showLimits, setShowLimits] = useState(false);

  // Load language and theme preference from localStorage on mount
  useEffect(() => {
    // Theme
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "light") {
      setIsLight(true);
      document.body.classList.add("light-mode");
    } else {
      setIsLight(false);
      document.body.classList.remove("light-mode");
    }

    // Language
    const savedLang = localStorage.getItem("lang") as LangType;
    if (savedLang && ["uz", "ru", "en"].includes(savedLang)) {
      setLang(savedLang);
    } else {
      setLang("uz");
      localStorage.setItem("lang", "uz");
    }
  }, []);

  const changeLanguage = useCallback((selectedLang: LangType) => {
    setLang(selectedLang);
    localStorage.setItem("lang", selectedLang);
  }, []);

  const toggleTheme = useCallback(() => {
    setIsLight((prev) => {
      const next = !prev;
      if (next) {
        document.body.classList.add("light-mode");
        localStorage.setItem("theme", "light");
      } else {
        document.body.classList.remove("light-mode");
        localStorage.setItem("theme", "dark");
      }
      return next;
    });
  }, []);

  // Scroll indicator animation
  useEffect(() => {
    const handleScroll = () => {
      if (!scrollBarRef.current) return;
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight === 0) return;
      const progress = (window.scrollY / totalHeight) * 100;
      scrollBarRef.current.style.transform = `scaleX(${progress / 100})`;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Set translation dynamic variable
  const t = translations[lang] || translations.uz;

  // Check error parameters
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const errorParam = params.get("error");
    if (errorParam === "not-found") {
      setError(t.errorNotFound);
    } else if (errorParam === "server-error") {
      setError(t.errorServerError);
    } else if (errorParam === "expired") {
      setError(t.errorExpired);
    } else if (errorParam === "limit-reached") {
      setError(t.errorLimitReached);
    }
  }, [lang, t.errorNotFound, t.errorServerError, t.errorExpired, t.errorLimitReached]);

  // Detect platform
  useEffect(() => {
    if (url.trim().length > 5) {
      try {
        new URL(url.trim());
        const platform = detectPlatform(url.trim());
        setDetectedPlatform(platform !== "unknown" ? platform : null);
      } catch {
        setDetectedPlatform(null);
      }
    } else {
      setDetectedPlatform(null);
    }
  }, [url]);

  const handleGenerate = useCallback(async (targetUrl?: string) => {
    setError(null);
    setResult(null);
    setCopied(false);

    const activeUrl = targetUrl !== undefined ? targetUrl : url;

    if (!activeUrl.trim()) {
      setError(t.errorUrlRequired);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/create-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: activeUrl.trim(),
          maxClicks: maxClicks ? parseInt(maxClicks) : null,
          expiresIn: expiresIn ? parseInt(expiresIn) : null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error === "URL is required" || data.error === "URL cannot be empty" ? t.errorUrlRequired : t.errorInvalidUrl);
        return;
      }

      setResult(data);
    } catch {
      setError(t.errorNetwork);
    } finally {
      setLoading(false);
    }
  }, [url, t.errorUrlRequired, t.errorInvalidUrl, t.errorNetwork]);

  const handleCopy = useCallback(async (customResult?: LinkResult | null) => {
    const activeResult = customResult !== undefined ? customResult : result;
    if (!activeResult) return;
    try {
      await navigator.clipboard.writeText(activeResult.shortUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textArea = document.createElement("textarea");
      textArea.value = activeResult.shortUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [result]);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = true;
      rec.interimResults = false;
      rec.lang = lang === "uz" ? "uz-UZ" : lang === "ru" ? "ru-RU" : "en-US";

      rec.onresult = (event: any) => {
        const resultIndex = event.resultIndex;
        const transcript = event.results[resultIndex][0].transcript;
        setVoiceLog(`"${transcript}"`);
        
        // Execute voice command logic
        const action = parseVoiceCommand(transcript);
        if (action.type === "url") {
          setUrl(action.value);
          setVoiceLog(`Action: Write URL -> ${action.value}`);
        } else if (action.type === "generate") {
          setVoiceLog("Action: Exposing URL...");
          handleGenerate();
        } else if (action.type === "clear") {
          setUrl("");
          setResult(null);
          setError(null);
          setVoiceLog("Action: Cleared fields");
        } else if (action.type === "copy") {
          setVoiceLog("Action: Copy URL to clipboard");
          handleCopy();
        } else if (action.type === "theme") {
          setVoiceLog("Action: Toggle light/dark theme");
          toggleTheme();
        } else if (action.type === "lang") {
          setVoiceLog(`Action: Change language to ${action.value.toUpperCase()}`);
          changeLanguage(action.value);
        } else {
          setVoiceLog(`Unknown command: "${transcript}"`);
        }
      };

      rec.onerror = (event: any) => {
        console.error("Speech Recognition Error:", event.error);
        setIsListening(false);
      };

      rec.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = rec;
    }
  }, [lang, url, result, handleGenerate, handleCopy, toggleTheme, changeLanguage]);

  // Handle Speech Recognition Language updates dynamically
  useEffect(() => {
    if (recognitionRef.current) {
      recognitionRef.current.lang = lang === "uz" ? "uz-UZ" : lang === "ru" ? "ru-RU" : "en-US";
    }
  }, [lang]);

  const toggleListening = useCallback(() => {
    if (!recognitionRef.current) {
      alert("Speech recognition is not supported in this browser. Please use Chrome or Safari.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      setVoiceLog(null);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
      setVoiceLog("Listening... Speak now");
    }
  }, [isListening]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !loading) {
        handleGenerate();
      }
    },
    [handleGenerate, loading]
  );

  return (
    <>
      {/* Scroll indicator bar */}
      <div className="scroll-progress" ref={scrollBarRef} style={{ transform: "scaleX(0)" }} />

      {/* Header */}
      <header className="site-header" role="banner">
        <div className="container-x header-inner">
          <a href="/" className="logo-link" aria-label="LinkJump Homepage">
            <div className="logo-dot" />
            <span>LINKJUMP</span>
          </a>
          <nav className="header-nav" role="navigation" aria-label="Main navigation">
            <a href="#features" className="nav-link">{t.featuresNav}</a>
            <a href="#features" className="nav-link">{t.useCasesNav}</a>
            
            {/* Language Selector */}
            <div className="lang-selector" role="group" aria-label="Language selector">
              <button
                onClick={() => changeLanguage("uz")}
                className={`lang-btn ${lang === "uz" ? "active" : ""}`}
                aria-label="O'zbekcha tilini tanlash"
              >
                UZ
              </button>
              <button
                onClick={() => changeLanguage("ru")}
                className={`lang-btn ${lang === "ru" ? "active" : ""}`}
                aria-label="Выбрать русский язык"
              >
                RU
              </button>
              <button
                onClick={() => changeLanguage("en")}
                className={`lang-btn ${lang === "en" ? "active" : ""}`}
                aria-label="Select English language"
              >
                EN
              </button>
            </div>

            {/* Voice Control Toggle Button */}
            <button
              onClick={toggleListening}
              className={`voice-toggle-btn ${isListening ? "listening" : ""}`}
              aria-label={isListening ? "Stop voice control" : "Start voice control"}
              title="Ovozli boshqaruvni yoqish / o'chirish"
            >
              🎤
              {isListening && <div className="voice-indicator-dot" />}
            </button>

            {/* Dark/Light Mode */}
            <button
              onClick={toggleTheme}
              className="theme-toggle-btn"
              aria-label={isLight ? "Toggle dark theme" : "Toggle light theme"}
            >
              {isLight ? "🌙" : "☀️"}
            </button>
            
            <a href="https://github.com" target="_blank" className="nav-link">GitHub ↗</a>
          </nav>
        </div>
      </header>

      <main className="container-x" role="main">
        {/* Hero Section */}
        <section className="hero-sec">
          <h1 className="display-title fade-up">
            {lang === "uz" ? (
              <>Tunnellarni Native<br />Ilovlarga Yo'naltirish.</>
            ) : lang === "ru" ? (
              <>Туннелирование ссылок<br />в нативные приложения.</>
            ) : (
              <>Ship Tunnels to<br />Native Apps.</>
            )}
          </h1>
          <p className="hero-subtitle fade-up" style={{ animationDelay: "80ms" }}>
            {t.heroSubtitle}
          </p>

          {/* JPRQ Style URL input container */}
          <div className="jprq-card fade-up" style={{ animationDelay: "160ms" }}>
            <div className="input-row">
              <div className="jprq-input-wrapper">
                <input
                  type="url"
                  className="jprq-input"
                  placeholder={t.placeholder}
                  value={url}
                  onChange={(e) => {
                    setUrl(e.target.value);
                    setError(null);
                  }}
                  onKeyDown={handleKeyDown}
                  disabled={loading}
                  autoComplete="off"
                  spellCheck={false}
                  aria-label="Social media URL to shorten"
                  aria-required="true"
                />
                {detectedPlatform && (
                  <div className="inline-badge" role="status" aria-label={`Detected platform: ${detectedPlatform}`}>
                    <span>{PLATFORM_ICONS[detectedPlatform] || "🔗"}</span>
                    <span>{detectedPlatform}</span>
                  </div>
                )}
              </div>
              <button
                className="jprq-btn"
                onClick={() => handleGenerate()}
                disabled={loading || !url.trim()}
                aria-label="Generate Smart Redirect Link"
              >
                {loading ? t.exposing : t.exposeBtn}
              </button>
            </div>

            {/* Cheklovlar (ixtiyoriy) */}
            <div
              style={{ marginTop: "0.75rem" }}
            >
              <button
                type="button"
                onClick={() => setShowLimits(!showLimits)}
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--text-gray)",
                  fontSize: "13px",
                  cursor: "pointer",
                  fontFamily: "'JetBrains Mono', monospace",
                  padding: "4px 0",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
                aria-expanded={showLimits}
              >
                <span style={{ transform: showLimits ? "rotate(90deg)" : "rotate(0deg)", transition: "transform 0.2s", display: "inline-block" }}>▶</span>
                {t.limitSectionTitle}
              </button>
              {showLimits && (
                <div
                  className="limits-panel"
                  style={{
                    marginTop: "0.5rem",
                    padding: "1rem",
                    background: "rgba(0,0,0,0.15)",
                    border: "1px solid rgba(255,255,255,0.04)",
                    borderRadius: "8px",
                    display: "flex",
                    gap: "1rem",
                    flexWrap: "wrap",
                  }}
                >
                  {/* Maksimal bosish soni */}
                  <div style={{ flex: "1", minWidth: "140px" }}>
                    <label style={{ fontSize: "12px", color: "var(--text-gray)", fontFamily: "'JetBrains Mono', monospace", marginBottom: "6px", display: "block" }}>
                      {t.limitMaxClicks}
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={maxClicks}
                      onChange={(e) => setMaxClicks(e.target.value)}
                      placeholder={t.limitMaxClicksPlaceholder}
                      style={{
                        width: "100%",
                        padding: "8px 12px",
                        background: "rgba(0,0,0,0.3)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        borderRadius: "6px",
                        color: "var(--text-primary)",
                        fontSize: "13px",
                        fontFamily: "'JetBrains Mono', monospace",
                        outline: "none",
                      }}
                      aria-label={t.limitMaxClicks}
                    />
                  </div>
                  {/* Muddat */}
                  <div style={{ flex: "1", minWidth: "140px" }}>
                    <label style={{ fontSize: "12px", color: "var(--text-gray)", fontFamily: "'JetBrains Mono', monospace", marginBottom: "6px", display: "block" }}>
                      {t.limitExpires}
                    </label>
                    <select
                      value={expiresIn}
                      onChange={(e) => setExpiresIn(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "8px 12px",
                        background: "rgba(0,0,0,0.3)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        borderRadius: "6px",
                        color: "var(--text-primary)",
                        fontSize: "13px",
                        fontFamily: "'JetBrains Mono', monospace",
                        outline: "none",
                        cursor: "pointer",
                      }}
                      aria-label={t.limitExpires}
                    >
                      <option value="">{t.limitNoLimit}</option>
                      <option value="60">{t.limit1Hour}</option>
                      <option value="360">{t.limit6Hours}</option>
                      <option value="1440">{t.limit24Hours}</option>
                      <option value="10080">{t.limit7Days}</option>
                      <option value="43200">{t.limit30Days}</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* Error logs inside terminal design */}
            {error && (
              <div className="terminal-error" id="error-message" role="alert" aria-live="assertive">
                {error}
              </div>
            )}

            {/* Voice Control active transcript logs inside terminal */}
            {voiceLog && (
              <div 
                style={{ 
                  marginTop: "1rem", 
                  background: "rgba(16, 185, 129, 0.03)", 
                  border: "1px solid rgba(16, 185, 129, 0.15)", 
                  color: "#10b981", 
                  borderRadius: "8px", 
                  padding: "0.75rem 1rem", 
                  fontFamily: "'JetBrains Mono', monospace", 
                  fontSize: "13px" 
                }}
                role="status" 
                aria-live="polite"
              >
                <span style={{ color: "#777" }}>$ voice-control:</span> {voiceLog}
              </div>
            )}

            {/* iOS-Inspired Result Card */}
            {result && (
              <div className="ios-result-card" id="result-card" role="region" aria-label="Generation result details">
                <div className="ios-card-main">
                  <div className="ios-link-wrapper">
                    <div 
                      className="ios-platform-icon" 
                      style={{ 
                        backgroundColor: `${PLATFORM_COLORS[result.platform.toLowerCase()] || '#6366F1'}15`, 
                        color: PLATFORM_COLORS[result.platform.toLowerCase()] || '#6366F1' 
                      }}
                    >
                      {PLATFORM_ICONS[result.platform.toLowerCase()] || "🔗"}
                    </div>
                    <span 
                      className="ios-link-text"
                      onClick={() => handleCopy()}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") handleCopy(); }}
                      title={t.termCopyBtn}
                      aria-label={`Short link: ${result.shortUrl}. Press Enter to copy.`}
                    >
                      {result.shortUrl}
                    </span>
                  </div>
                  <button
                    className={`ios-copy-btn ${copied ? "copied" : ""}`}
                    onClick={() => handleCopy()}
                    aria-label="Copy short link to clipboard"
                  >
                    {copied ? t.termCopiedBtn : t.termCopyBtn}
                  </button>
                </div>

                {/* Footer with constraints info */}
                {(result.maxClicks !== null || result.expiresAt !== null) && (
                  <div className="ios-card-footer">
                    {result.maxClicks !== null && (
                      <div>
                        <span>{t.termLabelClicks}: </span>
                        <span style={{ fontWeight: 600 }}>
                          0 / {result.maxClicks}
                        </span>
                      </div>
                    )}
                    {result.expiresAt !== null && (
                      <div>
                        <span>{t.termLabelExpires}: </span>
                        <span style={{ fontWeight: 600 }}>
                          {new Date(result.expiresAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        {/* Feature section in JPRQ grid layout */}
        <section id="features" className="fade-up" style={{ animationDelay: "240ms", paddingBottom: "80px" }}>
          <span style={{ color: "var(--text-gray)", fontSize: "14px", fontWeight: "600" }}>
            {t.featuresHeader}
          </span>
          <h2 style={{ fontSize: "clamp(1.5rem, 3.5vw, 2.5rem)", fontWeight: 500, margin: "0.5rem 0 2rem 0", letterSpacing: "-0.03em" }}>
            {t.featuresTitle}<br />
            <span style={{ color: "var(--text-gray)" }}>{t.featuresSubtitle}</span>
          </h2>

          <div className="jprq-features-grid">
            <div className="jprq-feature-card">
              <div className="feature-number">{t.feature1Number}</div>
              <h3 className="jprq-feature-title">{t.feature1Title}</h3>
              <p className="jprq-feature-desc">{t.feature1Desc}</p>
            </div>
            <div className="jprq-feature-card">
              <div className="feature-number">{t.feature2Number}</div>
              <h3 className="jprq-feature-title">{t.feature2Title}</h3>
              <p className="jprq-feature-desc">{t.feature2Desc}</p>
            </div>
            <div className="jprq-feature-card">
              <div className="feature-number">{t.feature3Number}</div>
              <h3 className="jprq-feature-title">{t.feature3Title}</h3>
              <p className="jprq-feature-desc">{t.feature3Desc}</p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="site-footer" role="contentinfo">
        <div className="container-x">
          <p>{t.footer}</p>
        </div>
      </footer>
    </>
  );
}
