// Rasterises the vector brand icons into the PNG/ICO files browsers and
// home screens expect. Runs before `next build` (see package.json "prebuild").
// Sources: public/icon.svg (rounded tile), scripts/brand/icon-square.svg
// (full-bleed tile for Apple touch + PWA icons), scripts/brand/icon-maskable.svg
// (mark inside the maskable safe zone) and public/alliance-mark.svg (iOS
// launch images: paper background + mark, matching the in-app splash).
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const pub = (f) => join(root, "public", f);
// iOS launch screens (portrait): [cssWidth, cssHeight, dpr]. Shared with
// src/app/layout.tsx, which emits the matching apple-touch-startup-image links.
export const launchScreens = JSON.parse(readFileSync(join(root, "src/data/launch-screens.json"), "utf8"));
const launchName = ([w, h, r]) => `splash/launch-${w * r}x${h * r}.png`;
const outputs = [
  "apple-touch-icon.png",
  "icon-192.png",
  "icon-512.png",
  "icon-maskable-512.png",
  "favicon.ico",
  ...launchScreens.map(launchName),
];

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
const maskable = readFileSync(join(root, "scripts/brand/icon-maskable.svg"));
const mark = readFileSync(pub("alliance-mark.svg"));
const rounded = readFileSync(pub("icon.svg"));

const png = (svg, size) =>
  sharp(svg, { density: Math.max(72, Math.ceil((size / 120) * 72 * 1.5)) })
    .resize(size, size)
    .png({ compressionLevel: 9 })
    .toBuffer();

writeFileSync(pub("apple-touch-icon.png"), await png(square, 180));
writeFileSync(pub("icon-192.png"), await png(square, 192));
writeFileSync(pub("icon-512.png"), await png(square, 512));
writeFileSync(pub("icon-maskable-512.png"), await png(maskable, 512));

// Launch screens: paper #FAFAF8 with the mark where the splash places it
// (104 css px, sitting ~42 css px above centre to leave room for the wordmark).
mkdirSync(pub("splash"), { recursive: true });
for (const s of launchScreens) {
  const [w, h, r] = s;
  const W = w * r;
  const H = h * r;
  const size = 104 * r;
  const markPng = await sharp(mark, { density: 72 * (size / 512) * 4 })
    .resize(size, size)
    .png()
    .toBuffer();
  const img = await sharp({
    create: { width: W, height: H, channels: 3, background: "#FAFAF8" },
  })
    .composite([
      {
        input: markPng,
        left: Math.round((W - size) / 2),
        top: Math.round(H / 2 - size / 2 - 42 * r),
      },
    ])
    .png({ compressionLevel: 9, palette: true })
    .toBuffer();
  writeFileSync(pub(launchName(s)), img);
}

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
