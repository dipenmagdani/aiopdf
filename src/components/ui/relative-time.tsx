"use client";

export function RelativeTime() {
  const date = new Date().getFullYear();
  return <span suppressHydrationWarning>{date}</span>;
}
