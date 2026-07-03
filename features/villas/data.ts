import { IMAGES } from "@/lib/media";
import type { Villa } from "./types";

export const villas: Villa[] = [
  {
    id: "lakefront-chalet",
    name: "Maison Lac Clair",
    type: "Lakefront Chalet",
    location: "Lac Clair, Valais",
    region: "Switzerland",
    priceRange: "€8.4M – €9.2M",
    priceFrom: 8_400_000,
    area: 410,
    bedrooms: 5,
    bathrooms: 6,
    view: "Direct lake & glacier",
    availability: "available",
    image: IMAGES.lakefrontChalet,
    blurb:
      "Water at the threshold. Hand-cut larch, a private mooring, and morning light that arrives across the lake before it reaches the road.",
  },
  {
    id: "forest-residence",
    name: "Villa Pinède",
    type: "Forest Residence",
    location: "Haut-Bois, Graubünden",
    region: "Switzerland",
    priceRange: "€6.1M – €6.8M",
    priceFrom: 6_100_000,
    area: 360,
    bedrooms: 4,
    bathrooms: 5,
    view: "Pine canopy & ridge",
    availability: "available",
    image: IMAGES.forestResidence,
    blurb:
      "Set deep among old-growth pine, with double-height glazing that turns the forest into the only artwork the house will ever need.",
  },
  {
    id: "mountain-view-estate",
    name: "Domaine Belvedère",
    type: "Mountain View Estate",
    location: "Crête Sud, Valais",
    region: "Switzerland",
    priceRange: "€11.5M – €12.9M",
    priceFrom: 11_500_000,
    area: 520,
    plot: 3_840,
    bedrooms: 6,
    bathrooms: 7,
    view: "Panoramic summit",
    availability: "reserved",
    image: IMAGES.mountainViewEstate,
    blurb:
      "An estate posed against the summit line. Stone base, timber crown, and a terrace built for the hour the peaks turn gold.",
    audience: ["Family retreat", "Legacy asset", "Seasonal residence"],
    positioning:
      "Protected ridge plot with second-home permit in place, private road access, and a 3,840 m² parcel that cannot be subdivided or overlooked — the kind of position Valais no longer issues.",
    access: [
      { label: "Geneva airport", value: "1 h 50 by car" },
      { label: "Sion airfield (private)", value: "35 min" },
      { label: "Ski lift — Crête Sud", value: "12 min" },
      { label: "Lake shore & mooring", value: "14 min" },
      { label: "Village — restaurants, school", value: "8 min" },
      { label: "Clinic (24 h)", value: "22 min" },
    ],
  },
  {
    id: "private-family-lodge",
    name: "Le Grand Refuge",
    type: "Private Family Lodge",
    location: "Vallée du Nord, Bern",
    region: "Switzerland",
    priceRange: "€9.8M – €10.6M",
    priceFrom: 9_800_000,
    area: 480,
    bedrooms: 6,
    bathrooms: 6,
    view: "Lake basin & gardens",
    availability: "private",
    image: IMAGES.privateFamilyLodge,
    blurb:
      "A symmetrical lodge for several generations — wide eaves, a stone hearth at its centre, and gardens that fall gently toward the water.",
  },
];

/** Featured property used in the dossier section. */
export const featuredVilla = villas[2];
