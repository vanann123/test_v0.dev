'use client'

import Script from 'next/script'

export function Analytics() {
  const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID

  if (!GA_TRACKING_ID) {
    return null
  }

  const handleLoad = () => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('js', new Date())
      window.gtag('config', GA_TRACKING_ID)
    }
  }

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
      />
      <Script
        id="gtag-init"
        strategy="afterInteractive"
        onLoad={handleLoad}
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_TRACKING_ID}');
          `,
        }}
      />
    </>
  )
}

export const trackEvent = (action: string, category: string, label?: string, value?: number) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    })
  }
}
