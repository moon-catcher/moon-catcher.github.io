import { clone } from "lodash";
import { Descendant } from "slate";

export const NEW_ARTICLE_KEY = "mooncatcher-new-article";
export const NEW_ARTICLE_TITLE_KEY = "mooncatcher-new-article-title";
const DEFAULT_INITIALVALUE_TEMP: (Descendant & { type: string })[] = [
  {
    type: "paragraph",
    children: [{ text: "A line of text in a paragraph.", bold: true }],
  },
  {
    type: "code",
    children: [{ text: "const a = 'b'" }],
  },
  {
    type: "paragraph",
    children: [{ text: "" }],
  },
];
export const DEFAULT_INITIALVALUE = clone(DEFAULT_INITIALVALUE_TEMP);
