import { createServerSupabaseClient } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const supabase = await createServerSupabaseClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error && data.user) {
      // Check if profile exists, create if not
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single()

      if (!profile) {
        // Create profile for new user
        const profileData: any = {
          id: data.user.id,
          email: data.user.email!,
          is_gom: false
        }

        // Add Discord info if available
        if (data.user.app_metadata?.provider === 'discord') {
          profileData.discord_id = data.user.user_metadata?.provider_id
          profileData.discord_username = data.user.user_metadata?.full_name
        }

        await supabase.from('profiles').insert(profileData)
      }

      // Redirect to dashboard
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  // Return the user to an error page with instructions
  return NextResponse.redirect(new URL('/auth/auth-code-error', request.url))
}