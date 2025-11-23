import { locales, type Locale } from "@i18n/utils";
import type { GetStaticPaths } from "astro";
import { getCollection, getEntry, type CollectionEntry } from "astro:content";

//FilterCollections by Lang.
const filterByLang = (collection: any[], locale: Locale) => {
  return collection
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
  const projects = await getCollection("projects");
  const posts = await getCollection("posts");

  return Object.keys(locales).map((locale) => {
    const filterProjects = filterByLang(
      projects,
      locale as Locale,
    ) as CollectionEntry<"projects">[];
    const FilterPosts = filterByLang(
      posts,
      locale as Locale,
    ) as CollectionEntry<"posts">[];

    const featuredProjects = filterProjects
      .filter(({ data }) => data.featured)
      .map(({ id, data }) => ({
        id: id.split("/")[1],
        name: data.name,
        cover: data.cover,
      }));

    const recentPosts = FilterPosts.slice(0, 3).map(({ id, data }) => {
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
  });
};

export const generateWorkStaticPaths: GetStaticPaths = async () => {
  const projects = await getCollection("projects");

  return Object.keys(locales).map((locale) => {
    const projectsFiltered = filterByLang(
      projects,
      locale as Locale,
    ) as CollectionEntry<"projects">[];

    const dataSelected = projectsFiltered.map(({ id, data }) => {
      const { name, cover, summary, date } = data;
      return {
        id: id.split("/")[1],
        name,
        cover,
        summary,
        date,
      };
    });

    return {
      params: {
        lang: locale,
      },
      props: {
        projects: dataSelected,
      },
    };
  });
};

export const generateProjectStaticPaths: GetStaticPaths = async () => {
  const projects = await getCollection("projects");

  const paths = await Promise.all(
    projects.map(async ({ id, data }) => {
      const [locale, slug] = id.split("/");

      const anotherProjects = await Promise.all(
        data.othersProjects.map(async ({ id }) => {
          const project = await getEntry("projects", id);
          if (!project) return;

          return {
            id: id,
            name: project.data.name,
            cover: project.data.cover,
          };
        }),
      );

      return {
        params: { lang: locale, id: slug },
        props: {
          project: data,
          anotherProjects,
        },
      };
    }),
  );
  return paths;
};

export const generateBlogStaticPaths: GetStaticPaths = async () => {
  const posts = await getCollection("posts");
  const tags = [...new Set(posts.flatMap(({ data }) => data.tag))];

  const paths = Object.keys(locales).map((locale) => {
    const postsFiltered = filterByLang(
      posts,
      locale as Locale,
    ) as CollectionEntry<"posts">[];

    return {
      params: {
        lang: locale,
      },
      props: {
        posts: postsFiltered,
        tags: tags,
      },
    };
  });

  return paths;
};

export const generateTagsStaticPaths: GetStaticPaths = async () => {
  const posts = await getCollection("posts");
  const tags = [...new Set(posts.flatMap(({ data }) => data.tag))];

  const paths = Object.keys(locales).flatMap((locale) => {
    const postsFiltered = filterByLang(
      posts,
      locale as Locale,
    ) as CollectionEntry<"posts">[];

    return tags.map((tag) => {
      const filterbyTag = postsFiltered.filter(({ data }) => data.tag === tag);
      return {
        params: {
          lang: locale,
          tag: tag,
        },
        props: {
          posts: filterbyTag,
          tags: tags,
        },
      };
    });
  });

  return paths;
};

export const generatePostStaticPaths: GetStaticPaths = async () => {
  const posts = await getCollection("posts");

  const paths = posts.map((post) => {
    const [locale, slug] = post.id.split("/");

    return {
      params: {
        lang: locale,
        post: slug,
      },
      props: {
        post: post,
      },
    };
  });

  return paths;
};
