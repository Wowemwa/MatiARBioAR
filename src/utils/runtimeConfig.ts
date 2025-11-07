export async function getAdminPassword(): Promise<string | undefined> {
  // Try to load a runtime config served from the site (public/runtime-config.json)
  try {
    const res = await fetch('/runtime-config.json', { cache: 'no-store' })
    if (res.ok) {
      const json = await res.json()
      const pass = json?.VITE_ADMIN_PASS
      if (pass) return String(pass).trim()
    }
  } catch (err) {
    // ignore network errors and fall back to build-time env
  }

  // Fallback to the build-time Vite env var
  return (import.meta.env.VITE_ADMIN_PASS as string | undefined)?.trim()
}

export default getAdminPassword
