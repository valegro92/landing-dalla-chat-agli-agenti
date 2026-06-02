const { sql } = require("@vercel/postgres");

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") { res.status(200).end(); return; }
  try {
    await sql.query("CREATE TABLE IF NOT EXISTS landing_responses (id SERIAL PRIMARY KEY, nome TEXT, cognome TEXT, email TEXT, professione TEXT, ruolo TEXT, problema TEXT, tappa TEXT, origine TEXT, marketing BOOLEAN, privacy_versione TEXT, created_at TIMESTAMPTZ DEFAULT now())");
    if (req.method === "GET") {
      const r = await sql.query("SELECT count(*)::int AS n FROM landing_responses");
      res.status(200).json({ ok: true, count: r.rows[0].n });
      return;
    }
    if (req.method !== "POST") { res.status(405).json({ ok: false }); return; }
    let b = req.body;
    if (typeof b === "string") { try { b = JSON.parse(b); } catch (e) { b = {}; } }
    b = b || {};
    await sql.query(
      "INSERT INTO landing_responses (nome, cognome, email, professione, ruolo, problema, tappa, origine, marketing, privacy_versione) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)",
      [b.nome || null, b.cognome || null, b.email || null, b.professione || null, b.ruolo || null, b.problema || null, b.tappa || null, b.origine || null, b.marketing === true, b.privacy_versione || null]
    );
    res.status(200).json({ ok: true });
  } catch (e) {
    res.status(500).json({ ok: false, error: String(e) });
  }
};
