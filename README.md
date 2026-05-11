# Site Zuno

Estrutura base de site estatico em producao com separacao de arquivos, SEO tecnico e organizacao minima para evolucao.

## Estrutura

- `index.html`: pagina principal
- `assets/css/main.css`: camada de estilos externa
- `assets/js/main.js`: scripts da pagina
- `favicon.svg`: icone do site
- `site.webmanifest`: manifesto PWA basico
- `robots.txt`: diretrizes para crawlers
- `sitemap.xml`: sitemap inicial
- `404.html`: pagina de erro

## Proximos passos recomendados

1. Substituir os placeholders:
   - `https://zuno.com.br/`
   - `assets/img/og-cover.jpg`
   - telefone e links sociais
2. Migrar o bloco `<style>` inline do `index.html` para `assets/css/main.css`.
3. Configurar deploy com cache e compressao (Vercel/Netlify/Cloudflare).
4. Integrar formulario com CRM/API (em vez de apenas redirecionamento WhatsApp).
