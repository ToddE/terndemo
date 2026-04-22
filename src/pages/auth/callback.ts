export const prerender = false;

// @ts-ignore
import { env as cfEnv } from 'cloudflare:workers';

export async function GET(context) {
  let step = "Initializing";
  try {
    const { url } = context;
    const code = url.searchParams.get("code");
    const env = cfEnv;
    const client_id = env?.GITHUB_CLIENT_ID;
    const client_secret = env?.GITHUB_CLIENT_SECRET;

    if (!client_id || !client_secret) {
      return new Response("Missing GITHUB_CLIENT_ID or GITHUB_CLIENT_SECRET in environment.", { status: 500 });
    }

    if (!code) {
      return new Response("No code provided from GitHub.", { status: 400 });
    }

    step = "Exchanging code for token";
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
      return new Response(`GitHub Error (${data.error}): ${data.error_description}`, { status: 400 });
    }

    step = "Preparing Handshake";
    const payload = JSON.stringify({
      token: data.access_token,
      provider: "github"
    });

    // We use a simplified script that works with most Decap/Netlify CMS versions
    const content = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Authorizing...</title>
        <style>
          body { font-family: sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; margin: 0; background: #f4f7f9; }
          .loader { border: 4px solid #f3f3f3; border-top: 4px solid #D80041; border-radius: 50%; width: 30px; height: 30px; animation: spin 1s linear infinite; margin-bottom: 1rem; }
          @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        </style>
      </head>
      <body>
        <div class="loader"></div>
        <p id="status">Finalizing authentication...</p>
        <script>
          (function() {
            const payload = ${payload};
            const message = "authorization:github:success:" + JSON.stringify(payload);
            
            function postToOpener() {
              if (window.opener) {
                console.log("Sending token to opener...");
                window.opener.postMessage(message, "*");
                document.getElementById('status').innerText = "Authentication successful! Closing window...";
                // Some versions of CMS require a slight delay before closing
                setTimeout(() => window.close(), 1000);
              } else {
                document.getElementById('status').innerText = "Error: Opener window lost.";
              }
            }

            // Listen for the handshake from the CMS
            window.addEventListener("message", function(e) {
              console.log("Received handshake from CMS");
              postToOpener();
            }, false);

            // Also try sending immediately in case the CMS is already listening
            window.opener.postMessage("authorizing:github", "*");
            postToOpener();
          })();
        </script>
      </body>
      </html>
    `;

    return new Response(content, {
      headers: { "Content-Type": "text/html" },
    });
  } catch (err) {
    return new Response(`Proxy Error at step [${step}]: ${err.message}`, { status: 500 });
  }
}
