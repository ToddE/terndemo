export const prerender = false;

export async function GET(context) {
  try {
    const { url, locals } = context;
    const code = url.searchParams.get("code");
    const env = locals?.runtime?.env || (globalThis as any);
    const client_id = env?.GITHUB_CLIENT_ID;
    const client_secret = env?.GITHUB_CLIENT_SECRET;

    if (!client_id || !client_secret) {
      return new Response("Missing GITHUB_CLIENT_ID or GITHUB_CLIENT_SECRET in environment.", { status: 500 });
    }

    if (!code) {
      return new Response("No code provided from GitHub.", { status: 400 });
    }

    const response = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "User-Agent": "Tern-CMS-Proxy"
      },
      body: JSON.stringify({
        client_id,
        client_secret,
        code,
      }),
    });

    const data = await response.json();

    if (data.error) {
      return new Response(`GitHub Error: ${data.error_description || data.error}`, { status: 400 });
    }

    const payload = JSON.stringify({
      token: data.access_token,
      provider: "github"
    });

    const content = `
      <!DOCTYPE html>
      <html>
      <head><title>Authorizing...</title></head>
      <body>
        <script>
          (function() {
            function receiveMessage(e) {
              window.opener.postMessage("authorization:github:success:${payload}", e.origin);
            }
            window.addEventListener("message", receiveMessage, false);
            window.opener.postMessage("authorizing:github", "*");
          })();
        </script>
      </body>
      </html>
    `;

    return new Response(content, {
      headers: { "Content-Type": "text/html" },
    });
  } catch (err) {
    return new Response(`Critical Callback Crash: ${err.message}\nStack: ${err.stack}`, { status: 500 });
  }
}
