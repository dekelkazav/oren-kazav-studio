// Converts original photos into web-ready images.
// Usage:  npm run images                     (default source folder: חומרים/תמונות)
//         npm run images -- "path/to/folder"
// Every image in the source folder becomes two files in images/works:
//   <name>.webp (1400px) and <name>-sm.webp (700px)
import sharp from "sharp";
import { readdir, mkdir } from "node:fs/promises";
import { join, parse } from "node:path";

const src = process.argv[2] || join("חומרים", "תמונות");
const out = join("images", "works");
await mkdir(out, { recursive: true });

const files = (await readdir(src)).filter((f) => /\.(jpe?g|png|webp|heic|tiff?)$/i.test(f));
if (!files.length) console.log(`No images found in "${src}"`);

for (const file of files) {
  const name = parse(file).name.trim().replace(/\s+/g, "-").toLowerCase();
  const input = sharp(join(src, file)).rotate();
  for (const [suffix, size, quality] of [["", 1400, 80], ["-sm", 700, 78]]) {
    const dest = join(out, `${name}${suffix}.webp`);
    const info = await input.clone()
      .resize({ width: size, height: size, fit: "inside", withoutEnlargement: true })
      .webp({ quality })
      .toFile(dest);
    console.log(`${dest}  ${info.width}x${info.height}  ${Math.round(info.size / 1024)}KB`);
  }
}
