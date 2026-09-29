import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-full max-w-xl flex-col justify-center px-6 py-24">
      <p className="text-sm font-semibold text-clay">目录里没有这一计</p>
      <h1 className="mt-3 font-serif text-4xl text-ink">页面不存在</h1>
      <p className="mt-4 leading-relaxed text-muted">
        从开篇读起，顺着胜战、敌战、攻战、混战、并战，走到败战。
      </p>
      <Link href="/" className={`${buttonVariants()} mt-8 w-fit`}>
        回到开篇
      </Link>
    </main>
  );
}
