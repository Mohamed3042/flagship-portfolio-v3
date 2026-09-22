/* Scope is v3 only. Complete cached bodies, including Safari byte-range requests. */
'use strict';
const CACHE='refraction-v3-complete-assets-v1';
const BASE=new URL('./',self.location.href).pathname;
self.addEventListener('install',event=>event.waitUntil(self.skipWaiting()));
self.addEventListener('activate',event=>event.waitUntil(self.clients.claim()));
function byteRange(value,size){
 const match=/^bytes=(\d*)-(\d*)$/.exec(value.trim());
 if(!match||(!match[1]&&!match[2])||size<=0)return null;
 const start=match[1]?Number(match[1]):Math.max(0,size-Number(match[2]));
 const end=match[1]?(match[2]?Math.min(Number(match[2]),size-1):size-1):size-1;
 if(!Number.isSafeInteger(start)||!Number.isSafeInteger(end)||start<0||start>=size||end<start||(!match[1]&&Number(match[2])<=0))return null;
 return {start,end};
}
async function cachedResponse(request,url){
 const cache=await caches.open(CACHE),key=new URL(url.pathname,self.location.origin).href;
 let cached=await cache.match(key);
 // Pages serves index.html at both /route/ and /route; normalize offline navigation.
 if(!cached&&(request.mode==='navigate'||url.pathname.endsWith('/'))){
  const path=url.pathname.endsWith('/')?url.pathname+'index.html':url.pathname+'/index.html';
  cached=await cache.match(new URL(path,self.location.origin).href);
 }
 if(!cached)return fetch(request);
 const headers=new Headers(cached.headers);headers.set('X-Refraction-Source','complete-cache');
 headers.set('Accept-Ranges','bytes');headers.delete('Content-Encoding');headers.delete('Transfer-Encoding');
 const size=Number(headers.get('Content-Length'));
 if(request.headers.has('Range')){
  const range=byteRange(request.headers.get('Range'),size);
  if(!range)return new Response(null,{status:416,headers:{'Content-Range':`bytes */${size}`,'X-Refraction-Source':'complete-cache'}});
  headers.set('Content-Range',`bytes ${range.start}-${range.end}/${size}`);headers.set('Content-Length',String(range.end-range.start+1));
  if(request.method==='HEAD')return new Response(null,{status:206,headers});
  const blob=await cached.blob();
  return new Response(blob.slice(range.start,range.end+1,headers.get('Content-Type')||'application/octet-stream'),{status:206,headers});
 }
 return new Response(request.method==='HEAD'?null:cached.body,{status:200,headers});
}
self.addEventListener('fetch',event=>{
 const request=event.request,url=new URL(request.url);
 if(url.origin!==self.location.origin||!url.pathname.startsWith(BASE)||!['GET','HEAD'].includes(request.method))return;
 if(request.headers.get('X-Refraction-Preload')==='1'||url.pathname===BASE+'cinema-cache-sw.js')return;
 // New navigation/manifest revisions come from the network; verified saved shells work offline.
 if(request.mode==='navigate'||url.pathname===BASE+'cinema-preload.json'){
  event.respondWith(fetch(request).then(response=>response.ok?response:cachedResponse(request,url)).catch(()=>cachedResponse(request,url)));
  return;
 }
 event.respondWith(cachedResponse(request,url));
});
