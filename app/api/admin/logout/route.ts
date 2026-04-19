import { NextResponse } from "next/server";
import { cookies } from "next/headers";

async function clearSessionAndRedirect(request: Request) {
  const cookieStore = await cookies();

  cookieStore.set("admin_session", "", {
    path: "/",
    maxAge: 0,
  });

  return NextResponse.redirect(new URL("/admin/login", request.url));
}

export async function GET(request: Request) {
  return clearSessionAndRedirect(request);
}

export async function POST(request: Request) {
  return clearSessionAndRedirect(request);
}