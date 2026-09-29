import type { Metadata } from "next";
import { OverviewView } from "@/components/overview-view";
import { ReadingShell } from "@/components/reading-shell";

export const metadata: Metadata = {
  title: "三十六计，按处境取用",
  description:
    "《三十六计》导读。每一计先放原文、注释、译文，再按先理解、核心观点、重建逻辑、简单表达、自我检查五步讲明白。",
};

export default function HomePage() {
  return (
    <ReadingShell current="start">
      <OverviewView />
    </ReadingShell>
  );
}
