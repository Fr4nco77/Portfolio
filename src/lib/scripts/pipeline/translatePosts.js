import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import gemini from "./gemini.js";

const target_langs = ["en", "fr", "pt"];
const files = process.argv.slice(2);

async function main() {
  for (const filePath of files) {
    if (!filePath.endsWith(".mdx") || !filePath.includes("/content/posts/es/"))
      continue;

    console.log(`\n📄 Processing file: ${filePath}`);
    const fileContent = readFileSync(filePath, "utf-8");

    for (const lang of target_langs) {
      console.log(`\ 🌎 Translating to ${lang}...`);

      const prompt = `
    Actúa como un traductor nativo experto en tecnología y MDX.
    Traduce el siguiente texto al idioma: ${lang}.
    
    REGLAS CRÍTICAS:
    1. No traduzcas componentes de Astro/React (ej. <Card />, <Button>).
    2. Mantén intactas las rutas de imágenes, enlaces de Markdown, fechas, ids y tags.
    3. No inventes contenido, solo traduce.
    4. PROHIBIDO el uso de bloques de código Markdown: Entrega el contenido directamente como texto plano sin envolverlo en \`\`\`yaml, \`\`\`md o etiquetas similares.
    5. Devuelve ÚNICAMENTE el texto traducido, sin comentarios adicionales.
    
    Texto a traducir:
    ${fileContent}
  `;

      const fileTranslated = await gemini(prompt);

      if (fileTranslated) {
        const newPath = filePath.replace("/es/", `/${lang}/`);
        const dir = path.dirname(newPath);

        if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
        writeFileSync(newPath, fileTranslated);

        console.log(` ✅ Saved: ${newPath}`);
      }
    }
  }
}

main().catch(console.error);
