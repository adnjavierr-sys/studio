
"use client";

import { useState, useEffect } from "react";
import { themes } from "@/lib/themes";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

export function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false);
  
  const [activeTheme, setActiveTheme] = useState(() => {
    if (typeof window === 'undefined') return themes[0];
    const savedThemeName = localStorage.getItem("app-theme");
    return themes.find(t => t.name === savedThemeName) || themes[0];
  });
  
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      const root = document.documentElement;
      const themeCssVars = document.getElementById('theme-css-vars');
      if (themeCssVars) {
        themeCssVars.innerHTML = `
          :root {
            ${Object.entries(activeTheme.cssVars.light).map(([prop, value]) => `${prop}: ${value};`).join('\n')}
          }
          .dark {
            ${Object.entries(activeTheme.cssVars.dark).map(([prop, value]) => `${prop}: ${value};`).join('\n')}
          }
        `;
      }
      localStorage.setItem("app-theme", activeTheme.name);
    }
  }, [activeTheme, mounted]);
  
  if (!mounted) {
    return null; 
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {themes.map((theme) => (
        <div key={theme.name}>
          <button
            onClick={() => setActiveTheme(theme)}
            className={cn(
              "flex flex-col items-center justify-center rounded-md border-2 p-1 w-full",
              activeTheme.name === theme.name ? "border-primary" : "border-transparent"
            )}
          >
            <div className="flex items-center gap-2 rounded-md bg-muted p-2">
              <div className="h-6 w-6 rounded-full" style={{ backgroundColor: theme.colors.primary }} />
              <div className="h-6 w-6 rounded-full" style={{ backgroundColor: theme.colors.accent }} />
              <div className="h-6 w-6 rounded-full" style={{ backgroundColor: theme.colors.background }} />
            </div>
          </button>
          <div className="mt-2 flex items-center justify-center">
            <span className="text-sm font-medium text-center">{theme.label}</span>
            {activeTheme.name === theme.name && <Check className="ml-1 h-4 w-4 text-primary" />}
          </div>
        </div>
      ))}
    </div>
  );
}
