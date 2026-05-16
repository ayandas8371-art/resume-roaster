// ============================================
// SHARE UTILITIES
// ============================================

export function generateTwitterShareUrl(
  score: number,
  headline: string
): string {
  const text = `🔥 Just got my resume ROASTED: ${score}/100\n\n"${headline}"\n\nDare to get yours done? 👇`;
  const url = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3002";
  return `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
}

export function generateLinkedInShareUrl(): string {
  const url = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3002";
  return `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-999999px";
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand("copy");
      return true;
    } catch {
      return false;
    } finally {
      document.body.removeChild(textArea);
    }
  }
}

export function generateShareText(score: number, headline: string): string {
  const url = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3002";
  return `🔥 My resume just got ROASTED: ${score}/100\n\n"${headline}"\n\nGet your career strategy at ${url}`;
}
