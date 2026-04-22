export const prerender = false;

export async function GET(context) {
  try {
    const { url, locals } = context;
    
    // Cloudflare environment variables can be in several places depending on the Astro/adapter version
    const env = locals?.runtime?.env || (globalThis as any);
    const client_id = env?.GITHUB_CLIENT_ID;

    if (!client_id) {
      const availableKeys = Object.keys(env).filter(k => k.includes("GITHUB") || k.includes("CLIENT"));
      return new Response(`
        <html>
          <body style="font-family: sans-serif; padding: 2rem;">
            <h1 style="color: #D80041;">Configuration Error</h1>
            <p><strong>GITHUB_CLIENT_ID</strong> was not found in the environment.</p>
            <p><strong>Diagnostic Info:</strong></p>
            <ul>
              <li>Locals present: ${!!locals}</li>
              <li>Runtime present: ${!!locals?.runtime}</li>
              <li>Env present: ${!!locals?.runtime?.env}</li>
              <li>Keys found in env: ${availableKeys.join(", ") || "none"}</li>
            </ul>
            <p>Please ensure you have added <code>GITHUB_CLIENT_ID</code> as an environment variable in your Cloudflare Pages dashboard.</p>
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
    return new Response(`Critical Crash: ${err.message}\nStack: ${err.stack}`, { status: 500 });
  }
}
