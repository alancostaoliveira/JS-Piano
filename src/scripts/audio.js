// audio.js — gerenciador de áudio com pooling.
// Fornece duas funções principais:
//  - init(): pré-carrega um pequeno pool de `Audio` por nota (reduz latência)
//  - play(key): reproduz uma instância disponível do pool (ou cria pontualmente)
//
// Parâmetros:
//  - KEY_DEFS: objeto com metadados das teclas (nome do arquivo)
//  - getVolume: função que retorna o volume atual (0.0 - 1.0)
//  - poolSize: quantas instâncias pré-carregar por nota (padrão 4)
export function createAudioManager(KEY_DEFS, getVolume, poolSize = 4) {
  const pools = {};

  // Pré-carrega `poolSize` instâncias Audio para cada nota conhecida.
  // Isso ajuda a reduzir a latência e permite sobreposição de notas.
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

  // Reproduz uma nota usando o pool. Procura uma instância livre (paused/ended),
  // senão rotaciona o pool (substitui a instância mais antiga).
  function play(key) {
    const pool = pools[key];
    if (!pool || pool.length === 0) {
      // fallback: cria uma instância única se não houver pool
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
      // Reinicia playback ao início. Alguns navegadores podem lançar se não suportado.
      audio.currentTime = 0;
    } catch (e) {}
    audio.volume = typeof getVolume === 'function' ? getVolume() : 0.5;
    audio.play().catch(() => {});

    // Coloca a instância de volta no final do pool para reutilização.
    if (!pool.includes(audio)) pool.push(audio);
    else pool.push(pool.shift());
  }

  return { init, play };
}
