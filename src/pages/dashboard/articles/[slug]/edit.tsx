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
import { InferGetServerSidePropsType, NextPage } from "next";
import { assertExists } from "@/utils/assert";
import { supabase } from "@/lib/supabaseClient";
import { ArticleWithTags } from "@/features/types";
import { z } from "zod";
import { convertToHTMLString } from "@hiromu617/markdown-parser";

type Props = InferGetServerSidePropsType<typeof getServerSideProps>;

const ArticleEditPage: NextPage<Props> = ({ article, htmlContent }) => {
  const { colorScheme } = useMantineColorScheme();
  const dark = colorScheme === "dark";

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
      </Stack>
    </Container>
  );
};

export default ArticleEditPage;

export const getServerSideProps = async (context: any) => {
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
