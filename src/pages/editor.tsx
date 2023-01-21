import type { NextPage } from "next";
import { useState } from "react";
import { convertToHTMLString } from "@hiromu617/markdown-parser";
import { Textarea, Container, Card, Switch, Stack } from "@mantine/core";

const EditorPage: NextPage = () => {
  const [isShowPreview, setIsShowPreview] = useState(false);
  const [markdown, setMarkdown] = useState("");
  const [html, setHtml] = useState("");

  return (
    <Container my={100}>
      <Stack style={{ width: 600, margin: "auto", minHeight: "1000px" }}>
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
          <Card shadow="xs" p="sm" radius="md" withBorder>
            <div
              dangerouslySetInnerHTML={{
                __html: html,
              }}
            />
          </Card>
        ) : (
          <Textarea
            minRows={50}
            autosize
            value={markdown}
            onChange={(e) => {
              setMarkdown(e.target.value);
            }}
            style={{ width: "100%" }}
          />
        )}
      </Stack>
    </Container>
  );
};

export default EditorPage;
