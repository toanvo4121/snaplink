// app/api/debug/route.ts

import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const h = await headers();

  return NextResponse.json({
    AUTH_URL: process.env.AUTH_URL,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    VERCEL_URL: process.env.VERCEL_URL,

    host: h.get("host"),
    xForwardedHost: h.get("x-forwarded-host"),
    xForwardedProto: h.get("x-forwarded-proto"),
  });
}