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
} as const;

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
} as const;

export const COUNTRIES = [
  { code: 'PH', name: 'Philippines', flag: '🇵🇭' },
  { code: 'MY', name: 'Malaysia', flag: '🇲🇾' },
  { code: 'ID', name: 'Indonesia', flag: '🇮🇩' },
  { code: 'TH', name: 'Thailand', flag: '🇹🇭' },
  { code: 'SG', name: 'Singapore', flag: '🇸🇬' },
  { code: 'HK', name: 'Hong Kong', flag: '🇭🇰' },
  { code: 'US', name: 'United States', flag: '🇺🇸' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺' }
] as const;

export type CountryCode = keyof typeof PAYMENT_METHODS;
export type PaymentMethod = typeof PAYMENT_METHODS[CountryCode][number];