"use client";

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

const initialMarkdown = `# Markdown Editor

**bold**, _italic_, ~~strike~~  
- list  
> quote
`;

export default function EditorPage() {
  return (
    <main
      className="p-6  w-[50vw]"
      style={{
        background: "rgba(255, 255, 255, 0.15)",
      }}
    >
      <MDXEditor
        markdown={initialMarkdown}
        contentEditableClassName="mdxeditor-content"
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

        /* -------------------- PARAGRAPH / LIST ----------- */
        .mdxeditor-content p {
          margin: 0.5rem 0;
          line-height: 1.7;
        }
        .mdxeditor-content ul,
        .mdxeditor-content ol {
          padding-left: 1.25rem;
        }
        .mdxeditor-content blockquote {
          border-left: 4px solid #475569;
          padding-left: 1rem;
          color: #64748b;
          margin: 1rem 0;
        }

        /* -------------------- TOOLBAR ---------------------- */
        .mdxeditor-toolbarRoot {
          background: #f5f5f5 !important; /* ⭐ đổi màu nền tại đây */
          border-bottom: 1px solid #e2e2e2;
          padding: 6px;
          border-radius: 6px 6px 0 0;

          display: flex;
          align-items: center !important; /* ⭐ căn giữa icon */
          gap: 6px;
        }

        /* Các nút icon */
        .mdxeditor-toolbarRoot button {
          display: flex !important;
          align-items: center;
          justify-content: center;
          height: 28px;
          width: 28px;
          padding: 0 !important;
        }

        .mdxeditor-toolbar {
          background-color: #f5f5f5 !important;
          border-bottom: 1px solid #e2e2e2 !important;
          padding: 6px !important;
        }
        // .mdxeditor-toolbar button {
        //   display: flex !important;
        //   align-items: center !important;
        //   justify-content: center !important;

        //   height: 28px !important;
        //   width: 28px !important;
        //   padding: 0 !important;
        // }
      `}</style>
    </main>
  );
}
