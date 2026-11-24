const http=require('http'),fs=require('fs'),path=require('path'),{WebSocketServer}=require('ws');
const T={'.html':'text/html; charset=utf-8','.js':'text/javascript','.json':'application/json','.webmanifest':'application/manifest+json','.png':'image/png','.svg':'image/svg+xml','.ico':'image/x-icon'};
const MAX=4,MAPS=['terraco','prisao'];
const server=http.createServer((q,r)=>{
 let u=decodeURIComponent(q.url.split('?')[0]);if(u==='/')u='/index.html';
 const f=path.join(__dirname,path.normalize(u).replace(/^(\.\.[\/\\])+/,''));
 if(!f.startsWith(__dirname)||f.endsWith('server.js')||f.endsWith('package.json')||f.includes('node_modules')){r.writeHead(404);return r.end('404')}
 fs.readFile(f,(e,d)=>{if(e){r.writeHead(404);return r.end('404')}
  r.writeHead(200,{'Content-Type':T[path.extname(f)]||'application/octet-stream','Cache-Control':f.endsWith('sw.js')?'no-cache':'public, max-age=300'});r.end(d)})});

// ---------- salas (WebSocket) ----------
const rooms=new Set();let nid=1;
const out=(w,o)=>{if(w&&w.readyState===1)w.send(typeof o==='string'?o:JSON.stringify(o))};
const cast=(R,o,skip)=>R.p.forEach(w=>w!==skip&&out(w,o));
const view=R=>({t:'room',host:R.host&&R.host.pid,max:MAX,started:R.started,players:R.p.map(w=>({id:w.pid,name:w.name}))});
function leave(ws){
 const R=ws.room;if(!R)return;ws.room=null;
 R.p=R.p.filter(w=>w!==ws);
 if(!R.p.length){rooms.delete(R);return}
 if(R.host===ws)R.host=R.p[0];
 if(R.started)cast(R,{t:'gone',id:ws.pid,left:R.p.length});else cast(R,view(R))}
function quick(ws,name){
 leave(ws);ws.name=String(name||'Jogador').slice(0,12)||'Jogador';
 let R=[...rooms].find(x=>!x.started&&x.p.length<MAX);
 if(!R){R={host:ws,p:[],started:0};rooms.add(R)}
 R.p.push(ws);ws.room=R;cast(R,view(R));
 if(R.p.length>=MAX)start(R)}
function start(R){
 if(R.started||R.p.length<2)return;R.started=1;
 const map=MAPS[Math.random()*MAPS.length|0];
 R.p.forEach((w,i)=>w.slot=i);
 const pl=R.p.map(w=>({id:w.pid,name:w.name,slot:w.slot}));
 R.p.forEach(w=>out(w,{t:'go',map,me:w.pid,players:pl}))}
const wss=new WebSocketServer({server});
wss.on('connection',ws=>{
 ws.pid='p'+(nid++);ws.alive=true;out(ws,{t:'hi',id:ws.pid});ws.on('pong',()=>ws.alive=true);
 ws.on('message',raw=>{
  let d;try{d=JSON.parse(raw)}catch{return}
  if(!d||typeof d.t!=='string')return;
  const R=ws.room;
  if(d.t==='quick')return quick(ws,d.name);
  if(d.t==='leave')return leave(ws);
  if(!R)return;
  if(d.t==='start'){if(R.host===ws)start(R);return}
  if(!R.started)return;
  if(d.t==='s'){d.from=ws.pid;return cast(R,d,ws)}               // estado do boneco -> todos os outros
  if(d.t==='ev'){d.from=ws.pid;                                    // evento (soco, arremesso...) -> alvo ou todos
   if(d.to){out(R.p.find(w=>w.pid===d.to),d)}else cast(R,d,ws)}
 });
 ws.on('close',()=>leave(ws));ws.on('error',()=>{})});
setInterval(()=>wss.clients.forEach(w=>{if(!w.alive)return w.terminate();w.alive=false;try{w.ping()}catch{}}),20000);
server.listen(process.env.PORT||3000,'0.0.0.0',()=>console.log('Rodando na porta',process.env.PORT||3000));
