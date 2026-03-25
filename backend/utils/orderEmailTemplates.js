const formatCurrency = (amount) => {
  return `₹${Number(amount || 0).toLocaleString("en-IN", {
    maximumFractionDigits: 2,
  })}`;
};

const formatDate = (date = new Date()) => {
  return new Date(date).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatDateOnly = (date) => {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const escapeHtml = (value = "") => {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
};

const getProductName = (item) => {
  if (item?.product?.name) return item.product.name;
  return "Jewellery Product";
};

const getVariantText = (item) => {
  if (
    item?.selectedVariant &&
    item.selectedVariant.name &&
    item.selectedVariant.value
  ) {
    return `${item.selectedVariant.name}: ${item.selectedVariant.value}`;
  }
  return "";
};

const getStatusMessage = (status) => {
  switch (status) {
    case "Processing":
      return "Your order is now being prepared carefully by our team.";
    case "Shipped":
      return "Great news — your order has been shipped and is on the way.";
    case "Out for Delivery":
      return "Your order is out for delivery and should reach you soon.";
    case "Delivered":
      return "Your order has been delivered. We hope you love your purchase.";
    case "Cancelled":
      return "Your order has been cancelled. If you need support, please contact us.";
    default:
      return "Your order status has been updated.";
  }
};

const getTrackingLink = (shippingDetails = {}) => {
  const courierName = String(shippingDetails?.courierName || "")
    .trim()
    .toLowerCase();
  const trackingNumber = String(shippingDetails?.trackingNumber || "").trim();

  if (!trackingNumber) return "";

  if (courierName.includes("delhivery")) {
    return `https://www.delhivery.com/track/package/${encodeURIComponent(
      trackingNumber
    )}`;
  }

  return "";
};

const buildItemsHtml = (orderItems = []) => {
  return orderItems
    .map((item) => {
      const productName = escapeHtml(getProductName(item));
      const variantText = escapeHtml(getVariantText(item));
      const quantity = Number(item?.quantity || 0);
      const unitPrice = Number(item?.price || 0);
      const lineTotal = unitPrice * quantity;

      return `
        <tr>
          <td style="padding: 12px; border: 1px solid #e5e5e5; vertical-align: top;">
            <div style="font-weight: 600; color: #111111;">${productName}</div>
            ${
              variantText
                ? `<div style="font-size: 12px; color: #666666; margin-top: 4px;">${variantText}</div>`
                : ""
            }
          </td>
          <td style="padding: 12px; border: 1px solid #e5e5e5; text-align: center;">
            ${quantity}
          </td>
          <td style="padding: 12px; border: 1px solid #e5e5e5; text-align: right;">
            ${formatCurrency(unitPrice)}
          </td>
          <td style="padding: 12px; border: 1px solid #e5e5e5; text-align: right;">
            ${formatCurrency(lineTotal)}
          </td>
        </tr>
      `;
    })
    .join("");
};

const buildPricingHtml = (order) => {
  const pricing = order?.pricing || {};

  return `
    <table style="width:100%; border-collapse:collapse; margin-top: 10px;">
      <tbody>
        <tr>
          <td style="padding:10px 0; color:#555555;">Subtotal</td>
          <td style="padding:10px 0; text-align:right; color:#111111;">
            ${formatCurrency(pricing.subtotal || 0)}
          </td>
        </tr>

        ${
          Number(pricing.couponDiscount || 0) > 0
            ? `
          <tr>
            <td style="padding:10px 0; color:#555555;">
              Coupon Discount${
                pricing.couponCode ? ` (${escapeHtml(pricing.couponCode)})` : ""
              }
            </td>
            <td style="padding:10px 0; text-align:right; color:#0f8a2f;">
              - ${formatCurrency(pricing.couponDiscount || 0)}
            </td>
          </tr>
        `
            : ""
        }

        ${
          Number(pricing.walletDiscount || 0) > 0
            ? `
          <tr>
            <td style="padding:10px 0; color:#555555;">
              Wallet Discount${
                Number(pricing.walletGramsUsed || 0) > 0
                  ? ` (${Number(pricing.walletGramsUsed || 0).toFixed(3)} g)`
                  : ""
              }
            </td>
            <td style="padding:10px 0; text-align:right; color:#0f8a2f;">
              - ${formatCurrency(pricing.walletDiscount || 0)}
            </td>
          </tr>
        `
            : ""
        }

        <tr>
          <td style="padding:14px 0 0; border-top:1px solid #e8e8e8; font-weight:700; color:#111111;">
            Final Total
          </td>
          <td style="padding:14px 0 0; border-top:1px solid #e8e8e8; text-align:right; font-weight:700; color:#111111;">
            ${formatCurrency(order?.totalPrice || pricing.finalPayable || 0)}
          </td>
        </tr>
      </tbody>
    </table>
  `;
};

const buildShippingAddressHtml = (shippingAddress = {}) => {
  return `
    <div style="background:#faf7f2; border:1px solid #ece2d4; border-radius:12px; padding:16px; line-height:1.8;">
      <div><strong>${escapeHtml(shippingAddress.fullName || "")}</strong></div>
      <div>${escapeHtml(shippingAddress.phone || "")}</div>
      <div>${escapeHtml(shippingAddress.addressLine || "")}</div>
      <div>${escapeHtml(shippingAddress.city || "")}, ${escapeHtml(
    shippingAddress.state || ""
  )} - ${escapeHtml(shippingAddress.postalCode || "")}</div>
      <div>${escapeHtml(shippingAddress.country || "India")}</div>
    </div>
  `;
};

const buildOrderMetaHtml = (order) => {
  return `
    <div style="background:#faf7f2; border:1px solid #ece2d4; border-radius:12px; padding:16px; margin:22px 0;">
      <p style="margin:0 0 8px;"><strong>Order ID:</strong> ${escapeHtml(order?._id || "")}</p>
      <p style="margin:0 0 8px;"><strong>Order Date:</strong> ${formatDate(
        order?.createdAt || new Date()
      )}</p>
      <p style="margin:0 0 8px;"><strong>Status:</strong> ${escapeHtml(
        order?.status || "Order Placed"
      )}</p>
      <p style="margin:0 0 8px;"><strong>Payment Method:</strong> ${escapeHtml(
        order?.paymentMethod || "Razorpay"
      )}</p>
      <p style="margin:0;"><strong>Payment Status:</strong> ${escapeHtml(
        order?.paymentStatus || "Paid"
      )}</p>
    </div>
  `;
};

const buildShippingTrackingHtml = (shippingDetails = {}) => {
  const courierName = shippingDetails?.courierName || "";
  const trackingNumber = shippingDetails?.trackingNumber || "";
  const shippedAt = shippingDetails?.shippedAt;
  const estimatedDelivery = shippingDetails?.estimatedDelivery;
  const shippingNote = shippingDetails?.shippingNote || "";
  const trackingLink = getTrackingLink(shippingDetails);

  if (
    !courierName &&
    !trackingNumber &&
    !shippedAt &&
    !estimatedDelivery &&
    !shippingNote
  ) {
    return "";
  }

  return `
    <h3 style="margin:26px 0 12px; color:#111111;">Shipping Details</h3>
    <div style="background:#f4f8ff; border:1px solid #d9e8ff; border-radius:12px; padding:16px; line-height:1.8;">
      <div><strong>Courier:</strong> ${escapeHtml(courierName || "-")}</div>
      <div><strong>Tracking Number:</strong> ${
        trackingLink
          ? `<a href="${trackingLink}" target="_blank" rel="noopener noreferrer" style="color:#2563eb; text-decoration:underline;">${escapeHtml(
              trackingNumber
            )}</a>`
          : escapeHtml(trackingNumber || "-")
      }</div>
      <div><strong>Shipped At:</strong> ${
        shippedAt ? escapeHtml(formatDate(shippedAt)) : "-"
      }</div>
      <div><strong>Estimated Delivery:</strong> ${
        estimatedDelivery ? escapeHtml(formatDateOnly(estimatedDelivery)) : "-"
      }</div>
      <div><strong>Note:</strong> ${escapeHtml(shippingNote || "-")}</div>
    </div>
  `;
};

const wrapper = ({ title, subtitle, body }) => {
  return `
    <div style="margin:0; padding:0; background:#f7f3ee; font-family: Arial, sans-serif; color:#222222;">
      <div style="max-width:700px; margin:0 auto; padding:30px 16px;">
        <div style="background:#ffffff; border-radius:18px; overflow:hidden; box-shadow:0 8px 30px rgba(0,0,0,0.08);">
          <div style="background:#111111; padding:28px 24px; text-align:center;">
            <h1 style="margin:0; color:#d4af37; letter-spacing:2px; font-size:30px;">AURUM</h1>
            <p style="margin:8px 0 0; color:#f4e5a6; font-size:14px;">Premium Jewellery</p>
          </div>

          <div style="padding:28px 24px;">
            <h2 style="margin:0 0 10px; color:#111111; font-size:24px;">${title}</h2>
            <p style="margin:0 0 24px; color:#666666; font-size:15px; line-height:1.7;">
              ${subtitle}
            </p>

            ${body}
          </div>

          <div style="padding:18px 24px; background:#fafafa; border-top:1px solid #eeeeee; text-align:center;">
            <p style="margin:0; font-size:13px; color:#777777;">
              Thank you for choosing AURUM.
            </p>
          </div>
        </div>
      </div>
    </div>
  `;
};

const getCustomerOrderConfirmationTemplate = ({ order, user }) => {
  const itemsHtml = buildItemsHtml(order?.orderItems || []);

  const body = `
    <p style="font-size:15px; line-height:1.7; margin-top:0;">
      Hi <strong>${escapeHtml(user?.name || "Customer")}</strong>,<br/>
      Your order has been placed successfully. Our team will start processing it shortly.
    </p>

    ${buildOrderMetaHtml(order)}

    <h3 style="margin:26px 0 12px; color:#111111;">Order Items</h3>
    <table style="width:100%; border-collapse:collapse;">
      <thead>
        <tr style="background:#f5f5f5;">
          <th style="padding:12px; border:1px solid #e5e5e5; text-align:left;">Product</th>
          <th style="padding:12px; border:1px solid #e5e5e5; text-align:center;">Qty</th>
          <th style="padding:12px; border:1px solid #e5e5e5; text-align:right;">Unit Price</th>
          <th style="padding:12px; border:1px solid #e5e5e5; text-align:right;">Line Total</th>
        </tr>
      </thead>
      <tbody>
        ${itemsHtml}
      </tbody>
    </table>

    <h3 style="margin:26px 0 12px; color:#111111;">Price Summary</h3>
    <div style="background:#ffffff; border:1px solid #ececec; border-radius:12px; padding:16px;">
      ${buildPricingHtml(order)}
    </div>

    <h3 style="margin:26px 0 12px; color:#111111;">Shipping Address</h3>
    ${buildShippingAddressHtml(order?.shippingAddress || {})}

    <p style="font-size:14px; line-height:1.7; color:#666666; margin-top:22px;">
      You can keep this email for your records. Invoice can be downloaded from your order history section on the website.
    </p>
  `;

  return {
    subject: `AURUM Order Confirmation - ${order._id}`,
    text: `Your order ${order._id} has been placed successfully. Total: ${formatCurrency(
      order.totalPrice
    )}. Status: ${order.status}.`,
    html: wrapper({
      title: "Order Confirmed",
      subtitle: "Your order has been received successfully.",
      body,
    }),
  };
};

const getAdminNewOrderTemplate = ({ order, user }) => {
  const itemsHtml = buildItemsHtml(order?.orderItems || []);

  const body = `
    <p style="font-size:15px; line-height:1.7; margin-top:0;">
      A new order has been placed on AURUM.
    </p>

    <div style="background:#faf7f2; border:1px solid #ece2d4; border-radius:12px; padding:16px; margin:22px 0;">
      <p style="margin:0 0 8px;"><strong>Order ID:</strong> ${escapeHtml(order?._id || "")}</p>
      <p style="margin:0 0 8px;"><strong>Customer Name:</strong> ${escapeHtml(
        user?.name || "N/A"
      )}</p>
      <p style="margin:0 0 8px;"><strong>Customer Email:</strong> ${escapeHtml(
        user?.email || "N/A"
      )}</p>
      <p style="margin:0 0 8px;"><strong>Status:</strong> ${escapeHtml(
        order?.status || "Order Placed"
      )}</p>
      <p style="margin:0 0 8px;"><strong>Payment Method:</strong> ${escapeHtml(
        order?.paymentMethod || "Razorpay"
      )}</p>
      <p style="margin:0;"><strong>Total:</strong> ${formatCurrency(
        order?.totalPrice || 0
      )}</p>
    </div>

    <h3 style="margin:26px 0 12px; color:#111111;">Order Items</h3>
    <table style="width:100%; border-collapse:collapse;">
      <thead>
        <tr style="background:#f5f5f5;">
          <th style="padding:12px; border:1px solid #e5e5e5; text-align:left;">Product</th>
          <th style="padding:12px; border:1px solid #e5e5e5; text-align:center;">Qty</th>
          <th style="padding:12px; border:1px solid #e5e5e5; text-align:right;">Unit Price</th>
          <th style="padding:12px; border:1px solid #e5e5e5; text-align:right;">Line Total</th>
        </tr>
      </thead>
      <tbody>
        ${itemsHtml}
      </tbody>
    </table>

    <h3 style="margin:26px 0 12px; color:#111111;">Price Summary</h3>
    <div style="background:#ffffff; border:1px solid #ececec; border-radius:12px; padding:16px;">
      ${buildPricingHtml(order)}
    </div>

    <h3 style="margin:26px 0 12px; color:#111111;">Shipping Address</h3>
    ${buildShippingAddressHtml(order?.shippingAddress || {})}
  `;

  return {
    subject: `New AURUM Order - ${order._id}`,
    text: `New order received. Order ID: ${order._id}. Customer: ${
      user?.name || "N/A"
    }. Total: ${formatCurrency(order?.totalPrice || 0)}.`,
    html: wrapper({
      title: "New Order Received",
      subtitle: "A new customer order has been placed.",
      body,
    }),
  };
};

const getOrderStatusUpdateTemplate = ({ order, user, status }) => {
  const trackingHtml =
    status === "Shipped" || status === "Out for Delivery"
      ? buildShippingTrackingHtml(order?.shippingDetails || {})
      : "";

  const trackingLink = getTrackingLink(order?.shippingDetails || {});
  const textTrackingPart =
    status === "Shipped" || status === "Out for Delivery"
      ? `
Courier: ${order?.shippingDetails?.courierName || "-"}
Tracking Number: ${order?.shippingDetails?.trackingNumber || "-"}
Shipped At: ${
          order?.shippingDetails?.shippedAt
            ? formatDate(order.shippingDetails.shippedAt)
            : "-"
        }
Estimated Delivery: ${
          order?.shippingDetails?.estimatedDelivery
            ? formatDateOnly(order.shippingDetails.estimatedDelivery)
            : "-"
        }
Tracking Link: ${trackingLink || "Not available"}`
      : "";

  const body = `
    <p style="font-size:15px; line-height:1.7; margin-top:0;">
      Hi <strong>${escapeHtml(user?.name || "Customer")}</strong>,<br/>
      ${escapeHtml(getStatusMessage(status))}
    </p>

    <div style="background:#faf7f2; border:1px solid #ece2d4; border-radius:12px; padding:16px; margin:22px 0;">
      <p style="margin:0 0 8px;"><strong>Order ID:</strong> ${escapeHtml(order?._id || "")}</p>
      <p style="margin:0 0 8px;"><strong>Updated Status:</strong> ${escapeHtml(
        status || ""
      )}</p>
      <p style="margin:0 0 8px;"><strong>Order Date:</strong> ${formatDate(
        order?.createdAt || new Date()
      )}</p>
      <p style="margin:0;"><strong>Total:</strong> ${formatCurrency(
        order?.totalPrice || 0
      )}</p>
    </div>

    ${trackingHtml}

    <h3 style="margin:26px 0 12px; color:#111111;">Shipping Address</h3>
    ${buildShippingAddressHtml(order?.shippingAddress || {})}

    <p style="font-size:15px; line-height:1.7; margin-top:24px;">
      Thank you for shopping with AURUM.
    </p>
  `;

  return {
    subject: `AURUM Order Status Updated - ${status}`,
    text: `Your AURUM order ${order?._id || ""} is now ${status}.${textTrackingPart}`,
    html: wrapper({
      title: "Order Status Updated",
      subtitle: `Your order is now marked as "${escapeHtml(status || "")}".`,
      body,
    }),
  };
};

module.exports = {
  getCustomerOrderConfirmationTemplate,
  getAdminNewOrderTemplate,
  getOrderStatusUpdateTemplate,
};