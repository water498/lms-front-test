"use client";

interface ProseContentProps {
  content: string;
  /** "light" (관리자 기본) | "dark" (학습자 다크 테마) */
  theme?: "light" | "dark";
  className?: string;
}

export default function ProseContent({
  content,
  theme = "light",
  className = "",
}: ProseContentProps) {
  const id = "prose-content";
  return (
    <>
      <div
        className={`${id} ${className}`}
        dangerouslySetInnerHTML={{ __html: content }}
      />
      <style>{`
        .${id} { line-height: 1.7; font-size: 0.875rem; }
        .${id} p { margin: 0 0 0.5em; }
        .${id} p:last-child { margin-bottom: 0; }
        .${id} h2 { font-size: 1rem; font-weight: 600; margin: 1em 0 0.4em; }
        .${id} h3 { font-size: 0.9rem; font-weight: 600; margin: 0.75em 0 0.3em; }
        .${id} ul { list-style: disc; padding-left: 1.25rem; margin: 0.4em 0; }
        .${id} ol { list-style: decimal; padding-left: 1.25rem; margin: 0.4em 0; }
        .${id} li { margin: 0.15em 0; }
        .${id} strong { font-weight: 600; }
        .${id} em { font-style: italic; }
        .${id} u { text-decoration: underline; }
        .${id} blockquote { border-left: 3px solid; padding-left: 0.75rem; margin: 0.5em 0; opacity: 0.75; }
        .${id} a { text-decoration: underline; }
        .${id} a:hover { opacity: 0.8; }
        /* light */
        .${id}.light h2, .${id}.light h3 { color: #1e293b; }
        .${id}.light blockquote { border-color: #e2e8f0; color: #64748b; }
        .${id}.light a { color: #7c3aed; }
        /* dark */
        .${id}.dark { color: #a1a1aa; }
        .${id}.dark h2, .${id}.dark h3 { color: #f4f4f5; }
        .${id}.dark blockquote { border-color: #3f3f46; }
        .${id}.dark a { color: #a78bfa; }
      `}</style>
    </>
  );
}
