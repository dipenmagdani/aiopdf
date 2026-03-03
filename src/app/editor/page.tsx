import Component from "@/pages/Editor";

import { Suspense } from 'react';

export default function Page() {
  return <Suspense fallback={<div className="flex min-h-screen items-center justify-center p-12 text-sm text-muted-foreground">Loading editor...</div>}>
      <Component />
    </Suspense>;
}
