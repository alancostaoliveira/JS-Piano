import { KEY_DEFS, getAnnouncementForKey } from './keys.js';
import { createAudioManager } from './audio.js';

export function init() {
  // Seletores e estado (local ao init para evitar referência a `document` no import)
  const pianoKeys = document.querySelectorAll('.piano-keys .key');
  const volumeSlider = document.querySelector('.volume-slider input');
  const keysCheck = document.querySelector('.keys-check input');
  let mappedKeys = [];
  const pressedKeys = new Set();

  let currentVolume = volumeSlider ? Number(volumeSlider.value) : 0.5;
  const liveRegion = document.getElementById('live-region');
  const noteFeedback = document.getElementById('note-feedback');
  let liveTimeout = null;
  const namingModeSelect = document.getElementById('naming-mode-select');
  let namingMode = namingModeSelect ? namingModeSelect.value : 'anglo';

  // criar e inicializar o gerenciador de áudio
  const audioManager = createAudioManager(KEY_DEFS, () => currentVolume, 4);

  const updateAriaLabels = () => {
    pianoKeys.forEach((el) => {
      const k = el.dataset.key;
      const announcement = getAnnouncementForKey(k, namingMode);
      const label = announcement
        ? `Tecla ${k.toUpperCase()} — ${announcement}`
        : `Tecla ${k.toUpperCase()}`;
      el.setAttribute('aria-label', label);
    });
  };

  const playTune = (key, options = {}) => {
    if (!key) return;
    const hold = !!options.hold;
    if (audioManager && typeof audioManager.play === 'function')
      audioManager.play(key);

    if (liveRegion) {
      clearTimeout(liveTimeout);
      const announce = getAnnouncementForKey(key, namingMode);
      liveRegion.textContent = announce;
      liveTimeout = setTimeout(() => (liveRegion.textContent = ''), 1000);
    }

    if (noteFeedback) {
      const announce = getAnnouncementForKey(key, namingMode);
      noteFeedback.textContent = `Nota tocada: ${announce}`;
      noteFeedback.classList.remove('is-updated');
      void noteFeedback.offsetWidth;
      noteFeedback.classList.add('is-updated');
    }

    const clickedKey = document.querySelector(`[data-key=\"${key}\"]`);
    if (clickedKey) {
      clickedKey.classList.remove('is-updated');
      void clickedKey.offsetWidth;
      clickedKey.classList.add('is-updated');
      if (hold) {
        clickedKey.classList.add('pressed');
        clickedKey.setAttribute('aria-pressed', 'true');
      } else {
        clickedKey.classList.add('active');
        clickedKey.setAttribute('aria-pressed', 'true');
        setTimeout(() => {
          clickedKey.classList.remove('active');
          clickedKey.classList.remove('is-updated');
          if (!clickedKey.classList.contains('pressed'))
            clickedKey.setAttribute('aria-pressed', 'false');
        }, 150);
      }
    }
  };

  const bindKeyElement = (keyEl) => {
    if (keyEl.tagName.toLowerCase() !== 'button') {
      keyEl.setAttribute('role', 'button');
      keyEl.setAttribute('tabindex', '0');
    }

    const announcement = getAnnouncementForKey(keyEl.dataset.key, namingMode);
    const label = announcement
      ? `Tecla ${keyEl.dataset.key.toUpperCase()} — ${announcement}`
      : `Tecla ${keyEl.dataset.key.toUpperCase()}`;
    keyEl.setAttribute('aria-label', label);
    keyEl.setAttribute('aria-pressed', 'false');
    keyEl.setAttribute('aria-describedby', 'note-feedback');

    keyEl.addEventListener('focus', () => {
      if (liveRegion) {
        clearTimeout(liveTimeout);
        liveRegion.textContent = getAnnouncementForKey(
          keyEl.dataset.key,
          namingMode,
        );
        liveTimeout = setTimeout(() => (liveRegion.textContent = ''), 800);
      }
    });

    keyEl.addEventListener('click', () =>
      playTune(keyEl.dataset.key, { hold: false }),
    );

    keyEl.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
        e.preventDefault();
        playTune(keyEl.dataset.key, { hold: false });
      }
    });

    mappedKeys.push(keyEl.dataset.key);
  };

  const handleDocumentKeydown = (e) => {
    const k = e.key;
    if (!mappedKeys.includes(k)) return;
    if (e.repeat || pressedKeys.has(k)) {
      e.preventDefault();
      return;
    }
    pressedKeys.add(k);
    e.preventDefault();
    playTune(k, { hold: true });
  };

  const handleDocumentKeyup = (e) => {
    const k = e.key;
    if (!mappedKeys.includes(k)) return;
    if (!pressedKeys.has(k)) return;
    pressedKeys.delete(k);
    const el = document.querySelector(`[data-key=\"${k}\"]`);
    if (el) {
      el.classList.remove('pressed');
      el.classList.remove('is-updated');
      el.setAttribute('aria-pressed', 'false');
    }
  };

  const handleVolume = (e) => {
    currentVolume = Number(e.target.value);
  };

  const showHideKeys = () => {
    pianoKeys.forEach((key) => key.classList.toggle('hide'));
  };

  const addDocumentListeners = () => {
    document.addEventListener('keydown', handleDocumentKeydown);
    document.addEventListener('keyup', handleDocumentKeyup);
  };

  const initVolumeAndToggle = () => {
    if (volumeSlider) volumeSlider.addEventListener('input', handleVolume);
    if (keysCheck) keysCheck.addEventListener('click', showHideKeys);
    if (namingModeSelect)
      namingModeSelect.addEventListener('change', (e) => {
        namingMode = e.target.value;
        updateAriaLabels();
      });
  };

  // startup
  mappedKeys = [];
  pianoKeys.forEach(bindKeyElement);
  audioManager.init();
  updateAriaLabels();
  addDocumentListeners();
  initVolumeAndToggle();
}
