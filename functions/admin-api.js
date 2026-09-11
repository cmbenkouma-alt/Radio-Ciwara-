export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const cors = {
      'Access-Control-Allow-Origin': env.ADMIN_ORIGIN || 'https://ciwara-medias.ml',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
      'Vary': 'Origin'
    };
    if (request.method === 'OPTIONS') return new Response(null, { headers: cors });

    const json = (data, status = 200) => new Response(JSON.stringify(data), {
      status, headers: { ...cors, 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }
    });
    const b64 = s => btoa(unescape(encodeURIComponent(s)));
    const unb64 = s => decodeURIComponent(escape(atob(s.replace(/\n/g, ''))));
    const gh = async (path, init = {}) => {
      const r = await fetch(`https://api.github.com/repos/${env.GITHUB_OWNER}/${env.GITHUB_REPO}/contents/${path}?ref=${env.GITHUB_BRANCH || 'main'}`, {
        ...init,
        headers: { 'Accept': 'application/vnd.github+json', 'Authorization': `Bearer ${env.GITHUB_TOKEN}`, 'X-GitHub-Api-Version': '2022-11-28', ...(init.headers || {}) }
      });
      const text = await r.text();
      if (!r.ok) throw new Error(`GitHub ${r.status}: ${text}`);
      return text ? JSON.parse(text) : {};
    };

    const enc = new TextEncoder();
    const key = await crypto.subtle.importKey('raw', enc.encode(env.SESSION_SECRET), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign', 'verify']);
    const sign = async payload => `${btoa(JSON.stringify(payload)).replace(/=+$/,'')}.${btoa(String.fromCharCode(...new Uint8Array(await crypto.subtle.sign('HMAC', key, enc.encode(JSON.stringify(payload)))))).replace(/=+$/,'')}`;
    const verify = async token => {
      try {
        const [p, s] = token.split('.'); if (!p || !s) return false;
        const payload = JSON.parse(atob(p));
        if (!payload.exp || payload.exp < Math.floor(Date.now()/1000)) return false;
        const sig = Uint8Array.from(atob(s), c => c.charCodeAt(0));
        return await crypto.subtle.verify('HMAC', key, sig, enc.encode(JSON.stringify(payload))) ? payload : false;
      } catch { return false; }
    };
    const auth = async () => {
      const h = request.headers.get('Authorization') || '';
      return h.startsWith('Bearer ') ? verify(h.slice(7)) : false;
    };

    try {
      if (url.pathname === '/health') return json({ ok: true, service: 'Radio Ciwara admin API' });
      if (url.pathname === '/auth' && request.method === 'POST') {
        const body = await request.json();
        if (!body.password || body.password !== env.ADMIN_PASSWORD) return json({ error: 'Identifiants invalides' }, 401);
        const token = await sign({ sub: 'admin', exp: Math.floor(Date.now()/1000) + 60 * 60 * 8 });
        return json({ ok: true, token, expiresIn: 28800 });
      }
      if (!(await auth())) return json({ error: 'Non autorisé' }, 401);

      if (url.pathname === '/file' && request.method === 'GET') {
        const path = url.searchParams.get('path');
        if (!path || path.includes('..') || !path.endsWith('.json')) return json({ error: 'Chemin invalide' }, 400);
        const d = await gh(path);
        return json({ path, sha: d.sha, data: JSON.parse(unb64(d.content)) });
      }
      if (url.pathname === '/file' && request.method === 'PUT') {
        const body = await request.json();
        if (!body.path || !body.path.endsWith('.json') || body.path.includes('..')) return json({ error: 'Chemin invalide' }, 400);
        const d = await gh(body.path, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: body.message || 'admin: update data', content: b64(JSON.stringify(body.data, null, 2) + '\n'), sha: body.sha, branch: env.GITHUB_BRANCH || 'main' }) });
        return json({ ok: true, sha: d.content?.sha });
      }
      if (url.pathname === '/image' && request.method === 'POST') {
        const body = await request.json();
        if (!body.path || !/^assets\/[a-zA-Z0-9_./-]+\.(jpg|jpeg|png|webp|gif)$/i.test(body.path)) return json({ error: 'Chemin image invalide' }, 400);
        const d = await gh(body.path);
        const r = await gh(body.path, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: body.message || 'admin: update image', content: body.contentBase64, sha: d.sha, branch: env.GITHUB_BRANCH || 'main' }) });
        return json({ ok: true, sha: r.content?.sha, path: body.path });
      }
      return json({ error: 'Route inconnue' }, 404);
    } catch (e) { return json({ error: e.message || 'Erreur serveur' }, 500); }
  }
};
