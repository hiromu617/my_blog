import type { NextPage } from "next";
import { useState, ChangeEvent } from "react";
import { convertToHTMLString } from "@hiromu617/markdown-parser";
import {
  Textarea,
  Switch,
  Stack,
  TypographyStylesProvider,
  Container,
  Input,
  Group,
  Title,
  Button,
  Checkbox,
  useMantineColorScheme,
  Collapse,
} from "@mantine/core";
import { supabase } from "@/lib/supabaseClient";
import { useLocalStorage } from "@mantine/hooks";
import { showNotification } from "@mantine/notifications";
import { InferGetServerSidePropsType } from "next";
import { z } from "zod";
import { assertExists } from "@/utils/assert";
import { useTriggerDeploy } from "@/hooks/useTriggerDeploy";

type Props = InferGetServerSidePropsType<typeof getServerSideProps>;

const schema = z.object({
  title: z.string().min(1).max(25),
  slug: z
    .string()
    .min(1)
    .max(15)
    .regex(/^[0-9a-zA-Z]*$/),
  content: z.string().min(1),
});

const EditorPage: NextPage<Props> = ({ tags }) => {
  const { colorScheme } = useMantineColorScheme();
  const dark = colorScheme === "dark";
  const { trigger } = useTriggerDeploy();
  const [isShowPreview, setIsShowPreview] = useState(false);
  const [tagInputOpened, setTagInputOpened] = useState(false);
  const [selectedTagId, setSelectedTagId] = useState<number[]>([]);
  const [html, setHtml] = useState("");
  const [slug, setSlug] = useState("");
  const [markdown, setMarkdown] = useLocalStorage({
    key: "article-under-edit",
    defaultValue: "",
    getInitialValueInEffect: true,
  });
  const [title, setTitle] = useLocalStorage({
    key: "article-title-under-edit",
    defaultValue: "",
    getInitialValueInEffect: true,
  });

  const handlePublish = async () => {
    // TODO: webhookでbuild
    const result = schema.safeParse({ title, content: markdown, slug });
    if (!result.success) {
      alert(result.error.message);
      return;
    }
    const { data: articles, error } = await supabase
      .from("articles")
      .insert({
        ...result.data,
        published_at: new Date().toLocaleString(),
      })
      .select();
    assertExists(articles?.[0]);

    const { error: errorOnCreateRelation } = await supabase
      .from("article_tags")
      .insert(
        selectedTagId.map((tag_id) => ({ tag_id, article_id: articles[0].id }))
      );

    if (error) {
      alert(error.message);
      return;
    }
    if (errorOnCreateRelation) {
      alert(errorOnCreateRelation.message);
      return;
    }
    showNotification({
      title: "success",
      message: "",
    });
    setTitle("");
    setMarkdown("");
    setSlug("");
    setSelectedTagId([]);
    trigger();
  };

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const id = +e.target.value;
    if (selectedTagId.includes(id)) {
      setSelectedTagId(selectedTagId.filter((old) => old !== id));
    } else {
      setSelectedTagId([...selectedTagId, id]);
    }
  };

  return (
    <Container size="sm">
      <Stack spacing="lg">
        <Group position="center">
          <Switch
            label="Show preview"
            size="lg"
            color={dark ? "blue" : "dark"}
            checked={isShowPreview}
            onChange={(e) => {
              setIsShowPreview(e.target.checked);
              const html = convertToHTMLString(markdown);
              setHtml(html);
            }}
          />
          <Input
            size="md"
            placeholder="slug"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
          />
          <Button
            color={dark ? "blue" : "dark"}
            radius="md"
            size="md"
            onClick={handlePublish}
          >
            公開する
          </Button>
        </Group>
        <Button onClick={() => setTagInputOpened((o) => !o)} variant="subtle">
          Tags
        </Button>
        <Collapse in={tagInputOpened}>
          <Stack>
            {tags?.map((tag) => (
              <Checkbox
                key={tag.id}
                label={tag.name}
                value={tag.id}
                checked={selectedTagId.includes(tag.id)}
                onChange={onChange}
              />
            ))}
          </Stack>
        </Collapse>
        {isShowPreview ? (
          <>
            <Title weight={500} ta="center">
              {title}
            </Title>
            <TypographyStylesProvider>
              <div
                dangerouslySetInnerHTML={{
                  __html: html,
                }}
              />
            </TypographyStylesProvider>
          </>
        ) : (
          <>
            <Input
              size="lg"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <Textarea
              minRows={30}
              autosize
              size="lg"
              value={markdown}
              onChange={(e) => {
                setMarkdown(e.target.value);
              }}
              style={{ width: "100%" }}
            />
          </>
        )}
      </Stack>
    </Container>
  );
};

export default EditorPage;

export const getServerSideProps = async () => {
  const { data: tags } = await supabase.from("tags").select("*");

  return {
    props: {
      tags,
    },
  };
};
