// src/components/CollectionsCarousel.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { getProducts } from "@/api/EcommerceApi";

/* ---------- couleurs de raccord (carrousel → calendrier) ---------- */
const CREME = "#FBF9F4";   // fond page
const BLUE0 = "#EAF2FF";   // haut du dégradé de la section calendrier

/* ---------- registre catégories (slugs alignés) ---------- */
const CATEGORY_REGISTRY = {
  pcol_01K88QVKKZN29HYFBYXRAV0106: { name: "Bijoux énergétiques", slug: "bijoux-energetiques" },
  pcol_01K88X47XDD86DGRCST06ZRFP4: { name: "Bougie émotionnelle", slug: "bougie-emotionnelle" },
  pcol_01K88QSKEZQ9032VE7PBEWG0GH: { name: "Calendrier de l'Avent", slug: "calendrier-de-lavent" },
  pcol_01K88QWACTFF883B79X179MZ28: { name: "Objets de lithothérapie", slug: "objets-de-lithotherapie" },
  pcol_01K88QVYP8QVQ95HSSKMD9KHZC: { name: "Pierres & Minéraux", slug: "pierres-mineraux" },
  pcol_01K88QVC9Q913Y15SCX4NC004D: { name: "Rituels & Bien-être", slug: "rituels-bien-etre" },
};

/* ---------- helpers d’indexation produits → catégories ---------- */
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
  return [base, baseSlug, andAmp, andWord, noAmp, onlyWords, ...pieces]
    .map(deaccent)
    .filter(Boolean);
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

  ["collection", "collection_name", "collection_slug", "category", "category_name", "category_slug"].forEach((k) => {
    const v = p?.[k];
    if (v) tokens.add(deaccent(v));
  });

  const m = p?.metadata || {};
  ["collection", "collection_name", "category", "category_name", "category_slug"].forEach((k) => {
    const v = m?.[k];
    if (v) tokens.add(deaccent(v));
  });

  const rawTags = p?.tags;
  if (typeof rawTags === "string") rawTags.split(",").forEach((t) => tokens.add(deaccent(t)));
  else if (Array.isArray(rawTags)) rawTags.forEach((t) => tokens.add(deaccent(t)));

  const maybeTitle = deaccent(p?.title || p?.name || "");
  const maybeSubtitle = deaccent(p?.subtitle || "");
  if (maybeTitle) tokens.add(maybeTitle);
  if (maybeSubtitle) tokens.add(maybeSubtitle);

  return { ids: [...ids], tokens: [...tokens] };
};

const fuzzyMatch = (a, b) => a === b || a.includes(b) || b.includes(a);

function buildCategoryIndex(products) {
  const index = CATEGORY_CATALOG.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    tokens: c.tokens,
    count: 0,
    cover: null,
  }));
  const byId = new Map(index.map((c) => [c.id, c]));

  for (const p of products) {
    const cover = p?.image || p?.images?.[0]?.src || p?.images?.[0]?.url || null;
    const { ids, tokens } = collectProductHints(p);

    let matched = false;

    for (const cid of ids) {
      const cell = byId.get(cid);
      if (cell) {
        matched = true;
        cell.count += 1;
        if (!cell.cover && cover) cell.cover = cover;
      }
    }
    if (!matched && tokens.length) {
      for (const cell of index) {
        const hit = tokens.some((t) => cell.tokens.some((ct) => fuzzyMatch(t, ct)));
        if (hit) {
          cell.count += 1;
          if (!cell.cover && cover) cell.cover = cover;
          matched = true;
        }
      }
    }
  }
  return index;
}

/* ---------- carte ---------- */
function Card({ item, active }) {
  const disabled = item.count === 0;

  return (
    <motion.div
      layout
      className={`
        snap-center shrink-0 overflow-hidden rounded-3xl
        shadow-[0_10px_30px_-10px_rgba(0,0,0,0.25)] ring-1 ring-black/5
        bg-white/70 backdrop-blur-md
        /* largeur responsive “safe” */
        w-[86vw] xs:w-[82vw] sm:w-[72vw]
        md:w-[34rem] lg:w-[28rem] xl:w-[24rem] 2xl:w-[26rem]
        /* ratio: vertical, aussi sur desktop */
        aspect-[4/5] md:aspect-[5/4]
      `}
      animate={{
        scale: active ? 1 : 0.965,
        y: active ? 0 : 4,
        filter: active ? "brightness(1)" : "brightness(0.97)",
      }}
      transition={{ type: "spring", stiffness: 180, damping: 18 }}
    >
      <Link
        to={`/collections/${item.slug}?categoryId=${encodeURIComponent(item.id)}`}
        className={`block h-full ${disabled ? "pointer-events-none opacity-60" : ""}`}
      >
        {/* Image */}
        <div className="relative h-[66%] md:h-[68%]">
          {item.cover ? (
            <img
              src={item.cover}
              alt={item.name}
              className="
                absolute inset-0 h-full w-full
                object-cover object-center
                md:object-contain md:bg-[#F7F3EC]
              "
              loading="lazy"
            />
          ) : (
            <div className="absolute inset-0 grid place-items-center text-gray-300 text-sm">
              Aucune image
            </div>
          )}
          {/* dégradé pour fondre la cartouche */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(to bottom, rgba(251,249,244,0) 45%, rgba(251,249,244,0.65) 82%, rgba(251,249,244,0.95) 100%)",
            }}
          />
        </div>

        {/* cartouche titre */}
        <div className="h-[34%] md:h-[32%] p-5 flex flex-col justify-center bg-gradient-to-br from-[#E9CC8A] to-[#C3A46D]">
          <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-black leading-snug">
            {item.name}
          </h3>
          <p className="text-sm md:text-base text-black/80 mt-1">
            {item.count} article{item.count > 1 ? "s" : ""}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}

/* ---------- carrousel scroll-snap + fondu de raccord ---------- */
export default function CollectionsCarousel() {
  const [items, setItems] = useState([]);
  const [active, setActive] = useState(0);
  const trackRef = useRef(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      const res = await getProducts({ limit: 250 });
      const all = res?.products || res?.items || [];
      const index = buildCategoryIndex(all);
      if (!alive) return;
      setItems(index);
      if (index.length) {
        const mid = Math.floor(index.length / 2);
        setActive(mid);
        requestAnimationFrame(() => {
          try {
            const node = trackRef.current?.children?.[mid];
            node?.scrollIntoView({ inline: "center", block: "nearest", behavior: "instant" });
          } catch {}
        });
      }
    })();
    return () => { alive = false; };
  }, []);

  useEffect(() => {
    const wrap = trackRef.current;
    if (!wrap) return;
    const onScroll = () => {
      if (!wrap.children.length) return;
      let best = 0;
      let bestDist = Infinity;
      const center = wrap.scrollLeft + wrap.clientWidth / 2;
      Array.from(wrap.children).forEach((el, i) => {
        const rectLeft = el.offsetLeft + el.clientWidth / 2;
        const dist = Math.abs(rectLeft - center);
        if (dist < bestDist) { bestDist = dist; best = i; }
      });
      setActive(best);
    };
    wrap.addEventListener("scroll", onScroll, { passive: true });
    return () => wrap.removeEventListener("scroll", onScroll);
  }, [items.length]);

  const scrollByCards = (dir) => {
    const wrap = trackRef.current;
    if (!wrap) return;
    const child = wrap.children?.[active];
    const w = child ? child.clientWidth : wrap.clientWidth * 0.8;
    wrap.scrollBy({ left: dir * (w + 24), behavior: "smooth" });
  };

  const dots = useMemo(() => items.map((_, i) => i), [items]);

  return (
    <section className="relative pt-2 md:pt-4 pb-8 md:pb-10" style={{ background: CREME }}>
      {/* contenu */}
      <div className="relative z-[1] container mx-auto px-4">
        <motion.h2
          className="text-5xl font-script font-bold text-gradient-gold-warm text-center mb-3"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6 }}
        >
          Nos Collections
        </motion.h2>

        <motion.p
          className="text-lg text-gray-600 max-w-3xl mx-auto text-center mb-6 md:mb-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, delay: 0.05 }}
        >
          Explorez nos univers et trouvez les créations qui résonnent avec votre âme.
        </motion.p>

        <div className="relative">
          <div className="mx-auto max-w-[1200px]">
            <div
              ref={trackRef}
              className="flex gap-5 md:gap-4 lg:gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4
                         [scrollbar-width:none] [-ms-overflow-style:none]"
              style={{ scrollPaddingInline: "12px" }}
            >
              <style>{`.snap-x::-webkit-scrollbar{ display:none; }`}</style>
              {items.map((it, i) => (
                <Card key={it.id} item={it} active={i === active} />
              ))}
            </div>
          </div>

          {/* commandes desktop */}
          <div className="mt-5 md:mt-6 flex items-center justify-center gap-5">
            <button
              type="button"
              onClick={() => scrollByCards(-1)}
              aria-label="Précédent"
              className="hidden md:grid place-items-center h-10 w-10 rounded-full bg-white/90 hover:bg-white shadow ring-1 ring-black/5"
            >
              ‹
            </button>

            <div className="flex items-center gap-2">
              {dots.map((i) => (
                <span
                  key={i}
                  className={`rounded-full transition-all ${
                    i === active ? "w-5 h-1.5 bg-gray-800" : "w-2 h-1.5 bg-gray-300"
                  }`}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={() => scrollByCards(+1)}
              aria-label="Suivant"
              className="hidden md:grid place-items-center h-10 w-10 rounded-full bg-white/90 hover:bg-white shadow ring-1 ring-black/5"
            >
              ›
            </button>
          </div>
        </div>
      </div>

      {/* fondu de raccord vers la section Calendrier */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-0 right-0 -bottom-10 h-16 md:h-20"
        style={{
          background: `linear-gradient(180deg, rgba(251,249,244,0) 0%, ${BLUE0} 100%)`,
        }}
      />
    </section>
  );
}