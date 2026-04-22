export const prerender = false;

export async function GET(context) {
  try {
    const { url, locals } = context;
    
    // In Astro 6, the runtime is available directly on context.locals.runtime
    // But we will be extra careful.
    const runtime = locals.runtime;
    const env = runtime?.env;
    
    const client_id = env?.GITHUB_CLIENT_ID;

    if (!client_id) {
      return new Response(`
        <html>
          <body style="font-family: sans-serif; padding: 2rem;">
            <h1 style="color: #D80041;">Configuration Error</h1>
            <p><strong>GITHUB_CLIENT_ID</strong> was not found in the environment.</p>
            <hr>
            <p><strong>Debug Info:</strong></p>
            <pre>${JSON.stringify({
              hasLocals: !!locals,
              hasRuntime: !!locals?.runtime,
              envKeys: Object.keys(env || {})
            }, null, 2)}</pre>
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
    return new Response(`Astro 6 Error: ${err.message}`, { status: 500 });
  }
}
