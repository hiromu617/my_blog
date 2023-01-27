import { FC } from "react";
import { Stack, Card, Text, Group, Anchor } from "@mantine/core";
import { ArticleWithTags } from "@/features/types";
import { NextLink } from "@mantine/next";

type Props = {
  articles: ArticleWithTags[];
};

export const ArticleList: FC<Props> = ({ articles }) => {
  return (
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
            {article.tags.map((tag) => (
              <Anchor href={`/tags/${tag.slug}`} key={tag.slug}>
                # {tag.name}
              </Anchor>
            ))}
          </Group>
          <Text>{article.published_at}</Text>
        </Card>
      ))}
    </Stack>
  );
};
