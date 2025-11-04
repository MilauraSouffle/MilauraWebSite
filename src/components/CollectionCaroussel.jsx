import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { getProducts } from "@/api/EcommerceApi";

const CATEGORY_REGISTRY = {
  pcol_01K88QVKKZN29HYFBYXRAV0106: { name: "Bijoux énergétiques", slug: "bijoux-energetiques" },
  pcol_01K88X47XDD86DGRCST06ZRFP4: { name: "Bougie émotionnelle", slug: "bougie-emotionnelle" },
  pcol_01K88QSKEZQ9032VE7PBEWG0GH: { name: "Calendrier de l'Avent", slug: "calendrier" },
  pcol_01K88QWACTFF883B79X179MZ28: { name: "Objets de lithothérapie", slug: "objets-de-lithotherapie" },
  pcol_01K88QVYP8QVQ95HSSKMD9KHZC: { name: "Pierres & Minéraux", slug: "pierres-et-mineraux" },
  pcol_01K88QVC9Q913Y15SCX4NC004D: { name: "Rituels & Bien-être", slug: "rituels-et-bien-etre" },
};

const deaccent = (s = "") =>
  s.toString().normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase().trim();
const toArray = (v) => (Array.isArray(v) ? v : v ? [v] : []);
const singular = (t) => (t.endsWith("s") ? t.slice(0, -1) : t);

const categoryTokens = (name, slug) => {
  const base = deaccent(name);
  const baseSlug = deaccent(slug || "");
  const andAmp = base.replace(" et ", " & ");
  const andWord = base.replace(" & ", " et ");
  const noAmp = base.replace("&", "et");
  const onlyWords = base.replace(/[&]/g, " ").replace(/\s+/g, " ").trim();
  const words = onlyWords.split(" ").filter(Boolean);
  const singles = words.map(singular);
  const pieces = [...new Set([...words, ...singles])];
  return [base, baseSlug, andAmp, andWord, noAmp, onlyWords, ...pieces].map(deaccent).filter(Boolean);
};

const CATEGORY_CATALOG = Object.entries(CATEGORY_REGISTRY).map(([id, meta]) => ({
  id,
  name: meta.name,
  slug: meta.slug,
  tokens: categoryTokens(meta.name, meta.slug),
}));

const collectProductHints = (p) => {
  const ids = new Set();
  const tokens = new Set();
  const pushStruct = (c) => {
    if (!c) return;
    const id = c?.id ?? c?.collection_id ?? c?.category_id;
    if (id) ids.add(String(id));
    if (c?.name) tokens.add(deaccent(c.name));
    if (c?.slug) tokens.add(deaccent(c.slug));
    if (c?.handle) tokens.add(deaccent(c.handle));
  };
  toArray(p?.collections).forEach(pushStruct);
  toArray(p?.categories).forEach(pushStruct);
  toArray(p?.collection_ids).forEach((x) => ids.add(String(x)));
  toArray(p?.category_ids).forEach((x) => ids.add(String(x)));
  ["collection","collection_name","collection_slug","category","category_name","category_slug"].forEach((k)=>{
    const v = p?.[k];
    if (v) tokens.add(deaccent(v));
  });
  const m = p?.metadata || {};
  ["collection","collection_name","category","category_name","category_slug"].forEach((k)=>{
    const v = m?.[k];
    if (v) tokens.add(deaccent(v));
  });
  const rawTags = p?.tags;
  if (typeof rawTags === "string") rawTags.split(",").forEach((t)=>tokens.add(deaccent(t)));
  else if (Array.isArray(rawTags)) rawTags.forEach((t)=>tokens.add(deaccent(t)));
  const maybeTitle = deaccent(p?.title || p?.name || "");
  const maybeSubtitle = deaccent(p?.subtitle || "");
  if (maybeTitle) tokens.add(maybeTitle);
  if (maybeSubtitle) tokens.add(maybeSubtitle);
  return { ids: [...ids], tokens: [...tokens] };
};

const fuzzyMatch = (a, b) => a === b || a.includes(b) || b.includes(a);

function buildCategoryIndex(products) {
  const index = CATEGORY_CATALOG.map((c) => ({
    id: c.id, name: c.name, slug: c.slug, tokens: c.tokens, count: 0, cover: null,
  }));
  const byId = new Map(index.map((c) => [c.id, c]));
  for (const p of products) {
    const cover = p?.image || p?.images?.[0]?.src || p?.images?.[0]?.url || null;
    const { ids, tokens } = collectProductHints(p);
    let matched = false;
    for (const cid of ids) {
      const cell = byId.get(cid);
      if (cell) { matched = true; cell.count += 1; if (!cell.cover && cover) cell.cover = cover; }
    }
    if (!matched && tokens.length) {
      for (const cell of index) {
        const hit = tokens.some((t) => cell.tokens.some((ct) => fuzzyMatch(t, ct)));
        if (hit) { cell.count += 1; if (!cell.cover && cover) cell.cover = cover; matched = true; }
      }
    }
  }
  return index;
}

const itemVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.98 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 120, damping: 18 } },
  hover: { y: -3, transition: { duration: 0.18 } },
};

const Card = ({ item }) => {
  const disabled = item.count === 0;
  return (
    <motion.div
      variants={itemVariants}
      whileHover="hover"
      className={`group relative rounded-xl overflow-hidden bg-white/90 shadow-sm max-w-[360px] w-full ${disabled ? "opacity-75 pointer-events-none" : ""}`}
      title={disabled ? "Aucun article dans cette catégorie pour le moment" : undefined}
    >
      <Link to={`/collections/${item.slug}?categoryId=${encodeURIComponent(item.id)}`} className="block">
        <div className="aspect-[4/3] relative overflow-hidden bg-[#FBF9F4]">
          {item.cover ? (
            <img src={item.cover} alt={item.name} className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-400" loading="lazy" />
          ) : (
            <div className="w-full h-full grid place-items-center text-gray-300 text-sm">Aucune image</div>
          )}
        </div>
        <div className="px-5 pt-3.5 pb-4 bg-gradient-to-br from-[#E9CC8A] to-[#C3A46D]">
          <h3 className="text-[1.05rem] md:text-lg font-bold text-black">{item.name}</h3>
          <p className="text-sm text-black/80">{item.count} article{item.count > 1 ? "s" : ""}</p>
        </div>
      </Link>
    </motion.div>
  );
};

export default function CollectionsCarousel() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hovered, setHovered] = useState(false);
  const scrollerRef = useRef(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        const res = await getProducts({ limit: 250 });
        const all = res?.products || res?.items || [];
        const index = buildCategoryIndex(all);
        if (alive) setItems(index);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  const list = useMemo(() => items || [], [items]);

  const scrollByCards = (dir = 1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const cardWidth = Math.min(360, Math.max(280, el.clientWidth / 3));
    el.scrollBy({ left: dir * (cardWidth * 2.5), behavior: "smooth" });
  };

  return (
    <section className="py-10 md:py-12 bg-[#FBF9F4] relative">
      <div className="container mx-auto px-4">
        <motion.h2
          className="text-5xl font-script font-bold text-gradient-gold-warm text-center mb-4"
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }} transition={{ duration: 0.7, ease: "easeOut" }}
        >
          Nos Collections
        </motion.h2>

        <motion.p
          className="text-lg text-gray-600 max-w-3xl mx-auto text-center mb-8"
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }} transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
        >
          Explorez nos univers et trouvez les créations qui résonnent avec votre âme.
        </motion.p>

        {loading ? (
          <div className="text-center text-gray-400 py-12">Chargement…</div>
        ) : (
          <div
            className="relative"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            {/* Boutons desktop (cachés mobile, visibles en transparence sur ordi) */}
            <button
              type="button"
              aria-label="Précédent"
              onClick={() => scrollByCards(-1)}
              className={`hidden md:flex items-center justify-center absolute left-1 top-1/2 -translate-y-1/2 z-10 h-12 w-12 rounded-full bg-white/80 hover:bg-white text-gray-700 shadow ring-1 ring-black/5 backdrop-blur transition-opacity ${hovered ? "opacity-100" : "opacity-70"}`}
            >
              ‹
            </button>
            <button
              type="button"
              aria-label="Suivant"
              onClick={() => scrollByCards(1)}
              className={`hidden md:flex items-center justify-center absolute right-1 top-1/2 -translate-y-1/2 z-10 h-12 w-12 rounded-full bg-white/80 hover:bg-white text-gray-700 shadow ring-1 ring-black/5 backdrop-blur transition-opacity ${hovered ? "opacity-100" : "opacity-70"}`}
            >
              ›
            </button>

            {/* Scroller */}
            <div
              ref={scrollerRef}
              className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2 pr-2"
              style={{ scrollbarWidth: "none" }}
            >
              {list.map((it) => (
                <div key={it.id} className="snap-start shrink-0 min-w-[280px] sm:min-w-[300px] lg:min-w-[360px]">
                  <Card item={it} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}