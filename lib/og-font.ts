import { cacheLife } from "next/cache";

export async function loadArchivo(weight: number, stretch: number, text: string): Promise<ArrayBuffer | null> {
  "use cache";
  cacheLife("max");
  try {
    const family = `Archivo:wdth,wght@${stretch},${weight}`;
    const url = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}&text=${encodeURIComponent(text)}`;
    const css = await (await fetch(url)).text();
    const source = css.match(/src: url\((.+?)\) format\('(?:opentype|truetype)'\)/);
    if (!source) return null;
    const response = await fetch(source[1]);
    if (!response.ok) return null;
    return await response.arrayBuffer();
  } catch {
    return null;
  }
}

export async function archivoFonts(parts: { text: string; weight: 500 | 700 | 800; stretch: number }[]) {
  const loaded = await Promise.all(
    parts.map(async (part) => ({ part, data: await loadArchivo(part.weight, part.stretch, part.text) }))
  );
  return loaded
    .filter((entry): entry is { part: (typeof parts)[number]; data: ArrayBuffer } => entry.data !== null)
    .map(({ part, data }) => ({
      name: `Archivo${part.stretch}`,
      data,
      weight: part.weight,
      style: "normal" as const,
    }));
}
