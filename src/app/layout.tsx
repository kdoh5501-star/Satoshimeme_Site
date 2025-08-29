import type { Metadata } from "next";
import Script from "next/script";
import { EB_Garamond, Cinzel } from "next/font/google";
import "./globals.css";

const ebGaramond = EB_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-eb-garamond"
});

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cinzel"
});

export const metadata: Metadata = {
  title: "The Satoshi Code 2.0: From Code to Culture",
  description: "Continue the sacred teachings of Proof of Work given to us by Satoshi. Join the movement of true believers in decentralized truth and mathematical proof.",
  icons: {
    icon: [
      { url: "/favicon/favicon.ico", sizes: "any" },
      { url: "/favicon/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    shortcut: "/favicon/favicon.ico",
    apple: [
      { url: "/favicon/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  openGraph: {
    title: "The Satoshi Code 2.0: From Code to Culture",
    description: "Continue the sacred teachings of Proof of Work given to us by Satoshi. Join the movement of true believers in decentralized truth and mathematical proof.",
    url: "https://satoshimemes.com/",
    siteName: "SatoshiMeme",
    images: [
      {
        url: "https://satoshimemes.com/uploads/matadata.png?v=2025072020",
        width: 1568,
        height: 882,
        alt: "SatoshiMeme - The Millennium Kingdom: Final Revolution",
        type: "image/png",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@SatoshimemesCom",
    creator: "@SatoshimemesCom",
    title: "The Satoshi Code 2.0: From Code to Culture",
    description: "Continue the sacred teachings of Proof of Work given to us by Satoshi. Join the movement of true believers in decentralized truth and mathematical proof.",
    images: [
      {
        url: "https://satoshimemes.com/uploads/matadata.png?v=2025072020",
        alt: "SatoshiMeme - The Millennium Kingdom: Final Revolution",
      }
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" href="/favicon/favicon-16x16.png" sizes="16x16" />
        <link rel="icon" type="image/png" href="/favicon/favicon-32x32.png" sizes="32x32" />
        <link rel="shortcut icon" href="/favicon/favicon.ico" />

        <link rel="apple-touch-icon" href="/favicon/apple-touch-icon.png" sizes="180x180" />

        <link rel="icon" type="image/png" href="/favicon/android-chrome-192x192.png" sizes="192x192" />
        <link rel="icon" type="image/png" href="/favicon/android-chrome-512x512.png" sizes="512x512" />

        <meta name="theme-color" content="#FBBF24" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="SatoshiMeme" />

        <link rel="manifest" href="/manifest.json" />

        {/* Enhanced Open Graph for better SNS sharing */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="The Satoshi Code 2.0: From Code to Culture" />
        <meta property="og:description" content="Continue the sacred teachings of Proof of Work given to us by Satoshi. Join the movement of true believers in decentralized truth and mathematical proof." />
        <meta property="og:url" content="https://satoshimemes.com/" />
        <meta property="og:site_name" content="SatoshiMeme" />
        <meta property="og:image" content="https://satoshimemes.com/uploads/matadata.png?v=2025072020" />
        <meta property="og:image:secure_url" content="https://satoshimemes.com/uploads/matadata.png?v=2025072020" />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:width" content="1568" />
        <meta property="og:image:height" content="882" />
        <meta property="og:image:alt" content="SatoshiMeme - The Millennium Kingdom: Final Revolution" />
        <meta property="og:locale" content="en_US" />

        {/* Twitter Card - Optimized for better compatibility */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@SatoshimemesCom" />
        <meta name="twitter:creator" content="@SatoshimemesCom" />
        <meta name="twitter:title" content="The Satoshi Code 2.0: From Code to Culture" />
        <meta name="twitter:description" content="Continue the sacred teachings of Proof of Work given to us by Satoshi. Join the movement of true believers in decentralized truth and mathematical proof." />
        <meta name="twitter:image" content="https://satoshimemes.com/uploads/matadata.png?v=2025072020" />
        <meta name="twitter:image:alt" content="SatoshiMeme - The Millennium Kingdom: Final Revolution" />
        <meta name="twitter:image:width" content="1568" />
        <meta name="twitter:image:height" content="882" />

        {/* Facebook specific optimizations */}
        <meta property="fb:app_id" content="SatoshiMeme" />
        <meta property="article:author" content="SatoshiMeme Team" />

        {/* Telegram specific */}
        <meta name="telegram:channel" content="@SatoshiMeme" />

        {/* Additional meta for better crawling */}
        <meta name="description" content="Continue the sacred teachings of Proof of Work given to us by Satoshi. Join the movement of true believers in decentralized truth and mathematical proof." />
        <meta property="og:updated_time" content="2025-07-20T20:00:00Z" />
        <meta name="robots" content="index, follow, max-image-preview:large" />
        <meta name="generator" content="SatoshiMeme" />

        {/* Force cache invalidation */}
        <meta httpEquiv="cache-control" content="no-cache, no-store, must-revalidate" />
        <meta httpEquiv="pragma" content="no-cache" />
        <meta httpEquiv="expires" content="0" />

        <meta name="author" content="SatoshiMeme Team" />
        <meta name="keywords" content="Satoshi Nakamoto, Bitcoin, Cryptocurrency, Meme Coin, Blockchain, P2P, Decentralization, MicroBitcoin" />

        {/* Google Tag Manager */}
        <Script id="gtm-init" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${process.env.NEXT_PUBLIC_GTM_ID || 'GTM-XXXXXXX'}');`}
        </Script>
        {/* End Google Tag Manager */}

        {/* Google tag (gtag.js) */}
        <Script id="gtag-src" async src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ADS_ID || 'AW-17384712576'}`}/>
        <Script id="gtag-init" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ADS_ID || 'AW-17384712576'}');`}
        </Script>

        {/* Event snippet for 페이지 조회 conversion */}
        <Script id="gtag-events" strategy="afterInteractive">
          {`function gtag_report_conversion(url) {
              var callback = function () {
                if (typeof(url) != 'undefined') {
                  window.location = url;
                }
              };
              gtag('event', 'conversion', {
                  'send_to': 'AW-17384712576/VwpsCLS79_UaEIDT1uFA',
                  'value': 1.0,
                  'currency': 'KRW',
                  'event_callback': callback
              });
              return false;
            }
            function gtag_report_airdrop_conversion() {
              gtag('event', 'conversion', {
                  'send_to': 'AW-17384712576/airdrop_submission',
                  'value': 1.0,
                  'currency': 'KRW'
              });
              return false;
            }`}
        </Script>
        {/* End Google tag (gtag.js) */}
      </head>
      <body className={`${ebGaramond.variable} ${cinzel.variable} font-serif antialiased`}>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${process.env.NEXT_PUBLIC_GTM_ID || 'GTM-XXXXXXX'}`}
            height="0"
            width="0"
            style={{display: 'none', visibility: 'hidden'}}
          />
        </noscript>
        {/* End Google Tag Manager (noscript) */}
        {children}
      </body>
    </html>
  );
}
