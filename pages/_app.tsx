import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Toaster } from 'react-hot-toast';
import { Metadata } from 'next';
import Head from 'next/head'
import { Analytics } from "@vercel/analytics/react"


export default function App({ Component, pageProps }: AppProps) {
  return <>
    <Head>
      <title>Huh, What if...</title>
      <meta name="description" content="Imagine what could be possible if you knew the answer to the unknown" />

      {/* Open Graph Meta Tags */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://huh-whatif.vercel.app" />
      <meta property="og:title" content="Huh, What if..." />
      <meta property="og:description" content="Imagine what could be possible if you knew the answer to the unknown" />
      <meta property="og:image" content="https://cloud-8tz3eq9yk-hack-club-bot.vercel.app/0image.png" />
      <meta property="og:image:alt" content="Huh, What if..." />
      <script defer src="https://umami.hrichik.xyz/script.js" data-website-id="0a20bdb6-769c-432a-9d10-b60eca839914"></script>
    </Head>

  <Component {...pageProps} />
  <Analytics/>
  <Toaster/>
  </>;
}
