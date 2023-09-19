import React, { useCallback, useState } from "react";
import { createEditor, Transforms, Element, Editor } from "slate";
// Import the Slate components and React plugin.
import {
  Slate,
  Editable,
  withReact,
  RenderElementProps,
  RenderLeafProps,
} from "slate-react";

import type { BaseEditor, Descendant } from "slate";
import { ReactEditor } from "slate-react";
import "./RichEditor.less";

type CustomElement = { type: "paragraph" | "code"; children: CustomText[] };
type CustomText = {
  bold?: boolean;
  text: string;
  type?: "paragraph" | "code";
};
type CustomEditor = BaseEditor &
  ReactEditor & { type: "paragraph" | "code" | null };
declare module "slate" {
  interface CustomTypes {
    Editor: CustomEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}

const CustomEditor = {
  isBoldMarkActive(editor: CustomEditor) {
    const marks = Editor.marks(editor);
    console.log(marks, "marks");

    return marks ? marks.bold === true : false;
  },

  isCodeBlockActive(editor: CustomEditor) {
    const [match] = Editor.nodes(editor, {
      match: (n) => n.type === "code",
    });

    return !!match;
  },

  toggleBoldMark(editor: CustomEditor) {
    const isActive = CustomEditor.isBoldMarkActive(editor);
    if (isActive) {
      Editor.removeMark(editor, "bold");
    } else {
      Editor.addMark(editor, "bold", true);
    }
  },

  toggleCodeBlock(editor: CustomEditor) {
    const isActive = CustomEditor.isCodeBlockActive(editor);
    Transforms.setNodes(
      editor,
      { type: isActive ? null : "code" },
      { match: (n) => Element.isElement(n) && Editor.isBlock(editor, n) }
    );
  },
};

const initialValue: (Descendant & { type: string })[] = [
  {
    type: "paragraph",
    children: [{ text: "" }],
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

  const renderLeaf = useCallback((props: RenderLeafProps) => {
    return <Leaf {...props} />;
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
        <div>
          <button
            onMouseDown={(event) => {
              event.preventDefault();
              CustomEditor.toggleBoldMark(editor);
            }}
          >
            Bold
          </button>
          <button
            onMouseDown={(event) => {
              event.preventDefault();
              CustomEditor.toggleCodeBlock(editor);
            }}
          >
            Code Block
          </button>
        </div>
        <Editable
          className="editable"
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          // autoSave=""
          onKeyDown={(event) => {
            if (event.key === "Tab") {
              event.preventDefault();
              editor.insertText("\t");
            }
            if (!event.ctrlKey) {
              return;
            }

            switch (event.key) {
              // When "`" is pressed, keep our existing code block logic.
              case "`": {
                event.preventDefault();
                CustomEditor.toggleCodeBlock(editor);
                break;
              }

              // When "B" is pressed, bold the text in the selection.
              case "b": {
                event.preventDefault();
                CustomEditor.toggleBoldMark(editor);
                break;
              }
            }
          }}
        />
      </Slate>
    </div>
  );
};

type ElementProps = {
  attributes: object;
  children: React.ReactNode;
};
const CodeElement = (props: ElementProps) => {
  return (
    <pre {...props.attributes} className="code-line">
      <code>{props.children}</code>
    </pre>
  );
};

const DefaultElement = (props: ElementProps) => {
  return <p {...props.attributes}>{props.children}</p>;
};

const Leaf = (props: RenderLeafProps) => {
  return (
    <span
      {...props.attributes}
      style={{ fontWeight: props.leaf.bold ? "bold" : "normal" }}
    >
      {props.children}
    </span>
  );
};

export { RichEditor, CodeElement, DefaultElement, Leaf };

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
