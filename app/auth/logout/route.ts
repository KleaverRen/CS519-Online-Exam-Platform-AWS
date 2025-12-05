// app/auth/logout/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getHostedLogoutUrl } from "../../../lib/auth";

export async function GET(req: NextRequest) {
  const res = NextResponse.redirect(getHostedLogoutUrl());

  res.cookies.set("id_token", "", { maxAge: 0, path: "/" });
  res.cookies.set("access_token", "", { maxAge: 0, path: "/" });

  return res;
}