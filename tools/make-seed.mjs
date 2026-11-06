// tools/fluent-export/members.json -> db/seed.sql
import { readFileSync, writeFileSync } from 'node:fs';
const members = JSON.parse(readFileSync('tools/fluent-export/members.json', 'utf8'));
const q = (s) => `'${String(s ?? '').replaceAll("'", "''")}'`;
const rows = members.map((m, i) =>
  `INSERT OR REPLACE INTO members (id, sort_order, name, call_name, birthday, gender, color_hex, color_name, rp, aside, image, extras, notes) VALUES (${[
    q(m.id), i, q(m.name), q(m.callName), q(m.birthday), q(m.gender), q(m.colorHex), q(m.colorName),
    q(m.rp), q(m.aside), q(m.image), q(JSON.stringify(m.extras ?? [])), q(JSON.stringify(m.notes ?? [])),
  ].join(', ')});`);
writeFileSync('db/seed.sql', rows.join('\n') + '\n');
console.log(`${rows.length} members -> db/seed.sql`);
