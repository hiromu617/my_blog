import { FC } from "react";
import { Stack, Card, Text, Group, Anchor } from "@mantine/core";
import { ArticleWithTags } from "@/features/types";
import { NextLink } from "@mantine/next";

type Props = {
  articles: ArticleWithTags[];
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}/${m}/${d}`;
};

export const ArticleList: FC<Props> = ({ articles }) => {
  return (
    <Stack spacing="lg">
      {articles.map((article) => {
        return (
          <Card key={article.slug} radius="md" withBorder>
            <Anchor
              weight={500}
              fz="xl"
              mb={6}
              component={NextLink}
              href={`/${article.slug}`}
              legacyBehavior
            >
              {article.title}
            </Anchor>
            <Group mb={6}>
              {article.tags.map((tag) => (
                <Anchor
                  href={`/tags/${tag.slug}/1`}
                  component={NextLink}
                  key={tag.slug}
                  legacyBehavior
                >
                  # {tag.name}
                </Anchor>
              ))}
            </Group>
            <Text>{formatDate(article.published_at ?? "")}</Text>
          </Card>
        );
      })}
    </Stack>
  );
};
