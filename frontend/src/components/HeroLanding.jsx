import React, { useState } from "react";
import {
  BrainCircuit,
  TrendingUp,
  TrendingDown,
  BarChart2,
  Sparkles,
  ShieldCheck,
  Layers,
  ArrowRight,
  Zap,
  CheckCircle2,
  Lock,
  Activity
} from "lucide-react";
import "./CSS/HeroLanding.css";

const PREVIEW_INDICES = [
  {
    id: "nifty50",
    name: "NIFTY 50",
    ticker: "^NSEI",
    currentPrice: "24,852.15",
    predictedPrice: "24,960.40",
    change: "+0.74%",
    isUp: true,
    volume: "426K",
    accuracy: "94.2%",
    features: "7 Features",
    sparkline: [24600, 24680, 24620, 24750, 24710, 24800, 24852]
  },
  {
    id: "niftybank",
    name: "NIFTY BANK",
    ticker: "^NSEBANK",
    currentPrice: "52,410.80",
    predictedPrice: "52,830.20",
    change: "+1.12%",
    isUp: true,
    volume: "355K",
    accuracy: "92.8%",
    features: "7 Features",
    sparkline: [51800, 51950, 52100, 52050, 52200, 52350, 52410]
  },
  {
    id: "niftyit",
    name: "NIFTY IT",
    ticker: "^CNXIT",
    currentPrice: "31,840.40",
    predictedPrice: "31,980.15",
    change: "-0.35%",
    isUp: false,
    volume: "44K",
    accuracy: "91.5%",
    features: "7 Features",
    sparkline: [32100, 32050, 31920, 31980, 31890, 31810, 31840]
  },
  {
    id: "niftyauto",
    name: "NIFTY AUTO",
    ticker: "^CNXAUTO",
    currentPrice: "25,190.25",
    predictedPrice: "25,320.60",
    change: "+0.48%",
    isUp: true,
    volume: "294K",
    accuracy: "93.1%",
    features: "8 Features",
    sparkline: [24900, 25020, 24980, 25080, 25110, 25150, 25190]
  },
  {
    id: "niftynext",
    name: "NIFTY NEXT 50",
    ticker: "^NSMIDCP",
    currentPrice: "68,240.90",
    predictedPrice: "68,790.30",
    change: "+0.82%",
    isUp: true,
    volume: "428K",
    accuracy: "92.4%",
    features: "7 Features",
    sparkline: [67400, 67600, 67550, 67800, 67950, 68100, 68240]
  }
];

export default function HeroLanding({ onOpenLogin, onScrollToCharts }) {
  const [selectedIdx, setSelectedIdx] = useState(PREVIEW_INDICES[0]);

  return (
    <section className="hero-landing">
      {/* ── Background Glow Effects ── */}
      <div className="hero-glow hero-glow--blue" />
      <div className="hero-glow hero-glow--cyan" />
      <div className="hero-glow hero-glow--purple" />

      {/* ── Hero Main Content ── */}
      <div className="hero-container">
        
        {/* Top Badge */}
        <div className="hero-badge">
          <span className="badge-pulse" />
          <Sparkles size={14} className="badge-icon" />
          <span>Institutional AI Engine • 60-Day Multi-Index LSTM Neural Network</span>
        </div>

        {/* Main Headline */}
        <h1 className="hero-title">
          Predict Indian Stock Markets with{" "}
          <span className="hero-title__highlight">Deep Neural Intelligence</span>
        </h1>

        {/* Subtitle */}
        <p className="hero-subtitle">
          Trader's Street combines Keras 3 sequential LSTM networks with real-time technical 
          charting, automated market ETL, and verified news feeds to deliver next-generation 
          trend forecasting for Indian markets.
        </p>

        {/* Hero Action Buttons */}
        <div className="hero-actions">
          <button className="hero-btn hero-btn--primary" onClick={onOpenLogin}>
            <BrainCircuit size={18} />
            <span>Start Free with AI Predictions</span>
            <ArrowRight size={16} />
          </button>

          <button className="hero-btn hero-btn--secondary" onClick={onScrollToCharts}>
            <BarChart2 size={18} />
            <span>Explore Live Charts</span>
          </button>
        </div>

        {/* Metric Badges */}
        <div className="hero-stats">
          <div className="stat-card">
            <span className="stat-number">5</span>
            <span className="stat-label">Major Indian Indices</span>
          </div>
          <div className="stat-divider" />
          <div className="stat-card">
            <span className="stat-number">60-Day</span>
            <span className="stat-label">Lookback Window</span>
          </div>
          <div className="stat-divider" />
          <div className="stat-card">
            <span className="stat-number">LSTM</span>
            <span className="stat-label">Recurrent Architecture</span>
          </div>
          <div className="stat-divider" />
          <div className="stat-card">
            <span className="stat-number">100%</span>
            <span className="stat-label">Free Educational Access</span>
          </div>
        </div>

        {/* ── Interactive Market Pulse Bar ── */}
        <div className="market-pulse-section">
          <div className="section-header-pill">
            <Activity size={14} />
            <span>Live Index Radar & AI Forecast Preview</span>
          </div>
          
          <div className="index-tabs-grid">
            {PREVIEW_INDICES.map((idx) => {
              const active = idx.id === selectedIdx.id;
              return (
                <div
                  key={idx.id}
                  className={`index-chip ${active ? "index-chip--active" : ""}`}
                  onClick={() => setSelectedIdx(idx)}
                >
                  <div className="index-chip__top">
                    <span className="index-chip__name">{idx.name}</span>
                    <span className={`index-chip__badge ${idx.isUp ? "badge--up" : "badge--down"}`}>
                      {idx.isUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                      {idx.change}
                    </span>
                  </div>
                  <div className="index-chip__price">₹{idx.currentPrice}</div>
                  <div className="index-chip__footer">
                    <span>Target: <strong>₹{idx.predictedPrice}</strong></span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Detailed Preview Card for Selected Index */}
          <div className="index-preview-panel">
            <div className="preview-panel__header">
              <div>
                <span className="panel-tag">Selected Model</span>
                <h3 className="panel-title">{selectedIdx.name} ({selectedIdx.ticker})</h3>
              </div>
              <div className="panel-status">
                <span className="status-dot" /> Live LSTM Inference Ready
              </div>
            </div>

            <div className="preview-panel__body">
              <div className="preview-metric">
                <span className="metric-title">Current Index Level</span>
                <span className="metric-val">₹{selectedIdx.currentPrice}</span>
                <span className={`metric-sub ${selectedIdx.isUp ? "text-green" : "text-red"}`}>
                  {selectedIdx.isUp ? "▲ Upward Trend" : "▼ Volatile Pullback"} ({selectedIdx.change})
                </span>
              </div>

              <div className="preview-metric preview-metric--highlight">
                <span className="metric-title">AI Projected Next Close</span>
                <span className="metric-val metric-val--pred">₹{selectedIdx.predictedPrice}</span>
                <span className="metric-sub text-cyan">
                  <Sparkles size={12} /> Based on 60-day historical sequence
                </span>
              </div>

              <div className="preview-metric">
                <span className="metric-title">Historical Sequence Depth</span>
                <span className="metric-val">{selectedIdx.features}</span>
                <span className="metric-sub">Open, High, Low, Close, Volume</span>
              </div>

              <div className="preview-cta-box">
                <button className="preview-unlock-btn" onClick={onOpenLogin}>
                  <Lock size={15} />
                  <span>Sign In to Run Custom Overrides</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ── Feature Highlights Grid ── */}
        <div className="features-section">
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon feature-icon--blue">
                <BrainCircuit size={24} />
              </div>
              <h3>Multi-Layer LSTM Engine</h3>
              <p>
                Recurrent neural network with memory cells engineered specifically to identify 
                long-term price autocorrelation, market cycle shifts, and volume anomalies.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon feature-icon--cyan">
                <BarChart2 size={24} />
              </div>
              <h3>Interactive Pro Charting</h3>
              <p>
                Zoomable candlestick and area charts powered by Chart.js. Track historical 
                highs, lows, daily variances, and inspect tabular data for all top NSE stocks.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon feature-icon--purple">
                <Zap size={24} />
              </div>
              <h3>What-If Scenario Simulation</h3>
              <p>
                Modify any row in the rolling 60-day input window directly from the dashboard 
                to test how the model responds to simulated market shocks and breakouts.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon feature-icon--green">
                <ShieldCheck size={24} />
              </div>
              <h3>Real-Time Financial Intel</h3>
              <p>
                Aggregated business headlines from Economic Times, Mint, and NDTV Profit, 
                along with curated video analysis from top market analysts.
              </p>
            </div>
          </div>
        </div>

        {/* ── How the AI Pipeline Works ── */}
        <div className="pipeline-section">
          <div className="section-title-wrap">
            <span className="section-eyebrow">Architecture Workflow</span>
            <h2 className="section-h2">How the Prediction Pipeline Operates</h2>
          </div>

          <div className="pipeline-steps">
            <div className="pipeline-step">
              <div className="step-num">01</div>
              <h4>Automated Market ETL</h4>
              <p>Daily ingestion of adjusted OHLCV price points from NSE via automated data pipelines into MongoDB.</p>
            </div>

            <div className="pipeline-step">
              <div className="step-num">02</div>
              <h4>MinMax Feature Scaling</h4>
              <p>Normalizes multi-dimensional features (Open, High, Low, Close, Volume) within uniform ranges.</p>
            </div>

            <div className="pipeline-step">
              <div className="step-num">03</div>
              <h4>Sequential LSTM Pass</h4>
              <p>2-layer LSTM units process 60 sequential timesteps to identify temporal dependencies.</p>
            </div>

            <div className="pipeline-step">
              <div className="step-num">04</div>
              <h4>Real-Time Projection</h4>
              <p>Inverse transformation translates scaled outputs into actual target prices displayed in your dashboard.</p>
            </div>
          </div>
        </div>

        {/* ── Pre-Login Bottom CTA ── */}
        <div className="hero-cta-banner">
          <div className="cta-banner__content">
            <h2>Ready to explore intelligent market analytics?</h2>
            <p>Access live index predictions, interactive charting, and real-time news in one unified dashboard.</p>
          </div>
          <button className="cta-banner__btn" onClick={onOpenLogin}>
            <span>Get Started Free</span>
            <ArrowRight size={18} />
          </button>
        </div>

      </div>
    </section>
  );
}
