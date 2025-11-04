import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Seo from "@/components/Seo";
import { getProducts } from "@/api/EcommerceApi";

/* ---------------------- mapping catégories (IDs confirmés) ---------------------- */
const CATEGORY_REGISTRY = {
  pcol_01K88QVKKZN29HYFBYXRAV0106: { name: "Bijoux énergétiques", slug: "bijoux-energetiques" },
  pcol_01K88X47XDD86DGRCST06ZRFP4: { name: "Bougie émotionnelle", slug: "bougie-emotionnelle" },
  pcol_01K88QSKEZQ9032VE7PBEWG0GH: { name: "Calendrier de l'Avent", slug: "calendrier" },
  pcol_01K88QWACTFF883B79X179MZ28: { name: "Objets de lithothérapie", slug: "objets-de-lithotherapie" },
  pcol_01K88QVYP8QVQ95HSSKMD9KHZC: { name: "Pierres & Minéraux", slug: "pierres-et-mineraux" },
  pcol_01K88QVC9Q913Y15SCX4NC004D: { name: "Rituels & Bien-être", slug: "rituels-et-bien-etre" },
};

/* ------------------------------ helpers & utils ------------------------------ */
const deaccent = (s = "") =>
  s.toString().normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase().trim();

const toArray = (v) => (Array.isArray(v) ? v : v ? [v] : []);

const singular = (t) =>
  t.endsWith("s") ? t.slice(0, -1) : t;

/* génère une liste de tokens “synonymes” tolérants pour chaque catégorie */
const categoryTokens = (name, slug) => {
  const base = deaccent(name);
  const baseSlug = deaccent(slug || "");
  const andAmp = base.replace(" et ", " & ");
  const andWord = base.replace(" & ", " et ");
  const noAmp = base.replace("&", "et");
  const onlyWords = base.replace(/[&]/g, " ").replace(/\s+/g, " ").trim();

  const words = onlyWords.split(" ").filter(Boolean);
  const singles = words.map(singular);

  // exemples pour “pierres & mineraux” → ["pierres", "mineraux", "pierre", "minerau"]
  const pieces = [...new Set([...words, ...singles])];

  return [
    base,
    baseSlug,
    andAmp,
    andWord,
    noAmp,
    onlyWords,
    ...pieces,
  ].map(deaccent).filter(Boolean);
};

/* on prépare un catalogue enrichi avec tokens */
const CATEGORY_CATALOG = Object.entries(CATEGORY_REGISTRY).map(([id, meta]) => ({
  id,
  name: meta.name,
  slug: meta.slug,
  tokens: categoryTokens(meta.name, meta.slug),
}));

/* collecte d’indices depuis un produit (on vise large) */
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

  // arrays d'ids directs
  toArray(p?.collection_ids).forEach((x) => ids.add(String(x)));
  toArray(p?.category_ids).forEach((x) => ids.add(String(x)));

  // champs simples
  ["collection","collection_name","collection_slug","category","category_name","category_slug"].forEach((k)=>{
    const v = p?.[k];
    if (v) tokens.add(deaccent(v));
  });

  // metadata possibles
  const m = p?.metadata || {};
  ["collection","collection_name","category","category_name","category_slug"].forEach((k)=>{
    const v = m?.[k];
    if (v) tokens.add(deaccent(v));
  });

  // tags
  const rawTags = p?.tags;
  if (typeof rawTags === "string") rawTags.split(",").forEach((t)=>tokens.add(deaccent(t)));
  else if (Array.isArray(rawTags)) rawTags.forEach((t)=>tokens.add(deaccent(t)));

  // parfois les intégrations balancent la collection dans le titre/description
  const maybeTitle = deaccent(p?.title || p?.name || "");
  const maybeSubtitle = deaccent(p?.subtitle || "");
  if (maybeTitle) tokens.add(maybeTitle);
  if (maybeSubtitle) tokens.add(maybeSubtitle);

  return { ids: [...ids], tokens: [...tokens] };
};

/* match flou: égalité ou inclusion bi-directionnelle */
const fuzzyMatch = (a, b) => a === b || a.includes(b) || b.includes(a);

/* construit l’index: compte + cover par catégorie même si IDs ont bougé */
function buildCategoryIndex(products) {
  // base visible: toujours 6 cartes
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

    // 1) match strict par ID
    for (const cid of ids) {
      const cell = byId.get(cid);
      if (cell) {
        matched = true;
        cell.count += 1;
        if (!cell.cover && cover) cell.cover = cover;
      }
    }

    // 2) si rien par ID, on tente par tokens flous vs tokens de catégorie
    if (!matched && tokens.length) {
      for (const cell of index) {
        const hit = tokens.some((t) => cell.tokens.some((ct) => fuzzyMatch(t, ct)));
        if (hit) {
          cell.count += 1;
          if (!cell.cover && cover) cell.cover = cover;
          matched = true;
          // on ne break pas: un produit peut alimenter plusieurs catégories si tags multiples
        }
      }
    }
  }

  return index;
}

/* ------------------------------ animations ------------------------------ */
const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07, delayChildren: 0.1, ease: "easeOut", duration: 0.4 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.98 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 120, damping: 18 } },
  hover: { y: -3, transition: { duration: 0.18 } },
};

/* ----------------------------- carte collection ----------------------------- */
const CollectionCard = ({ item }) => {
  const disabled = item.count === 0;

  return (
    <motion.div
      variants={itemVariants}
      whileHover="hover"
      className={`group relative rounded-xl overflow-hidden bg-white/90 shadow-sm max-w-[360px] w-full mx-auto ${
        disabled ? "opacity-75 pointer-events-none" : ""
      }`}
      title={disabled ? "Aucun article dans cette catégorie pour le moment" : undefined}
    >
      <Link to={`/collections/${item.slug}?categoryId=${encodeURIComponent(item.id)}`} className="block">
        <div className="aspect-[4/3] relative overflow-hidden bg-[#FBF9F4]">
          {item.cover ? (
            <img
              src={item.cover}
              alt={item.name}
              className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-400"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full grid place-items-center text-gray-300 text-sm">
              Aucune image
            </div>
          )}
        </div>

        <div className="px-5 pt-3.5 pb-4 bg-gradient-to-br from-[#E9CC8A] to-[#C3A46D]">
          <h3 className="text-[1.05rem] md:text-lg font-bold text-black">{item.name}</h3>
          <p className="text-sm text-black/80">
            {item.count} article{item.count > 1 ? "s" : ""}
          </p>
        </div>
      </Link>
    </motion.div>
  );
};

/* ---------------------------------- page ---------------------------------- */
const CollectionsPage = () => {
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        setError("");

        const res = await getProducts({ limit: 250 });
        const all = res?.products || res?.items || [];
        const index = buildCategoryIndex(all);
        if (alive) setItems(index);
      } catch (e) {
        if (alive) setError("Impossible de charger les collections. Réessaie plus tard.");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const title = "Nos Collections";
  const description =
    "Découvrez nos univers : bougies émotionnelles, bijoux énergétiques, pierres naturelles, rituels & bien-être… chaque catégorie vous ouvre une nouvelle porte émotionnelle.";

  const gridItems = useMemo(() => items || [], [items]);

  return (
    <>
      <Seo title={`${title} – Mil’aura`} description={description} />
      <motion.div className="bg-[#FBF9F4] min-h-screen" initial="hidden" animate="show" variants={containerVariants}>
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <motion.h1 variants={itemVariants} className="text-4xl md:text-5xl font-script text-gradient-gold-warm text-center mb-5">
            {title}
          </motion.h1>

          <motion.p variants={itemVariants} className="max-w-3xl mx-auto text-center text-gray-600 mb-10 md:mb-12">
            {description}
          </motion.p>

          {loading ? (
            <motion.div variants={itemVariants} className="text-center text-gray-400 py-24">Chargement…</motion.div>
          ) : error ? (
            <motion.div variants={itemVariants} className="text-center text-red-500 bg-red-50/60 rounded-xl p-6">{error}</motion.div>
          ) : (
            <motion.div variants={containerVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {gridItems.map((it) => (
                <CollectionCard key={it.id} item={it} />
              ))}
            </motion.div>
          )}
        </section>
      </motion.div>
    </>
  );
};

export default CollectionsPage;