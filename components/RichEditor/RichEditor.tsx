/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { Article, ArticleSaveResponse } from "@type/article";
type Props = {
  title?: string;
};

const rowHeight = 30;

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
  const [content, setContent] = useState("");
  const [stashSave, setStashSave] = useState(false);
  const [currentArticle, setCurrentArticle] = useState<Article | null>(null);
  const [localArticles, setLocalArticles] = useState<Article[]>([]);
  // const [remoteArticles, setRemoteArticles] = useState<Article[]>([]);
  const [draftOpen, setDraftOpen] = useState(false);
  const [orginTitle, setOrginTitle] = useState("");
  const [initialValue, setInitialValue] = useState<Descendant[] | null>(null);

  const { setLinkBntAction } = usePageContext();
  const { octokit, userInfo, login } = useAuth();

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

  const handleArticletoRemote = useCallback(
    (data: ArticleSaveResponse["data"]) => {
      const newCurrentArticle = {
        title: data.content.name.replace(".json", ""),
        sha: data.content.sha,
        remote: true,
      };
      let isLocalToRemote = false;
      // let newRemoteArticles = [...remoteArticles];
      const newlocalArticles = localArticles.map((article) => {
        if (
          `${article.title}.json` === data.content.name ||
          article.sha === data.content.sha
        ) {
          // newRemoteArticles.push(newCurrentArticle);
          isLocalToRemote = true;
          return newCurrentArticle;
        }
        return article;
      });
      // 保存当前article
      setCurrentArticle(newCurrentArticle);
      localStorage.setItem(
        CURRENT_ARTICLE_KEY,
        JSON.stringify(newCurrentArticle)
      );

      if (isLocalToRemote) {
        setLocalArticles(newlocalArticles);
        localStorage.setItem(
          ARTICLE_LIST_KEY,
          JSON.stringify(newlocalArticles)
        );
      }
      alert("已保存至草稿箱");
    },
    [localArticles]
  );

  const handleArticleChange = useCallback(
    ({
      newCurrentArticle,
      newContent,
    }: {
      newCurrentArticle: Article;
      newContent?: string;
    }) => {
      const { title: newTitle } = newCurrentArticle;
      let newlocalArticles = [...localArticles];
      newlocalArticles = newlocalArticles.map((article) => {
        if (
          article.title === currentArticle?.title ||
          (article.sha && article.sha === currentArticle?.sha)
        ) {
          return { ...article, title: newTitle, remote: false };
        }
        return article;
      });

      if (newContent) setContent(newContent);
      localStorage.setItem(
        `${NEW_ARTICLE_KEY}_${newTitle}`,
        newContent ?? content ?? ""
      );
      setCurrentArticle(newCurrentArticle);
      setLocalArticles(newlocalArticles);
      localStorage.setItem(ARTICLE_LIST_KEY, JSON.stringify(newlocalArticles));
      localStorage.setItem(
        CURRENT_ARTICLE_KEY,
        JSON.stringify(newCurrentArticle)
      );
    },
    [content, currentArticle, localArticles]
  );

  const handleContentChange = useCallback(
    (value: Descendant[]) => {
      const isAstChange = editor.operations.some(
        (op) => "set_selection" !== op.type
      );
      if (isAstChange) {
        // Save the value to Local Storage.
        const content = JSON.stringify(value);
        const newCurrentArticle = {
          ...currentArticle,
          remote: false,
          title: currentArticle?.title ?? "",
        };
        handleArticleChange({ newCurrentArticle, newContent: content });
      }
    },
    [currentArticle, editor.operations, handleArticleChange]
  );

  const handleTitleChange = useCallback(
    (
      event: React.FormEvent<HTMLInputElement> & { target: HTMLInputElement }
    ) => {
      const newlocalArticles = [...localArticles];
      if (
        event.target.value &&
        newlocalArticles.some(({ title }) => title === event.target.value)
      ) {
        alert("标题不可重复,已重命名");
        event.target.value += `(1)`;
        return;
      }
      const oldTitle = currentArticle?.title;
      localStorage.removeItem(`${NEW_ARTICLE_KEY}_${oldTitle}`);
      const newCurrentArticle = {
        title: event.target.value,
        sha: currentArticle?.sha,
        remote: false,
      };
      handleArticleChange({ newCurrentArticle });
    },

    [localArticles, currentArticle, handleArticleChange]
  );

  const handleDelelteRemoteArticle = useCallback(
    ({
      sha,
      title,
      owner,
      name,
      email,
    }: {
      sha: string;
      title: string;
      owner: any;
      name: any;
      email: any;
    }) => {
      octokit.request("DELETE /repos/{owner}/{repo}/contents/{path}", {
        owner,
        repo: `${owner}.github.io`,
        sha,
        path: `public/jsonStore/write/${title}.json`,
        message: ` create or update draft article ${title}`,
        committer: {
          name,
          email: email || "moon-catcher@gmail.com",
        },
        headers: DEFAULT_HEADER,
      });
    },
    [octokit]
  );

  const handleSave = useCallback(() => {
    if (content && octokit && currentArticle?.title) {
      const { login: owner, name, email } = userInfo;
      octokit
        .request("PUT /repos/{owner}/{repo}/contents/{path}", {
          owner,
          repo: `${owner}.github.io`,
          sha: currentArticle.sha,
          path: `public/jsonStore/write/${currentArticle.title}.json`,
          message: ` create or update draft article ${currentArticle.title}`,
          committer: {
            name,
            email: email || "moon-catcher@gmail.com",
          },
          content: btoa(content),
          headers: DEFAULT_HEADER,
        })
        .then((res: ArticleSaveResponse) => {
          console.log(res, "tetttttt");
          if (currentArticle.sha && orginTitle !== currentArticle.title) {
            handleDelelteRemoteArticle({
              sha: currentArticle.sha,
              title: orginTitle,
              owner,
              name,
              email,
            });
            setOrginTitle(currentArticle.title);
          }
          handleArticletoRemote(res.data);
        })
        .catch((error: Error) => {
          console.log(error, "error");
          if (error.message) {
            alert("同名文章已存在!");
          } else {
            alert(error.message);
          }
        });
    } else if (!octokit) {
      const result = confirm("未登录,是否登录");
      if (result) {
        login();
        setStashSave(true);
      }
    }
  }, [
    content,
    octokit,
    currentArticle,
    userInfo,
    orginTitle,
    handleArticletoRemote,
    handleDelelteRemoteArticle,
    login,
  ]);

  const handleSubmit = useCallback(() => {
    const nodes = JSON.parse(content!) as Node[];
    console.log(nodes.map((node) => serialize(node)));
  }, [content]);

  useEffect(() => {
    if (stashSave && userInfo.login) {
      console.log(content, "************");
      handleSave();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stashSave, userInfo.login]);

  useEffect(() => {
    if (typeof setLinkBntAction === "function") {
      setLinkBntAction("save", handleSave);
      setLinkBntAction("submit", handleSubmit);
    }
  }, [handleSave, handleSubmit, setLinkBntAction]);

  useEffect(() => {
    let content;
    if (orginTitle) {
      content = localStorage.getItem(`${NEW_ARTICLE_KEY}_${orginTitle}`) ?? "";
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
  }, [orginTitle]);

  useEffect(() => {
    let localArticles: Article[] = [{ title: "标题", remote: false }];
    let title = localArticles[0].title;
    let newCurrentArticle = { title: "标题", remote: false };
    if (!props.title) {
      const currentArticleJSONStr =
        localStorage.getItem(CURRENT_ARTICLE_KEY) ?? "";
      try {
        if (currentArticleJSONStr) {
          const currentArticle = JSON.parse(currentArticleJSONStr) as Article;
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
      <div className="header">
        <div
          className="draft-box"
          onClick={() => setDraftOpen((draftOpen) => !draftOpen)}
        >
          <span>草稿箱</span>
          <div className={["expand-icon", draftOpen ? "open" : ""].join(" ")}>
            {">"}
          </div>
        </div>
        <div
          className={[
            "draft-article-box",
            !draftOpen ? "draft-article-box-hidden" : "",
          ].join(" ")}
          style={{
            height: draftOpen
              ? rowHeight * ((localArticles.length || 0) + 1)
              : 0,
          }}
        >
          <div className="draft-article-row" style={{ height: rowHeight }}>
            <div>title</div>
            <div>isRemote</div>
            <div>createAt</div>
            <div>updateAt</div>
            <div>delete</div>
          </div>
          {localArticles.map(({ title, remote }) => (
            <div
              key={title}
              style={{ height: rowHeight }}
              className="draft-article-row"
            >
              <div>{title}</div>
              <div>{remote ? "remote" : "local"}</div>
              <div>createAt</div>
              <div>updateAt</div>
              <div>delete</div>
            </div>
          ))}
        </div>
        <input
          className="title"
          onInput={handleTitleChange}
          suppressContentEditableWarning
          value={currentArticle?.title}
        />
      </div>
      <Slate
        editor={editor}
        initialValue={initialValue}
        onChange={handleContentChange}
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
