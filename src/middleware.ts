import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const protectedRoutes = ["/dashboard", "/workspace", "/mentor", "/portfolio", "/community", "/templates", "/onboarding"];

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "",
    {
      cookies: {
        getAll: () => req.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value }) => req.cookies.set(name, value));
          cookiesToSet.forEach(({ name, value, options }) => res.cookies.set(name, value, options));
        }
      }
    }
  );

  const { data } = await supabase.auth.getUser();
  const isProtected = protectedRoutes.some((route) => req.nextUrl.pathname.startsWith(route));
  if (!data.user && isProtected) {
    return NextResponse.redirect(new URL("/auth", req.url));
  }
  return res;
}

export const config = {
  matcher: ["/dashboard/:path*", "/workspace/:path*", "/mentor/:path*", "/portfolio/:path*", "/community/:path*", "/templates/:path*", "/onboarding/:path*"]
};
