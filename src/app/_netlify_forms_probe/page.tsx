export const dynamic = 'force-static';

export default function NetlifyFormsProbe() {
  return (
    <html>
      <body>
        {/* Hidden page whose sole purpose is to let Netlify detect the form at build time */}
        <form name="airdrop" method="POST" data-netlify="true" netlify-honeypot="bot-field" hidden>
          <input type="hidden" name="form-name" value="airdrop" />
          <input type="text" name="walletAddress" />
          <input type="email" name="email" />
          <input type="text" name="userAgent" />
          <input type="text" name="timestamp" />
          <input type="text" name="bot-field" />
        </form>
      </body>
    </html>
  );
}


