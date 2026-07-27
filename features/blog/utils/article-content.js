/**
 * Ensures h2/h3 headings have id attributes for TOC anchor links.
 * @param {string} html
 */
export function addHeadingIds(html = "") {
  let index = 0;

  return String(html).replace(
    /<h([2-3])([^>]*)>(.*?)<\/h\1>/gi,
    (match, level, attrs, content) => {
      if (/id\s*=/i.test(attrs)) return match;
      index += 1;
      return `<h${level}${attrs} id="heading-${index}">${content}</h${level}>`;
    },
  );
}
