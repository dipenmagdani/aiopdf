import Link from "next/link";
import { FileText } from "lucide-react";
import { toolsConfig } from "@/lib/toolsConfig";
import { RelativeTime } from "@/components/ui/relative-time";
import { Suspense } from "react";
export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/20 py-12">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <Link
              href="/"
              className="flex items-center gap-2 font-bold text-lg"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[hsl(var(--gradient-start))] to-[hsl(var(--gradient-end))]">
                <FileText className="h-4 w-4 text-white" />
              </div>
              <span className="font-mono">AIOpdf</span>
            </Link>
            <p className="text-sm text-muted-foreground mt-4 leading-relaxed">
              Professional PDF tools that run entirely in your browser. Zero
              uploads, maximum privacy.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-3 text-sm tracking-wider uppercase text-foreground/80">
              Tools
            </h4>
            <ul className="space-y-2">
              {toolsConfig.slice(0, 5).map((t) => (
                <li key={t.id}>
                  <Link
                    href={t.route}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {t.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3 text-sm tracking-wider uppercase text-foreground/80">
              More Tools
            </h4>
            <ul className="space-y-2">
              {toolsConfig.slice(5).map((t) => (
                <li key={t.id}>
                  <Link
                    href={t.route}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {t.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3 text-sm tracking-wider uppercase text-foreground/80">
              Product
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/editor"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  PDF Editor
                </Link>
              </li>
              <li>
                <Link
                  href="/tools"
                  className="text-sm text-muted-foreground hover:text-foreground hover:translate-x-1 inline-block transition-all"
                >
                  All Tools
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          ©{" "}
          <Suspense fallback={<span>2026</span>}>
            <RelativeTime />
          </Suspense>{" "}
          AIOpdf. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
