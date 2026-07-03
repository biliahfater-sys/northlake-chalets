// One-off media pipeline: optimize the source reference renders into
// web-ready, descriptively-named images used by next/image as canonical sources.
import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const SRC = "C:/Users/LEOHACKER/Desktop/виллы/референсы";
const OUT = "C:/Users/LEOHACKER/Desktop/виллы/northlake/public/images";

// reference render -> semantic asset name
const MAP = [
  ["ChatGPT Image 9 июн. 2026 г., 01_07_08 (6).png", "hero-alpine-village-lake"],
  ["ChatGPT Image 9 июн. 2026 г., 01_07_06 (3).png", "villa-mountain-view-estate"],
  ["ChatGPT Image 9 июн. 2026 г., 01_07_06 (1).png", "villa-lakefront-chalet"],
  ["ChatGPT Image 9 июн. 2026 г., 01_07_07 (4).png", "villa-forest-residence"],
  ["ChatGPT Image 9 июн. 2026 г., 01_07_06 (2).png", "villa-private-family-lodge"],
  ["ChatGPT Image 9 июн. 2026 г., 01_07_08 (5).png", "nature-mountain-lake"],
];

await mkdir(OUT, { recursive: true });

for (const [file, name] of MAP) {
  const input = path.join(SRC, file);
  const img = sharp(input);
  const meta = await img.metadata();
  console.log(`${name}: source ${meta.width}x${meta.height}`);

  // canonical large JPG source (next/image will derive webp/avif + srcset)
  await sharp(input)
    .resize({ width: Math.min(meta.width, 2048), withoutEnlargement: true })
    .jpeg({ quality: 84, mozjpeg: true, progressive: true })
    .toFile(path.join(OUT, `${name}.jpg`));

  // tiny blurDataURL-friendly preview (also handy as LQIP)
  const blur = await sharp(input)
    .resize({ width: 24 })
    .jpeg({ quality: 40 })
    .toBuffer();
  console.log(`  -> ${name}.jpg  | blur ${blur.length}b`);
}

// Open Graph / social card (1200x630) from the hero village shot
await sharp(path.join(SRC, "ChatGPT Image 9 июн. 2026 г., 01_07_08 (6).png"))
  .resize({ width: 1200, height: 630, fit: "cover", position: "centre" })
  .jpeg({ quality: 86, mozjpeg: true })
  .toFile(path.join(OUT, "og-northlake.jpg"));
console.log("og-northlake.jpg written");

console.log("DONE");
