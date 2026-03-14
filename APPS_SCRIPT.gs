// ============================================================
// ESCALA v5 — Validador + Gerador de Tokens via Google Sheets
// Cole este código em: script.google.com → Novo projeto
// ============================================================

// ▶ ID da sua planilha (está na URL do Google Sheets)
const SHEET_ID   = 'COLE_O_ID_DA_SUA_PLANILHA_AQUI';
const ABA_TOKENS = 'Tokens';  // aba com a lista de tokens
const ABA_GERAR  = 'Gerador'; // aba com o painel de geração

// ============================================================
// API — validação chamada pelo app
// ============================================================
function doGet(e) {
  const token = (e.parameter.token || '').toUpperCase().trim();
  const resultado = validarToken(token);
  return ContentService
    .createTextOutput(JSON.stringify(resultado))
    .setMimeType(ContentService.MimeType.JSON);
}

function validarToken(token) {
  if (!token) return { valido: false, mensagem: '❌ Token não informado.' };
  try {
    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(ABA_TOKENS);
    const dados = sheet.getDataRange().getValues();
    for (let i = 1; i < dados.length; i++) {
      const tokenPlanilha = String(dados[i][0]).toUpperCase().trim();
      const validade      = String(dados[i][1]).trim();
      const ativo         = String(dados[i][2]).toUpperCase().trim();
      if (tokenPlanilha !== token) continue;
      if (ativo !== 'SIM') return { valido: false, mensagem: '❌ Token desativado.' };
      if (validade.toUpperCase() === 'VITALICIO') return { valido: true, mensagem: 'OK' };
      const dataValidade = new Date(validade + 'T23:59:59');
      if (isNaN(dataValidade.getTime())) return { valido: false, mensagem: '⚠️ Data inválida.' };
      return new Date() <= dataValidade
        ? { valido: true, mensagem: 'OK' }
        : { valido: false, mensagem: '❌ Token expirado em ' + validade + '.' };
    }
    return { valido: false, mensagem: '❌ Token não encontrado.' };
  } catch (err) {
    return { valido: false, mensagem: '⚠️ Erro interno. Tente novamente.' };
  }
}

// ============================================================
// GERADOR — chamado pelo menu na planilha
// ============================================================
function gerarToken() {
  const ss       = SpreadsheetApp.openById(SHEET_ID);
  const abaGer   = ss.getSheetByName(ABA_GERAR);
  const abaTokens = ss.getSheetByName(ABA_TOKENS);

  const prefixo    = String(abaGer.getRange('B2').getValue()).toUpperCase().trim() || 'VENDA';
  const tipoVal    = String(abaGer.getRange('B3').getValue()).trim();
  const quantidade = parseInt(abaGer.getRange('B4').getValue()) || 1;
  const cliente    = String(abaGer.getRange('B5').getValue()).trim();

  // Calcular validade
  let validade = 'vitalicio';
  const dias = parseInt(tipoVal);
  if (!isNaN(dias) && dias > 0) {
    const d = new Date();
    d.setDate(d.getDate() + dias);
    validade = Utilities.formatDate(d, Session.getScriptTimeZone(), 'yyyy-MM-dd');
  }

  const tokensGerados = [];
  for (let i = 0; i < quantidade; i++) {
    const token = prefixo + '-' + gerarCodigo(6);
    const agora = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'dd/MM/yyyy HH:mm');
    abaTokens.appendRow([token, validade, 'SIM', cliente, agora]);
    tokensGerados.push(token);
  }

  // Mostrar resultado na aba Gerador
  abaGer.getRange('B7').setValue(tokensGerados.join('\n'));

  SpreadsheetApp.getUi().alert(
    '✅ ' + quantidade + ' token(s) gerado(s)!\n\n' +
    tokensGerados.join('\n') + '\n\n' +
    'Validade: ' + (validade === 'vitalicio' ? 'Vitalício' : validade) + '\n\n' +
    'Já foram salvos na aba Tokens.'
  );
}

function gerarCodigo(tamanho) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let r = '';
  for (let i = 0; i < tamanho; i++) r += chars[Math.floor(Math.random() * chars.length)];
  return r;
}

// ============================================================
// SETUP — rode UMA VEZ para criar as abas e o menu
// ============================================================
function configurarPlanilha() {
  const ss = SpreadsheetApp.openById(SHEET_ID);

  // Aba Tokens
  let abaT = ss.getSheetByName(ABA_TOKENS) || ss.insertSheet(ABA_TOKENS);
  abaT.clearContents();
  abaT.getRange('A1:E1').setValues([['TOKEN','VALIDADE','ATIVO','CLIENTE','GERADO EM']]);
  abaT.getRange('A1:E1').setFontWeight('bold').setBackground('#0a0f1e').setFontColor('#00d4ff');
  abaT.setColumnWidths(1, 5, 160);
  abaT.appendRow(['DEMO-EXEMPLO', 'vitalicio', 'SIM', 'Teste', new Date()]);

  // Aba Gerador
  let abaG = ss.getSheetByName(ABA_GERAR) || ss.insertSheet(ABA_GERAR);
  abaG.clearContents();
  const instrucoes = [
    ['🔑 GERADOR DE TOKENS — Escala v5', ''],
    ['Prefixo do token:', 'VENDA'],
    ['Validade (número de dias ou "vitalicio"):', '365'],
    ['Quantidade de tokens:', '1'],
    ['Nome do cliente (opcional):', ''],
    ['────────────────────────────', ''],
    ['Tokens gerados:', '(use o menu 🔑 Tokens → Gerar)'],
  ];
  abaG.getRange(1, 1, instrucoes.length, 2).setValues(instrucoes);
  abaG.getRange('A1').setFontSize(13).setFontWeight('bold');
  abaG.getRange('A2:A7').setFontWeight('bold');
  abaG.setColumnWidth(1, 300);
  abaG.setColumnWidth(2, 260);

  SpreadsheetApp.getUi().alert(
    '✅ Planilha configurada com sucesso!\n\n' +
    'Agora use o menu "🔑 Tokens" no topo da planilha para gerar tokens.\n\n' +
    'Obs: O menu aparece toda vez que você abrir a planilha.'
  );
}

// Menu aparece automaticamente ao abrir a planilha
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('🔑 Tokens')
    .addItem('✨ Gerar novo(s) token(s)', 'gerarToken')
    .addSeparator()
    .addItem('⚙️ Configurar planilha', 'configurarPlanilha')
    .addToUi();
}
