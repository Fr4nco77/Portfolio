//newtworks
import Github from "@assets/icons/networks/Github.astro";
import LinkedIn from "@assets/icons/networks/LinkedIn.astro";
import Mail from "@assets/icons/networks/Mail.astro";

//services
import Globe from "@assets/icons/services/Globe.astro";
import Zap from "@assets/icons/services/Zap.astro";
import Robot from "@assets/icons/services/Robot.astro";
import Tools from "@assets/icons/services/Tools.astro";

//design
import Monitor from "@assets/icons/design/Monitor.astro";
import Laptop from "@assets/icons/design/Laptop.astro";
import Pen from "@assets/icons/design/Pen.astro";
import Paint from "@assets/icons/design/Paint.astro";

//techs
import Javascript from "@assets/icons/techs/JavaScript.astro";
import TypeScript from "@assets/icons/techs/TypeScript.astro";
import Java from "@assets/icons/techs/Java.astro";
import HTML from "@assets/icons/techs/HTML.astro";
import React from "@assets/icons/techs/React.astro";
import Next from "@assets/icons/techs/Next.astro";
import Astro from "@assets/icons/techs/Astr.astro";
import Express from "@assets/icons/techs/Express.astro";
import NestJS from "@assets/icons/techs/NestJS.astro";
import CSS from "@assets/icons/techs/CSS.astro";
import Tailwind from "@assets/icons/techs/Tailwind.astro";
import Node from "@assets/icons/techs/Node.astro";
import Npm from "@assets/icons/techs/Npm.astro";
import Pnpm from "@assets/icons/techs/Pnpm.astro";
import Git from "@assets/icons/techs/Git.astro";
import GitHub2 from "@assets/icons/techs/GitHub.astro";
import PostgreSQL from "@assets/icons/techs/PostgreSQL.astro";
import MySQL from "@assets/icons/techs/MySQL.astro";
import MongoDB from "@assets/icons/techs/MongoDB.astro";
import Mongoose from "@assets/icons/techs/Mongoose.astro";
import Playwright from "@assets/icons/techs/Playwright.astro";
import Jest from "@assets/icons/techs/Jest.astro";

//images
import Techs from "@assets/images/skills/laptop.jpg";
import Services from "@assets/images/skills/services.jpg";
import Design from "@assets/images/skills/design.jpg";

//funciones para skills
function getServiceIconByIndex(index: number) {
  switch (index) {
    case 0:
    case 1:
    case 2:
    case 3:
      return Globe;

    case 4:
    case 5:
      return Zap;

    case 6:
    case 7:
      return Robot;

    case 8:
      return Tools;

    default:
      return Globe;
  }
}

export function getIconDesignByIndex(index: number) {
  switch (index) {
    case 0:
      return Monitor;
    case 1:
      return Laptop;
    case 2:
      return Pen;
    default:
      return Paint;
  }
}

//constantes
export const networks = [
  { label: "GitHub", href: "https://github.com/Fr4nco77", icon: Github },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/franco-carreras-b7a1a4268/",
    icon: LinkedIn,
  },
  { label: "Email", href: "mailto:fcarreras777@gmail.com", icon: Mail },
];

export const skills = ({
  services,
  design,
}: {
  [key: string]: { title: string; skills: string[] };
}) => [
  {
    label: services.title,
    image: Services,
    skills: services.skills.map((service, index) => ({
      label: service,
      icon: getServiceIconByIndex(index),
    })),
  },
  {
    label: "Tecnologías",
    image: Techs,
    skills: [
      // Lenguajes
      { label: "JavaScript", icon: Javascript },
      { label: "TypeScript", icon: TypeScript },
      { label: "Java", icon: Java },
      { label: "HTML", icon: HTML },

      // Frameworks y Meta-frameworks
      { label: "React", icon: React },
      { label: "Next.js", icon: Next },
      { label: "Astro", icon: Astro },
      { label: "Express", icon: Express },
      { label: "NestJS", icon: NestJS },

      // Estilos y UI
      { label: "CSS", icon: CSS },
      { label: "TailwindCSS", icon: Tailwind },

      // Herramientas
      { label: "Node.js", icon: Node },
      { label: "npm", icon: Npm },
      { label: "pnpm", icon: Pnpm },
      { label: "Git", icon: Git },
      { label: "GitHub", icon: GitHub2 },

      // ORMs y Bases de Datos
      { label: "PostgreSQL", icon: PostgreSQL },
      { label: "MySQL", icon: MySQL },
      { label: "MongoDB", icon: MongoDB },
      { label: "Mongoose", icon: Mongoose },

      // Testing y automatización
      { label: "Playwright", icon: Playwright },
      { label: "Jest", icon: Jest },
    ],
  },
  {
    label: design.title,
    image: Design,
    skills: design.skills.map((label, index) => ({
      label: label,
      icon: getIconDesignByIndex(index),
    })),
  },
];
