import type { NextPage } from "next";
import { useState } from "react";
import { convertToHTMLString } from "@hiromu617/markdown-parser";
import {
  Textarea,
  Card,
  Switch,
  Stack,
  TypographyStylesProvider,
  Container,
  Input,
  Group,
  Title,
  Button,
  useMantineColorScheme,
} from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";

const EditorPage: NextPage = () => {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === "dark";
  const [isShowPreview, setIsShowPreview] = useState(false);
  const [html, setHtml] = useState("");
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
          <Button color={dark ? "blue" : "dark"} radius="md" size="md">
            公開する
          </Button>
        </Group>
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
