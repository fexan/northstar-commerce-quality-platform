import { config as loadEnvironment } from 'dotenv'
import path from 'node:path'

loadEnvironment({ path: path.resolve(process.cwd(), '.env'), quiet: true })
loadEnvironment({
  path: path.resolve(
    process.cwd(),
    'my-medusa-store/apps/storefront/.env.local',
  ),
  override: false,
  quiet: true,
})

export const environment = {
  storefrontBaseUrl:
    process.env.STOREFRONT_BASE_URL ??
    process.env.NEXT_PUBLIC_BASE_URL?.replace('https://', 'http://') ??
    'http://127.0.0.1:8000',
  backendBaseUrl:
    process.env.MEDUSA_BACKEND_URL ??
    process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL ??
    'http://127.0.0.1:9000',
  publishableKey:
    process.env.MEDUSA_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY ??
    '',
  adminApiKey: process.env.MEDUSA_ADMIN_API_KEY ?? '',
}
