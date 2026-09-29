import type { ReactNode } from "react";
import type { Reading } from "@/content/types";

export function FiveSteps({
  reading,
  intro,
}: {
  reading: Reading;
  intro: string;
}) {
  return (
    <section id="plain" className="mt-14 scroll-mt-6 bg-band px-5 py-8 sm:px-8">
      <h2 className="font-serif text-3xl text-ink">用简单的话再讲一遍</h2>
      <p className="mt-4 leading-relaxed">{intro}</p>
      <ol className="mt-8 space-y-8">
        <Step n={1} title="先理解">
          <p>{reading.understand}</p>
        </Step>
        <Step n={2} title="找出核心观点">
          <blockquote className="border-l-2 border-gold pl-4 font-serif text-2xl leading-snug text-pine">
            {reading.core}
          </blockquote>
        </Step>
        <Step n={3} title="重建逻辑">
          <ol className="space-y-3">
            {reading.logic.map((line, lineIndex) => (
              <li key={line} className="grid grid-cols-[1.5rem_1fr] gap-2">
                <span className="font-semibold text-clay">{lineIndex + 1}</span>
                <span>{line}</span>
              </li>
            ))}
          </ol>
        </Step>
        <Step n={4} title="用简单语言表达">
          <p>{reading.plain}</p>
        </Step>
        <Step n={5} title="检查你是否能快速理解">
          <p>先盖住答案，用自己的话说。说得出来，这一则才算读过。</p>
          <div className="mt-4 divide-y divide-line border-y border-line">
            {reading.checks.map((check, checkIndex) => (
              <details key={check.question} className="group py-3">
                <summary className="cursor-pointer list-none font-semibold leading-relaxed [&::-webkit-details-marker]:hidden">
                  <span className="mr-2 text-clay">{checkIndex + 1}</span>
                  {check.question}
                  <span className="mt-1 block text-sm font-normal text-muted group-open:hidden">
                    我想好了，再看答案
                  </span>
                </summary>
                <p className="mt-3 leading-relaxed text-ink">{check.answer}</p>
              </details>
            ))}
          </div>
        </Step>
      </ol>
    </section>
  );
}

function Step({
  n,
  title,
  children,
}: {
  n: number;
  title: string;
  children: ReactNode;
}) {
  return (
    <li className="grid grid-cols-[2.25rem_minmax(0,1fr)] gap-3">
      <span className="font-serif text-3xl leading-none text-clay">{n}</span>
      <div className="leading-[1.9]">
        <h3 className="font-serif text-2xl leading-snug text-ink">{title}</h3>
        <div className="mt-3">{children}</div>
      </div>
    </li>
  );
}
