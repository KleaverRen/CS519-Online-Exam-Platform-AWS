// lib/auth.ts
import qs from "querystring";

const domain = process.env.COGNITO_DOMAIN!;
const clientId = process.env.COGNITO_CLIENT_ID!;
const redirectUri = process.env.COGNITO_REDIRECT_URI!;
const logoutRedirectUri = process.env.COGNITO_LOGOUT_REDIRECT_URI!;
const clientSecret = process.env.COGNITO_CLIENT_SECRET; // optional

export function getHostedLoginUrl() {
  const params = new URLSearchParams({
    client_id: clientId,
    response_type: "code",
    scope: "email openid phone",
    redirect_uri: redirectUri,
  });
  return `${domain}/login?${params.toString()}`;
}

export function getHostedLogoutUrl() {
  const params = new URLSearchParams({
    client_id: clientId,
    logout_uri: logoutRedirectUri,
  });
  return `${domain}/logout?${params.toString()}`;
}

export async function exchangeCodeForTokens(code: string) {
  const tokenUrl = `${domain}/oauth2/token`;

  const body = qs.stringify({
    grant_type: "authorization_code",
    client_id: clientId,
    code,
    redirect_uri: redirectUri,
  });

  const headers: Record<string, string> = {
    "Content-Type": "application/x-www-form-urlencoded",
  };

  // If you use a client secret, use basic auth
  if (clientSecret) {
    const basic = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
    headers["Authorization"] = `Basic ${basic}`;
  }

  const res = await fetch(tokenUrl, {
    method: "POST",
    headers,
    body,
  });

  if (!res.ok) {
    console.error("Token exchange failed", await res.text());
    throw new Error("Failed to exchange code for tokens");
  }

  return res.json() as Promise<{
    id_token: string;
    access_token: string;
    refresh_token?: string;
    expires_in: number;
    token_type: string;
  }>;
}