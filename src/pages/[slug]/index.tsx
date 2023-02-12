import {
  Stack,
  Text,
  Group,
  Anchor,
  Title,
  useMantineColorScheme,
  Container,
  TypographyStylesProvider,
} from "@mantine/core";
import { GetStaticPaths, InferGetStaticPropsType, NextPage } from "next";
import { assertExists } from "@/utils/assert";
import { supabase } from "@/lib/supabaseClient";
import { ArticleWithTags } from "@/features/types";
import { z } from "zod";
import { convertToHTMLString } from "@hiromu617/markdown-parser";
import { useRouter } from "next/router";
import { TwitterShareButton, TwitterIcon } from "react-share";

type Props = InferGetStaticPropsType<typeof getStaticProps>;

const ArticlePage: NextPage<Props> = ({ article, htmlContent }) => {
  const { colorScheme } = useMantineColorScheme();
  const dark = colorScheme === "dark";
  const router = useRouter();

  return (
    <Container size="sm">
      <Stack spacing="lg">
        <Title weight={500} ta="center">
          {article.title}
        </Title>
        <Group mb={6} m="auto">
          {article.tags.map((tag) => (
            <Anchor href={`/tags/${tag.slug}/1`} key={tag.slug}>
              # {tag.name}
            </Anchor>
          ))}
        </Group>
        <Text component="time" ta="center">
          2023.01.22
        </Text>
        <TypographyStylesProvider>
          <article
            dangerouslySetInnerHTML={{
              __html: htmlContent,
            }}
          />
        </TypographyStylesProvider>
        <Group m="auto" py={30}>
          <TwitterShareButton
            url={`${process.env.NEXT_PUBLIC_BASE_URL}${router.asPath}`}
            title={article.title}
          >
            <TwitterIcon size={46} round />
          </TwitterShareButton>
        </Group>
      </Stack>
    </Container>
  );
};

export default ArticlePage;

export const getStaticPaths: GetStaticPaths = async () => {
  const { data: articles, error } = await supabase
    .from("articles")
    .select("*")
    .not("published_at", "is", null);

  assertExists(articles);
  const paths = articles.map((a) => `/${a.slug}`);

  return { paths, fallback: false };
};

export const getStaticProps = async (context: any) => {
  const slug = z.string().parse(context.params.slug);
  const { data: articles, error } = await supabase
    .from("articles")
    .select(
      `
    *,
    tags (
      name,
      slug
    )
  `
    )
    .eq("slug", slug);

  assertExists(articles?.[0]);

  const article = articles[0];
  const htmlContent = convertToHTMLString(article.content);

  return {
    props: {
      article: article as ArticleWithTags,
      htmlContent,
    },
  };
};
