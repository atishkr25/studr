'use server'

import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { createClient } from '@/lib/supabase/server'

export type AuthState = {
  error?: string
  message?: string
}

export async function loginAction(
  _prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    return { error: 'Email and password are required.' }
  }

  try {
    const supabase = await createClient()

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      if (error.message?.includes('fetch failed') || (error as any).status === 0) {
        return {
          error:
            'Unable to connect to the authentication service. Your Supabase project may be paused or unreachable.',
        }
      }
      return { error: error.message }
    }
  } catch (err: any) {
    if (err?.message?.includes('NEXT_REDIRECT') || err?.digest?.includes('NEXT_REDIRECT')) {
      throw err
    }
    return {
      error:
        'Unable to reach the authentication service. Please check your Supabase connection.',
    }
  }

  redirect('/dashboard')
}

export async function signupAction(
  _prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const email = (formData.get('email') as string)?.trim().toLowerCase()
  const password = formData.get('password') as string
  const fullName = (formData.get('full_name') as string)?.trim()
  const username = (formData.get('username') as string)?.trim().toLowerCase()

  if (!email || !password || !username) {
    return { error: 'Email, username, and password are required.' }
  }

  if (password.length < 6) {
    return { error: 'Password must be at least 6 characters.' }
  }

  try {
    const supabase = await createClient()

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          username,
        },
      },
    })

    if (error) {
      if (error.message?.includes('fetch failed') || (error as any).status === 0) {
        return {
          error:
            'Unable to connect to the authentication service. Your Supabase project may be paused or unreachable.',
        }
      }
      return { error: error.message }
    }
  } catch (err: any) {
    if (err?.message?.includes('NEXT_REDIRECT') || err?.digest?.includes('NEXT_REDIRECT')) {
      throw err
    }
    return {
      error:
        'Unable to reach the authentication service. Please check your Supabase connection.',
    }
  }

  redirect('/dashboard')
}

export async function signOutAction() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/auth/login')
}

const DEPLOYED_SITE_URL = 'https://study-room-platform.vercel.app'

export async function forgotPasswordAction(
  _prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const email = (formData.get('email') as string)?.trim()

  if (!email) {
    return { error: 'Email address is required.' }
  }

  try {
    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') || DEPLOYED_SITE_URL

    const supabase = await createClient()

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${siteUrl}/auth/callback?next=/auth/reset-password`,
    })

    if (error) {
      if (error.message?.includes('fetch failed') || (error as any).status === 0) {
        return {
          error:
            'Unable to connect to the authentication service. Your Supabase project may be paused or unreachable.',
        }
      }
      return { error: error.message }
    }

    return {
      message:
        'If an account exists with this email, a password reset link has been sent. Please check your inbox.',
    }
  } catch (err: any) {
    return {
      error:
        'Unable to send reset email. Please verify your connection or try again later.',
    }
  }
}

export async function resetPasswordAction(
  _prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const password = formData.get('password') as string
  const confirmPassword = formData.get('confirm_password') as string

  if (!password || !confirmPassword) {
    return { error: 'Please enter and confirm your new password.' }
  }

  if (password.length < 6) {
    return { error: 'Password must be at least 6 characters long.' }
  }

  if (password !== confirmPassword) {
    return { error: 'Passwords do not match.' }
  }

  try {
    const supabase = await createClient()

    const { error } = await supabase.auth.updateUser({
      password,
    })

    if (error) {
      if (error.message?.includes('fetch failed') || (error as any).status === 0) {
        return {
          error:
            'Unable to connect to the authentication service. Your Supabase project may be paused or unreachable.',
        }
      }
      return { error: error.message }
    }
  } catch (err: any) {
    if (err?.message?.includes('NEXT_REDIRECT') || err?.digest?.includes('NEXT_REDIRECT')) {
      throw err
    }
    return {
      error:
        'Failed to update password. Your reset session may have expired.',
    }
  }

  redirect('/dashboard')
}
