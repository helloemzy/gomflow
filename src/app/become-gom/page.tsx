'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useAuth } from '@/lib/auth'
import { updateProfile } from '@/lib/database'
import { COUNTRIES } from '@/constants/payment-methods'

export default function BecomeGomPage() {
  const { user, profile } = useAuth()
  const [selectedCountry, setSelectedCountry] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleActivateGom = async () => {
    if (!user || !selectedCountry) return

    setLoading(true)
    try {
      await updateProfile(user.id, { is_gom: true })
      router.push('/dashboard')
    } catch (error) {
      console.error('Error activating GOM:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-md">
        <Card>
          <CardHeader className="text-center">
            <CardTitle>Become a GOM</CardTitle>
            <CardDescription>
              You need to sign in first to become a Group Order Manager
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => router.push('/login')}
              className="w-full"
            >
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (profile?.is_gom) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-md">
        <Card>
          <CardHeader className="text-center">
            <CardTitle>You're already a GOM!</CardTitle>
            <CardDescription>
              You can create and manage group orders
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => router.push('/dashboard')}
              className="w-full"
            >
              Go to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <Card>
        <CardHeader className="text-center">
          <CardTitle>Become a GOM</CardTitle>
          <CardDescription>
            Group Order Managers create orders, verify payments, and handle shipping
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className="font-semibold">As a GOM you can:</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Create group orders with minimum quantities</li>
              <li>• Set deadlines and accept multiple payment methods</li>
              <li>• Verify payment proofs from buyers</li>
              <li>• Manage shipping and provide tracking numbers</li>
              <li>• Build trust in the K-pop community</li>
            </ul>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Primary Country</label>
            <Select value={selectedCountry} onValueChange={setSelectedCountry}>
              <SelectTrigger>
                <SelectValue placeholder="Select your country" />
              </SelectTrigger>
              <SelectContent>
                {COUNTRIES.map((country) => (
                  <SelectItem key={country.code} value={country.code}>
                    {country.flag} {country.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button 
            onClick={handleActivateGom}
            disabled={!selectedCountry || loading}
            className="w-full"
          >
            {loading ? 'Activating...' : 'Activate GOM Account'}
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            By becoming a GOM, you agree to handle orders responsibly and maintain 
            clear communication with buyers.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}