import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Boot Diagnostics Script */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(){
                const log = (...a) => {
                  try {
                    localStorage._bootlog = (localStorage._bootlog || '') + a.join(' ') + '\\n';
                  } catch(e) {}
                  console.log('[BOOT]', ...a);
                };
                
                window.onerror = (m, s, l, c, e) => log('onerror:', m, s + ':' + l, c, e?.stack || '');
                window.addEventListener('unhandledrejection', ev => log('unhandled:', ev.reason?.stack || ev.reason || ''));
                log('base', document.baseURI);
                log('location', location.href);
                log('timestamp', new Date().toISOString());
              })()
            `,
          }}
        />
        
        {/* Handle redirect from 404.html */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(){
                const redirect = sessionStorage.getItem('redirect');
                if (redirect) {
                  sessionStorage.removeItem('redirect');
                  history.replaceState(null, null, redirect);
                }
              })()
            `,
          }}
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
