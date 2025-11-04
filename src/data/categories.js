export const categories = [
  {
    name: 'Bijoux énergétiques',
    slug: 'bijoux-energetiques',
    aliases: ['bijoux energetiques', 'bijoux', 'jewelry', 'bijoux et talismans', 'bijoux & talismans'],
    imgDescription: 'A delicate necklace with a rose quartz pendant lying on a silk cloth.',
    alt: 'Collection de bijoux énergétiques'
  },
  {
    name: 'Bougies émotionnelles',
    slug: 'bougie-emotionnelle',
    aliases: ['bougies emotionnelles', 'bougies', 'bougie', 'emotionnelle', 'candles'],
    imgDescription: 'A close-up of a lit candle with crystals embedded in the wax.',
    alt: 'Collection de bougies émotionnelles'
  },
  {
    name: 'Objets de lithothérapie',
    slug: 'objets-de-lithotherapie',
    aliases: ['objets de lithotherapie', 'objets', 'lithotherapie', 'decor'],
    imgDescription: 'A beautifully crafted stone soap dispenser on a marble countertop.',
    alt: 'Collection d\'objets de lithothérapie'
  },
  {
    name: 'Pierres & Minéraux',
    slug: 'pierres-mineraux',
    aliases: ['pierres et mineraux', 'pierres & mineraux', 'pierres', 'mineraux', 'stones'],
    imgDescription: 'A collection of various polished crystals like amethyst, and clear quartz.',
    alt: 'Collection de pierres et minéraux'
  },
  {
    name: 'Rituels & Bien-être',
    slug: 'rituels-bien-etre',
    aliases: ['rituels et bien-etre', 'rituels & bien-etre', 'rituels', 'bien-etre', 'wellness'],
    imgDescription: 'Peaceful ritual setup with crystals, candles and natural elements.',
    alt: 'Collection rituels et bien-être'
  },
  {
    name: 'Calendrier de l\'Avent',
    slug: 'calendrier-de-lavent',
    aliases: ['calendrier de lavent', "calendrier de l'avent", 'calendrier', 'avent', 'advent'],
    imgDescription: 'Beautiful advent calendar with spiritual gifts.',
    alt: 'Calendrier de l\'avent spirituel'
  },
  {
    name: 'Nos nouveautés',
    slug: 'nos-nouveautes',
    aliases: ['nos nouveautes', 'nouveautes', 'new-arrivals', 'new', 'nos nouveautés'],
    imgDescription: 'Latest arrivals in our spiritual collection.',
    alt: 'Nos dernières nouveautés'
  },
  {
    name: "Tous les produits",
    slug: "tous-les-produits",
    aliases: ["all products", "tous les produits", "all"],
    imgDescription: 'A wide array of spiritual products.',
    alt: 'Toutes nos créations'
  }
];

export const matchCategorySlug = (wantedSlug, collectionFromStore) => {
  // Normalize strings to be lowercase and without dashes for comparison
  const normalize = (str) => (str || '').trim().toLowerCase();
  const normalizeSlug = (str) => normalize(str).replace(/-/g, ' ');

  const wantedSlugNormalized = normalizeSlug(wantedSlug);
  const storeCollectionTitle = normalize(collectionFromStore?.title || '');

  // Find the corresponding category configuration from our local list
  const localCategory = categories.find(cat => normalizeSlug(cat.slug) === wantedSlugNormalized);
  
  if (localCategory) {
    // Create a list of all possible names for this category, including its main name and all aliases
    const allPossibleNames = [normalize(localCategory.name), ...localCategory.aliases.map(normalize)];
    // Check if the store's collection title is in our list of possible names
    return allPossibleNames.includes(storeCollectionTitle);
  }

  // Fallback: if no specific category config is found, check for a direct match
  return wantedSlugNormalized === storeCollectionTitle;
};