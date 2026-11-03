import assert from "node:assert/strict";
import { test } from "node:test";
import { compile } from "@mdx-js/mdx";
import { micromark } from "micromark";
import { math, mathHtml } from "micromark-extension-math";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

const source = String.raw`Inline $$E = mc^2$$. Price: $10.

$$
\int_0^1 x^2\,dx = \frac{1}{3}
$$
`;

test("MDX math plugins render inline and block formulas with the patched KaTeX", async () => {
  const file = await compile(source, {
    remarkPlugins: [[remarkMath, { singleDollarTextMath: false }]],
    rehypePlugins: [rehypeKatex],
  });
  assert.equal(file.messages.length, 0);
  assert.match(String(file), /katex-display/);
  assert.match(String(file), /katex-mathml/);
  assert.match(String(file), /\$10/);
  assert.doesNotMatch(String(file), /katex-error/);
});

test("micromark math HTML renderer also uses the patched KaTeX", () => {
  const html = micromark(source, {
    extensions: [math({ singleDollarTextMath: false })],
    htmlExtensions: [mathHtml()],
  });
  assert.match(html, /katex-display/);
  assert.match(html, /katex-mathml/);
  assert.match(html, /\$10/);
  assert.doesNotMatch(html, /katex-error/);
});
