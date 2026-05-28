// keys.js — define metadados das teclas e helpers de nomenclatura
export const KEY_DEFS = {
  a: { audio: 'a.wav', anglo: 'C', octave: 'Dó4' },
  w: { audio: 'w.wav', anglo: 'C#', octave: 'Dó#4' },
  s: { audio: 's.wav', anglo: 'D', octave: 'Ré4' },
  e: { audio: 'e.wav', anglo: 'D#', octave: 'Ré#4' },
  d: { audio: 'd.wav', anglo: 'E', octave: 'Mi4' },
  f: { audio: 'f.wav', anglo: 'F', octave: 'Fá4' },
  t: { audio: 't.wav', anglo: 'F#', octave: 'Fá#4' },
  g: { audio: 'g.wav', anglo: 'G', octave: 'Sol4' },
  y: { audio: 'y.wav', anglo: 'G#', octave: 'Sol#4' },
  h: { audio: 'h.wav', anglo: 'A', octave: 'Lá4' },
  u: { audio: 'u.wav', anglo: 'A#', octave: 'Lá#4' },
  j: { audio: 'j.wav', anglo: 'B', octave: 'Si4' },
  k: { audio: 'k.wav', anglo: 'C', octave: 'Dó5' },
  o: { audio: 'o.wav', anglo: 'C#', octave: 'Dó#5' },
  l: { audio: 'l.wav', anglo: 'D', octave: 'Ré5' },
  p: { audio: 'p.wav', anglo: 'D#', octave: 'Ré#5' },
  ';': { audio: ';.wav', anglo: 'E', octave: 'Mi5' },
};

export const getAnnouncementForKey = (key, namingMode = 'anglo') => {
  const def = KEY_DEFS[key] || {};
  const anglo = def.anglo;
  const oct = def.octave;
  if (namingMode === 'anglo') return anglo || `Nota ${key.toUpperCase()}`;
  if (namingMode === 'oitava') return oct || `Nota ${key.toUpperCase()}`;
  if (anglo && oct) return `${anglo} / ${oct}`;
  return anglo || oct || `Nota ${key.toUpperCase()}`;
};
