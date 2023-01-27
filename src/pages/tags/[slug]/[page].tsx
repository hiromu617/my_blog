import { Center, Container, Text } from "@mantine/core";
import { supabase } from "@/lib/supabaseClient";
import { NextPage, InferGetStaticPropsType } from "next";
import { ArticleList } from "@/features/Article/components/ArticleList";
import { AppPagination } from "@/components/Layout/AppPagination";
import { assertExists } from "@/utils/assert";
import { ArticleWithTags } from "@/features/types";
import { PAGE_SIZE } from "@/const";

const range = (start: number, end: number) =>
  [...Array(end - start + 1)].map((_, i) => start + i);

type Props = InferGetStaticPropsType<typeof getServerSideProps>;

const TagPageIndexPage: NextPage<Props> = ({ articles, totalCount, tag }) => {
  return (
    <Container size="xs">
      <Text weight={500} fz="xl" mb={6}>
        # {tag.name}
      </Text>
      <ArticleList articles={articles} />
      <Center my={20}>
        <AppPagination totalCount={totalCount} />
      </Center>
    </Container>
  );
};

export default TagPageIndexPage;

// export const getStaticPaths = async () => {
//   const { data: tags, count } = await supabase.from("tags").select("id, slug");
//   assertExists(tags);

//   const paths: string[] = [];
//   await tags.forEach(async (tag) => {
//     const { count } = await supabase
//       .from("articles")
//       .select(
//         `id,
//       article_tags!inner (
//         tag_id
//       )`,
//         { count: "exact" }
//       )
//       .in("article_tags.tag_id", [tag.id]);
//     await range(1, Math.ceil(count ?? 0 / PAGE_SIZE)).forEach((i) => {
//       console.log(`/tags/${tag.slug}/${i}`);
//       paths.push(`/tags/${tag.slug}/${i}`);
//     });
//   });

//   console.log(paths);

//   return { paths, fallback: false };
// };

// SGむずいのでSSR
export const getServerSideProps = async (context: any) => {
  const page = context.params.page;
  const slug = context.params.slug;
  const start = (page - 1) * PAGE_SIZE;
  const end = start + PAGE_SIZE - 1;

  const { data: tags } = await supabase
    .from("tags")
    .select("id, name, slug")
    .eq("slug", slug);
  assertExists(tags?.[0]);

  const { data: articles, count } = await supabase
    .from("articles")
    .select(
      `
    *,
    article_tags!inner (
      tag_id
    ),
    tags (
      name,
      slug
    )
    `,
      { count: "exact" }
    )
    .in("article_tags.tag_id", [tags[0].id])
    .range(start, end);

  assertExists(count);

  return {
    props: {
      articles: articles as ArticleWithTags[],
      totalCount: count,
      tag: tags[0],
    },
  };
};
