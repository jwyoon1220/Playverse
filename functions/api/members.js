export async function onRequestGet({ env }) {
  const { results } = await env.DB.prepare(
    'SELECT * FROM members ORDER BY sort_order, id'
  ).all();
  const members = results.map((r) => ({
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
  }));
  return Response.json(members, {
    headers: { 'Cache-Control': 'public, max-age=60' },
  });
}
