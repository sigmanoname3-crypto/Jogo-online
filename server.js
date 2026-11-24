const http=require('http'),fs=require('fs'),path=require('path');
const T={'.html':'text/html; charset=utf-8','.js':'text/javascript','.json':'application/json','.webmanifest':'application/manifest+json','.png':'image/png','.svg':'image/svg+xml','.ico':'image/x-icon'};
http.createServer((q,r)=>{let u=decodeURIComponent(q.url.split('?')[0]);if(u==='/')u='/index.html';
 const f=path.join(__dirname,path.normalize(u).replace(/^(\.\.[\/\\])+/,''));
 if(!f.startsWith(__dirname)||f.endsWith('server.js')||f.endsWith('package.json')){r.writeHead(404);return r.end('404')}
 fs.readFile(f,(e,d)=>{if(e){r.writeHead(404);return r.end('404')}r.writeHead(200,{'Content-Type':T[path.extname(f)]||'application/octet-stream','Cache-Control':f.endsWith('sw.js')?'no-cache':'public, max-age=300'});r.end(d)})
}).listen(process.env.PORT||3000,'0.0.0.0',()=>console.log('Rodando na porta',process.env.PORT||3000));
