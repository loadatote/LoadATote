export function ownerEmailsFromEnv() {
  return (process.env.NEXT_PUBLIC_OWNER_EMAILS || process.env.OWNER_EMAILS || '')
    .split(',')
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);
}
