'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { getSubmissionByTrackingCode } from '@/lib/database'
import { Submission } from '@/lib/supabase'

export default function TrackPage() {
  const [trackingCode, setTrackingCode] = useState('')
  const [email, setEmail] = useState('')
  const [submission, setSubmission] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!trackingCode.trim()) return

    setLoading(true)
    setError('')
    setSubmission(null)

    try {
      const result = await getSubmissionByTrackingCode(trackingCode, email || undefined)
      if (result) {
        setSubmission(result)
      } else {
        setError('Order not found. Please check your tracking code and email.')
      }
    } catch (err) {
      setError('Error searching for order. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (submission: any) => {
    if (submission.shipped_at) {
      return <Badge variant="default">Shipped</Badge>
    } else if (submission.payment_verified) {
      return <Badge variant="secondary">Payment Verified</Badge>
    } else if (submission.payment_proof_url) {
      return <Badge variant="outline">Payment Pending</Badge>
    } else {
      return <Badge variant="destructive">Payment Required</Badge>
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">Track Your Order</h1>
        <p className="text-muted-foreground">
          Enter your tracking code to check your order status
        </p>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Order Tracking</CardTitle>
          <CardDescription>
            Enter your tracking code and email address (for guest orders)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleTrack} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="tracking-code">Tracking Code</Label>
              <Input
                id="tracking-code"
                placeholder="GOM-XXXXXXXX"
                value={trackingCode}
                onChange={(e) => setTrackingCode(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email (for guest orders)</Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? 'Searching...' : 'Track Order'}
            </Button>
          </form>

          {error && (
            <div className="mt-4 p-3 bg-destructive/10 text-destructive rounded-md text-sm">
              {error}
            </div>
          )}
        </CardContent>
      </Card>

      {submission && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Order Details
              {getStatusBadge(submission)}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold mb-2">Product Information</h3>
                <p className="text-sm">
                  <strong>Product:</strong> {submission.orders?.product_name}
                </p>
                <p className="text-sm">
                  <strong>Quantity:</strong> {submission.quantity}
                </p>
                <p className="text-sm">
                  <strong>Price:</strong> ${submission.orders?.price} {submission.orders?.currency}
                </p>
                <p className="text-sm">
                  <strong>Total:</strong> ${(submission.orders?.price * submission.quantity).toFixed(2)} {submission.orders?.currency}
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Order Status</h3>
                <p className="text-sm">
                  <strong>Payment Method:</strong> {submission.payment_method}
                </p>
                <p className="text-sm">
                  <strong>Payment Status:</strong> {submission.payment_verified ? 'Verified' : 'Pending'}
                </p>
                <p className="text-sm">
                  <strong>Order Date:</strong> {new Date(submission.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>

            {submission.tracking_number && (
              <div className="border-t pt-4">
                <h3 className="font-semibold mb-2">Shipping Information</h3>
                <p className="text-sm">
                  <strong>Tracking Number:</strong> {submission.tracking_number}
                </p>
                {submission.courier_service && (
                  <p className="text-sm">
                    <strong>Courier:</strong> {submission.courier_service}
                  </p>
                )}
                {submission.shipped_at && (
                  <p className="text-sm">
                    <strong>Shipped:</strong> {new Date(submission.shipped_at).toLocaleDateString()}
                  </p>
                )}
              </div>
            )}

            <div className="border-t pt-4">
              <h3 className="font-semibold mb-2">Order Progress</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Order placed</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${submission.payment_verified ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  <span>Payment verified</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${submission.tracking_number ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  <span>Shipped</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                  <span>Delivered</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}