GOMFLOW MVP - Build Instructions for Claude Code
Project Overview
Build a working group order management platform for Southeast Asian K-pop fans. GOMs (Group Order Managers) create orders, buyers join and pay, GOMs verify payments and ship items. Must work end-to-end with real data.
Quick Setup
npx create-next-app@latest gomflow --typescript --tailwind --app
cd gomflow
npm install @supabase/supabase-js @supabase/auth-helpers-nextjs
npx shadcn-ui@latest init
Database Schema (Supabase)
-- 1. Profiles (unified users)
create table profiles (
  id uuid primary key references auth.users(id),
  email text unique not null,
  discord_id text unique,
  discord_username text,
  is_gom boolean default false,
  created_at timestamp default now()
);

-- 2. Orders
create table orders (
  id uuid primary key default gen_random_uuid(),
  gom_id uuid references profiles(id) not null,
  
  -- Product info
  product_name text not null,
  product_description text,
  product_image_url text,
  price decimal(10,2) not null,
  currency text not null,
  
  -- Location & payments
  country text not null check (country in ('PH', 'MY', 'ID', 'TH', 'SG', 'HK', 'US', 'CA', 'GB', 'AU')),
  payment_methods jsonb not null,
  payment_details jsonb not null, -- GOM's payment account details
  
  -- Order requirements
  minimum_order_quantity integer not null,
  current_order_count integer default 0,
  status text default 'open',
  deadline timestamp not null,
  
  -- Tracking
  shareable_slug text unique not null,
  created_at timestamp default now()
);

-- 3. Submissions
create table submissions (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders(id) not null,
  
  -- Buyer info
  buyer_id uuid references profiles(id),
  guest_email text,
  tracking_code text unique,
  
  -- Order details
  quantity integer not null,
  payment_method text not null,
  payment_proof_url text,
  payment_verified boolean default false,
  
  -- Shipping
  tracking_number text,
  courier_service text,
  shipped_at timestamp,
  
  created_at timestamp default now(),
  
  constraint buyer_identification check (buyer_id is not null or guest_email is not null)
);

-- Enable RLS
alter table profiles enable row level security;
alter table orders enable row level security;
alter table submissions enable row level security;

-- Basic RLS policies
create policy "Anyone can view orders" on orders for select using (true);
create policy "Users can view own profile" on profiles for select using (auth.uid() = id);
create policy "GOMs can manage their orders" on orders for all using (auth.uid() = gom_id);
Core Features to Build (In Order)
1. Authentication (Discord + Email)
// app/(auth)/login/page.tsx
export default function LoginPage() {
  // Two options:
  // 1. Discord OAuth (for full features)
  // 2. Email (guest checkout with tracking code)
  
  // Discord users get profiles, email users get tracking codes
}
2. Payment Methods Configuration
// constants/payment-methods.ts
export const PAYMENT_METHODS = {
  // Southeast Asia
  PH: [
    { id: 'gcash', name: 'GCash', type: 'ewallet' },
    { id: 'bank_transfer', name: 'Bank Transfer', type: 'bank' }
  ],
  MY: [
    { id: 'bank_transfer', name: 'Bank Transfer', type: 'bank' },
    { id: 'touch_n_go', name: 'Touch n Go', type: 'ewallet' }
  ],
  ID: [
    { id: 'bank_transfer', name: 'Bank Transfer', type: 'bank' },
    { id: 'gopay', name: 'GoPay', type: 'ewallet' }
  ],
  TH: [
    { id: 'bank_transfer', name: 'Bank Transfer', type: 'bank' },
    { id: 'promptpay', name: 'PromptPay', type: 'qr' }
  ],
  SG: [
    { id: 'paynow', name: 'PayNow', type: 'qr' },
    { id: 'bank_transfer', name: 'Bank Transfer', type: 'bank' }
  ],
  
  // East Asia
  HK: [
    { id: 'fps', name: 'FPS', type: 'fps' },
    { id: 'payme', name: 'PayMe', type: 'ewallet' },
    { id: 'bank_transfer', name: 'Bank Transfer', type: 'bank' }
  ],
  
  // Western Countries
  US: [
    { id: 'venmo', name: 'Venmo', type: 'venmo' },
    { id: 'zelle', name: 'Zelle', type: 'zelle' },
    { id: 'paypal', name: 'PayPal', type: 'paypal' }
  ],
  CA: [
    { id: 'interac', name: 'Interac e-Transfer', type: 'interac' },
    { id: 'paypal', name: 'PayPal', type: 'paypal' }
  ],
  GB: [
    { id: 'bank_transfer', name: 'Bank Transfer', type: 'bank' },
    { id: 'paypal', name: 'PayPal', type: 'paypal' }
  ],
  AU: [
    { id: 'payid', name: 'PayID', type: 'payid' },
    { id: 'bank_transfer', name: 'Bank Transfer', type: 'bank' }
  ]
};

export const TOP_BANKS = {
  PH: ['BDO', 'BPI', 'Metrobank', 'UnionBank'],
  MY: ['Maybank', 'CIMB', 'Public Bank', 'RHB'],
  ID: ['BCA', 'Mandiri', 'BNI', 'BRI'],
  TH: ['Bangkok Bank', 'Kasikorn', 'SCB'],
  SG: ['DBS/POSB', 'OCBC', 'UOB'],
  HK: ['HSBC', 'Bank of China', 'Standard Chartered'],
  US: ['Chase', 'Bank of America', 'Wells Fargo'],
  CA: ['TD', 'RBC', 'BMO', 'Scotiabank'],
  GB: ['HSBC', 'Barclays', 'Lloyds', 'NatWest'],
  AU: ['Commonwealth', 'ANZ', 'Westpac', 'NAB']
};
3. GOM: Create Order Flow
// app/dashboard/orders/new/page.tsx

// Step 1: Select country
// Step 2: Select payment methods + enter payment details
// Step 3: Product details (name, description, image, price, MOQ)
// Step 4: Review and create

// Payment details structure:
// {
//   "gcash": {
//     "phone_number": "09171234567",
//     "account_name": "Juan Dela Cruz"
//   },
//   "bank_transfer": {
//     "bank_name": "BDO",
//     "account_name": "Juan Dela Cruz",
//     "account_number": "001234567890"
//   }
// }

// Generate shareable slug and redirect to success page
4. Public Order Page
// app/order/[slug]/page.tsx

// Display:
// - Product info
// - MOQ progress bar (X of Y orders)
// - Deadline countdown
// - Payment method selection (cards)
// - Selected method's payment instructions
// - Payment proof upload
// - Submit order (Discord login or email for tracking)

// MOQ warning if not met
// Auto-cancel if deadline passes without MOQ
5. GOM: Payment Verification
// app/dashboard/orders/[id]/verify/page.tsx

// Split screen:
// Left: List of pending verifications
// Right: Payment proof viewer with zoom
// Actions: Approve/Reject
// Download payment proof option
6. GOM: Shipping Management
// app/dashboard/orders/[id]/shipping/page.tsx

// For each verified submission:
// - Buyer name/email
// - Quantity
// - Input: Tracking number
// - Select: Courier service
// - Button: Mark as shipped

// Simple list, no bulk features for MVP
7. Order Tracking
// app/track/page.tsx

// For email users:
// - Enter tracking code + email
// - Show order status
// - Show tracking info if shipped

// For Discord users:
// - Auto-show their orders
8. Role Switching
// app/become-gom/page.tsx

// Simple activation:
// - Select country
// - Click activate
// - Redirect to GOM dashboard

// Navigation shows different options based on is_gom flag
File Structure
gomflow/
├── app/
│   ├── (auth)/
│   │   └── login/page.tsx
│   ├── (dashboard)/
│   │   ├── layout.tsx (require auth + is_gom)
│   │   ├── dashboard/page.tsx
│   │   └── orders/
│   │       ├── page.tsx (list orders)
│   │       ├── new/page.tsx (create order)
│   │       └── [id]/
│   │           ├── page.tsx (order details)
│   │           ├── verify/page.tsx
│   │           └── shipping/page.tsx
│   ├── order/[slug]/page.tsx (public)
│   ├── track/page.tsx (public)
│   ├── become-gom/page.tsx
│   └── layout.tsx (root)
├── components/
│   ├── auth/
│   ├── orders/
│   └── ui/ (shadcn)
├── lib/
│   ├── supabase.ts
│   └── utils.ts
└── constants/
    └── payment-methods.ts
Implementation Notes
Image Upload
// Use Supabase Storage
const uploadPaymentProof = async (file: File) => {
  const { data, error } = await supabase.storage
    .from('payment-proofs')
    .upload(`${orderId}/${Date.now()}-${file.name}`, file);
    
  return data?.path;
};
MOQ Logic
// On submission create/update
const checkMOQ = async (orderId: string) => {
  const { data: order } = await supabase
    .from('orders')
    .select('*')
    .eq('id', orderId)
    .single();
    
  if (order.current_order_count >= order.minimum_order_quantity) {
    await supabase
      .from('orders')
      .update({ status: 'moq_met' })
      .eq('id', orderId);
  }
};

// Cron job or edge function for deadline check
const checkDeadlines = async () => {
  const expired = await supabase
    .from('orders')
    .select('*')
    .eq('status', 'open')
    .lt('deadline', new Date().toISOString());
    
  for (const order of expired) {
    if (order.current_order_count < order.minimum_order_quantity) {
      // Cancel order and notify buyers
    }
  }
};
Tracking Code Generation
const generateTrackingCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = 'GOM-';
  for (let i = 0; i < 8; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
};
What to Focus On
	1	Real data persistence - Everything saves to Supabase
	2	Mobile responsive - Must work on phones
	3	Payment proof viewer - Full screen with zoom
	4	MOQ system - Auto-cancel if not met
	5	Simple shipping - Manual tracking entry
	6	Clear payment instructions - Show GOM's payment details
What NOT to Build
	•	❌ Email templates (just use basic text)
	•	❌ Analytics dashboards
	•	❌ Bulk operations
	•	❌ Real-time features
	•	❌ Payment gateway integrations
	•	❌ Multi-language support
Test Checklist
	•	[ ] Create order as GOM
	•	[ ] Join order as buyer (Discord and email)
	•	[ ] Upload payment proof
	•	[ ] Verify payment as GOM
	•	[ ] Add tracking numbers
	•	[ ] Check order status as buyer
	•	[ ] MOQ auto-cancel works
	•	[ ] Works on mobile
Build this step by step. Make it work, then make it pretty. Ship it!

I've kept the prompt exactly the same but removed the shadcn explanation. This prompt is clear and comprehensive for Claude Code to build a production-ready MVP with:
	•	Real Supabase integration (no mock data)
	•	Complete user flows for both GOMs and buyers
	•	Payment methods for 10 countries
	•	All core features needed for a working platform
The prompt is structured to guide implementation step-by-step while being specific about what to build and what to skip for the MVP.
