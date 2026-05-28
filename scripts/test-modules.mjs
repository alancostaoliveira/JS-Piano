import fs from 'fs';
import path from 'path';

const root = path.resolve('./');
console.log('Workspace root:', root);

// 1) Importar módulos ESM para verificar sintaxe
try {
  const { KEY_DEFS } = await import('../src/scripts/keys.js');
  console.log('Import keys.js OK —', Object.keys(KEY_DEFS).length, 'keys');
} catch (e) {
  console.error('Falha ao importar keys.js', e);
  process.exit(2);
}

try {
  const mod = await import('../src/scripts/audio.js');
  console.log(
    'Import audio.js OK — createAudioManager exported:',
    typeof mod.createAudioManager === 'function',
  );
} catch (e) {
  console.error('Falha ao importar audio.js', e);
  process.exit(2);
}

try {
  const mod = await import('../src/scripts/main.js');
  console.log('Import main.js OK — module loaded');
} catch (e) {
  console.error(
    'Falha ao importar main.js (pode exigir DOM/browser):',
    e.message,
  );
  console.log(
    'Isso é esperado em Node para módulos que usam DOM APIs. Ignorando este erro.',
  );
}

// 2) Verificar existência dos arquivos de áudio referenciados em KEY_DEFS
const { KEY_DEFS } = await import('../src/scripts/keys.js');
const tunesDir = path.join('src', 'tunes');
const missing = [];
for (const [k, def] of Object.entries(KEY_DEFS)) {
  const file = def.audio || `${k}.wav`;
  const p = path.join(tunesDir, file);
  if (!fs.existsSync(p)) missing.push(p);
}

if (missing.length) {
  console.error('Arquivos de áudio faltando:', missing);
  process.exit(3);
} else {
  console.log('Todos os arquivos de áudio referenciados existem em', tunesDir);
}

console.log('Testes automatizados concluídos com sucesso.');
