import { readFileSync, existsSync } from "node:fs";
import path from "node:path";
import gemini from "./gemini.js";

if (existsSync(".env")) {
  process.loadEnvFile();
}

const { LINKEDIN_ACCESS_TOKEN, LINKEDIN_PERSON_URN, LINKEDIN_VERSION } =
  process.env;
const BASE_URL = "https://franco-carreras.vercel.app/es";

// Capturamos los archivos que vienen de GitHub Actions
const files = process.argv.slice(2);

async function main() {
  for (const filePath of files) {
    // SOLO publicar si es un post nuevo en la carpeta original (ES)
    if (!filePath.endsWith(".mdx") || !filePath.includes("/content/posts/es/"))
      continue;

    console.log(`\n📄 Processing file: ${filePath}`);

    try {
      const fileContent = readFileSync(filePath, "utf-8");
      const slug = path.basename(filePath, path.extname(filePath));
      const postUrl = `${BASE_URL}/blog/${slug}`;

      // 1. Generar Copy con Gemini
      const prompt = generatePrompt(fileContent);
      console.log(" 🤖 Writing a strategic post...");
      const linkedinText = await gemini(prompt);

      if (!linkedinText) throw new Error("Gemini returned an empty text");

      // 2. Enviar a LinkedIn
      console.log(" ✍️ Posting...");
      await postToLinkedin(linkedinText, postUrl);
    } catch (error) {
      console.error(` ❌ Error with ${filePath}:`, error.message);
    }
  }
}

async function postToLinkedin(linkedinText, postUrl) {
  const url = "https://api.linkedin.com/rest/posts";
  const jsonContent = linkedinText.match(/\{[\s\S]*\}/)[0];
  const { title, content } = JSON.parse(jsonContent);

  const body = {
    author: LINKEDIN_PERSON_URN,
    commentary: content,
    visibility: "PUBLIC",
    distribution: {
      feedDistribution: "MAIN_FEED",
      targetEntities: [],
      thirdPartyDistributionChannels: [],
    },
    content: {
      article: {
        source: postUrl,
        title,
        thumbnail: "urn:li:image:D4D10AQHs8eXAbWU4zA",
      },
    },
    lifecycleState: "PUBLISHED",
  };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${LINKEDIN_ACCESS_TOKEN}`,
      "Content-Type": "application/json",
      "X-Restli-Protocol-Version": "2.0.0",
      "LinkedIn-Version": LINKEDIN_VERSION,
    },
    body: JSON.stringify(body),
  });

  if (response.ok) {
    console.log(" ✅ Successfully published on LinkedIn.");
  } else {
    const errorData = await response.json();
    console.error(
      " ❌ LinkedIn API Error:",
      JSON.stringify(errorData, null, 2),
    );
  }
}

function generatePrompt(content) {
  return `
# 🚀 Prompt: Generador de Estrategia de Visibilidad en LinkedIn

**Contexto:**
Eres un experto en **Personal Branding para Desarrolladores de Software** y **Copywriting Técnico**. Tu objetivo es convertir un artículo técnico en un post de LinkedIn de alto impacto, diseñado para posicionar al autor como un perfil Senior con mentalidad de producto, criterio arquitectónico y capacidad de liderazgo técnico ante **Recruiters** y **Tech Leads**.

---

**Entrada (Input):**
Usa el siguiente contenido como base conceptual para la narrativa:
> ${content.substring(0, 1500)}

---

**Tareas a realizar:**

### 1. Redacción del Post Principal
* **Gancho (Hook):** Empieza con una pregunta contundente, una cifra de rendimiento o una confesión "incómoda" que detenga el scroll.
* **Cuerpo:** Desarrolla la tensión entre "sofisticación técnica innecesaria" vs. "valor real de negocio". Usa bullet points para facilitar la lectura rápida.
* **Enfoque Senior:** No hables solo de sintaxis; habla de **mantenibilidad**, **deuda técnica**, **costes de infraestructura** y **experiencia de usuario**.
* **Call to Action (CTA):** Invita a una reflexión técnica en los comentarios. Indica al usuario que puede expandir la información haciendo clic en la tarjeta visual (Card) que acompaña este post.
* **Hashtags Estratégicos:** Incluye un bloque optimizado (5-7) que mezcle:
    * Tecnologías específicas (ej. #AstroJS, #React).
    * Conceptos de ingeniería (#SoftwareArchitecture, #WebPerformance).
    * industria general (ej. #SoftwareEngineering, #Programming).
    * **REGLA DE ORO:** PROHIBIDO usar #OpenToWork, #Junior, #Senior o hashtags motivacionales. Queremos un perfil técnico puro.

### 2. Metadatos de la Card (Título)
* **Card Title:** Coloca el mismo title que tiene el archivo original.

---

**Restricciones de Estilo:**
* **Tono:** Profesional, crítico, honesto y directo. Evita el lenguaje motivacional genérico.
* **Formato:** Deja espacios en blanco entre párrafos para evitar "muros de texto". Usa emojis de forma profesional, como indicadores funcionales (ej. ✅ para soluciones, ❌ para errores, 🔍 para análisis) evitando su uso decorativo.
* **Sin Markdown:** No uses ** ni __. Para enfatizar, usa Mayúsculas Selectivas en encabezados cortos, listas con Emojis Funcionales (✅/❌) o Frases Cortas en líneas independientes.

**RESTRICCIONES CRÍTICAS DE SALIDA:**
- Responde ÚNICAMENTE con el objeto JSON.
- NO incluyas introducciones como "Aquí tienes el post" ni conclusiones.
- NO uses bloques de código con markdown (ej: \`\`\`json ... \`\`\`).
- El resultado debe ser un JSON válido que comience con { y termine con } para poder parsearlo correctamente.
- Asegúrate de escapar correctamente las comillas dobles internas y los saltos de línea dentro de los valores del JSON.

**Estructura requerida:**
{
  "title": "Aquí va el mismo title del archivo original",
  "content": "Aquí va todo el cuerpo del post generado con todo lo solicitado"
}
`;
}

main().catch(console.error);
