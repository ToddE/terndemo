export const prerender = false;

export async function GET({ url, locals }) {
  const code = url.searchParams.get("code");
  const env = locals?.runtime?.env || process.env;
  const client_id = env?.GITHUB_CLIENT_ID;
  const client_secret = env?.GITHUB_CLIENT_SECRET;

  if (!client_id || !client_secret) {
    return new Response("Configuration Error: GITHUB_CLIENT_ID or SECRET missing.", { status: 500 });
  }

  if (!code) {
    return new Response("Error: No code provided from GitHub.", { status: 400 });
  }

  try {
    const response = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "User-Agent": "Astro-Decap-CMS-Proxy"
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

    // Prepare the script payload carefully
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
              console.log("CMS Handshake received from:", e.origin);
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
    return new Response(`Proxy Error: ${err.message}`, { status: 500 });
  }
}
