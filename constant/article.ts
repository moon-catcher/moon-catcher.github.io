import { clone } from "lodash";
import { Descendant } from "slate";

export const NEW_ARTICLE_KEY = "mooncatcher-new-article";
export const NEW_ARTICLE_TITLE_KEY = "mooncatcher-new-article-title";
export const ARTICLE_LIST_KEY = "mooncatcher-local-articles-key";
export const CURRENT_ARTICLE_KEY = "mooncatcher-current-article-key";

const DEFAULT_INITIALVALUE_TEMP: Descendant[] = [
  {
    type: "paragraph",
    children: [{ text: "A line of text in a paragraph.", bold: true }],
  },
  {
    type: "code",
    children: [{ text: "const a = 'b'" }],
  },
];
export const DEFAULT_INITIALVALUE = clone(DEFAULT_INITIALVALUE_TEMP);

export const SAME_NAME_ERROR = `"sha" wasn't supplied.`;
