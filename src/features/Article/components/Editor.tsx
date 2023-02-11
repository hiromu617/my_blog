import { useState, ChangeEvent, FC } from "react";
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
import { useLocalStorage } from "@mantine/hooks";
import { Tag } from "@/features/types";
import { z } from "zod";
import { articleSchema } from "../schema/articleSchema";

type ArticleParams = z.infer<typeof articleSchema>;

type Props = {
  tags: Tag[];
  lsKey: string;
  handleSubmit: (
    articleParams: ArticleParams,
    tagIds: number[]
  ) => Promise<void>;
};

export const Editor: FC<Props> = ({ tags, lsKey, handleSubmit }) => {
  const { colorScheme } = useMantineColorScheme();
  const dark = colorScheme === "dark";
  const [isShowPreview, setIsShowPreview] = useState(false);
  const [tagInputOpened, setTagInputOpened] = useState(false);
  const [selectedTagId, setSelectedTagId] = useState<number[]>([]);
  const [html, setHtml] = useState("");
  const [slug, setSlug] = useState("");
  const [markdown, setMarkdown] = useLocalStorage({
    key: lsKey,
    defaultValue: "",
    getInitialValueInEffect: true,
  });
  const [title, setTitle] = useLocalStorage({
    key: lsKey + "-title",
    defaultValue: "",
    getInitialValueInEffect: true,
  });

  const onSubmit = async () => {
    const result = articleSchema.safeParse({ title, content: markdown, slug });
    if (!result.success) {
      alert(result.error.message);
      return;
    }
    await handleSubmit(result.data, selectedTagId);
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
            onClick={onSubmit}
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
