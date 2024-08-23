import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Toaster } from 'react-hot-toast';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Huh, What if...',
  description: 'Imagine what could be possible if you knew the answer to the unknown',
  metadataBase: new URL('https://cloud-8tz3eq9yk-hack-club-bot.vercel.app'),
  openGraph: {
    type: 'website',
    url: 'https://huh-whatif.vercel.app',
    title: 'Huh, What if...',
    description: 'Imagine what could be possible if you knew the answer to the unknown',
    images: [
      {
        url: '/0image.png',
        width: 1545,
        height: 1545,
        alt: 'Huh, What if...',
      },
    ],
  },
};


export default function App({ Component, pageProps }: AppProps) {
  return <>
  <Component {...pageProps} />
  <Toaster/>
  </>;
}
