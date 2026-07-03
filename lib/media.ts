/**
 * Centralized media paths. Every asset lives here so components never
 * hardcode strings and we always know what is actually shipped in /public.
 */

export const IMAGES = {
  heroVillage: "/images/hero-alpine-village-lake.jpg",
  natureMountainLake: "/images/nature-mountain-lake.jpg",
  lakefrontChalet: "/images/villa-lakefront-chalet.jpg",
  forestResidence: "/images/villa-forest-residence.jpg",
  mountainViewEstate: "/images/villa-mountain-view-estate.jpg",
  privateFamilyLodge: "/images/villa-private-family-lodge.jpg",
  og: "/images/og-northlake.jpg",
} as const;

export const VIDEO = {
  firepit1080: "/video/cta-evening-firepit-1080.mp4",
  firepit720: "/video/cta-evening-firepit-720.mp4",
  firepitPoster: "/video/cta-evening-firepit-poster.jpg",
} as const;
