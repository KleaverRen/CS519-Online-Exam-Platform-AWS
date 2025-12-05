// app/auth/callback/route.ts  (or whatever your callback route is)
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const COGNITO_DOMAIN = process.env.COGNITO_DOMAIN!;   // e.g. "https://your-domain.auth.us-west-2.amazoncognito.com"
const CLIENT_ID = process.env.COGNITO_CLIENT_ID!;
const CLIENT_SECRET = process.env.COGNITO_CLIENT_SECRET!;
const REDIRECT_URI = process.env.COGNITO_REDIRECT_URI!;  // e.g. "http://localhost:3000/auth/callback"

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  const error = req.nextUrl.searchParams.get("error");

  if (error || !code) {
    return NextResponse.redirect(new URL(`/?error=${encodeURIComponent(error || "login_failed")}`, req.url));
  }

  // Exchange code for tokens
  const tokenRes = await fetch(`${COGNITO_DOMAIN}/oauth2/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization:
        "Basic " + Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64"),
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      client_id: CLIENT_ID,
      code,
      redirect_uri: REDIRECT_URI,
    }),
  });

  if (!tokenRes.ok) {
    const text = await tokenRes.text();
    console.error("Token exchange failed:", tokenRes.status, text);
    return NextResponse.redirect(new URL("/?error=token_exchange_failed", req.url));
  }

  const tokens = await tokenRes.json();

  const idToken = tokens.id_token as string;
  const accessToken = tokens.access_token as string;
  const refreshToken = tokens.refresh_token as string | undefined;
  const expiresIn = Number(tokens.expires_in || 3600);

  const cookieStore = await cookies();
  const maxAge = expiresIn; // seconds

  // Store all tokens as httpOnly cookies
  cookieStore.set("id_token", idToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge,
  });

  cookieStore.set("access_token", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge,
  });

  if (refreshToken) {
    cookieStore.set("refresh_token", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 30 * 24 * 60 * 60, // for example
    });
  }

  // Redirect to dashboard or admin
  return NextResponse.redirect(new URL("/dashboard", req.url));
}