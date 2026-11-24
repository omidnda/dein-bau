import { Fragment, type ReactNode } from "react";

function safeUrl(value: string) {
  const url = value.trim();
  return /^(https?:\/\/|mailto:|tel:)/i.test(url) ? url : undefined;
}
function inline(text: string): ReactNode[] {
  const pattern = /\[([^\]\n]+)\]\(([^\s)]+)\)|(\*\*|__)(.+?)\3|(\*|_)([^\n]+?)\5/g;
  const result: ReactNode[] = []; let last = 0; let match: RegExpExecArray | null;
  while ((match = pattern.exec(text))) {
    result.push(text.slice(last, match.index));
    if (match[1]) { const href = safeUrl(match[2]); result.push(href ? <a key={match.index} href={href}>{match[1]}</a> : match[1]); }
    else if (match[3]) result.push(<strong key={match.index}>{match[4]}</strong>);
    else result.push(<em key={match.index}>{match[6]}</em>);
    last = pattern.lastIndex;
  }
  result.push(text.slice(last)); return result;
}
export default function LegalMarkdown({ text }: { text: string }) {
  const lines = text.replace(/\r\n?/g, "\n").split("\n"); const blocks: ReactNode[] = []; let i = 0;
  while (i < lines.length) {
    if (!lines[i].trim()) { i++; continue; }
    const heading = /^(#{1,6})\s+(.+)$/.exec(lines[i]);
    if (heading) { const content = inline(heading[2]); const level = Math.min(heading[1].length, 6); blocks.push(level === 1 ? <h1 key={i}>{content}</h1> : level === 2 ? <h2 key={i}>{content}</h2> : level === 3 ? <h3 key={i}>{content}</h3> : <h4 key={i}>{content}</h4>); i++; continue; }
    const item = /^\s*(?:([-*+])\s+|(\d+)\.\s+)(.*)$/.exec(lines[i]);
    if (item) { const start = i; const ordered = !!item[2]; const entries: ReactNode[] = []; while (i < lines.length) { const next = /^\s*(?:([-*+])\s+|(\d+)\.\s+)(.*)$/.exec(lines[i]); if (!next || !!next[2] !== ordered) break; entries.push(<li key={i}>{inline(next[3])}</li>); i++; } blocks.push(ordered ? <ol key={start}>{entries}</ol> : <ul key={start}>{entries}</ul>); continue; }
    const start = i; const paragraph: string[] = []; while (i < lines.length && lines[i].trim() && !/^(#{1,6})\s+/.test(lines[i]) && !/^\s*(?:[-*+]\s+|\d+\.\s+)/.test(lines[i])) paragraph.push(lines[i++]);
    blocks.push(<p key={start}>{paragraph.map((line, index) => <Fragment key={index}>{index > 0 && <br />}{inline(line)}</Fragment>)}</p>);
  }
  return <div className="legal-markdown">{blocks}</div>;
}
