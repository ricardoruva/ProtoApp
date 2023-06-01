import 'src/styles/reset.css';
import 'src/styles/body.css';
import 'public/fonts/fonts.css';

import type { AppProps } from 'next/app'

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}
