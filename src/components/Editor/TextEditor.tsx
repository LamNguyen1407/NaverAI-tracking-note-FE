"use client";

import React, { useState } from "react";
import { Box } from "@mui/material";

import "@mdxeditor/editor/style.css";

import {
  MDXEditor,
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  markdownShortcutPlugin,
  linkPlugin,
  linkDialogPlugin,
  tablePlugin,
  toolbarPlugin,
  UndoRedo,
  BoldItalicUnderlineToggles,
  BlockTypeSelect,
  ListsToggle,
  CreateLink,
  InsertTable,
  Separator,
} from "@mdxeditor/editor";
import { GlassCard } from "@developer-hub/liquid-glass";

const TextEditor = () => {
  const [markdown, setMarkdown] = useState(
    `# Markdown Editor Demo

  ## Typography  
  **bold**, _italic_, ~~strikethrough~~, <u>underline</u>  
  Superscript: x^2^  
  Subscript: H~2~O  
  Inline code: \`const x = 1\`



  ## Headings  
  # Heading 1  
  ## Heading 2  
  ### Heading 3  
  #### Heading 4  
  ##### Heading 5  
  ###### Heading 6  


  ## Lists

  ### Bullet list
  - Level 1
    - Level 2
      - Level 3

  ### Numbered list
  1. Step one
    1. Sub step
        1. Sub-sub step
  2. Step two


  ## Quote

  > Đây là blockquote  
  > Có thể chứa **bold**, _italic_ hoặc ~~strike~~



  ## Link

  Link ví dụ: [Google](https://google.com)



  ## Table

  | Name   | Age | Country |
  |--------|-----|---------|
  | John   | 22  | USA     |
  | Maria  | 19  | Spain   |
  | Kenji  | 25  | Japan   |

  `
  );

  return (
    <GlassCard cornerRadius={25}>
      <Box
        sx={{
          // background:
          //   "linear-gradient(180deg, rgba(17,51,32,0.6), rgba(38,141,124,0.6), rgba(194,255,180,0.6))",

          // background: "rgba(255, 255, 255, 0.6)",

          background:
            "linear-gradient(180deg, rgba(255,255,255,0.5), rgba(255,255,255,0.8), rgba(255,255,255,0.6))",

          // backdropFilter: "blur(12px)",
          // boxShadow: "0 8px 32px rgba(31,38,135,0.37)",

          borderRadius: "15px",
          border: "1px solid rgba(255,255,255,0.18)",
          width: { xs: "90vw", md: "65vw" },
          height: "90vh",

          p: 2,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* ⭐ Wrapper bắt buộc để editor hoạt động đúng */}
        <div style={{ flex: 1, overflow: "auto" }}>
          <MDXEditor
            markdown={markdown}
            contentEditableClassName="mdxeditor-content"
            spellCheck={false}
            plugins={[
              // Plugins bạn giữ lại
              headingsPlugin(),
              listsPlugin(),
              quotePlugin(),
              markdownShortcutPlugin(),
              linkPlugin(),
              linkDialogPlugin(),
              tablePlugin(),

              // Toolbar tùy chỉnh – KHÔNG có codeblock, image, hr, sandpack, admonition...
              toolbarPlugin({
                toolbarContents: () => (
                  <>
                    <UndoRedo />

                    <Separator />
                    <BoldItalicUnderlineToggles />

                    <Separator />
                    <BlockTypeSelect />

                    <Separator />
                    <ListsToggle />

                    <Separator />
                    <CreateLink />

                    <Separator />
                    <InsertTable />
                  </>
                ),
              }),
            ]}
          />

          {/* Markdown style */}
          <style jsx global>{`
            // .mdxeditor-content {
            //   color: white !important;
            // }

            /* -------------------- HEADINGS -------------------- */
            .mdxeditor-content h1 {
              font-size: 2rem;
              font-weight: 700;
              margin: 1.25rem 0 0.75rem;
            }
            .mdxeditor-content h2 {
              font-size: 1.5rem;
              font-weight: 600;
              margin: 1.1rem 0 0.5rem;
            }
            .mdxeditor-content h3 {
              font-size: 1.25rem;
              font-weight: 600;
              margin: 1rem 0 0.5rem;
            }
            .mdxeditor-content h4 {
              font-size: 1.1rem;
              font-weight: 600;
              margin: 0.75rem 0 0.35rem;
            }
            .mdxeditor-content h5 {
              font-size: 1rem;
              font-weight: 600;
              margin: 0.6rem 0 0.3rem;
            }
            .mdxeditor-content h6 {
              font-size: 0.9rem;
              font-weight: 600;
              margin: 0.5rem 0 0.25rem;
              text-transform: uppercase;
              opacity: 0.7;
            }

            /* -------------------- PARAGRAPH -------------------- */
            .mdxeditor-content p {
              margin: 0.5rem 0;
              line-height: 1.7;
            }

            /* -------------------- LISTS (BULLET + NUMBERED) ---- */
            .mdxeditor-content ul {
              list-style-type: disc !important;
              padding-left: 1.5rem !important;
              margin: 0.5rem 0 !important;
            }

            .mdxeditor-content ul ul {
              list-style-type: circle !important;
            }

            .mdxeditor-content ul ul ul {
              list-style-type: square !important;
            }

            .mdxeditor-content ol {
              list-style-type: decimal !important;
              padding-left: 1.5rem !important;
              margin: 0.5rem 0 !important;
            }

            .mdxeditor-content ol ol {
              list-style-type: lower-alpha !important;
            }

            .mdxeditor-content ol ol ol {
              list-style-type: lower-roman !important;
            }

            .mdxeditor-content li {
              margin: 0.25rem 0 !important;
            }

            /* -------------------- BLOCKQUOTE ------------------- */
            .mdxeditor-content blockquote {
              border-left: 4px solid #475569;
              padding-left: 1rem;
              color: black;
              margin: 1rem 0;
            }
          `}</style>
        </div>
      </Box>
    </GlassCard>
  );
};

export default TextEditor;
