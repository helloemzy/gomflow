# GOMFLOW 🚀

**Group Order Management Platform for Southeast Asian K-pop Fans**

GOMFLOW is a web platform that connects Group Order Managers (GOMs) with buyers across Southeast Asia and beyond. GOMs can create group orders for K-pop merchandise, while buyers can join orders, make payments, and track their shipments.

## ✨ Features

### For Group Order Managers (GOMs)
- 🛍️ **Create Group Orders** - Set up orders with product details, pricing, and MOQ requirements
- 💰 **Multi-Payment Support** - Accept payments via GCash, Bank Transfer, PayNow, Venmo, and more
- ✅ **Payment Verification** - Review and approve payment proofs with built-in image viewer
- 📦 **Shipping Management** - Add tracking numbers and manage order fulfillment
- 📊 **Order Dashboard** - Monitor order progress and MOQ status

### For Buyers
- 🔍 **Browse Orders** - Discover available group orders from trusted GOMs
- 💳 **Flexible Payment** - Pay using local payment methods in your country
- 📸 **Payment Proof Upload** - Upload payment confirmations securely
- 🔗 **Order Tracking** - Track your orders with unique tracking codes
- 👤 **Discord Integration** - Sign in with Discord for full features

### Platform Features
- 🌏 **Multi-Country Support** - Philippines, Malaysia, Indonesia, Thailand, Singapore, Hong Kong, US, Canada, UK, Australia
- 📱 **Mobile Responsive** - Works seamlessly on phones and desktop
- 🔒 **Secure Authentication** - Discord OAuth and email authentication
- ⚡ **Real-time Updates** - Live order count and MOQ progress tracking
- 📧 **Guest Checkout** - Email-only checkout for quick purchases

## 🗺️ Supported Countries & Payment Methods

| Country | Payment Methods |
|---------|----------------|
| 🇵🇭 Philippines | GCash, Bank Transfer (BDO, BPI, Metrobank, UnionBank) |
| 🇲🇾 Malaysia | Bank Transfer (Maybank, CIMB, Public Bank), Touch n Go |
| 🇮🇩 Indonesia | Bank Transfer (BCA, Mandiri, BNI, BRI), GoPay |
| 🇹🇭 Thailand | Bank Transfer (Bangkok Bank, Kasikorn, SCB), PromptPay |
| 🇸🇬 Singapore | PayNow, Bank Transfer (DBS/POSB, OCBC, UOB) |
| 🇭🇰 Hong Kong | FPS, PayMe, Bank Transfer (HSBC, Bank of China) |
| 🇺🇸 United States | Venmo, Zelle, PayPal |
| 🇨🇦 Canada | Interac e-Transfer, PayPal |
| 🇬🇧 United Kingdom | Bank Transfer, PayPal |
| 🇦🇺 Australia | PayID, Bank Transfer (Commonwealth, ANZ, Westpac) |

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Backend**: Supabase (Database, Authentication, Storage)
- **Authentication**: Discord OAuth, Email/Password
- **Database**: PostgreSQL with Row Level Security
- **Storage**: Supabase Storage for payment proofs and product images
- **Deployment**: Vercel (recommended)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account
- Discord application (optional)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/gomflow.git
   cd gomflow
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Fill in your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   
   # Optional: Discord OAuth
   DISCORD_CLIENT_ID=your_discord_client_id
   DISCORD_CLIENT_SECRET=your_discord_client_secret
   ```

4. **Set up Supabase database**
   
   Run the SQL schema from `supabase-schema.sql` in your Supabase SQL editor:
   - Creates `profiles`, `orders`, `submissions` tables
   - Sets up Row Level Security policies
   - Creates storage buckets for images

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:3000`

## 📁 Project Structure

```
gomflow/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/
│   │   │   └── login/          # Authentication pages
│   │   ├── (dashboard)/        # GOM dashboard (protected)
│   │   │   ├── dashboard/      # GOM overview
│   │   │   └── orders/         # Order management
│   │   ├── order/[slug]/       # Public order pages
│   │   ├── track/              # Order tracking
│   │   ├── become-gom/         # Role switching
│   │   └── auth/callback/      # OAuth callback
│   ├── components/
│   │   ├── auth/               # Authentication components
│   │   ├── orders/             # Order-related components
│   │   └── ui/                 # shadcn/ui components
│   ├── lib/
│   │   ├── supabase.ts         # Supabase client & types
│   │   ├── database.ts         # Database operations
│   │   ├── auth.tsx            # Auth context provider
│   │   └── utils.ts            # Utility functions
│   └── constants/
│       └── payment-methods.ts  # Payment method definitions
├── supabase-schema.sql         # Database schema
├── .env.local                  # Environment variables
└── README.md
```

## 💡 Usage

### Creating Your First Group Order

1. **Sign in** with Discord or create an account
2. **Become a GOM** by visiting `/become-gom`
3. **Create an order** at `/dashboard/orders/new`:
   - Select your country
   - Choose payment methods and enter your payment details
   - Add product information (name, description, price, MOQ)
   - Set deadline and review
4. **Share your order** using the generated link
5. **Manage submissions** as buyers join your order
6. **Verify payments** and add tracking information

### Joining a Group Order

1. **Visit the order link** shared by the GOM
2. **Select quantity** and payment method
3. **Upload payment proof** after making payment
4. **Track your order** using the tracking code (email users) or dashboard (Discord users)

## 🔧 Configuration

### Payment Methods

Payment methods are configured in `src/constants/payment-methods.ts`. Each country has specific payment options with associated bank lists for transfers.

### Environment Variables

Required environment variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Discord OAuth (Optional)
DISCORD_CLIENT_ID=your_discord_app_client_id
DISCORD_CLIENT_SECRET=your_discord_app_client_secret
```

## 🧪 Testing Checklist

- [ ] Create order as GOM
- [ ] Join order as buyer (Discord and email)
- [ ] Upload payment proof
- [ ] Verify payment as GOM
- [ ] Add tracking numbers
- [ ] Check order status as buyer
- [ ] MOQ auto-cancel works
- [ ] Mobile responsive design

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect your GitHub repository** to Vercel
2. **Add environment variables** in Vercel dashboard
3. **Deploy** - Vercel will automatically build and deploy

### Other Platforms

GOMFLOW can be deployed on any platform that supports Next.js applications.

## 🤝 Contributing

We welcome contributions! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

- **Documentation**: Check this README and inline code comments
- **Issues**: Report bugs and request features via GitHub Issues

---

**Built with ❤️ for the K-pop community in Southeast Asia**

*GOMFLOW - Making group orders simple, secure, and seamless.*
