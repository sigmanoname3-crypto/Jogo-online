# Briga de Bonecos 3D

## Como publicar no Render (Web Service)
1. Crie um repositorio no GitHub e envie TODOS os arquivos desta pasta (index.html fica na raiz).
2. No Render: New + > Web Service > escolha o repositorio.
3. Runtime: Node | Build Command: `npm install` | Start Command: `npm start`
4. Create Web Service. Pronto: o link .onrender.com abre o jogo.

(O arquivo render.yaml ja traz essas configuracoes: New + > Blueprint tambem funciona.)

## Virar app / APK
Abra o link no Chrome do celular > menu > "Instalar app". Para gerar APK, cole o link em pwabuilder.com.
O jogo usa three.js e cannon.js de um CDN; apos a 1a abertura com internet ficam guardados para uso offline.
