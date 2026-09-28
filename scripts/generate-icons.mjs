// Rasterises the vector brand icons into the PNG/ICO files browsers and
// home screens expect. Runs before `next build` (see package.json "prebuild").
// Sources: public/icon.svg (rounded tile) and scripts/brand/icon-square.svg
// (full-bleed tile for Apple touch + PWA icons).
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const pub = (f) => join(root, "public", f);
const outputs = ["apple-touch-icon.png", "icon-192.png", "icon-512.png", "favicon.ico"];

let sharp;
try {
  sharp = (await import("sharp")).default;
} catch {
  const missing = outputs.filter((f) => !existsSync(pub(f)));
  if (missing.length) {
    console.warn(`[icons] sharp unavailable; missing: ${missing.join(", ")}`);
  } else {
    console.log("[icons] sharp unavailable; existing icons kept");
  }
  process.exit(0);
}

const square = readFileSync(join(root, "scripts/brand/icon-square.svg"));
const rounded = readFileSync(pub("icon.svg"));

const png = (svg, size) =>
  sharp(svg, { density: Math.max(72, Math.ceil((size / 120) * 72 * 1.5)) })
    .resize(size, size)
    .png({ compressionLevel: 9 })
    .toBuffer();

writeFileSync(pub("apple-touch-icon.png"), await png(square, 180));
writeFileSync(pub("icon-192.png"), await png(square, 192));
writeFileSync(pub("icon-512.png"), await png(square, 512));

// Minimal ICO container holding 16px and 32px PNGs.
const images = [
  [16, await png(rounded, 16)],
  [32, await png(rounded, 32)],
];
const header = Buffer.alloc(6);
header.writeUInt16LE(0, 0);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(images.length, 4);
let offset = 6 + 16 * images.length;
const entries = images.map(([size, buf]) => {
  const e = Buffer.alloc(16);
  e.writeUInt8(size, 0);
  e.writeUInt8(size, 1);
  e.writeUInt16LE(1, 4);
  e.writeUInt16LE(32, 6);
  e.writeUInt32LE(buf.length, 8);
  e.writeUInt32LE(offset, 12);
  offset += buf.length;
  return e;
});
writeFileSync(pub("favicon.ico"), Buffer.concat([header, ...entries, ...images.map((i) => i[1])]));

console.log(`[icons] generated ${outputs.join(", ")}`);
