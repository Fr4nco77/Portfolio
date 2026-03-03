import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import gemini from "./gemini.js";

const target_langs = ["en", "fr", "pt"];
const files = process.argv.slice(2);

async function main() {
  for (const filePath of files) {
    if (
      !filePath.endsWith(".md") ||
      !filePath.includes("/content/projects/es/")
    )
      continue;

    console.log(`\n📄 Processing file: ${filePath}`);
    const fileContent = readFileSync(filePath, "utf-8");

    for (const lang of target_langs) {
      console.log(` 🌎 Translating to ${lang}...`);

      const prompt = `
  Actúa como un traductor técnico experto en archivos de configuración YAML/Markdown.
  Traduce el archivo al idioma: ${lang}.

  REGLAS DE FORMATO (OBLIGATORIAS):
  1. El archivo DEBE empezar y terminar con tres guiones (---).
  2. NO uses bloques de código Markdown (prohibido usar \`\`\`yaml o \`\`\`).
  3. Devuelve el contenido en texto plano, listo para ser guardado como archivo .md.
  4. Mantén el esquema exacto de llaves y valores.

  REGLAS DE TRADUCCIÓN:
  1. Traduce únicamente los valores de "summary" y los elementos de la lista "services".
  2. NO traduzcas los valores de: "name", "cover", "techs", "link", "repository", "date", "images", "video", "featured".
  3. En las rutas de "othersProjects", cambia solo el prefijo de idioma al de destino (ej. "es/peeps" pasa a ser "${lang}/peeps").
  4. Devuelve ÚNICAMENTE el texto del archivo, sin introducciones ni comentarios.

  Archivo a traducir:
  ${fileContent}`;

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
