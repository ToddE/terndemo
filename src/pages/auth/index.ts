export const prerender = false;

export async function GET({ redirect, url, locals }) {
  const env = locals.runtime.env;
  const client_id = env.GITHUB_CLIENT_ID;
  const scope = "repo,user";
  
  // This is the URL that GitHub will redirect back to
  const redirect_uri = `${url.origin}/auth/callback`;
  
  return redirect(
    `https://github.com/login/oauth/authorize?client_id=${client_id}&scope=${scope}&redirect_uri=${redirect_uri}`
  );
}
