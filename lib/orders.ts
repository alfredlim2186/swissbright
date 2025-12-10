import type { Order, OrderItem, Product, PromoCode, Promotion, User, Courier } from '@prisma/client'
import { centsToNumber } from './shop'
import { sendEmail } from './email'

export type OrderWithRelations = Order & {
  user: User
  items: Array<OrderItem & { product: Product }>
  promoCode?: PromoCode | null
  promotion?: Promotion | null
  courier?: Courier | null
}

export const ORDER_STATUS_VALUES = ['PROCESSING', 'CONFIRMED', 'SENT', 'COMPLETED', 'CANCELLED'] as const
export type OrderStatus = (typeof ORDER_STATUS_VALUES)[number]

export const ORDER_STATUS: Record<OrderStatus, OrderStatus> = {
  PROCESSING: 'PROCESSING',
  CONFIRMED: 'CONFIRMED',
  SENT: 'SENT',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
}

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  PROCESSING: 'Order Received',
  CONFIRMED: 'Order Confirmed',
  SENT: 'Order Sent',
  COMPLETED: 'Order Completed',
  CANCELLED: 'Order Cancelled',
}

export const ORDER_STATUS_DESCRIPTIONS: Record<OrderStatus, string> = {
  PROCESSING: 'We received your order and are waiting for payment advice on WhatsApp.',
  CONFIRMED: 'Payment has been verified by the SweetB team.',
  SENT: 'Your order left our facility. Courier and tracking details are below.',
  COMPLETED: 'This order has been completed and delivered.',
  CANCELLED: 'This order has been cancelled. If you have questions, please contact us.',
}

export const ORDER_STATUS_EMAIL_SUBJECTS: Record<OrderStatus, string> = {
  PROCESSING: 'SweetB | Order Received',
  CONFIRMED: 'SweetB | Order Confirmed',
  SENT: 'SweetB | Order On The Way',
  COMPLETED: 'SweetB | Order Completed',
  CANCELLED: 'SweetB | Order Cancelled',
}

export const serializeOrder = (order: OrderWithRelations) => ({
  promoCode: order.promoCode
    ? {
        code: order.promoCode.code,
        discountType: order.promoCode.discountType,
      }
    : null,
  promoCodeDiscount: centsToNumber(order.promoCodeDiscountCents),
  promotion: order.promotion
    ? {
        id: order.promotion.id,
        name: order.promotion.name,
        discountType: order.promotion.discountType,
      }
    : null,
  promotionDiscount: centsToNumber(order.promotionDiscountCents),
  id: order.id,
  status: order.status,
  statusLabel: ORDER_STATUS_LABELS[order.status as OrderStatus] ?? order.status,
  total: centsToNumber(order.totalCents),
  currency: order.currency,
  message: order.message ?? '',
  courier: order.courier
    ? {
        id: order.courier.id,
        name: order.courier.name,
        description: order.courier.description,
      }
    : null,
  courierName: order.courierName ?? order.courier?.name ?? '',
  trackingNumber: order.trackingNumber ?? '',
  shippingFee: centsToNumber(order.shippingFeeCents),
  paymentNote: order.paymentNote ?? '',
  createdAt: order.createdAt.toISOString(),
  updatedAt: order.updatedAt.toISOString(),
  user: {
    id: order.user.id,
    email: order.user.email,
    name: order.user.name ?? '',
    phoneNumber: order.user.phoneNumber ?? '',
  },
  items: order.items.map((item) => ({
    id: item.id,
    productId: item.productId,
    name: item.product.name,
    quantity: item.quantity,
    unitPrice: centsToNumber(item.priceCents),
    subtotal: centsToNumber(item.priceCents * item.quantity),
  })),
})

const formatCurrency = (value: number, currency = 'MYR') =>
  new Intl.NumberFormat('en-MY', { style: 'currency', currency }).format(value)

const renderOrderLines = (order: OrderWithRelations) => {
  const rows = order.items
    .map(
      (item) => `
        <tr>
          <td>${item.product.name}</td>
          <td style="text-align:center;">${item.quantity}</td>
          <td style="text-align:right;">${formatCurrency(centsToNumber(item.priceCents), order.currency)}</td>
        </tr>
      `,
    )
    .join('')

  return `
    <table width="100%" cellpadding="12" style="border-collapse:collapse;color:#F8F8F8;">
      <thead>
        <tr style="border-bottom:1px solid rgba(255,255,255,0.08);color:#B8B8B8;font-size:0.85rem;text-transform:uppercase;letter-spacing:2px;">
          <th style="text-align:left;">Product</th>
          <th style="text-align:center;">Qty</th>
          <th style="text-align:right;">Price</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
      <tfoot>
        <tr style="border-top:1px solid rgba(255,255,255,0.08);">
          <td colspan="2" style="text-align:right;padding-top:16px;">Total</td>
          <td style="text-align:right;padding-top:16px;font-weight:600;">${formatCurrency(
            centsToNumber(order.totalCents),
            order.currency,
          )}</td>
        </tr>
      </tfoot>
    </table>
  `
}

const baseEmailTemplate = (params: {
  headline: string
  intro: string
  order: OrderWithRelations
  footerNote?: string
}) => {
  const { headline, intro, order, footerNote } = params
  return `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8" />
      <style>
        body {
          font-family: 'Inter', Arial, sans-serif;
          background-color: #050505;
          color: #F8F8F8;
          padding: 32px 16px;
        }
        .card {
          max-width: 640px;
          margin: 0 auto;
          background-color: #0F0F0F;
          border: 1px solid rgba(201,168,106,0.25);
          border-radius: 12px;
          padding: 32px;
        }
        .eyebrow {
          letter-spacing: 4px;
          text-transform: uppercase;
          color: #C9A86A;
          font-size: 0.75rem;
        }
        h1 {
          font-family: 'Playfair Display', serif;
          font-weight: 400;
        }
        p {
          color: #B8B8B8;
          line-height: 1.6;
        }
        .footer {
          margin-top: 32px;
          border-top: 1px solid rgba(255,255,255,0.08);
          padding-top: 16px;
          color: #666666;
          font-size: 0.75rem;
        }
        .pill {
          display: inline-block;
          padding: 6px 16px;
          border-radius: 999px;
          border: 1px solid rgba(201,168,106,0.4);
          color: #C9A86A;
          font-size: 0.8rem;
          letter-spacing: 2px;
        }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="pill">Order #${order.id.slice(-6).toUpperCase()}</div>
        <h1>${headline}</h1>
        <p>${intro}</p>
        ${renderOrderLines(order)}
        ${order.courierName || order.trackingNumber ? `
          <div style="margin-top:24px;border-top:1px solid rgba(255,255,255,0.08);padding-top:16px;">
            <p style="color:#B8B8B8;font-size:0.9rem;">
              <strong>Courier:</strong> ${order.courierName ?? 'Pending'}<br />
              <strong>Tracking:</strong> ${order.trackingNumber ?? 'Pending'}
            </p>
          </div>
        ` : ''}
        ${
          footerNote
            ? `<p style="margin-top:24px;color:#B8B8B8;">${footerNote}</p>`
            : ''
        }
        <div class="footer">
          © ${new Date().getFullYear()} Swiss Bright. Vitality Reborn.
        </div>
      </div>
    </body>
  </html>
  `
}

export const generateOrderEmailHtml = (status: OrderStatus, order: OrderWithRelations) => {
  switch (status) {
    case ORDER_STATUS.PROCESSING:
      return baseEmailTemplate({
        headline: 'Order Received',
        intro:
          'Thanks for selecting Swiss Bright. Share your payment advice via WhatsApp so we can move this order forward. Until then, it remains in Processing.',
        order,
        footerNote: 'Need help? Reply to this email or message us on WhatsApp.',
      })
    case ORDER_STATUS.CONFIRMED:
      return baseEmailTemplate({
        headline: 'Payment Confirmed',
        intro: 'We verified your payment advice. Our team will prepare your parcel and share courier details shortly.',
        order,
      })
    case ORDER_STATUS.SENT:
      return baseEmailTemplate({
        headline: 'Your Order Is On The Way',
        intro: 'Swiss Bright has handed your parcel to the courier. Tracking details are below—chat us if you need assistance.',
        order,
      })
    case ORDER_STATUS.COMPLETED:
      return baseEmailTemplate({
        headline: 'Order Completed',
        intro: 'Your Swiss Bright order has been completed. Thank you for your purchase!',
        order,
        footerNote: 'We hope you enjoy your Swiss Bright products. If you have any questions, feel free to contact us.',
      })
    case ORDER_STATUS.CANCELLED:
      return baseEmailTemplate({
        headline: 'Order Cancelled',
        intro: 'Your order has been cancelled. If you have any questions or concerns, please contact our customer service team.',
        order,
        footerNote: 'If you believe this was an error, please contact us immediately.',
      })
    default:
      return baseEmailTemplate({
        headline: 'Order Update',
        intro: 'There is an update regarding your Swiss Bright order.',
        order,
      })
  }
}

export async function sendOrderStatusEmail(params: {
  status: OrderStatus
  order: OrderWithRelations
}) {
  const { status, order } = params
  if (!order.user.email) {
    return { success: false, error: 'User email missing' }
  }

  const html = generateOrderEmailHtml(status, order)
  const subject = ORDER_STATUS_EMAIL_SUBJECTS[status] ?? 'SweetB Order Update'

  return sendEmail({
    to: order.user.email,
    subject,
    html,
  })
}


