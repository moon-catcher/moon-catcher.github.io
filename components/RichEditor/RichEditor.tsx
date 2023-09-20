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
  ARTICLE_LIST_KEY,
  CURRENT_ARTICLE_KEY,
  DEFAULT_INITIALVALUE,
  NEW_ARTICLE_KEY,
} from "@constant/article";
import { usePageContext } from "../../renderer/usePageContext";
import { useAuth } from "@providers/AuthProvider";
import { DEFAULT_HEADER } from "@constant/auth";
import { Article, CurrentArticle } from "@type/article";
type Props = {
  content?: string;
  title?: string;
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
  const [currentArticle, setCurrentArticle] = useState<CurrentArticle | null>(
    null
  );
  const [localArticles, setLocalArticles] = useState<Article[]>([]);
  // const [remoteArticles, setRemoteArticles] = useState<Article[]>([]);
  const [orginTitle, setOrginTitle] = useState("");
  const [initialValue, setInitialValue] = useState<Descendant[] | null>(null);

  const { setLinkBntAction } = usePageContext();
  const { octokit, userInfo } = useAuth();

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

  const handleTitleChange = useCallback(
    (
      event: React.FormEvent<HTMLInputElement> & { target: HTMLInputElement }
    ) => {
      let newlocalArticles = [...localArticles];
      if (
        event.target.value &&
        newlocalArticles.some(({ title }) => title === event.target.value)
      ) {
        alert("标题不可重复,已重命名");
        event.target.value += `(1)`;
        return;
      }
      const newTitle = event.target.value;
      const oldTitle = currentArticle?.title;
      newlocalArticles = newlocalArticles.map((article) => {
        if (article.title === oldTitle) {
          return { ...article, title: newTitle };
        }
        return article;
      });
      localStorage.removeItem(`${NEW_ARTICLE_KEY}_${oldTitle}`);
      console.log(content, "content", newlocalArticles);

      console.log(
        content,
        "handleTitleChange -contentcontentcontentcontent",
        newlocalArticles
      );

      if (content) {
        localStorage.setItem(`${NEW_ARTICLE_KEY}_${newTitle}`, content);
      }
      const newCurrentArticle = {
        title: newTitle,
        remote: !!currentArticle?.remote,
      };
      // store CURRENT_ARTICLE_KEY
      localStorage.setItem(
        CURRENT_ARTICLE_KEY,
        JSON.stringify(newCurrentArticle)
      );
      setCurrentArticle(newCurrentArticle);
      // store ARTICLE_LIST_KEY
      localStorage.setItem(ARTICLE_LIST_KEY, JSON.stringify(newlocalArticles));
      setLocalArticles(newlocalArticles);
    },

    [localArticles, content, currentArticle]
  );

  const handleSave = useCallback(() => {
    console.log(octokit, "content");
    if (content && octokit && currentArticle?.title) {
      const { login: owner, name, email } = userInfo;
      octokit
        .request("PUT /repos/{owner}/{repo}/contents/{path}", {
          owner,
          repo: `${owner}.github.io`,
          path: `public/jsonStore/ttt/${currentArticle.title}.json`,
          message: ` create or update draft article ${currentArticle.title}`,
          committer: {
            name,
            email: email || "moon-catcher@gmail.com",
          },
          content: btoa(content),
          headers: DEFAULT_HEADER,
        })
        .then((res: unknown) => {
          console.log(res);
        })
        .catch((error: Error) => {
          console.log(error, "error");
          if (error.message) {
            alert("同名文章已存在!");
          } else {
            alert(error.message);
          }
        });
    }
  }, [content, octokit, userInfo, currentArticle?.title]);

  const handleSubmit = useCallback(() => {
    // const nodes = JSON.parse(content!) as Node[];
    // console.log(nodes.map((node) => serialize(node)));
  }, [content]);

  useEffect(() => {
    if (typeof setLinkBntAction === "function") {
      setLinkBntAction("save", handleSave);
      setLinkBntAction("submit", handleSubmit);
    }
  }, [handleSave, handleSubmit, setLinkBntAction]);

  useEffect(() => {
    let content;
    if (orginTitle) {
      if (!props.content) {
        content =
          localStorage.getItem(`${NEW_ARTICLE_KEY}_${orginTitle}`) ?? "";
      } else {
        content = props.content;
      }
      console.log(content, "content----------------------");

      let initialValue = DEFAULT_INITIALVALUE;
      try {
        if (content) {
          initialValue = JSON.parse(content);
        } else {
          content = JSON.stringify(DEFAULT_INITIALVALUE);
        }
      } catch (error) {
        console.log(error);
      }
      console.log(content, "contentcontentcontentcontent");

      setInitialValue(initialValue);
      setContent(content);
    }
  }, [props.content, orginTitle]);

  useEffect(() => {
    let localArticles: Article[] = [{ title: "标题" }];
    let title = localArticles[0].title;
    let newCurrentArticle = { title: "标题", remote: false };
    if (!props.title) {
      const currentArticleJSONStr =
        localStorage.getItem(CURRENT_ARTICLE_KEY) ?? "";
      try {
        if (currentArticleJSONStr) {
          const currentArticle = JSON.parse(
            currentArticleJSONStr
          ) as CurrentArticle;
          if (currentArticle.title) {
            title = currentArticle.title;
            newCurrentArticle = currentArticle;
          }
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      title = props.title;
    }
    const localArticlesJSONStr = localStorage.getItem(ARTICLE_LIST_KEY) ?? "";
    try {
      if (localArticlesJSONStr) {
        const tempArr = JSON.parse(localArticlesJSONStr) as Article[];
        if (tempArr.length) {
          localArticles = tempArr;
        }
      }
    } catch (error) {
      console.log(error);
    }
    localStorage.setItem(ARTICLE_LIST_KEY, JSON.stringify(localArticles));
    setOrginTitle(title);
    setLocalArticles(localArticles);
    setCurrentArticle(newCurrentArticle);
  }, [props.title]);

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
        <input
          className="title"
          onInput={handleTitleChange}
          suppressContentEditableWarning
          value={currentArticle?.title}
        />
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
            localStorage.setItem(
              `${NEW_ARTICLE_KEY}_${currentArticle?.title}`,
              content
            );
            setContent(content);
          }
        }}
      >
        <div>
          <button
            onMouseDown={(event) => {
              event.preventDefault();
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
