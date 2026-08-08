import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// Use onboarding@resend.dev in development or when custom sender is not set/verified
const FROM_EMAIL =
  process.env.RESEND_FROM_EMAIL ||
  (process.env.NODE_ENV === "production"
    ? "Wishelier <noreply@wishelier.in>"
    : "Wishelier <onboarding@resend.dev>");

/**
 * Send OTP verification email.
 */
export async function sendOTPEmail(
  email: string,
  otp: string,
  purpose: "signup" | "password_reset"
): Promise<{ success: boolean; error?: string }> {
  const subject =
    purpose === "signup"
      ? "Verify your email — Wishelier"
      : "Reset your password — Wishelier";

  const body =
    purpose === "signup"
      ? `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 500px; margin: 0 auto; padding: 40px 20px;">
          <h1 style="color: #f472b6; font-size: 28px; margin-bottom: 8px;">Welcome to Wishelier ✨</h1>
          <p style="color: #64748b; font-size: 16px; margin-bottom: 24px;">Use the code below to verify your email and create your account.</p>
          <div style="background: linear-gradient(135deg, #fdf2f8, #f5f3ff); border-radius: 16px; padding: 32px; text-align: center; margin-bottom: 24px;">
            <p style="color: #64748b; font-size: 14px; margin-bottom: 8px;">Your verification code</p>
            <p style="font-size: 36px; font-weight: 700; letter-spacing: 8px; color: #1e293b; margin: 0;">${otp}</p>
          </div>
          <p style="color: #94a3b8; font-size: 13px;">This code expires in 10 minutes. If you didn't request this, you can safely ignore this email.</p>
        </div>
      `
      : `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 500px; margin: 0 auto; padding: 40px 20px;">
          <h1 style="color: #f472b6; font-size: 28px; margin-bottom: 8px;">Reset Your Password</h1>
          <p style="color: #64748b; font-size: 16px; margin-bottom: 24px;">Use the code below to reset your password.</p>
          <div style="background: linear-gradient(135deg, #fdf2f8, #f5f3ff); border-radius: 16px; padding: 32px; text-align: center; margin-bottom: 24px;">
            <p style="color: #64748b; font-size: 14px; margin-bottom: 8px;">Your reset code</p>
            <p style="font-size: 36px; font-weight: 700; letter-spacing: 8px; color: #1e293b; margin: 0;">${otp}</p>
          </div>
          <p style="color: #94a3b8; font-size: 13px;">This code expires in 10 minutes. If you didn't request this, your account is safe.</p>
        </div>
      `;

  // Log for local development visibility
  console.log(`🔑 [OTP GENERATED] (${purpose}) for ${email}: ${otp}`);

  try {
    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject,
      html: body,
    });

    if (error) {
      console.error("Resend error:", error);
      // Fallback: If unverified domain error in dev, attempt fallback to onboarding@resend.dev
      if (
        error.message?.includes("domain is not verified") &&
        FROM_EMAIL !== "Wishelier <onboarding@resend.dev>"
      ) {
        console.log("Attempting fallback email send via onboarding@resend.dev...");
        const fallbackResult = await resend.emails.send({
          from: "Wishelier <onboarding@resend.dev>",
          to: email,
          subject,
          html: body,
        });
        if (!fallbackResult.error) return { success: true };
      }
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    console.error("Email send error:", err);
    return { success: false, error: "Failed to send email" };
  }
}

/**
 * Send "Your site is live" notification email.
 */
export async function sendSiteLiveEmail(
  email: string,
  siteName: string,
  siteUrl: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: `🎉 ${siteName}'s birthday site is live! — Wishelier`,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 500px; margin: 0 auto; padding: 40px 20px;">
          <h1 style="color: #f472b6; font-size: 28px; margin-bottom: 8px;">Your site is live! 🎉</h1>
          <p style="color: #64748b; font-size: 16px; margin-bottom: 24px;">
            The birthday surprise for <strong>${siteName}</strong> is ready to share.
          </p>
          <div style="background: linear-gradient(135deg, #fdf2f8, #f5f3ff); border-radius: 16px; padding: 24px; text-align: center; margin-bottom: 24px;">
            <a href="${siteUrl}" style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #f472b6, #a78bfa); color: white; text-decoration: none; border-radius: 999px; font-weight: 600; font-size: 16px;">
              Visit Your Site →
            </a>
            <p style="color: #64748b; font-size: 13px; margin-top: 12px;">${siteUrl}</p>
          </div>
          <p style="color: #64748b; font-size: 14px;">Share this link with friends and family to surprise ${siteName}!</p>
          <p style="color: #94a3b8; font-size: 13px; margin-top: 16px;">Made with ❤️ by Wishelier</p>
        </div>
      `,
    });

    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err) {
    console.error("Email send error:", err);
    return { success: false, error: "Failed to send email" };
  }
}

/**
 * Send payment receipt email.
 */
export async function sendPaymentReceiptEmail(
  email: string,
  templateName: string,
  amount: string,
  orderId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: `Payment confirmed — Wishelier`,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 500px; margin: 0 auto; padding: 40px 20px;">
          <h1 style="color: #f472b6; font-size: 28px; margin-bottom: 8px;">Payment Confirmed ✅</h1>
          <p style="color: #64748b; font-size: 16px; margin-bottom: 24px;">We're generating your birthday site now. You'll receive another email when it's ready!</p>
          <div style="background: #f8fafc; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
            <p style="color: #64748b; font-size: 14px; margin-bottom: 4px;">Template: <strong>${templateName}</strong></p>
            <p style="color: #64748b; font-size: 14px; margin-bottom: 4px;">Amount: <strong>₹${amount}</strong></p>
            <p style="color: #64748b; font-size: 14px;">Order ID: <code>${orderId}</code></p>
          </div>
          <p style="color: #94a3b8; font-size: 13px;">Made with ❤️ by Wishelier</p>
        </div>
      `,
    });

    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err) {
    console.error("Email send error:", err);
    return { success: false, error: "Failed to send email" };
  }
}
