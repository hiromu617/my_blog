import type { NextPage } from "next";
import { useState } from "react";
import { convertToHTMLString } from "@hiromu617/markdown-parser";
import {
  Textarea,
  Card,
  Switch,
  Stack,
  TypographyStylesProvider,
} from "@mantine/core";

const EditorPage: NextPage = () => {
  const [isShowPreview, setIsShowPreview] = useState(false);
  const [markdown, setMarkdown] = useState("");
  const [html, setHtml] = useState("");

  return (
    <Stack>
      <Switch
        label="Show preview"
        size="lg"
        checked={isShowPreview}
        onChange={(e) => {
          setIsShowPreview(e.target.checked);
          const html = convertToHTMLString(markdown);
          setHtml(html);
        }}
      />
      {isShowPreview ? (
        <Card p="sm" radius="md" withBorder>
          <TypographyStylesProvider>
            <div
              dangerouslySetInnerHTML={{
                __html: html,
              }}
            />
          </TypographyStylesProvider>
        </Card>
      ) : (
        <Textarea
          minRows={30}
          autosize
          value={markdown}
          onChange={(e) => {
            setMarkdown(e.target.value);
          }}
          style={{ width: "100%" }}
        />
      )}
    </Stack>
  );
};

export default EditorPage;
