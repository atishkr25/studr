'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { resetPasswordAction, type AuthState } from '@/app/auth/actions'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, AlertCircle, Lock } from 'lucide-react'

const initialState: AuthState = {}

export default function ResetPasswordPage() {
  const [state, formAction, pending] = useActionState(resetPasswordAction, initialState)

  return (
    <div className="min-h-screen bg-[#f9f6f2] flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Elegant Organic Blurred Highlights */}
      <div className="absolute top-[20%] left-[10%] w-[300px] h-[300px] bg-[#0A7C6E]/10 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-[20%] right-[10%] w-[350px] h-[350px] bg-[#000015]/5 rounded-full blur-[150px] pointer-events-none z-0" />

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center justify-center w-12 h-12 rounded-[5px] border border-[#e7e7e7] mb-3.5 text-[#141414] bg-white">
            <Lock className="w-6 h-6 text-[#262626]" />
          </div>
          <h1 className="text-heading-sm font-semibold text-[#141414] tracking-tight">StudyRoom</h1>
          <p className="text-[#737373] text-[13px] mt-1">Set a new secure password</p>
        </div>

        <Card className="border border-[#e7e7e7] bg-white shadow-none rounded-[10px]">
          <CardHeader className="pb-4">
            <CardTitle className="text-heading-sm text-[#141414] font-semibold tracking-tight">
              Create new password
            </CardTitle>
            <CardDescription className="text-[#4e4d4c] text-[13px] tracking-normal font-normal">
              Enter and confirm your new password below.
            </CardDescription>
          </CardHeader>

          <CardContent>
            {/* Error message */}
            {state.error && (
              <div className="flex items-start gap-2.5 rounded-[5px] border border-[#cc3737]/20 bg-[#f4eee5] px-3.5 py-3 text-[#cc3737] text-[13px] font-normal mb-4">
                <AlertCircle className="w-4.5 h-4.5 mt-0.5 shrink-0 text-[#cc3737]" />
                <span className="leading-relaxed">{state.error}</span>
              </div>
            )}

            <form action={formAction} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password" className="text-[#4e4d4c] text-[13px] font-medium">
                  New Password
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  autoComplete="new-password"
                  minLength={6}
                  className="bg-white border border-[#e7e7e7] text-[#141414] placeholder:text-[#a1a1a1] focus-visible:ring-1 focus-visible:ring-[#0A7C6E] focus-visible:border-[#141414] rounded-[5px] h-11 text-[14px] font-normal shadow-none"
                />
                <p className="text-[12px] text-[#737373]">Must be at least 6 characters</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm_password" className="text-[#4e4d4c] text-[13px] font-medium">
                  Confirm New Password
                </Label>
                <Input
                  id="confirm_password"
                  name="confirm_password"
                  type="password"
                  placeholder="••••••••"
                  required
                  autoComplete="new-password"
                  minLength={6}
                  className="bg-white border border-[#e7e7e7] text-[#141414] placeholder:text-[#a1a1a1] focus-visible:ring-1 focus-visible:ring-[#0A7C6E] focus-visible:border-[#141414] rounded-[5px] h-11 text-[14px] font-normal shadow-none"
                />
              </div>

              <button
                id="update-password-submit"
                type="submit"
                disabled={pending}
                className="btn-evernote-primary w-full h-11 text-[14px] mt-3.5 justify-center cursor-pointer shadow-none font-semibold"
              >
                {pending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin text-white" />
                    Updating password…
                  </>
                ) : (
                  'Update password'
                )}
              </button>
            </form>

            <div className="mt-6 flex items-center justify-center gap-4 text-[13px]">
              <Link
                href="/dashboard"
                className="text-[#0A7C6E] hover:text-[#086358] font-semibold hover:underline"
              >
                Go to Dashboard →
              </Link>
              <span className="text-[#d1d1d1]">•</span>
              <Link
                href="/auth/login"
                className="text-[#4e4d4c] hover:text-[#141414] font-medium hover:underline"
              >
                Back to sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
