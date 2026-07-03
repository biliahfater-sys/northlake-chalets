export type Availability = "available" | "reserved" | "private";

export interface VillaAccess {
  label: string;
  value: string;
}

export interface Villa {
  id: string;
  name: string;
  type: string;
  location: string;
  region: string;
  priceRange: string;
  priceFrom: number; // for sorting / data display
  area: number; // m²
  plot?: number; // m² of land
  bedrooms: number;
  bathrooms: number;
  view: string;
  availability: Availability;
  image: string;
  blurb: string;
  /** Who the asset suits — family retreat, legacy asset, seasonal residence… */
  audience?: string[];
  /** Why it holds its price — one honest sentence. */
  positioning?: string;
  /** Travel & amenity distances for the access ledger. */
  access?: VillaAccess[];
}

export const AVAILABILITY_LABEL: Record<Availability, string> = {
  available: "Available",
  reserved: "Reserved",
  private: "Private sale",
};
