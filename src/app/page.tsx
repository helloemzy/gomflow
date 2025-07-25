import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">
          Group Order Management for K-pop Fans
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          Join group orders, verify payments, and manage shipping across Southeast Asia
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/browse">
            <Button size="lg">Browse Orders</Button>
          </Link>
          <Link href="/become-gom">
            <Button variant="outline" size="lg">Become a GOM</Button>
          </Link>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <Card>
          <CardHeader>
            <CardTitle>For Buyers</CardTitle>
            <CardDescription>Join group orders and track your purchases</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li>• Browse available group orders</li>
              <li>• Secure payment with proof upload</li>
              <li>• Track your order status</li>
              <li>• Get shipping updates</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>For GOMs</CardTitle>
            <CardDescription>Manage group orders efficiently</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li>• Create group orders with MOQ</li>
              <li>• Verify payment proofs</li>
              <li>• Manage shipping & tracking</li>
              <li>• Support multiple payment methods</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Multi-Country Support</CardTitle>
            <CardDescription>Payment methods for 10 countries</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li>• Southeast Asia: PH, MY, ID, TH, SG</li>
              <li>• East Asia: HK</li>
              <li>• Western: US, CA, GB, AU</li>
              <li>• Local payment methods supported</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Recent Orders</h2>
        <p className="text-muted-foreground mb-4">Check out what's available now</p>
        <Link href="/browse">
          <Button variant="outline">View All Orders</Button>
        </Link>
      </div>
    </div>
  );
}