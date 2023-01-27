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
import { convertToHTMLString } from "@hiromu617/markdown-parser";

type Props = InferGetStaticPropsType<typeof getStaticProps>;

const ArticlePage: NextPage<Props> = ({ article, htmlContent }) => {
  const { colorScheme } = useMantineColorScheme();
  const dark = colorScheme === "dark";

  return (
    <Container size="sm">
      <Stack spacing="lg">
        <Title weight={500} ta="center">
          {article.title}
        </Title>
        <Group mb={6} m="auto">
          <Anchor href="https://asds"># React</Anchor>
          <Anchor href="https://asds"># Next.js</Anchor>
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

export default ArticlePage;

export const getStaticPaths: GetStaticPaths = async () => {
  const { data: articles, error } = await supabase.from("articles").select("*");
  assertExists(articles);
  const paths = articles.map((a) => `/${a.slug}`);

  return { paths, fallback: false };
};

export const getStaticProps = async (context: any) => {
  const slug = context.params.slug;
  const { data: articles, error } = await supabase
    .from("articles")
    .select("*")
    .eq("slug", slug);

  assertExists(articles?.[0]);

  const article = articles[0];
  const htmlContent = convertToHTMLString(article.content);

  return {
    props: {
      article,
      htmlContent,
    },
  };
};
