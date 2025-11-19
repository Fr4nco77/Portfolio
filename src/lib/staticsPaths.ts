import { locales, type Locale } from "@i18n/utils";
import type { GetStaticPaths } from "astro";
import { getCollection } from "astro:content";

//GetCollections by Lang

const getProjects = async (locale: Locale) => {
  const projects = await getCollection("projects");
  return projects.filter(({ id }) => id.startsWith(`${locale}/`));
};

const getPosts = async (locale: Locale) => {
  const posts = await getCollection("posts");
  return posts
    .filter(({ id }) => id.startsWith(`${locale}/`))
    .sort(
      (a, b) =>
        new Date(b.data.date).getTime() - new Date(a.data.date).getTime(),
    );
};

//Statics Paths

export const generateLangStaticPaths = (() => {
  return Object.keys(locales).map((locale) => {
    return { params: { lang: locale } };
  });
}) satisfies GetStaticPaths;

export const generateHomeStaticPaths: GetStaticPaths = async () => {
  const paths = await Promise.all(
    Object.keys(locales).map(async (locale) => {
      const projects = await getProjects(locale as Locale);
      const posts = await getPosts(locale as Locale);

      const featuredProjects = projects
        .filter(({ data }) => data.featured)
        .map(({ id, data }) => ({
          id: id.split("/")[1],
          name: data.name,
          cover: data.cover,
        }));

      const recentPosts = posts.slice(0, 3).map(({ id, data }) => {
        const { title, tag, date, summary, cover } = data;
        return {
          id: id.split("/")[1],
          title,
          tag,
          date: date.getFullYear(),
          summary,
          cover,
        };
      });

      return {
        params: { lang: locale },
        props: {
          projects: featuredProjects,
          posts: recentPosts,
        },
      };
    }),
  );

  return paths;
};
