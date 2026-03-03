import type { Metadata } from 'next';
import Component from '@/components/tools/PdfToImages';

export const metadata: Metadata = {
  title: "PDF to Images Online Free | AIOpdf",
  description: "Securely pdf to images directly in your browser. Zero uploads, maximum privacy.",
};

import { Suspense } from 'react';

export default function Page() {
  return (
    <>
      <Suspense fallback={<div className="flex min-h-[60vh] items-center justify-center p-12 text-sm text-muted-foreground">Loading tool interface...</div>}>
        <Component />
      </Suspense>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "PDF to Images - AIOpdf",
            "operatingSystem": "All",
            "applicationCategory": "BusinessApplication",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            }
          })
        }}
      />
    </>
  );
}
