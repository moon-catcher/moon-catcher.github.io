import React, { useCallback, useState } from "react";
import { createEditor, Transforms, Element, Editor } from "slate";
// Import the Slate components and React plugin.
import { Slate, Editable, withReact, RenderElementProps } from "slate-react";

import type { BaseEditor, Descendant } from "slate";
import { ReactEditor } from "slate-react";
import "./RichEditor.less";

type CustomElement = { type: "paragraph" | "code"; children: CustomText[] };
type CustomText = { text: string; type?: "paragraph" | "code" };

declare module "slate" {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor & { type: "paragraph" | "code" };
    Element: CustomElement;
    Text: CustomText;
  }
}

// type Props = {};

const initialValue: (Descendant & { type: string })[] = [
  {
    type: "paragraph",
    children: [{ text: "A line of text in a paragraph." }],
  },
];

const RichEditor = () => {
  const [editor] = useState(() => withReact(createEditor()));
  const [title, setTitle] = useState("标题");

  console.log(title, "title");

  const renderElement = useCallback((props: RenderElementProps) => {
    switch (props.element.type) {
      case "code":
        return <CodeElement {...props} />;
      default:
        return <DefaultElement {...props} />;
    }
  }, []);

  const handleTitleChange = (
    event: React.FormEvent<HTMLDivElement> & { target: HTMLInputElement }
  ) => {
    setTitle(event.target.innerText);
  };
  return (
    <div className="editor">
      <h2>
        <div
          className="title"
          contentEditable
          onInput={handleTitleChange}
          suppressContentEditableWarning
        >
          标题
        </div>
      </h2>
      <Slate editor={editor} initialValue={initialValue}>
        <Editable
          className="editable"
          renderElement={renderElement}
          onKeyDown={(event) => {
            console.log(event, "event");

            if (event.key === "`" && event.ctrlKey) {
              event.preventDefault();
              // Determine whether any of the currently selected blocks are code blocks.
              const [match] = Editor.nodes(editor, {
                match: (n) => n.type === "code",
              });
              // Toggle the block type depending on whether there's already a match.
              Transforms.setNodes(
                editor,
                { type: match ? "paragraph" : "code" },
                {
                  match: (n) =>
                    Element.isElement(n) && Editor.isBlock(editor, n),
                }
              );
            }
            if (event.key === "Tab") {
              event.preventDefault();
              editor.insertText("\t");
            }
          }}
        />
      </Slate>
    </div>
  );
};

type ElementProps = { attributes: object; children: React.ReactNode };
const CodeElement = (props: ElementProps) => {
  return (
    <pre {...props.attributes}>
      <code>{props.children}</code>
    </pre>
  );
};

const DefaultElement = (props: ElementProps) => {
  return <p {...props.attributes}>{props.children}</p>;
};

export { RichEditor, CodeElement, DefaultElement };

/**
 * 不能将类型“{ children: Element; 
 * editor: BaseEditor & ReactEditor; 
 * initialValue: (Descendant & { type: string; })[];
 *  renderElement: (props: any) => Element; }”
 * 
 * 分配给类型“IntrinsicAttributes & { editor: ReactEditor; 
 * initialValue: Descendant[]; 
 * children: ReactNode; onChange?: ((value: Descendant[]) => void) | undefined; }”。
  类型“IntrinsicAttributes & 
  { editor: ReactEditor; initialValue: Descen
    dant[]; children: ReactNode; onChange?: ((value: Descendant[]) => void) |
 */
