import type { NextPage } from "next";
import { useState } from "react";
import { convertToHTMLString } from "@hiromu617/markdown-parser";

const EditorPage: NextPage = () => {
  const [markdown, setMarkdown] = useState("");
  const [html, setHtml] = useState("");

  return (
    <div>
      <textarea
        value={markdown}
        onChange={(e) => {
          setMarkdown(e.target.value);
          const html = convertToHTMLString(e.target.value);
          setHtml(html);
        }}
      />
      <div
        dangerouslySetInnerHTML={{
          __html: html,
        }}
      />
    </div>
  );
};

export default EditorPage;
