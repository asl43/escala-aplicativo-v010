# 📅 Escala de Serviço — PWA

Sistema completo de gerenciamento de escalas de serviço como Progressive Web App instalável.

## 🚀 Como usar

### Opção 1 — Abrir localmente
Basta abrir o arquivo `index.html` no navegador. Todas as funções funcionam offline.

### Opção 2 — Hospedar e instalar como app
Para instalar como app no celular, o arquivo precisa ser hospedado em um servidor HTTPS.

**Opções gratuitas de hospedagem:**
- [GitHub Pages](https://pages.github.com/) — gratuito, HTTPS automático
- [Netlify](https://netlify.com) — arraste a pasta e pronto
- [Vercel](https://vercel.com) — deploy em segundos

**Instalar no celular após hospedar:**
- **Android (Chrome):** Abrirá um banner "Adicionar à tela inicial" automaticamente
- **iPhone (Safari):** Toque em Compartilhar → "Adicionar à Tela de Início"

## 📁 Arquivos

```
escala-pwa/
├── index.html      ← App principal (todas as funcionalidades)
├── manifest.json   ← Configuração do PWA
├── sw.js           ← Service Worker (suporte offline)
├── icons/
│   ├── icon-192.png
│   └── icon-512.png
└── README.md
```

## ✅ Funcionalidades preservadas

- ✅ Escala Recorrente (12x24-12x72, 12x24-12x48, 12x24-12x96, Diário 8h, 24x48, 24x72)
- ✅ Escala Personalizada (por horas ou por dias)
- ✅ Escala de 2 dias consecutivos
- ✅ Serviços Únicos (Extra, Falta/Atestado, Férias) com quantidade de dias
- ✅ Dispensa Médica automática (acima de 8 dias de falta)
- ✅ Calendário mensal com cores por tipo
- ✅ Visualização semanal
- ✅ Dashboard com mini calendário, resumo e próximos serviços
- ✅ Estatísticas completas (8 métricas)
- ✅ Filtros avançados (nome, função, tipo, período)
- ✅ Exportar CSV
- ✅ Editar e excluir escalas
- ✅ Modo escuro / claro
- ✅ Imprimir e exportar PDF
- ✅ QR Code na impressão
- ✅ Dados salvos localmente (localStorage)
- ✅ Funciona 100% offline

## 🆕 Novidades do PWA

- 📲 Instalável como app nativo no celular
- 🔲 Navegação por abas inferior (Home, Calendário, Adicionar, Escalas, Stats)
- 🎨 Visual moderno e responsivo
- ⚡ Carregamento rápido com Service Worker
- 🔔 Notificações toast de feedback
- 📱 Interface otimizada para toque
