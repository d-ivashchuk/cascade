// contentlayer.config.ts
import { defineDocumentType, makeSource } from "contentlayer/source-files";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";

export const Post = defineDocumentType(() => ({
  name: "Post",
  filePathPattern: `blog/**/*.md`,
  contentType: "mdx",
  fields: {
    title: { type: "string", required: true },
    image: {
      type: "string",
      required: true,
    },
    description: { type: "string", required: true },
    date: { type: "date", required: true },
    published: {
      type: "boolean",
      required: true,
      default: false,
    },
  },
  computedFields: {
    slug: {
      type: "string",
      resolve: (post) => `/${post._raw.flattenedPath}`,
    },
    slugAsParams: {
      type: "string",
      resolve: (doc) => doc._raw.flattenedPath.split("/").slice(1).join("/"),
    },
  },
}));

export default makeSource({
  contentDirPath: "./content",
  documentTypes: [Post],
  mdx: {
    rehypePlugins: [
      rehypeSlug,
      [
        //@ts-expect-error would still work even though types are incorrect, need to fix this after contentlayer gets enough maintenenace
        rehypePrettyCode,
        {
          theme: "dracula",
          onVisitLine(node: { children: string | unknown[] }) {
            // Prevent lines from collapsing in `display: grid` mode, and allow empty
            // lines to be copy/pasted
            if (node.children.length === 0) {
              node.children = [{ type: "text", value: " " }];
            }
          },
          onVisitHighlightedLine(node: {
            properties: { className: string[] };
          }) {
            node.properties.className.push("line--highlighted");
          },
          onVisitHighlightedWord(node: {
            properties: { className: string[] };
          }) {
            node.properties.className = ["word--highlighted"];
          },
        },
      ],
      [
        rehypeAutolinkHeadings,
        {
          properties: {
            className: ["subheading-anchor"],
            ariaLabel: "Link to section",
          },
        },
      ],
    ],
  },
});
