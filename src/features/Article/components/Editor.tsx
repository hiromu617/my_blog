import { useState, ChangeEvent, FC, DragEvent, useRef } from "react";
import { convertToHtmlWithOgpCard } from "@/utils/convertHtmlWithOgpCard";
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
  LoadingOverlay,
} from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import { Tag } from "@/features/types";
import { z } from "zod";
import { articleSchema } from "../schema/articleSchema";
import { assertExists } from "@/utils/assert";
import { useUploadImage } from "../hooks/useUploadImage";
type ArticleParams = z.infer<typeof articleSchema>;

type Props = {
  tags: Tag[];
  lsKey: string;
  handleSubmit: (
    articleParams: ArticleParams,
    tagIds: number[],
    isToPublish: boolean
  ) => Promise<void>;
  initialTitle?: string;
  initialContent?: string;
  initialSlug?: string;
  initialTagIds?: number[];
  isEdit?: boolean;
  isPublished?: boolean;
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
  isPublished,
}) => {
  const { colorScheme } = useMantineColorScheme();
  const dark = colorScheme === "dark";
  const [isShowPreview, setIsShowPreview] = useState(false);
  const [tagInputOpened, setTagInputOpened] = useState(false);
  const [isToPublish, setIsToPublish] = useState(isPublished ?? false);
  const { uploadImage, isUploading } = useUploadImage();
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
    await handleSubmit(result.data, selectedTagId, isToPublish);
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
    if (!files[0].type.startsWith("image/")) {
      alert("not image");
      return;
    }
    const { publicUrl, error } = await uploadImage(files[0]);
    if (error) {
      alert(error);
      return;
    }
    assertExists(ref.current);

    const pos = ref.current.selectionStart;
    const imageMarkdown = `![alt](${publicUrl})`;

    setMarkdown((markdown) => {
      const before = markdown.slice(0, pos);
      const after = markdown.slice(pos, markdown.length);
      return before + imageMarkdown + after;
    });

    e.dataTransfer.clearData();
  };

  const onIsShowPreviewSwitchChange = async (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    setIsShowPreview(e.target.checked);

    const html = await convertToHtmlWithOgpCard(markdown);
    setHtml(html);
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
            onChange={onIsShowPreviewSwitchChange}
          />
          <Input
            size="md"
            placeholder="slug"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
          />
          <Checkbox
            label="公開する"
            checked={isToPublish}
            onChange={() => setIsToPublish(!isToPublish)}
          />
          <Button
            color={dark ? "blue" : "dark"}
            radius="md"
            size="md"
            onClick={onSubmit}
          >
            保存する
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
