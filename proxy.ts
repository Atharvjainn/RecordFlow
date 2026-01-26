// middleware.ts
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import {auth} from './lib/auth'

export async function proxy(req: NextRequest) {
  const session = await auth.api.getSession({
    headers: req.headers,
  })

  if (!session?.user) {
    return NextResponse.redirect(new URL("/", req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*"],
}
