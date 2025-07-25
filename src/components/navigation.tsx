'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/lib/auth'

export function Navigation() {
  const { user, profile, loading, signOut } = useAuth()

  if (loading) {
    return (
      <nav className="border-b">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-primary">
            GOMFLOW
          </Link>
          <div>Loading...</div>
        </div>
      </nav>
    )
  }

  return (
    <nav className="border-b">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-primary">
          GOMFLOW
        </Link>
        
        <div className="flex items-center gap-4">
          <Link href="/track">
            <Button variant="ghost">Track Order</Button>
          </Link>
          
          {user ? (
            <>
              {profile?.is_gom ? (
                <Link href="/dashboard">
                  <Button variant="ghost">Dashboard</Button>
                </Link>
              ) : (
                <Link href="/become-gom">
                  <Button variant="ghost">Become GOM</Button>
                </Link>
              )}
              <Button variant="outline" onClick={signOut}>
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="outline">Login</Button>
              </Link>
              <Link href="/become-gom">
                <Button>Become GOM</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}