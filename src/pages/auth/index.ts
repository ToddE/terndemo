export const prerender = false;

// @ts-ignore
import { env as cfEnv } from 'cloudflare:workers';

export async function GET(context) {
  try {
    const { url } = context;
    
    // Attempting the method suggested by the Astro 6 error message
    const env = cfEnv;
    const client_id = env?.GITHUB_CLIENT_ID;

    if (!client_id) {
      return new Response(`
        <html>
          <body style="font-family: sans-serif; padding: 2rem;">
            <h1 style="color: #D80041;">Configuration Error</h1>
            <p><strong>GITHUB_CLIENT_ID</strong> was not found in the environment.</p>
            <hr>
            <p><strong>Diagnostic Info:</strong></p>
            <p>We tried using <code>import { env } from 'cloudflare:workers'</code> as suggested by the error.</p>
            <p>Keys found: ${Object.keys(env || {}).join(", ") || "none"}</p>
          </body>
        </html>
      `, { 
        status: 500,
        headers: { "Content-Type": "text/html" }
      });
    }

    const scope = "repo,user";
    const redirect_uri = `${url.origin}/auth/callback`;
    
    return context.redirect(
      `https://github.com/login/oauth/authorize?client_id=${client_id}&scope=${scope}&redirect_uri=${redirect_uri}`
    );
  } catch (err) {
    return new Response(`Astro 6 Virtual Module Error: ${err.message}`, { status: 500 });
  }
}
