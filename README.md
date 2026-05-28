# Piano Simulator JS

Projeto: simulador de piano em JavaScript (vanilla). Fornece interação por mouse, teclado físico e suporte básico a leitores de tela.

Demo

Teste a demo hospedada em: https://alancostaoliveira.github.io/JS-Piano/

Como executar (desenvolvimento)

1. Instalar dependências (necessário Node.js para scripts de teste/servidor):

```bash
npm install
```

2. Executar servidor local (recomendado para testes no navegador):

```bash
npm start
# abre http://localhost:8080/
```

3. Testes automáticos (verifica importação de módulos e arquivos de áudio):

```bash
npm test
```

Testes manuais

- Abra `http://localhost:8080/` no navegador.
- Clique nas teclas ou pressione as teclas mapeadas: `a w s e d f t g y h u j k o l p ;`.
- Ajuste volume, altere nomenclatura e verifique `#note-feedback` e `#live-region`.

Arquitetura e notas técnicas

- `src/scripts/keys.js`: metadados das teclas (`KEY_DEFS`) e helper de anúncio.
- `src/scripts/audio.js`: `createAudioManager(...)` — gerenciador de áudio com pooling e pré-carregamento.
- `src/scripts/main.js`: ponto de entrada da app; exporta `init()` (chamado por `index.html`).
- `src/scripts/engine.js`: versão antiga mantida por compatibilidade, a app usa agora `main.js`.

Checklist de qualidade

- [x] Modelagem de dados das teclas
- [x] Gerenciador de áudio com pré-carregamento
- [x] Responsividade (media queries)
- [x] Acessibilidade básica (aria-describedby, live region, lang)
- [x] Manuseio aprimorado do teclado (keydown/keyup)
- [x] Modularização em ES modules
- [x] Testes automáticos básicos (import/module + arquivos de áudio)

Próximos passos sugeridos

- Refinar mensagens do `live-region` para leitores de tela.
- Adicionar pré-commit/CI que roda `npm test`.
- Abrir issue se encontrar comportamentos estranhos em navegadores móveis ou com leitores de tela.
