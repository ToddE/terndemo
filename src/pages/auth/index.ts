export const prerender = false;

export async function GET({ redirect, url, locals }) {
  const env = locals?.runtime?.env || process.env;
  const client_id = env?.GITHUB_CLIENT_ID;

  if (!client_id) {
    return new Response(`
      <h1>Configuration Error</h1>
      <p>GITHUB_CLIENT_ID is not defined in the environment.</p>
      <p>Current environment keys: ${Object.keys(env || {}).join(", ")}</p>
    `, { 
      status: 500,
      headers: { "Content-Type": "text/html" }
    });
  }

  const scope = "repo,user";
  const redirect_uri = `${url.origin}/auth/callback`;
  
  return redirect(
    `https://github.com/login/oauth/authorize?client_id=${client_id}&scope=${scope}&redirect_uri=${redirect_uri}`
  );
}
