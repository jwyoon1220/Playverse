async function members(env) {
  const { results } = await env.DB.prepare('SELECT * FROM members ORDER BY sort_order, id').all();
  return Response.json(
    results.map((r) => ({
      id: r.id,
      name: r.name,
      callName: r.call_name,
      birthday: r.birthday,
      gender: r.gender,
      colorHex: r.color_hex,
      colorName: r.color_name,
      rp: r.rp,
      aside: r.aside,
      image: r.image,
      extras: JSON.parse(r.extras),
      notes: JSON.parse(r.notes),
    })),
    { headers: { 'Cache-Control': 'public, max-age=60' } }
  );
}

// /images/* : R2(IMAGES)에 있으면 R2에서, 없으면 public/images 정적 파일로 폴백
async function image(request, env, key) {
  if (env.IMAGES && key) {
    const obj = await env.IMAGES.get(key);
    if (obj) {
      const headers = new Headers();
      obj.writeHttpMetadata(headers);
      headers.set('etag', obj.httpEtag);
      headers.set('Cache-Control', 'public, max-age=86400');
      return new Response(obj.body, { headers });
    }
  }
  return env.ASSETS.fetch(request);
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const isRead = request.method === 'GET' || request.method === 'HEAD';
    if (isRead && url.pathname === '/api/members') return members(env);
    if (isRead && url.pathname.startsWith('/images/')) {
      return image(request, env, decodeURIComponent(url.pathname.slice('/images/'.length)));
    }
    return env.ASSETS.fetch(request);
  },
};
