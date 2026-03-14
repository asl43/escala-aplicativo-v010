// ============================================================
// ESCALA v5 — Validador de Tokens via Google Sheets
// Cole este código em: script.google.com → Novo projeto
// ============================================================

// ▶ ID da sua planilha (está na URL do Google Sheets)
// Ex: https://docs.google.com/spreadsheets/d/ESTE_ID_AQUI/edit
const SHEET_ID = 'COLE_O_ID_DA_SUA_PLANILHA_AQUI';
const ABA_NOME = 'Tokens'; // nome da aba na planilha

function doGet(e) {
  const token = (e.parameter.token || '').toUpperCase().trim();
  const resultado = validarToken(token);

  return ContentService
    .createTextOutput(JSON.stringify(resultado))
    .setMimeType(ContentService.MimeType.JSON);
}

function validarToken(token) {
  if (!token) {
    return { valido: false, mensagem: '❌ Token não informado.' };
  }

  try {
    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(ABA_NOME);
    const dados = sheet.getDataRange().getValues();

    // Pula a linha de cabeçalho (linha 1)
    for (let i = 1; i < dados.length; i++) {
      const tokenPlanilha  = String(dados[i][0]).toUpperCase().trim(); // Coluna A
      const validade       = String(dados[i][1]).trim();               // Coluna B
      const ativo          = String(dados[i][2]).toUpperCase().trim(); // Coluna C

      if (tokenPlanilha !== token) continue;

      // Verificar se está ativo
      if (ativo !== 'SIM') {
        return { valido: false, mensagem: '❌ Token desativado.' };
      }

      // Verificar validade
      if (validade.toUpperCase() === 'VITALICIO') {
        return { valido: true, mensagem: 'OK' };
      }

      const dataValidade = new Date(validade + 'T23:59:59');
      if (isNaN(dataValidade.getTime())) {
        return { valido: false, mensagem: '⚠️ Data de validade inválida.' };
      }

      if (new Date() <= dataValidade) {
        return { valido: true, mensagem: 'OK' };
      } else {
        return { valido: false, mensagem: '❌ Token expirado em ' + validade + '.' };
      }
    }

    return { valido: false, mensagem: '❌ Token não encontrado.' };

  } catch (err) {
    return { valido: false, mensagem: '⚠️ Erro interno. Tente novamente.' };
  }
}
