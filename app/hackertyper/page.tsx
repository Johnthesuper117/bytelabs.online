'use client';

import { useEffect, useRef, useState } from 'react';
import './hackertyper.css';

// Harmless pseudo-code corpus — monitoring dashboard theme
const SAMPLE = `#!/usr/bin/env python3
# ByteLabs Operations Dashboard v4.1.0

import math
import time
import random
from typing import Dict, List, Optional

REFRESH_INTERVAL_MS = 250
MAX_WIDGETS = 12
DEFAULT_THEME = "midnight"

class Dashboard:
    def __init__(self, name: str, theme: str = DEFAULT_THEME):
        self.name = name
        self.theme = theme
        self.widgets: List[Dict[str, float]] = []
        self._started_at = time.time()
        self._frame = 0

    def add_widget(self, label: str, value: float) -> None:
        self.widgets.append({"label": label, "value": value})

    def tick(self) -> Dict[str, float]:
        self._frame += 1
        phase = self._frame / 10.0
        cpu = 40 + math.sin(phase) * 15
        memory = 55 + math.cos(phase / 2) * 10
        temperature = 48 + math.sin(phase / 3) * 4
        return {
            "cpu": round(cpu, 2),
            "memory": round(memory, 2),
            "temperature": round(temperature, 2),
        }

    def summary(self) -> str:
        uptime = int(time.time() - self._started_at)
        return f"{self.name} theme={self.theme} uptime={uptime}s widgets={len(self.widgets)}"

def generate_series(points: int = 16) -> List[float]:
    series: List[float] = []
    baseline = random.uniform(20.0, 80.0)
    for index in range(points):
        drift = math.sin(index / 3) * 5
        jitter = random.uniform(-1.5, 1.5)
        series.append(round(baseline + drift + jitter, 2))
    return series

def render_table(rows: List[Dict[str, float]]) -> str:
    headers = ("metric", "value")
    lines = [f"{headers[0]:<16}{headers[1]:>8}"]
    lines.append("-" * 24)
    for row in rows:
        lines.append(f"{row['label']:<16}{row['value']:>8.2f}")
    return "\\n".join(lines)

def find_peak(values: List[float]) -> Optional[float]:
    if not values:
        return None
    peak = values[0]
    for value in values[1:]:
        if value > peak:
            peak = value
    return peak

dashboard = Dashboard("Operations Overview")
for label in ("requests", "latency", "cache_hit_rate", "queue_depth"):
    dashboard.add_widget(label, random.uniform(10.0, 99.0))

snapshot = dashboard.tick()
trend = generate_series()
peak = find_peak(trend)

rows = [
    {"label": "cpu",         "value": snapshot["cpu"]},
    {"label": "memory",      "value": snapshot["memory"]},
    {"label": "temperature", "value": snapshot["temperature"]},
    {"label": "peak",        "value": peak or 0.0},
]
print(render_table(rows))
print(dashboard.summary())

// ---------------------------------------------------------------
// C demo panel renderer
// ---------------------------------------------------------------

#include <stdio.h>
#include <string.h>
#include <math.h>

typedef struct { const char *title; int width; int height; } Panel;

static void draw_border(int w) {
    for (int i = 0; i < w; i++) putchar('=');
    putchar('\\n');
}

static void draw_panel(const Panel *p) {
    draw_border(p->width);
    printf("Panel : %s\\n", p->title);
    printf("Size  : %dx%d\\n", p->width, p->height);
    draw_border(p->width);
}

int main(void) {
    Panel panel = { "ByteLabs Demo Metrics", 32, 8 };
    draw_panel(&panel);
    puts("status : ready");
    puts("mode   : preview");
    puts("hint   : press any key to animate");
    return 0;
}

// ---------------------------------------------------------------
// TypeScript widget renderer
// ---------------------------------------------------------------

interface Widget {
  id: string;
  label: string;
  value: number;
  unit: string;
  trend: number[];
}

function sparkline(values: number[], width = 8): string {
  const bars = '\u2581\u2582\u2583\u2584\u2585\u2586\u2587\u2588';
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  return values
    .slice(-width)
    .map((v) => bars[Math.round(((v - min) / range) * (bars.length - 1))])
    .join('');
}

function formatValue(v: number, unit: string): string {
  return v.toFixed(1) + unit;
}

async function fetchMetrics(endpoint: string): Promise<Widget[]> {
  const res = await fetch(endpoint, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!res.ok) throw new Error('HTTP ' + res.status);
  return res.json() as Promise<Widget[]>;
}

function renderDashboard(widgets: Widget[]): void {
  const timestamp = new Date().toISOString();
  console.log('[ByteLabs Dashboard] ' + timestamp);
  console.log('='.repeat(48));
  for (const w of widgets) {
    const bar = sparkline(w.trend);
    const val = formatValue(w.value, w.unit);
    console.log(w.label.padEnd(20) + val.padStart(8) + '  ' + bar);
  }
  console.log('='.repeat(48));
}

const endpoint = '/api/metrics';
fetchMetrics(endpoint)
  .then(renderDashboard)
  .catch((err: Error) => console.error('Dashboard error:', err.message));
`;

export default function HackerTyper() {
  const [text, setText] = useState('');
  const [showInstructions, setShowInstructions] = useState(true);
  const posRef = useRef(0);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key.length > 1 && e.key !== 'Enter' && e.key !== 'Backspace') return;
      setShowInstructions(false);

      const chunkLength = Math.max(1, Math.floor(Math.random() * 6));
      let out = '';
      for (let i = 0; i < chunkLength; i++) {
        const idx = posRef.current % SAMPLE.length;
        out += SAMPLE[idx];
        posRef.current += 1;
      }

      setText((t) => t + out);

      requestAnimationFrame(() => {
        if (containerRef.current) {
          containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
      });
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  const handleClear = () => {
    setText('');
    posRef.current = 0;
    setShowInstructions(true);
  };

  return (
    <div className="ht-page">
      {/* Instructions / Clear bar */}
      <div className="ht-controls">
        <span className="ht-hint">
          {showInstructions ? '\u2328  Press any key to start typing...' : '\u2328  Keep typing...'}
        </span>
        <button className="ht-clear-btn" onClick={handleClear} title="Clear the screen">
          \u2715 CLEAR
        </button>
      </div>

      <div ref={containerRef} className="ht-wrapper">
        <pre className="ht-screen" aria-live="polite">
{text}
        </pre>
      </div>
    </div>
  );
}
