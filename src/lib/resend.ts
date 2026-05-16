import { Resend } from "resend";

// ============================================
// EMAIL SERVICE
// ============================================

function getResendClient(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  return new Resend(key);
}

export async function sendWelcomeEmail(
  email: string,
  name?: string
): Promise<void> {
  const resend = getResendClient();
  if (!resend) return;

  try {
    await resend.emails.send({
      from: "Roast My Resume <noreply@roastmyresume.com>",
      to: email,
      subject: "Welcome to Roast My Resume 🔥",
      html: `
        <div style="font-family: 'Inter', system-ui, sans-serif; max-width: 600px; margin: 0 auto; background: #0A0A0A; color: #FAFAFA; padding: 40px; border-radius: 16px;">
          <h1 style="font-size: 28px; margin-bottom: 16px;">Welcome to Roast My Resume 🔥</h1>
          <p style="color: #A1A1AA; font-size: 16px; line-height: 1.6;">
            Hey ${name || "there"},
          </p>
          <p style="color: #A1A1AA; font-size: 16px; line-height: 1.6;">
            Your resume is about to get roasted harder than a Thanksgiving turkey.
            But don't worry — we'll also fix it so you actually get hired.
          </p>
          <p style="color: #A1A1AA; font-size: 16px; line-height: 1.6;">
            You've got <strong style="color: #EF4444;">2 free roasts</strong> to start.
            Use them wisely. Or don't. We'll judge either way.
          </p>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard"
             style="display: inline-block; background: linear-gradient(135deg, #EF4444, #A855F7); color: white; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; margin-top: 24px;">
            Upload Your First Resume →
          </a>
          <p style="color: #52525B; font-size: 12px; margin-top: 40px;">
            © Roast My Resume. Brutal honesty, delivered with love.
          </p>
        </div>
      `,
    });
  } catch (error) {
    console.error("Failed to send welcome email:", error);
  }
}

export async function sendRoastCompleteEmail(
  email: string,
  score: number,
  headline: string
): Promise<void> {
  const resend = getResendClient();
  if (!resend) return;

  try {
    await resend.emails.send({
      from: "Roast My Resume <noreply@roastmyresume.com>",
      to: email,
      subject: `Your Resume Scored ${score}/100 🔥`,
      html: `
        <div style="font-family: 'Inter', system-ui, sans-serif; max-width: 600px; margin: 0 auto; background: #0A0A0A; color: #FAFAFA; padding: 40px; border-radius: 16px;">
          <h1 style="font-size: 28px; margin-bottom: 16px;">Your Resume Got Roasted 🔥</h1>
          <div style="background: #141414; border-radius: 12px; padding: 24px; margin: 24px 0; border: 1px solid #27272A;">
            <p style="font-size: 48px; font-weight: bold; text-align: center; margin: 0;">
              <span style="background: linear-gradient(135deg, #EF4444, #F97316); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
                ${score}/100
              </span>
            </p>
            <p style="color: #A1A1AA; text-align: center; font-style: italic; margin-top: 12px;">
              "${headline}"
            </p>
          </div>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard"
             style="display: inline-block; background: linear-gradient(135deg, #EF4444, #A855F7); color: white; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-weight: 600;">
            View Full Roast →
          </a>
        </div>
      `,
    });
  } catch (error) {
    console.error("Failed to send roast email:", error);
  }
}
