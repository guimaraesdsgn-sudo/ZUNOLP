## Integracao do formulario com Google Sheets

### 1) Criar a planilha

Crie uma planilha no Google Sheets com as colunas:

- `criadoEm`
- `nome`
- `whatsapp`
- `faturamento`
- `origem`
- `pagina`

### 2) Criar o Apps Script

No Sheets, abra `Extensoes > Apps Script` e cole este codigo:

```javascript
// Opcional: evita erro "doGet not found" ao abrir a URL no navegador.
function doGet() {
  return ContentService.createTextOutput("OK")
    .setMimeType(ContentService.MimeType.TEXT);
}

function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Leads");
  if (!sheet) {
    sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet("Leads");
    sheet.appendRow(["criadoEm", "nome", "whatsapp", "faturamento", "origem", "pagina"]);
  }

  var data = {};
  try {
    data = JSON.parse(e.postData.contents || "{}");
  } catch (err) {
    data = {};
  }

  sheet.appendRow([
    data.criadoEm || new Date().toISOString(),
    data.nome || "",
    data.whatsapp || "",
    data.faturamento || "",
    data.origem || "",
    data.pagina || ""
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}
```

Se ao abrir a URL no navegador aparecer **Script function not found: doGet**, isso e normal: o navegador faz um GET. Inclua a funcao `doGet` acima e faca **Implantar > Gerenciar implantacoes > Editar > Versao nova** para publicar de novo.

### 3) Publicar o Web App

1. Clique em `Implantar > Nova implantacao`.
2. Tipo: `Aplicativo da web`.
3. `Executar como`: voce mesmo.
4. `Quem tem acesso`: `Qualquer pessoa`.
5. Copie a URL final do Web App.

### 4) Colar no formulario

No `index.html`, no formulario `#hero-form`, preencha:

```html
<form id="hero-form" data-sheet-endpoint="SUA_URL_DO_WEB_APP_AQUI" novalidate>
```

Pronto. O formulario passara a enviar os leads para a aba `Leads`.
