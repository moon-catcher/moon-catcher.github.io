/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Slate,
  Editable,
  ReactEditor,
  withReact,
  RenderElementProps,
  RenderLeafProps,
} from "slate-react";
import React, { useCallback, useEffect, useState, memo } from "react";
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
import dayjs from "dayjs";
type Props = {
  title?: string;
  filePickerOpen?: boolean;
  onFilePickerOpenChange?: () => void;
};
// localStorage.setItem = function (key: string, value: string) {
//   console.log(this);
//   console.log(key, value);
//   localStorage.setItem(key, value);
// };

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
const RichEditor = memo(function RichEditor(props: Props) {
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

  const handleLocalStorage = useCallback(
    ({
      title,
      content,
      currentArticle,
      localArticles,
    }: {
      title?: string;
      content?: string;
      currentArticle?: Article;
      localArticles?: Article[];
    }) => {
      if (content && title) {
        setContent(content);
        if (currentArticle?.warning) {
          localStorage.setItem(
            `${NEW_ARTICLE_KEY}_${currentArticle.warning}`,
            content
          );
        } else {
          localStorage.setItem(`${NEW_ARTICLE_KEY}_${title}`, content);
        }
      }
      if (currentArticle) {
        setCurrentArticle(currentArticle);
        localStorage.setItem(
          CURRENT_ARTICLE_KEY,
          JSON.stringify(currentArticle)
        );
      }
      if (localArticles) {
        setLocalArticles(localArticles);
        localStorage.setItem(ARTICLE_LIST_KEY, JSON.stringify(localArticles));
      }
    },
    []
  );

  const handleArticleCreate = useCallback(() => {
    let title = "标题";
    while (localArticles.some((item) => item.title === title)) {
      title += "(1)";
    }
    const newCurrentArticle = { title, remote: false };
    const content = JSON.stringify(DEFAULT_INITIALVALUE);
    setLocalArticles((localArticles) => [...localArticles, newCurrentArticle]);
    setInitialValue(null);
    handleLocalStorage({
      localArticles: [...localArticles, newCurrentArticle],
      currentArticle: newCurrentArticle,
      title,
      content,
    });
    setTimeout(() => {
      setInitialValue(DEFAULT_INITIALVALUE);
    }, 1);
  }, [handleLocalStorage, localArticles]);

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
      handleLocalStorage({ currentArticle: newCurrentArticle });

      if (isLocalToRemote) {
        handleLocalStorage({ localArticles: newlocalArticles });
      }
      alert("已保存至草稿箱");
    },
    [handleLocalStorage, localArticles]
  );

  const handleSelectArticle = useCallback(
    (article: Article) => {
      setInitialValue(null);

      console.log(article, "article.warning");

      const currentContext = localStorage.getItem(
        article?.warning
          ? `${NEW_ARTICLE_KEY}_${article.warning}`
          : `${NEW_ARTICLE_KEY}_${article.title}`
      );
      let initValue = DEFAULT_INITIALVALUE;
      console.log(
        currentContext,
        "currentContext",
        article?.warning
          ? `${NEW_ARTICLE_KEY}_${article.warning}`
          : `${NEW_ARTICLE_KEY}_${article.title}`
      );

      if (currentContext) initValue = JSON.parse(currentContext);
      // 需要将设置值放在get storage后边，不然有影响
      handleLocalStorage({ currentArticle: article });
      setTimeout(() => {
        setInitialValue(initValue);
      }, 1);
    },
    [handleLocalStorage]
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
      console.log(newTitle, newContent, newCurrentArticle, "newTitlenewTitle");

      let newlocalArticles = localArticles.length
        ? [...localArticles]
        : [newCurrentArticle];

      const articleTitles: { [p: string]: number } = {};
      newlocalArticles = newlocalArticles.map((article) => {
        let result = article;
        if (
          (article.title === currentArticle?.title ||
            (article.sha && article.sha === currentArticle?.sha)) &&
          article.warning === currentArticle.warning
        ) {
          result = newCurrentArticle;
        }

        // 统计冲突
        if (!articleTitles[result.title]) articleTitles[result.title] = 0;
        articleTitles[result.title] += 1;
        return result;
      });
      newlocalArticles = newlocalArticles.map((article) => {
        if (article.warning && articleTitles[article.title] === 1) {
          const content = localStorage.getItem(
            `${NEW_ARTICLE_KEY}_${article.warning}`
          );
          localStorage.setItem(
            `${NEW_ARTICLE_KEY}_${article.title}`,
            content ?? ""
          );
          return { ...article, warning: undefined };
        }
        return article;
      });
      handleLocalStorage({
        title: newTitle,
        content: newContent,
        localArticles: newlocalArticles,
        currentArticle: newCurrentArticle,
      });
    },
    [currentArticle, handleLocalStorage, localArticles]
  );

  const handleContentChange = useCallback(
    (value: Descendant[]) => {
      console.log("handleContentChange???");

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
      const newCurrentArticle: Article = {
        title: event.target.value,
        sha: currentArticle?.sha,
        remote: false,
      };
      if (
        event.target.value &&
        newlocalArticles.some(({ title }) => title === event.target.value)
      ) {
        newCurrentArticle.warning = dayjs().format() + "标题重复";
      }
      const oldTitle = currentArticle?.title;

      // 1.去除上个名字的存储位置
      const currentContext = localStorage.getItem(
        currentArticle?.warning
          ? `${NEW_ARTICLE_KEY}_${currentArticle.warning}`
          : `${NEW_ARTICLE_KEY}_${oldTitle}`
      );

      // 2.移除上一个存储位置
      localStorage.removeItem(
        currentArticle?.warning
          ? `${NEW_ARTICLE_KEY}_${currentArticle?.warning}`
          : `${NEW_ARTICLE_KEY}_${oldTitle}`
      );

      // 存到新位置
      handleArticleChange({
        newCurrentArticle,
        newContent: currentContext ?? "",
      });
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
    if (currentArticle?.warning) {
      alert("标题重复！请修改");
      return;
    }
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
    if (currentArticle?.warning) {
      alert("标题重复！请修改");
      return;
    }
    const nodes = JSON.parse(content!) as Node[];
    console.log(nodes.map((node) => serialize(node)));
  }, [content, currentArticle]);

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
    let title = "标题";
    let newCurrentArticle: Article = { title: "标题", remote: false };
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
        console.log(tempArr, "tempArr");

        if (tempArr.length) {
          handleLocalStorage({ localArticles: tempArr });
        }
      }
    } catch (error) {
      console.log(error);
    }
    setOrginTitle(title);
    setCurrentArticle(newCurrentArticle);

    let content;
    if (title) {
      content = localStorage.getItem(
        newCurrentArticle?.warning
          ? `${NEW_ARTICLE_KEY}_${newCurrentArticle.warning}`
          : `${NEW_ARTICLE_KEY}_${newCurrentArticle?.title}`
      );
      let initialValue = DEFAULT_INITIALVALUE;
      if (content) {
        try {
          initialValue = JSON.parse(content);
        } catch (error) {
          console.log(error);
        }
      } else {
        content = JSON.stringify(DEFAULT_INITIALVALUE);
      }
      console.log(content, "contentcontentcontentcontent");

      setInitialValue(initialValue);
      setContent(content);
    }
  }, [handleLocalStorage, props.title]);

  useEffect(() => {
    if (editor) {
      CustomEditor.toggleBoldMark(editor, bold);
    } else {
      setIsBold(false);
    }
  }, [bold, editor]);

  useEffect(() => {
    if (editor && initialValue) {
      const lastIndex = initialValue.length - 1;
      const lastChildren = (initialValue[lastIndex] as CustomElement).children;
      const nextLastChildren = lastChildren[lastChildren.length - 1];
      editor.select({
        offset: nextLastChildren.text.length,
        path: [lastIndex, lastChildren.length - 1],
      });
    }
  }, [editor, initialValue]);

  // click outside
  // useEffect(() => {
  //   document.addEventListener("click", (event) => {
  //     if (
  //       event.target &&
  //       !document
  //         .querySelector(".draft-article-box")
  //         ?.contains(event.target as globalThis.Node) &&
  //       !document
  //         .querySelector(".draft-box")
  //         ?.contains(event.target as globalThis.Node)
  //     )
  //       setDraftOpen(false);
  //   });
  // }, []);

  return (
    <div className="editor">
      <div className="header">
        <input
          className="title"
          onInput={handleTitleChange}
          suppressContentEditableWarning
          value={currentArticle?.title ?? ""}
        />
      </div>
      <div className="article-actions">
        <div
          className={[
            "file-list",
            props.filePickerOpen ? "file-list-active" : "",
          ].join(" ")}
          onClick={props.onFilePickerOpenChange}
        >
          {/* <span>草稿箱</span>
          <div className={["expand-icon", draftOpen ? "open" : ""].join(" ")}>
            {">"}
          </div> */}
          文件列表
        </div>
        <span className="create-button" onClick={handleArticleCreate}>
          新建
        </span>
        {currentArticle?.warning && (
          <div className="titleCeffg-warning" title="标题重复，请修改">
            ❗❗❗❗❗❗❗❗{currentArticle?.warning}❗❗❗❗❗❗❗❗❗
          </div>
        )}
      </div>{" "}
      <div
        className={["draft-article-box"].join(" ")}
        style={{
          height: draftOpen ? rowHeight * ((localArticles.length || 1) + 1) : 0,
        }}
      >
        <div className="draft-article-header" style={{ height: rowHeight }}>
          <div>title</div>
          <div>isRemote</div>
          <div>createAt</div>
          <div>updateAt</div>
          <div>Actions</div>
          <div></div>
        </div>
        {localArticles.length ? (
          localArticles.map((article, index) => {
            const { title, warning, remote } = article;
            return (
              <div
                onClick={() => handleSelectArticle(article)}
                key={title + index}
                style={{ height: rowHeight }}
                title={warning}
                className={[
                  "draft-article-row",
                  currentArticle?.title === title &&
                  currentArticle.warning === warning
                    ? "current-article"
                    : "",
                  warning ? "draft-article-row-warning" : "",
                ].join(" ")}
              >
                <div>
                  {warning && <span>❗❗</span>}
                  {title}
                </div>
                <div>{remote ? "remote" : "local"}</div>
                <div>CreateAt</div>
                <div>UpdateAt</div>
                <div
                  onClick={(event) => {
                    event.stopPropagation();
                  }}
                >
                  Delete
                </div>
                <div
                  onClick={(event) => {
                    event.stopPropagation();
                  }}
                >
                  Sync
                </div>
              </div>
            );
          })
        ) : (
          <div>Empty</div>
        )}
      </div>
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
      {initialValue ? (
        <Slate
          editor={editor}
          initialValue={initialValue}
          onChange={handleContentChange}
        >
          <Editable
            className="editable"
            renderElement={renderElement}
            renderLeaf={renderLeaf}
            autoFocus
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
      ) : (
        <div className="editable loading">
          <h2>loading...</h2>
        </div>
      )}
    </div>
  );
});

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
