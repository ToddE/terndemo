export const prerender = false;

export async function GET({ url, locals }) {
  const code = url.searchParams.get("code");
  const env = locals.runtime.env;
  const client_id = env.GITHUB_CLIENT_ID;
  const client_secret = env.GITHUB_CLIENT_SECRET;

  try {
    const response = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        client_id,
        client_secret,
        code,
      }),
    });

    const data = await response.json();

    if (data.error) {
      return new Response(`Error: ${data.error_description}`, { status: 400 });
    }

    // This script sends the token back to the Decap CMS window
    const content = `
      <html>
        <body>
          <script>
            (function() {
              function recieveMessage(e) {
                console.log("Recieved message:", e.data);
                window.opener.postMessage(
                  'authorization:github:success:${JSON.stringify(data)}',
                  e.origin
                );
              }
              window.addEventListener("message", recieveMessage, false);
              window.opener.postMessage("authorizing:github", "*");
            })()
          </script>
        </body>
      </html>
    `;

    return new Response(content, {
      headers: { "Content-Type": "text/html" },
    });
  } catch (err) {
    return new Response(`Internal Server Error: ${err.message}`, { status: 500 });
  }
}
