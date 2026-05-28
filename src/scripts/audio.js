// audio.js — gerenciador de áudio com pooling. Cria instância ligada a um getter de volume.
export function createAudioManager(KEY_DEFS, getVolume, poolSize = 4) {
  const pools = {};

  function init() {
    Object.keys(KEY_DEFS).forEach((k) => {
      const def = KEY_DEFS[k] || {};
      const file = def.audio ? def.audio : `${k}.wav`;
      const src = `src/tunes/${file}`;
      pools[k] = [];
      for (let i = 0; i < poolSize; i++) {
        const a = new Audio(src);
        a.preload = 'auto';
        pools[k].push(a);
      }
    });
  }

  function play(key) {
    const pool = pools[key];
    if (!pool || pool.length === 0) {
      const src = KEY_DEFS[key]
        ? `src/tunes/${KEY_DEFS[key].audio}`
        : `src/tunes/${key}.wav`;
      const a = new Audio(src);
      a.volume = typeof getVolume === 'function' ? getVolume() : 0.5;
      a.play().catch(() => {});
      return;
    }

    let audio = pool.find((p) => p.paused || p.ended);
    if (!audio) audio = pool.shift();
    if (!audio || !audio.src)
      audio = new Audio(pool[0] ? pool[0].src : `src/tunes/${key}.wav`);
    try {
      audio.currentTime = 0;
    } catch (e) {}
    audio.volume = typeof getVolume === 'function' ? getVolume() : 0.5;
    audio.play().catch(() => {});

    if (!pool.includes(audio)) pool.push(audio);
    else pool.push(pool.shift());
  }

  return { init, play };
}
