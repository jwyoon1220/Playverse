CREATE TABLE IF NOT EXISTS members (
  id         TEXT PRIMARY KEY,
  sort_order INTEGER NOT NULL DEFAULT 0,
  name       TEXT NOT NULL,
  call_name  TEXT NOT NULL DEFAULT '',
  birthday   TEXT NOT NULL DEFAULT '',
  gender     TEXT NOT NULL DEFAULT '',
  color_hex  TEXT NOT NULL DEFAULT '',
  color_name TEXT NOT NULL DEFAULT '',
  rp         TEXT NOT NULL DEFAULT '',
  aside      TEXT NOT NULL DEFAULT '',
  image      TEXT NOT NULL DEFAULT '',
  extras     TEXT NOT NULL DEFAULT '[]',
  notes      TEXT NOT NULL DEFAULT '[]'
);
