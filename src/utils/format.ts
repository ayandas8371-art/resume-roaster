// ============================================
// FORMATTING UTILITIES
// ============================================

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

export function formatRelativeTime(date: string | Date): string {
  const now = new Date();
  const then = new Date(date);
  const diffMs = now.getTime() - then.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDate(date);
}

export function getScoreColor(score: number): string {
  if (score >= 80) return "text-emerald-400";
  if (score >= 60) return "text-orange-400";
  if (score >= 40) return "text-yellow-400";
  return "text-red-500";
}

export function getScoreGradient(score: number): string {
  if (score >= 80)
    return "from-green-500 to-emerald-400";
  if (score >= 60)
    return "from-orange-500 to-yellow-400";
  if (score >= 40)
    return "from-yellow-500 to-orange-400";
  return "from-red-600 to-red-400";
}

export function getScoreLabel(score: number): string {
  if (score >= 90) return "Actually impressive";
  if (score >= 80) return "Pretty good";
  if (score >= 70) return "Decent";
  if (score >= 60) return "Needs work";
  if (score >= 50) return "Yikes";
  if (score >= 40) return "Rough";
  if (score >= 30) return "Pain";
  if (score >= 20) return "Brutal";
  return "Career terrorism";
}

export function formatPlanName(plan: string): string {
  return plan.charAt(0).toUpperCase() + plan.slice(1);
}

export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - 3) + "...";
}
