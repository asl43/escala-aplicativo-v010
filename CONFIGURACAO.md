# 🔐 Escala v5 — Configuração do Sistema de Token

## Visão Geral

O token é validado **no servidor** (Google Sheets + Apps Script).
Ninguém que abrir o app consegue ver ou burlar os tokens.

---

## PASSO 1 — Criar a Planilha de Tokens

1. Acesse [sheets.google.com](https://sheets.google.com) e crie uma nova planilha
2. Renomeie a aba para **Tokens** (clique 2x na aba "Página1")
3. Na linha 1, crie os cabeçalhos:

| A         | B          | C      |
|-----------|------------|--------|
| TOKEN     | VALIDADE   | ATIVO  |

4. A partir da linha 2, adicione seus tokens:

| A              | B            | C    |
|----------------|--------------|------|
| COMPRA-ABC1    | vitalicio    | SIM  |
| COMPRA-ABC2    | 2026-12-31   | SIM  |
| COMPRA-ABC3    | 2026-06-30   | SIM  |
| TOKEN-TESTE    | vitalicio    | NÃO  |

- **Coluna A** — Token (qualquer texto, sem espaços)
- **Coluna B** — `vitalicio` ou data no formato `AAAA-MM-DD`
- **Coluna C** — `SIM` para ativo, `NÃO` para revogar acesso

5. Copie o **ID da planilha** da URL:
   `https://docs.google.com/spreadsheets/d/**ESTE_ID**/edit`

---

## PASSO 2 — Criar o Google Apps Script

1. Acesse [script.google.com](https://script.google.com)
2. Clique em **"Novo projeto"**
3. Apague o código padrão e cole o conteúdo do arquivo `APPS_SCRIPT.gs`
4. No topo do código, substitua:
   ```
   const SHEET_ID = 'COLE_O_ID_DA_SUA_PLANILHA_AQUI';
   ```
   pelo ID que você copiou no passo anterior

5. Salve o projeto (Ctrl+S) e dê um nome, ex: `Escala Tokens`

---

## PASSO 3 — Publicar o Script como API

1. No Apps Script, clique em **"Implantar"** → **"Nova implantação"**
2. Clique na engrenagem ⚙️ e escolha **"App da Web"**
3. Configure:
   - **Descrição:** Validador de Tokens Escala
   - **Executar como:** Eu (sua conta)
   - **Quem tem acesso:** **Qualquer pessoa** ⚠️ (necessário para o app funcionar)
4. Clique em **"Implantar"**
5. Autorize as permissões quando solicitado
6. Copie a **URL do app da Web** gerada

---

## PASSO 4 — Configurar o App

1. Abra o arquivo `index.html`
2. Encontre a linha:
   ```javascript
   const APPS_SCRIPT_URL = 'COLE_SUA_URL_AQUI';
   ```
3. Substitua pelo URL copiado no passo anterior
4. Salve e suba para o Netlify/Vercel

---

## PASSO 5 — Hospedar no Netlify (gratuito)

1. Acesse [netlify.com](https://netlify.com) e crie uma conta gratuita
2. Arraste a pasta `escala-sheets` direto no painel do Netlify
3. Seu app estará online em segundos com um link como:
   `https://seu-nome.netlify.app`

---

## Gerenciando Tokens no Dia a Dia

### ✅ Novo cliente pagou?
Adicione uma linha na planilha com o token novo → Coluna C = `SIM`

### ❌ Revogar acesso?
Mude a Coluna C para `NÃO` → Acesso bloqueado imediatamente

### ⏰ Token expirado?
Mude a data na Coluna B ou coloque `vitalicio`

**Não precisa mexer no código nem republicar o app!**

---

## Como gerar tokens únicos

Use este padrão simples:
- `NOME-XXXX` onde XXXX são 4 letras/números aleatórios
- Exemplos: `JOAO-K3M9`, `MARIA-7XPQ`, `VIP-2026`

Ou use um gerador online: [passwordsgenerator.net](https://passwordsgenerator.net)

---

## Segurança

- ✅ Tokens ficam **só na sua planilha**, invisíveis no código
- ✅ Revogar acesso funciona **em tempo real**
- ✅ Funciona offline por até 24h com cache no dispositivo
- ✅ Revalida silenciosamente em background quando volta online
- ⚠️ O Apps Script tem limite de **100.000 chamadas/dia** (gratuito) — mais que suficiente

---

## Suporte

Problemas? Verifique:
1. O ID da planilha está correto no `APPS_SCRIPT.gs`?
2. A aba se chama exatamente `Tokens`?
3. O script foi publicado como "Qualquer pessoa"?
4. A URL no `index.html` está correta e sem espaços?
