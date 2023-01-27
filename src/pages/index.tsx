import {
  Stack,
  Card,
  Text,
  Group,
  Pagination,
  Center,
  Anchor,
  useMantineColorScheme,
  Container,
} from "@mantine/core";
import { NextLink } from "@mantine/next";
import { supabase } from "@/lib/supabaseClient";
import { NextPage, InferGetStaticPropsType } from "next";
import { useMediaQuery } from "@mantine/hooks";

type Props = InferGetStaticPropsType<typeof getStaticProps>;

const IndexPage: NextPage<Props> = ({ articles }) => {
  const { colorScheme } = useMantineColorScheme();
  const dark = colorScheme === "dark";
  const isSP = useMediaQuery("(max-width: 576px)");

  return (
    <Container size="xs" p={isSP ? 0 : undefined}>
      <Stack spacing="lg">
        {articles.map((article) => (
          <Card
            key={article.slug}
            radius="md"
            withBorder
            component={NextLink}
            href={`/${article.slug}`}
            sx={(theme) => ({
              "&:hover": {
                backgroundColor:
                  theme.colorScheme === "dark"
                    ? theme.colors.dark[8]
                    : theme.colors.gray[0],
              },
            })}
            legacyBehavior
          >
            <Text weight={500} fz="xl" mb={6}>
              {article.title}
            </Text>
            <Group mb={6}>
              <Anchor href="https://asds"># React</Anchor>
              <Anchor href="https://asds"># Next.js</Anchor>
            </Group>
            <Text>2023.01.22</Text>
          </Card>
        ))}
        <Center my={20}>
          <Pagination total={10} color={dark ? "blue" : "dark"} radius="md" />
        </Center>
      </Stack>
    </Container>
  );
};

export default IndexPage;

export const getStaticProps = async () => {
  const { data: articles, error } = await supabase
    .from("articles")
    .select("*")
    .not("published_at", "is", null);

  return {
    props: {
      articles: articles ?? [],
    },
  };
};
