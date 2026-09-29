import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SECTION_META } from "@/content/book";
import { entryHref } from "@/content/nav";
import { intro, overviewPlain } from "@/content/overview";
import { FiveSteps } from "@/components/steps";
import { buttonVariants } from "@/components/ui/button";

export function OverviewView() {
  return (
    <article id="chapter" className="mx-auto w-full max-w-3xl px-5 py-10 sm:px-8 sm:py-14">
      <p className="text-sm font-semibold text-clay">
        开篇
        <span className="mx-2 text-line">/</span>
        <span className="text-muted">六套 · 36 计</span>
      </p>
      <h1 className="mt-3 font-serif text-4xl leading-tight text-ink sm:text-5xl">
        三十六计，按处境取用
      </h1>
      <p className="mt-4 text-sm leading-relaxed text-muted">
        先看全书怎么分，再一计一计读：原文、注释、译文，然后五步讲明白
      </p>
      <p className="mt-6 text-lg leading-relaxed text-ink">
        每一计只有一两句原文，常借《周易》的一卦说理。本站把原文、注释、译文原样摆出来，再用五步讲开：先理解，找出核心观点，重建逻辑，用简单的话说一遍，最后留两个问题让你自己讲。
      </p>

      <p className="mt-8 flex flex-wrap gap-4 text-sm">
        <a href="#original" className="font-semibold text-pine underline-offset-4 hover:underline">
          先看题解
        </a>
        <a href="#map" className="font-semibold text-teal underline-offset-4 hover:underline">
          六套怎么排
        </a>
        <a href="#plain" className="font-semibold text-clay underline-offset-4 hover:underline">
          五步讲明白
        </a>
      </p>

      <section id="original" className="mt-12 scroll-mt-6">
        <h2 className="font-serif text-3xl text-ink">题解</h2>
        <blockquote className="mt-5 border-l-2 border-pine bg-paper px-5 py-6 font-serif text-lg leading-[1.95] text-ink">
          {intro}
        </blockquote>
      </section>

      <section id="map" className="mt-12 scroll-mt-6">
        <h2 className="font-serif text-3xl text-ink">六套，每套六计</h2>
        <p className="mt-4 leading-relaxed">
          前三套是占优、相持、进攻时用的，后三套是混乱、多方角力、身处劣势时用的。先认清自己在哪种局面，再翻到那一套。
        </p>
        <ol className="mt-6 space-y-3">
          {SECTION_META.map((section, index) => (
            <li key={section.name}>
              <Link
                href={entryHref(section.from)}
                className="grid gap-1 border border-line bg-paper px-4 py-4 transition-colors hover:border-pine sm:grid-cols-[7rem_1fr_auto] sm:items-center"
              >
                <span className="font-serif text-xl text-pine">
                  <span className="mr-2 text-clay">{index + 1}</span>
                  {section.name}
                </span>
                <span className="text-sm leading-relaxed text-muted">
                  第 {section.range} 计 · {section.blurb}
                </span>
                <span className="text-sm font-semibold text-teal">从第 {section.from} 计读起</span>
              </Link>
            </li>
          ))}
        </ol>
      </section>

      <FiveSteps
        reading={overviewPlain}
        intro="上面是题解，也是六套的地图。下面按同一个意思走五步。"
      />

      <p className="mt-10 border-l-2 border-gold pl-4 font-serif text-xl leading-relaxed text-ink">
        {overviewPlain.core}
      </p>

      <div className="mt-12">
        <Link href={entryHref(1)} className={buttonVariants()}>
          从第一计 瞒天过海 读起
          <ArrowRight />
        </Link>
      </div>

      <footer className="mt-16 text-sm leading-relaxed text-muted">
        这是一份独立导读。原文、注释、译文照录太极书馆《三十六计》，解析是本站自己写的，不替代原书。
      </footer>
    </article>
  );
}
