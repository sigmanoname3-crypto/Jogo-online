const http=require('http'),fs=require('fs'),path=require('path');
const T={'.html':'text/html; charset=utf-8','.js':'text/javascript','.json':'application/json','.webmanifest':'application/manifest+json','.png':'image/png','.svg':'image/svg+xml','.ico':'image/x-icon'};
const rooms={};
function api(u,q,r){const g=k=>q.get(k)||'',id=g('id').slice(0,16),name=(g('name')||'Jogador').slice(0,12),now=Date.now();
 for(const c in rooms){const R=rooms[c];R.p=R.p.filter(x=>now-x.t<10000);if(!R.p.length)delete rooms[c];else if(!R.p.some(x=>x.id==R.host))R.host=R.p[0].id}
 const send=o=>{r.writeHead(200,{'Content-Type':'application/json','Cache-Control':'no-store'});r.end(JSON.stringify(o))},err=m=>send({err:m});
 const view=R=>({code:R.code,max:4,host:R.host,started:R.started,players:R.p.map(x=>({id:x.id,name:x.name}))});
 const mk=quick=>{let c;do c=Math.random().toString(36).slice(2,6).toUpperCase();while(rooms[c]);return rooms[c]={code:c,host:id,started:0,quick,p:[]}};
 const add=R=>{const x=R.p.find(x=>x.id==id);if(x)x.t=now;else R.p.push({id,name,t:now});return R};
 const R=rooms[g('code').toUpperCase()];
 if(u=='/api/create')return send(view(add(mk(0))));
 if(u=='/api/quick')return send(view(add(Object.values(rooms).find(x=>x.quick&&!x.started&&x.p.length<4)||mk(1))));
 if(!R)return err('Sala não encontrada');
 if(u=='/api/join'){if(R.started&&!R.p.some(x=>x.id==id))return err('A partida já começou');if(R.p.length>=4&&!R.p.some(x=>x.id==id))return err('Sala cheia (4/4)');return send(view(add(R)))}
 if(!R.p.some(x=>x.id==id))return err('Você saiu da sala');
 if(u=='/api/start'&&R.host==id)R.started=1;
 if(u=='/api/leave')R.p=R.p.filter(x=>x.id!=id);else add(R);
 send(view(R))}
http.createServer((q,r)=>{let u=decodeURIComponent(q.url.split('?')[0]);if(u.startsWith('/api/'))return api(u,new URL(q.url,'http://x').searchParams,r);if(u==='/')u='/index.html';
 const f=path.join(__dirname,path.normalize(u).replace(/^(\.\.[\/\\])+/,''));
 if(!f.startsWith(__dirname)||f.endsWith('server.js')||f.endsWith('package.json')){r.writeHead(404);return r.end('404')}
 fs.readFile(f,(e,d)=>{if(e){r.writeHead(404);return r.end('404')}r.writeHead(200,{'Content-Type':T[path.extname(f)]||'application/octet-stream','Cache-Control':f.endsWith('sw.js')?'no-cache':'public, max-age=300'});r.end(d)})
}).listen(process.env.PORT||3000,'0.0.0.0',()=>console.log('Rodando na porta',process.env.PORT||3000));
