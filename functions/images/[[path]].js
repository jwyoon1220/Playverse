// /images/* : R2(IMAGES)에 있으면 R2에서, 없으면 public/images 정적 파일로 폴백
export async function onRequestGet({ request, env, params }) {
  const key = Array.isArray(params.path) ? params.path.join('/') : params.path;
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
