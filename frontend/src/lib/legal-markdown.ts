export type LegalSection = { title: string; text: string };

export function sectionsToMarkdown(sections: LegalSection[]): string {
  return sections.map(({ title, text }) => title ? `## ${title}${text ? `\n\n${text}` : ""}` : text).join("\n\n");
}

export function markdownToSections(markdown: string): LegalSection[] {
  const lines = markdown.replace(/\r\n?/g, "\n").split("\n");
  const sections: LegalSection[] = [];
  let title = "";
  let body: string[] = [];
  let hasHeading = false;
  let fence = false;
  function push() {
    while (body.length && body[0] === "") body.shift();
    while (body.length && body[body.length - 1] === "") body.pop();
    if (hasHeading || body.length) sections.push({ title, text: body.join("\n") });
  }
  for (const line of lines) {
    if (/^\s*```/.test(line)) fence = !fence;
    const heading = !fence && /^ {0,3}##\s+(.+?)\s*#*\s*$/.exec(line);
    if (heading) { push(); title = heading[1]; body = []; hasHeading = true; }
    else body.push(line);
  }
  push();
  return sections;
}
