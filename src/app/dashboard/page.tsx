'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/lib/auth'
import { getOrdersByGom } from '@/lib/database'
import { Order } from '@/lib/supabase'

export default function DashboardPage() {
  const { user, profile, loading } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [ordersLoading, setOrdersLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
      return
    }

    if (!loading && profile && !profile.is_gom) {
      router.push('/become-gom')
      return
    }

    if (user && profile?.is_gom) {
      getOrdersByGom(user.id).then((data) => {
        setOrders(data)
        setOrdersLoading(false)
      })
    }
  }, [user, profile, loading, router])

  if (loading || !user || !profile) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open':
        return <Badge variant="secondary">Open</Badge>
      case 'moq_met':
        return <Badge variant="default">MOQ Met</Badge>
      case 'closed':
        return <Badge variant="outline">Closed</Badge>
      case 'cancelled':
        return <Badge variant="destructive">Cancelled</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">GOM Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back! Manage your group orders here.
            </p>
          </div>
          <Link href="/dashboard/orders/new">
            <Button>Create New Order</Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Your Orders</CardTitle>
            <CardDescription>
              {ordersLoading ? 'Loading...' : `${orders.length} total orders`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {ordersLoading ? (
              <p>Loading orders...</p>
            ) : orders.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">
                  You haven't created any orders yet.
                </p>
                <Link href="/dashboard/orders/new">
                  <Button>Create Your First Order</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{order.product_name}</h3>
                        {getStatusBadge(order.status)}
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">
                        {order.current_order_count} / {order.minimum_order_quantity} orders
                        • ${order.price} {order.currency}
                        • {order.country}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Deadline: {new Date(order.deadline).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Link href={`/order/${order.shareable_slug}`}>
                        <Button variant="outline" size="sm">View</Button>
                      </Link>
                      <Link href={`/dashboard/orders/${order.id}`}>
                        <Button size="sm">Manage</Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Active Orders</span>
                  <span className="font-medium">
                    {orders.filter(o => o.status === 'open' || o.status === 'moq_met').length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Total Orders</span>
                  <span className="font-medium">{orders.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Completed</span>
                  <span className="font-medium">
                    {orders.filter(o => o.status === 'closed').length}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pending Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <p>• Payment verifications needed</p>
                <p>• Shipping updates required</p>
                <p>• Orders approaching deadline</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href="/dashboard/orders/new" className="block">
                <Button variant="outline" size="sm" className="w-full">
                  Create Order
                </Button>
              </Link>
              <Link href="/dashboard/verify" className="block">
                <Button variant="outline" size="sm" className="w-full">
                  Verify Payments
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}