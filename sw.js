// Jeûne & Prière — lanceur. Réseau d'abord (toujours la dernière version), copie en secours sans réseau.
// Il ne touche jamais aux appels vers Google (script.google.com).
const CACHE = "jp-lanceur-v7";
const COQUILLE = ["./", "./index.html", "./manifest.webmanifest", "./icon-192.png", "./icon-512.png"];
self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(COQUILLE)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return;
  const cle = req.mode === "navigate" ? "./index.html" : req;
  e.respondWith(fetch(req).then(r => {
    if (r.ok) { const c = r.clone(); caches.open(CACHE).then(x => x.put(cle, c)); }
    return r;
  }).catch(() => caches.match(cle, { ignoreSearch: true })));
});
