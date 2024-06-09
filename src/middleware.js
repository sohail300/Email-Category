import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
export { default } from "next-auth/middleware";

export const config = {
    matcher: [
        "/emailList",
        "/signin",
        "/",
    ],
};

export async function middleware(request) {
    const token = await getToken({ req: request });
    const url = request.nextUrl.pathname;

    const isPublic =
        url.startsWith("/signin") ||
        url === "/";

    if (token && isPublic) {
        return NextResponse.redirect(new URL("/emailList", request.url));
    }

    if (!token && !isPublic) {
        return NextResponse.redirect(new URL("/signin", request.url));
    }

    return NextResponse.next();
}
