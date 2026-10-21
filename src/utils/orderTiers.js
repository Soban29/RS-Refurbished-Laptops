/**
 * Order Tier Classification System & Quote Number Utilities
 *
 * Rules:
 * - Below 5 units (< 5): Individual
 * - 5 to 10 units (5 - 10): Corporate
 * - Above 10 units (> 10): Bulk Orders
 */

export const getOrderTier = (totalQuantity = 1) => {
  const qty = Number(totalQuantity) || 1;

  if (qty < 5) {
    return {
      tier: 'Individual',
      label: 'Individual Buyer',
      badge: 'Individual Tier (<5 units)',
      badgeClass: 'bg-blue-50 text-blue-700 border-blue-200',
      description: 'Standard retail refurbished pricing with 1-Month Testing Warranty.',
      minQty: 1,
      maxQty: 4,
      gstBenefit: 'Official purchase order bill provided.'
    };
  }

  if (qty <= 10) {
    return {
      tier: 'Corporate',
      label: 'Corporate Fleet',
      badge: 'Corporate Tier (5-10 units)',
      badgeClass: 'bg-purple-50 text-purple-700 border-purple-200',
      description: 'Corporate volume pricing with 1-Month Testing Warranty & priority IT support.',
      minQty: 5,
      maxQty: 10,
      gstBenefit: 'Special corporate volume discounts.'
    };
  }

  return {
    tier: 'Bulk',
    label: 'Bulk Orders',
    badge: 'Bulk Order Tier (>10 units)',
    badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-300 font-extrabold',
    description: 'Enterprise wholesale pricing tier with dedicated account manager, free custom OS deployment & standby unit support.',
    minQty: 11,
    maxQty: 9999,
    gstBenefit: 'Max wholesale discounts + standby unit support.'
  };
};

/**
 * Generates an official, human-readable Quote Number
 * Format: RSQ-YYYY-XXXX (e.g. RSQ-2026-8419)
 */
export const generateQuoteNumber = (seed) => {
  const year = new Date().getFullYear();
  if (seed && String(seed).startsWith('RSQ-')) return seed;
  const randomPart = Math.floor(1000 + Math.random() * 9000);
  return `RSQ-${year}-${randomPart}`;
};
