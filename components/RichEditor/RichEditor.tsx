import {
  Slate,
  Editable,
  ReactEditor,
  withReact,
  RenderElementProps,
  RenderLeafProps,
} from "slate-react";
import React, { useCallback, useEffect, useState } from "react";
import { createEditor, Transforms, Element, Editor, Node, Text } from "slate";
import type { BaseEditor, Descendant } from "slate";
import escapeHtml from "escape-html";
import "./RichEditor.less";
import {
  DEFAULT_INITIALVALUE,
  NEW_ARTICLE_KEY,
  NEW_ARTICLE_TITLE_KEY,
} from "@constant/article";
import { usePageContext } from "../../renderer/usePageContext";
type Props = {
  content?: string;
};

const serialize = (node: Node) => {
  if (Text.isText(node)) {
    let string = escapeHtml(node.text);
    if (node.bold) {
      string = `<strong>${string}</strong>`;
    }
    return string;
  }

  const children: string = node.children?.map((n) => serialize(n)).join("");

  switch (node.type) {
    case "quote":
      return `<blockquote><p>${children}</p></blockquote>`;
    case "paragraph":
      return `<p>${children}</p>`;
    case "link":
      return `<a href="${escapeHtml(node.url!)}">${children}</a>`;
    case "code":
      return ` <pre className="code-line"><code>${children}</code></pre>`;
    default:
      return children;
  }
};
const RichEditor = (props: Props) => {
  const [editor] = useState(() => withReact(createEditor()));
  const [bold, setIsBold] = useState(false);
  const [content, setContent] = useState(props.content);
  const [initialValue, setInitialValue] = useState<Descendant[] | null>(null);
  const { sidebarRef } = usePageContext();

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
    localStorage.setItem(NEW_ARTICLE_TITLE_KEY, event.target.innerText);
  };

  const handleSave = useCallback(() => {
    console.log(content, "content");
  }, [content]);

  const handleSubmit = useCallback(() => {
    const nodes = JSON.parse(content!) as Node[];
    console.log(nodes.map((node) => serialize(node)));
  }, [content]);

  useEffect(() => {
    if (sidebarRef?.current) {
      console.log(sidebarRef.current, "sidebarRef.current");

      sidebarRef.current.setSaveFc(() => handleSubmit);
      // sidebarRef.current.setSaveFc(() => () => console.log("handleSubmit"));
      console.log(sidebarRef, "sidebarRef");
    }
  }, [handleSave, handleSubmit, sidebarRef]);

  useEffect(() => {
    let content;
    if (!props.content) {
      content = localStorage.getItem(NEW_ARTICLE_KEY) ?? "";
    } else {
      content = props.content;
    }

    const initialValue = JSON.parse(content) ?? DEFAULT_INITIALVALUE;
    setInitialValue(initialValue);
    setContent(content);
  }, [props.content]);

  useEffect(() => {
    if (editor) {
      CustomEditor.toggleBoldMark(editor, bold);
    } else {
      setIsBold(false);
    }
  }, [bold, editor]);

  useEffect(() => {
    if (editor && initialValue) {
      Transforms.select(editor, { offset: 0, path: [0, 0] });
    }
  }, [editor, initialValue]);

  if (!initialValue) {
    return <h2 className="loading">loading...</h2>;
  }

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
      <Slate
        editor={editor}
        initialValue={initialValue}
        onChange={(value) => {
          const isAstChange = editor.operations.some(
            (op) => "set_selection" !== op.type
          );
          if (isAstChange) {
            // Save the value to Local Storage.
            const content = JSON.stringify(value);
            localStorage.setItem(NEW_ARTICLE_KEY, content);
            setContent(content);
          }
        }}
      >
        <div>
          <button
            onMouseDown={(event) => {
              event.preventDefault();
              console.log(editor);

              // CustomEditor.toggleBoldMark(editor, (bold) => setIsBold(bold));
              setIsBold((bold) => !bold);
            }}
            style={{ fontWeight: bold ? "bold" : "normal" }}
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
          autoFocus={true}
          onSelect={() => {
            setIsBold(CustomEditor.isBoldMarkActive(editor));
          }}
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
                setIsBold((bold) => !bold);
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

type CustomElement = { type: "paragraph" | "code"; children: CustomText[] };
type CustomText = {
  bold?: boolean;
  text: string;
  type?: "paragraph" | "code";
};
type CustomEditor = BaseEditor &
  ReactEditor & { type: "paragraph" | "code" | string | null; url?: string };
declare module "slate" {
  interface CustomTypes {
    Editor: CustomEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}

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

  toggleBoldMark(editor: CustomEditor, bold: boolean) {
    if (!bold) {
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
