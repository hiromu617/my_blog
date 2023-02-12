import { useState, ChangeEvent, FC, DragEvent, useRef } from "react";
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
  Overlay,
  Center,
  Text,
  LoadingOverlay,
} from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import { Tag } from "@/features/types";
import { z } from "zod";
import { articleSchema } from "../schema/articleSchema";
import { supabase } from "@/lib/supabaseClient";
import { assertExists } from "@/utils/assert";

type ArticleParams = z.infer<typeof articleSchema>;

type Props = {
  tags: Tag[];
  lsKey: string;
  handleSubmit: (
    articleParams: ArticleParams,
    tagIds: number[]
  ) => Promise<void>;
  initialTitle?: string;
  initialContent?: string;
  initialSlug?: string;
  initialTagIds?: number[];
  isEdit?: boolean;
};

export const Editor: FC<Props> = ({
  tags,
  lsKey,
  handleSubmit,
  initialTitle,
  initialContent,
  initialSlug,
  initialTagIds,
  isEdit,
}) => {
  const { colorScheme } = useMantineColorScheme();
  const dark = colorScheme === "dark";
  const [isShowPreview, setIsShowPreview] = useState(false);
  const [tagInputOpened, setTagInputOpened] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedTagId, setSelectedTagId] = useState<number[]>(
    initialTagIds ?? []
  );
  const [html, setHtml] = useState("");
  const [slug, setSlug] = useState(initialSlug ?? "");
  const [markdown, setMarkdown] = useLocalStorage({
    key: lsKey,
    defaultValue: initialContent ?? "",
    getInitialValueInEffect: true,
  });
  const [title, setTitle] = useLocalStorage({
    key: lsKey + "-title",
    defaultValue: initialTitle ?? "",
    getInitialValueInEffect: true,
  });
  const ref = useRef<HTMLTextAreaElement>(null);

  const onSubmit = async () => {
    const result = articleSchema.safeParse({ title, content: markdown, slug });
    if (!result.success) {
      alert(result.error.message);
      return;
    }
    await handleSubmit(result.data, selectedTagId);
    if (!isEdit) {
      setHtml("");
      setMarkdown("");
      setTitle("");
      setSlug("");
      setSelectedTagId([]);
    }
  };

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const id = +e.target.value;
    if (selectedTagId.includes(id)) {
      setSelectedTagId(selectedTagId.filter((old) => old !== id));
    } else {
      setSelectedTagId([...selectedTagId, id]);
    }
  };

  const onDrop = async (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    setIsUploading(true);
    const { data, error } = await supabase.storage
      .from("images-in-article")
      .upload(files[0].name, files[0]);
    if (!data && error) {
      alert(error.message);
      setIsUploading(false);
      return;
    }
    const {
      data: { publicUrl },
    } = await supabase.storage
      .from("images-in-article")
      .getPublicUrl(data.path);
    assertExists(ref.current);

    const pos = ref.current.selectionStart;
    const imageMarkdown = `![alt](${publicUrl})`;

    setMarkdown((markdown) => {
      const before = markdown.slice(0, pos);
      const after = markdown.slice(pos, markdown.length);
      return before + imageMarkdown + after;
    });
    setIsUploading(false);

    e.dataTransfer.clearData();
  };

  return (
    <Container size="sm" onDragOver={(e) => e.preventDefault()} onDrop={onDrop}>
      <LoadingOverlay visible={isUploading} overlayBlur={2} />
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
            {isEdit ? "更新する" : "公開する"}
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
              ref={ref}
              minRows={30}
              autosize
              size="lg"
              value={markdown}
              onChange={(e) => {
                setMarkdown(e.target.value);
              }}
              style={{ width: "100%", wordBreak: "break-all" }}
            />
          </>
        )}
      </Stack>
    </Container>
  );
};
