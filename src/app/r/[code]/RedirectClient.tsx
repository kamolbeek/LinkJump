"use client";

import { useEffect, useState } from "react";
import { getAdapter } from "@/lib/adapter-resolver";
import { translations, LangType } from "@/lib/translations";

interface RedirectClientProps {
  platform: string;
  normalizedUrl: string;
  originalUrl: string;
}

export default function RedirectClient({
  platform,
  normalizedUrl,
  originalUrl,
}: RedirectClientProps) {
  const [lang, setLang] = useState<LangType>("uz");
  const [status, setStatus] = useState("Analyzing system environment...");

  // Load language preference
  useEffect(() => {
    const savedLang = localStorage.getItem("lang") as LangType;
    if (savedLang && ["uz", "ru", "en"].includes(savedLang)) {
      setLang(savedLang);
    } else {
      setLang("uz");
    }
  }, []);

  const t = translations[lang] || translations.uz;

  useEffect(() => {
    // Tilda matnlarni darhol sozlash uchun statusni birinchi marta o'rnatamiz
    setStatus(t.redChecking);

    // 1. OS ni aniqlash
    const ua = navigator.userAgent || navigator.vendor || (window as any).opera;
    const isAndroid = /Android/i.test(ua);
    const isIOS = /iPhone|iPad|iPod/i.test(ua);

    // Agar Desktop bo'lsa - darhol brauzerda yo'naltiramiz
    if (!isAndroid && !isIOS) {
      setStatus(t.redDesktop);
      window.location.replace(normalizedUrl);
      return;
    }

    // 2. Mobil qurilmalar uchun adapter va launchUrl generatorini olamiz
    setStatus(t.redResolving);
    const adapter = getAdapter(platform, normalizedUrl);
    
    let launchUrl = "";
    if (isAndroid) {
      launchUrl = adapter.getAndroidLaunchUrl();
    } else if (isIOS) {
      launchUrl = adapter.getIOSLaunchUrl();
    }
    
    const fallbackUrl = adapter.getFallbackUrl();

    // Agar deep-link topilmasa yoki platform aniqlanmagan bo'lsa, to'g'ri brauzerga yo'naltiramiz
    if (platform === "unknown" || !launchUrl) {
      setStatus(t.redRoutingDirect);
      window.location.replace(fallbackUrl);
      return;
    }

    setStatus(t.redLaunching);

    // 3. Fallback taymerini boshlash (1500ms)
    let fallbackTimeout: NodeJS.Timeout | null = setTimeout(() => {
      setStatus(t.redTimeout);
      window.location.replace(fallbackUrl);
    }, 1500);

    // 4. Visibilitychange hodisasini tinglash
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        setStatus(t.redHandshake);
        if (fallbackTimeout) {
          clearTimeout(fallbackTimeout);
          fallbackTimeout = null;
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    // 5. Ilovani ochishga urinish
    window.location.href = launchUrl;

    // Tozalash
    return () => {
      if (fallbackTimeout) {
        clearTimeout(fallbackTimeout);
      }
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [platform, normalizedUrl, lang, t]);

  return (
    <div style={styles.container}>
      <div style={styles.box}>
        <div style={styles.header}>
          <div style={styles.dots}>
            <div style={styles.dot} />
            <div style={styles.dot} />
            <div style={styles.dot} />
          </div>
          <span style={styles.title}>{t.redTitle}</span>
        </div>
        
        <div style={styles.body}>
          <div style={styles.logoRow}>
            <svg 
              viewBox="0 0 100 100" 
              width="24" 
              height="24" 
              fill="none" 
              stroke="#ffffff" 
              strokeWidth="6" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              xmlns="http://www.w3.org/2000/svg"
              style={{ marginRight: "4px" }}
            >
              {/* Leaping chain panther SVG */}
              {/* Back leg & tail */}
              <path d="M 22,58 C 16,58 12,38 22,25 C 25,20 29,22 28,30 C 26,38 22,50 26,58 M 18,66 C 12,72 8,78 14,82 C 20,86 25,78 28,72" />
              {/* Interlocking links */}
              <rect x="25" y="42" width="32" height="16" rx="8" transform="rotate(-30 41 50)" />
              <rect x="45" y="32" width="32" height="16" rx="8" transform="rotate(-30 61 40)" />
              {/* Front head & legs */}
              <path d="M 76,28 C 80,22 86,20 90,25 C 92,27 91,30 88,31 C 85,32 81,36 79,42 M 70,38 C 75,44 82,50 79,56 C 76,62 70,54 66,48" />
            </svg>
            <span style={styles.logoText}>LINKJUMP</span>
          </div>

          <div style={styles.statusRow}>
            <span style={styles.prompt}>$</span> {status}
          </div>

          <div style={styles.detailsBox}>
            <div style={styles.detailRow}>
              <span style={styles.label}>Platform</span>
              <span style={styles.valPlatform}>{platform.toUpperCase()}</span>
            </div>
            <div style={styles.detailRow}>
              <span style={styles.label}>Target</span>
              <span style={styles.valUrl} title={normalizedUrl}>{normalizedUrl}</span>
            </div>
          </div>

          <div style={styles.loaderContainer}>
            <div style={styles.spinner} />
            <span style={styles.loadingText}>Opening content... Please wait...</span>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    backgroundColor: "#0e0e11",
    fontFamily: "'Inter', -apple-system, sans-serif",
    padding: "1rem",
  },
  box: {
    width: "100%",
    maxWidth: "480px",
    backgroundColor: "#171717",
    border: "1px solid rgba(255, 255, 255, 0.04)",
    borderRadius: "12px",
    overflow: "hidden",
    boxShadow: "0 24px 60px rgba(0, 0, 0, 0.5)",
  },
  header: {
    backgroundColor: "#0e0e11",
    borderBottom: "1px solid rgba(255, 255, 255, 0.04)",
    padding: "0.5rem 1rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dots: {
    display: "flex",
    gap: "6px",
  },
  dot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    backgroundColor: "#27272a",
  },
  title: {
    fontSize: "11px",
    fontWeight: "600",
    color: "#777777",
    letterSpacing: "0.05em",
  },
  body: {
    padding: "1.5rem",
  },
  logoRow: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    marginBottom: "1.5rem",
  },
  logoText: {
    fontWeight: "700",
    fontSize: "14px",
    color: "#ffffff",
    letterSpacing: "-0.02em",
  },
  statusRow: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: "14px",
    color: "#10b981",
    marginBottom: "1.5rem",
    display: "flex",
    gap: "8px",
  },
  prompt: {
    color: "#777777",
  },
  detailsBox: {
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    border: "1px solid rgba(255, 255, 255, 0.04)",
    borderRadius: "8px",
    padding: "1rem",
    marginBottom: "1.5rem",
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: "12px",
  },
  detailRow: {
    display: "flex",
    marginBottom: "0.5rem",
  },
  label: {
    color: "#71717a",
    width: "80px",
    flexShrink: 0,
  },
  valPlatform: {
    color: "#eab308",
  },
  valUrl: {
    color: "#a1a1aa",
    whiteSpace: "nowrap" as const,
    overflow: "hidden",
    textOverflow: "ellipsis",
    flex: 1,
  },
  loaderContainer: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    justifyContent: "center",
    marginTop: "1rem",
  },
  spinner: {
    width: "16px",
    height: "16px",
    border: "2px solid rgba(255, 255, 255, 0.1)",
    borderTopColor: "#ffffff",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },
  loadingText: {
    fontSize: "13px",
    color: "#777777",
  },
};
