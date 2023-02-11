import { FC, useState } from "react";
import { Anchor, Table, Button, Center } from "@mantine/core";
import { ArticleWithTags } from "@/features/types";
import { NextLink } from "@mantine/next";
import { supabase } from "@/lib/supabaseClient";
import { showNotification } from "@mantine/notifications";
import { useTriggerDeploy } from "@/hooks/useTriggerDeploy";
import { mutate } from "swr";

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

export const DashboardArticleTable: FC<Props> = ({ articles }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { trigger } = useTriggerDeploy();

  const handlePublishOrUnpublish = async (
    id: number,
    toBeUnpublish: boolean = false
  ) => {
    setIsLoading(true);
    const { error } = await supabase
      .from("articles")
      .update({
        published_at: toBeUnpublish ? null : new Date().toLocaleString(),
      })
      .eq("id", id);
    setIsLoading(false);
    if (error) {
      showNotification({
        title: "failed",
        message: "",
      });
      console.error(error);
      return;
    }
    await mutate("/dashboard/articles");
    showNotification({
      title: "success",
      message: "",
    });
    trigger();
  };

  return (
    <Table verticalSpacing="md" fontSize="md">
      <thead>
        <tr>
          <th>ステータス</th>
          <th>スラッグ</th>
          <th>タイトル</th>
          <th>公開日</th>
        </tr>
      </thead>
      <tbody>
        {articles.map((article) => (
          <tr key={article.slug}>
            <td>{article.published_at ? "公開中" : "非公開"}</td>
            <td>{article.slug}</td>
            <td>
              <Anchor
                component={NextLink}
                href={`/dashboard/articles/${article.slug}/edit`}
                legacyBehavior
              >
                {article.title}
              </Anchor>
            </td>
            <td>
              {article.published_at ? formatDate(article.published_at) : "-"}
            </td>
            <td>
              <Center>
                <Button
                  color="dark"
                  radius="md"
                  size="sm"
                  onClick={() =>
                    handlePublishOrUnpublish(article.id, !!article.published_at)
                  }
                  loading={isLoading}
                  loaderPosition="center"
                >
                  {article.published_at ? "非公開にする" : "公開する"}
                </Button>
              </Center>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};
