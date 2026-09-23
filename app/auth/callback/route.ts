import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const DEPLOYED_SITE_URL = 'https://study-room-platform.vercel.app'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'

  // If the request was routed via localhost, redirect to the live deployed site
  const baseUrl = origin.includes('localhost')
    ? (process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') || DEPLOYED_SITE_URL)
    : origin

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      return NextResponse.redirect(`${baseUrl}${next}`)
    }
  }

  // Something went wrong — redirect to login with error
  return NextResponse.redirect(`${baseUrl}/auth/login?error=auth_callback_failed`)
}
