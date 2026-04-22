export const prerender = false;

export async function GET({ redirect, url, locals }) {
  // Try to get env from Cloudflare runtime, then fallback to process.env (for local dev)
  const env = locals?.runtime?.env || process.env;
  const client_id = env.GITHUB_CLIENT_ID;
  
  if (!client_id) {
    return new Response("Configuration Error: GITHUB_CLIENT_ID is missing.", { status: 500 });
  }

  const scope = "repo,user";
  const redirect_uri = `${url.origin}/auth/callback`;
  
  return redirect(
    `https://github.com/login/oauth/authorize?client_id=${client_id}&scope=${scope}&redirect_uri=${redirect_uri}`
  );
}
