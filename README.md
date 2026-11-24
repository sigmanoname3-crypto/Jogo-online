# Briga de Bonecos 3D (online)

## Como funciona o online
- Play > Jogar online > **⚡ Sala rápida**: você entra no lobby de uma sala aberta (junto do dono) ou, se não houver, cria uma e vira o dono 👑.
- O dono toca em **Iniciar partida** (mínimo 2 jogadores; começa sozinho se encher 4/4). O mapa é sorteado pelo servidor.
- Dentro da partida todos jogam juntos: socos, segurar/arremessar, empurrões, tiros e K.O. valem entre jogadores.
- Na tela inicial você escolhe a cor e até 2 acessórios antes de tocar em Play. O mapa é sorteado pelo servidor.

## Publicar no Render (Web Service)
1. Envie TODOS os arquivos desta pasta para um repositório no GitHub.
2. Render: New + > Web Service > escolha o repositório.
3. Runtime: Node | Build Command: `npm install` | Start Command: `npm start`
4. Pronto: o link .onrender.com abre o jogo (usa WebSocket, já suportado pelo Render).

## Rodar local
`npm install && npm start` e abra http://localhost:3000 em duas abas.
