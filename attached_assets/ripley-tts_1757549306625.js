
/**
 * ripley-tts.js
 * Lightweight in‑app narrator for web apps (uses the Web Speech API).
 * Features: play/pause/stop, queue, auto-read updates, voice/volume/rate/pitch controls,
 * focus read (reads currently focused input/textarea/contenteditable),
 * safe fallback if SpeechSynthesis is unavailable.
 */

(function (global) {
  const tts = {
    supported: 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window,
    _queue: [],
    _speaking: false,
    _current: null,
    opts: {
      voice: null,
      rate: 1.0,
      pitch: 1.0,
      volume: 1.0
    },
    voices: [],

    init() {
      if (!this.supported) {
        console.warn('[Ripley TTS] Web Speech API not supported. Falling back to no-op.');
        return;
      }
      const loadVoices = () => {
        this.voices = window.speechSynthesis.getVoices();
        // Attempt to pick an English Jamaican/Caribbean voice if present; otherwise first English voice
        let preferred = this.voices.find(v => /Jamaica|Caribbean/i.test(v.name));
        if (!preferred) preferred = this.voices.find(v => /English/i.test(v.lang)) || this.voices[0];
        this.opts.voice = preferred || null;
      };
      window.speechSynthesis.onvoiceschanged = loadVoices;
      loadVoices();

      // Auto-read elements with [data-tts="auto"]
      const observer = new MutationObserver((muts) => {
        for (const m of muts) {
          if (m.type === 'childList' || m.type === 'characterData') {
            const el = m.target.nodeType === 3 ? m.target.parentElement : m.target;
            if (el && el.closest('[data-tts="auto"]')) {
              const text = el.closest('[data-tts="auto"]').innerText.trim();
              if (text) this.say(text, { interrupt: true });
            }
          }
        }
      });
      observer.observe(document.documentElement, { childList: true, subtree: true, characterData: true });

      // Focus-to-read for inputs/textareas/contenteditable
      document.addEventListener('focusin', (e) => {
        const el = e.target;
        if (!el) return;
        if (el.matches('input, textarea, [contenteditable="true"]')) {
          const text = (el.value ?? el.innerText ?? '').trim();
          if (text) this.say(text, { interrupt: true });
        }
      });
    },

    /** Queue text to speak */
    say(text, { interrupt = false } = {}) {
      if (!this.supported) return;
      if (interrupt) this.stop();
      const utter = new SpeechSynthesisUtterance(text);
      if (this.opts.voice) utter.voice = this.opts.voice;
      utter.rate = this.opts.rate;
      utter.pitch = this.opts.pitch;
      utter.volume = this.opts.volume;
      utter.onend = () => {
        this._speaking = false;
        this._current = null;
        this._dequeue();
      };
      utter.onerror = (e) => {
        console.error('[Ripley TTS] error:', e);
        this._speaking = false;
        this._current = null;
        this._dequeue();
      };
      this._queue.push(utter);
      this._dequeue();
    },

    _dequeue() {
      if (this._speaking || this._queue.length === 0) return;
      const next = this._queue.shift();
      this._current = next;
      this._speaking = true;
      window.speechSynthesis.speak(next);
    },

    pause() {
      if (!this.supported) return;
      if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
        window.speechSynthesis.pause();
      }
    },

    resume() {
      if (!this.supported) return;
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }
    },

    stop() {
      if (!this.supported) return;
      this._queue.length = 0;
      window.speechSynthesis.cancel();
      this._speaking = false;
      this._current = null;
    },

    setRate(v) { this.opts.rate = Math.max(0.5, Math.min(2, v)); },
    setPitch(v) { this.opts.pitch = Math.max(0, Math.min(2, v)); },
    setVolume(v) { this.opts.volume = Math.max(0, Math.min(1, v)); },
    selectVoice(name) {
      if (!this.supported) return;
      const found = this.voices.find(v => v.name === name);
      if (found) this.opts.voice = found;
    }
  };

  // UI helper to wire basic controls if desired
  tts.mountControls = function(container) {
    if (!this.supported) {
      container.innerHTML = '<div style="padding:.75rem;border:1px solid #ddd;border-radius:.5rem">Your browser does not support speech synthesis.</div>';
      return;
    }
    const voicesOptions = this.voices.map(v => `<option value="${v.name}">${v.name} (${v.lang})</option>`).join('');
    container.innerHTML = `
      <div style="display:flex;gap:.5rem;flex-wrap:wrap;align-items:center">
        <select id="tts-voice">${voicesOptions}</select>
        <label>Rate <input id="tts-rate" type="range" min="0.5" max="2" step="0.1" value="${this.opts.rate}"></label>
        <label>Pitch <input id="tts-pitch" type="range" min="0" max="2" step="0.1" value="${this.opts.pitch}"></label>
        <label>Volume <input id="tts-volume" type="range" min="0" max="1" step="0.05" value="${this.opts.volume}"></label>
        <button id="tts-play">Play</button>
        <button id="tts-pause">Pause</button>
        <button id="tts-resume">Resume</button>
        <button id="tts-stop">Stop</button>
        <input id="tts-input" placeholder="Type and press Play" style="flex:1;min-width:200px">
      </div>
    `;
    const $ = (id) => container.querySelector(id);
    $('#tts-voice').addEventListener('change', e => tts.selectVoice(e.target.value));
    $('#tts-rate').addEventListener('input', e => tts.setRate(parseFloat(e.target.value)));
    $('#tts-pitch').addEventListener('input', e => tts.setPitch(parseFloat(e.target.value)));
    $('#tts-volume').addEventListener('input', e => tts.setVolume(parseFloat(e.target.value)));
    $('#tts-play').addEventListener('click', () => {
      const text = $('#tts-input').value.trim() || document.querySelector('[data-tts="auto"]')?.innerText.trim() || '';
      if (text) tts.say(text, { interrupt: true });
    });
    $('#tts-pause').addEventListener('click', () => tts.pause());
    $('#tts-resume').addEventListener('click', () => tts.resume());
    $('#tts-stop').addEventListener('click', () => tts.stop());
  };

  global.RipleyTTS = tts;
  // auto-init
  document.addEventListener('DOMContentLoaded', () => tts.init());
})(window);
