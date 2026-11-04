export class SupabaseConfigurationError extends Error {
  constructor() {
    super("Supabase Auth is not configured for this deployment.");
    this.name = "SupabaseConfigurationError";
  }
}

export type SupabasePublicConfig = {
  url: string;
  anonKey: string;
};

/** Read only the public Supabase project URL and anon key. */
export function getSupabasePublicConfig(): SupabasePublicConfig {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

  if (!url || !anonKey) throw new SupabaseConfigurationError();

  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    throw new SupabaseConfigurationError();
  }

  const localHost = ["localhost", "127.0.0.1", "[::1]"].includes(parsed.hostname);
  if (parsed.protocol !== "https:" && !(parsed.protocol === "http:" && localHost)) {
    throw new SupabaseConfigurationError();
  }

  return { url: parsed.origin, anonKey };
}
