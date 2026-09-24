import React, { useState } from "react";
import { Eye, Palette, CheckCircle, XCircle } from "lucide-react";

export const ColorContrastTester: React.FC = () => {
  const [fgColor, setFgColor] = useState("#1e293b"); // slate-800
  const [bgColor, setBgColor] = useState("#ffffff"); // white
  const [visionMode, setVisionMode] = useState<"normal" | "protanopia" | "deuteranopia" | "tritanopia" | "achromatopsia">("normal");

  // Relative luminance calculation according to WCAG 2.1 specifications
  const getLuminance = (hex: string): number => {
    let cleanHex = hex.replace("#", "");
    if (cleanHex.length === 3) {
      cleanHex = cleanHex.split("").map(c => c + c).join("");
    }
    const r = parseInt(cleanHex.substring(0, 2) || "0", 16) / 255;
    const g = parseInt(cleanHex.substring(2, 4) || "0", 16) / 255;
    const b = parseInt(cleanHex.substring(4, 6) || "0", 16) / 255;

    const sRGB = [r, g, b].map(val => {
      return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
    });

    return 0.2126 * sRGB[0] + 0.7152 * sRGB[1] + 0.0722 * sRGB[2];
  };

  const getContrastRatio = (c1: string, c2: string): number => {
    try {
      const l1 = getLuminance(c1);
      const l2 = getLuminance(c2);
      const lighter = Math.max(l1, l2);
      const darker = Math.min(l1, l2);
      return (lighter + 0.05) / (darker + 0.05);
    } catch {
      return 1;
    }
  };

  const ratio = getContrastRatio(fgColor, bgColor);
  const formattedRatio = ratio.toFixed(2);

  const passesNormalAA = ratio >= 4.5;
  const passesNormalAAA = ratio >= 7.0;
  const passesLargeAA = ratio >= 3.0;
  const passesLargeAAA = ratio >= 4.5;
  const passesUIComponents = ratio >= 3.0;

  // Vision simulation filter classes
  const getVisionFilterStyle = () => {
    switch (visionMode) {
      case "protanopia":
        return { filter: "url('#protanopia-filter')" };
      case "deuteranopia":
        return { filter: "url('#deuteranopia-filter')" };
      case "tritanopia":
        return { filter: "url('#tritanopia-filter')" };
      case "achromatopsia":
        return { filter: "grayscale(100%)" };
      default:
        return {};
    }
  };

  return (
    <section aria-labelledby="contrast-heading" className="space-y-4">
      {/* SVG Filters for color vision deficiency simulation */}
      <svg className="sr-only" aria-hidden="true">
        <defs>
          <filter id="protanopia-filter">
            <feColorMatrix
              type="matrix"
              values="0.567, 0.433, 0, 0, 0
                      0.558, 0.442, 0, 0, 0
                      0, 0.242, 0.758, 0, 0
                      0, 0, 0, 1, 0"
            />
          </filter>
          <filter id="deuteranopia-filter">
            <feColorMatrix
              type="matrix"
              values="0.625, 0.375, 0, 0, 0
                      0.7, 0.3, 0, 0, 0
                      0, 0.3, 0.7, 0, 0
                      0, 0, 0, 1, 0"
            />
          </filter>
          <filter id="tritanopia-filter">
            <feColorMatrix
              type="matrix"
              values="0.95, 0.05, 0, 0, 0
                      0, 0.433, 0.567, 0, 0
                      0, 0.475, 0.525, 0, 0
                      0, 0, 0, 1, 0"
            />
          </filter>
        </defs>
      </svg>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 id="contrast-heading" className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Palette className="w-5 h-5 text-indigo-600 dark:text-indigo-400" aria-hidden="true" />
            WCAG Color Contrast &amp; Vision Simulation
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Real-time W3C contrast algorithm &amp; color blindness accommodation testing
          </p>
        </div>

        {/* Vision Mode Selector */}
        <div className="flex items-center gap-2">
          <label htmlFor="vision-select" className="text-xs font-medium text-slate-600 dark:text-slate-400 flex items-center gap-1">
            <Eye className="w-3.5 h-3.5" aria-hidden="true" />
            Vision Sim:
          </label>
          <select
            id="vision-select"
            value={visionMode}
            onChange={e => setVisionMode(e.target.value as any)}
            className="text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1 text-slate-800 dark:text-slate-200 focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:outline-none"
          >
            <option value="normal">Typical Vision</option>
            <option value="protanopia">Protanopia (Red-Blind)</option>
            <option value="deuteranopia">Deuteranopia (Green-Blind)</option>
            <option value="tritanopia">Tritanopia (Blue-Blind)</option>
            <option value="achromatopsia">Achromatopsia (Monochromacy)</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Color pickers */}
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="fg-color" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Text (Foreground)
              </label>
              <div className="flex items-center gap-2">
                <input
                  id="fg-color"
                  type="color"
                  value={fgColor}
                  onChange={e => setFgColor(e.target.value)}
                  className="w-9 h-9 rounded cursor-pointer border border-slate-300 dark:border-slate-700 p-0.5 bg-transparent"
                />
                <input
                  type="text"
                  aria-label="Text foreground color hex code"
                  value={fgColor}
                  onChange={e => setFgColor(e.target.value)}
                  className="font-mono text-xs w-full px-2 py-1.5 border border-slate-300 dark:border-slate-700 rounded bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                />
              </div>
            </div>

            <div>
              <label htmlFor="bg-color" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Surface (Background)
              </label>
              <div className="flex items-center gap-2">
                <input
                  id="bg-color"
                  type="color"
                  value={bgColor}
                  onChange={e => setBgColor(e.target.value)}
                  className="w-9 h-9 rounded cursor-pointer border border-slate-300 dark:border-slate-700 p-0.5 bg-transparent"
                />
                <input
                  type="text"
                  aria-label="Background surface color hex code"
                  value={bgColor}
                  onChange={e => setBgColor(e.target.value)}
                  className="font-mono text-xs w-full px-2 py-1.5 border border-slate-300 dark:border-slate-700 rounded bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                />
              </div>
            </div>
          </div>

          {/* Quick accessible pairings */}
          <div>
            <span className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">
              Preset Accessible Combos:
            </span>
            <div className="flex flex-wrap gap-2 text-xs">
              <button
                type="button"
                onClick={() => { setFgColor("#0f172a"); setBgColor("#f8fafc"); }}
                className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700"
              >
                Slate on White (18.5:1)
              </button>
              <button
                type="button"
                onClick={() => { setFgColor("#1d4ed8"); setBgColor("#eff6ff"); }}
                className="px-2 py-1 rounded bg-blue-100 dark:bg-blue-950/60 hover:bg-blue-200 text-blue-900 dark:text-blue-200 border border-blue-200 dark:border-blue-900"
              >
                Royal Blue (8.2:1)
              </button>
              <button
                type="button"
                onClick={() => { setFgColor("#047857"); setBgColor("#ecfdf5"); }}
                className="px-2 py-1 rounded bg-emerald-100 dark:bg-emerald-950/60 hover:bg-emerald-200 text-emerald-900 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-900"
              >
                Emerald Safe (6.4:1)
              </button>
            </div>
          </div>

          {/* Live sample preview */}
          <div
            style={{ backgroundColor: bgColor, color: fgColor, ...getVisionFilterStyle() }}
            className="p-4 rounded-xl border border-slate-300 shadow-inner text-center transition-all"
          >
            <p className="font-bold text-base">Sample Heading Text (Large)</p>
            <p className="text-xs mt-1">
              Regular 14px body text previewing contrast clarity and visual fatigue under different vision modes.
            </p>
          </div>
        </div>

        {/* Contrast results & ratings */}
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Contrast Ratio
              </span>
              <span className="font-mono text-2xl font-black text-slate-900 dark:text-white">
                {formattedRatio} : 1
              </span>
            </div>

            <div className="mt-4 space-y-2.5">
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 text-xs">
                <div>
                  <span className="font-semibold text-slate-900 dark:text-white block">Normal Text (Body)</span>
                  <span className="text-[11px] text-slate-500">Requires &ge; 4.5:1 (AA) / &ge; 7.0:1 (AAA)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded font-bold ${passesNormalAA ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300" : "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"}`}>
                    AA {passesNormalAA ? "PASS" : "FAIL"}
                  </span>
                  <span className={`px-2 py-0.5 rounded font-bold ${passesNormalAAA ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300" : "bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-400"}`}>
                    AAA {passesNormalAAA ? "PASS" : "FAIL"}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 text-xs">
                <div>
                  <span className="font-semibold text-slate-900 dark:text-white block">Large Text (&ge; 18pt or 14pt bold)</span>
                  <span className="text-[11px] text-slate-500">Requires &ge; 3.0:1 (AA) / &ge; 4.5:1 (AAA)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded font-bold ${passesLargeAA ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300" : "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"}`}>
                    AA {passesLargeAA ? "PASS" : "FAIL"}
                  </span>
                  <span className={`px-2 py-0.5 rounded font-bold ${passesLargeAAA ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300" : "bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-400"}`}>
                    AAA {passesLargeAAA ? "PASS" : "FAIL"}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 text-xs">
                <div>
                  <span className="font-semibold text-slate-900 dark:text-white block">UI Controls &amp; Form Borders</span>
                  <span className="text-[11px] text-slate-500">WCAG 1.4.11 Non-text Contrast &ge; 3.0:1</span>
                </div>
                <span className={`px-2 py-0.5 rounded font-bold ${passesUIComponents ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300" : "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"}`}>
                  {passesUIComponents ? "PASS" : "FAIL"}
                </span>
              </div>
            </div>
          </div>

          <p className="text-[11px] text-slate-500 dark:text-slate-400 italic">
            Calculated per WCAG 2.1 Success Criteria 1.4.3 &amp; 1.4.11 standards.
          </p>
        </div>
      </div>
    </section>
  );
};
