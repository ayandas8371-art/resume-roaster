import { Resend } from 'resend';

let resendInstance: Resend | null = null;

function getResend() {
  if (!resendInstance && process.env.RESEND_API_KEY) {
    resendInstance = new Resend(process.env.RESEND_API_KEY);
  }
  return resendInstance;
}

export async function sendRoastEmail(to: string, userName: string, score: number, roastText: string) {
  if (!process.env.RESEND_API_KEY) {
    console.warn("Resend API key missing, skipping email");
    return;
  }

  try {
    const resend = getResend();
    if (!resend) return;
    await resend.emails.send({
      from: 'Roast My Resume <onboarding@resend.dev>',
      to: [to],
      subject: `Your Resume Roast Result: ${score}/10 🔥`,
      html: `
        <div style="font-family: sans-serif; background-color: #141414; color: #FAFAFA; padding: 40px; border-radius: 16px;">
          <h1 style="color: #A855F7;">Hey ${userName}!</h1>
          <p style="font-size: 18px;">The AI has finished tearing apart your resume.</p>
          <div style="background-color: #1E1E1E; padding: 24px; border-left: 4px solid #EF4444; margin: 24px 0;">
            <h2 style="margin-top: 0;">Roast Score: ${score}/10</h2>
            <p style="font-style: italic; color: #A1A1AA;">"${roastText.substring(0, 200)}..."</p>
          </div>
          <p>Want to see the full roast and the fixed version?</p>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" style="display: inline-block; background-color: #A855F7; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">View Full Roast</a>
          <p style="margin-top: 40px; font-size: 12px; color: #71717A;">
            Roast My Resume — Stop submitting mid resumes.
          </p>
        </div>
      `
    });
  } catch (error) {
    console.error("Failed to send email:", error);
  }
}
