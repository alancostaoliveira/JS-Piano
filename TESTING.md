TESTES MANUAIS — Piano Simulator JS

Objetivo

- Validar funcionamento do piano no navegador, acessibilidade e responsividade.

Pré-requisitos

- Navegador moderno (Chrome/Edge/Firefox/Safari).
- Leitor de tela opcional (NVDA, VoiceOver).

Passos principais

1. Abrir a página

- Abra `index.html` no navegador (arrastar o arquivo para a aba ou usar um servidor local).

2. Teste básico de áudio

- Clique em várias teclas com o mouse; confirme que cada tecla reproduz o som correspondente.
- Toque várias teclas em rápida sucessão para verificar sobreposição (polyphony).
- Ajuste o controle de volume e confirme alteração no volume das notas.

3. Teste do teclado físico

- Foque a página e pressione as teclas mapeadas (a, w, s, e, d, f, t, g, y, h, u, j, k, o, l, p, ;).
- Segure uma tecla: a tecla deve receber o estado visual de "pressed" enquanto segurada.
- Repetição: segurar a tecla deve tocar apenas uma vez (evitar retrigger indesejado).

4. Teste do seletor de nomenclatura

- Alterne entre "Anglo", "Com oitava" e "Ambos" e confirme que o `aria-label`/live region muda conforme opção.

5. Live region e feedback visual

- Ao tocar, verifique que a área visível `#note-feedback` atualiza com a nota.
- Com leitor de tela ativo, confirme que a `#live-region` anuncia a nota tocada.
- Ao focar uma tecla com Tab, a `live-region` deve anunciar a nota (timeout curto).

6. Teste de acessibilidade

- Navegue usando Tab e ative as teclas com Enter/Space.
- Verifique `aria-pressed`, `aria-label` e `aria-describedby` nas teclas com as ferramentas de inspeção.

7. Responsividade

- Em devtools/mobile view, confirme que o teclado se ajusta: teclas menores, rolagem horizontal em telas estreitas.

8. Verificação de arquivos

- Confirme que todos os arquivos em `src/tunes/` correspondem aos nomes em `src/scripts/keys.js`.

Relatório de problemas

- Anote passos para reproduzir, navegador/versão, e copie mensagens do console.

Observações

- `main.js` está modularizado; alguns testes automáticos (Node) verificam apenas importação de módulos.

Fim
