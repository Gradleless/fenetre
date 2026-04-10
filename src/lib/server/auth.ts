import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { sveltekitCookies } from 'better-auth/svelte-kit'
import { admin, lastLoginMethod } from 'better-auth/plugins'
import { ac, admin as adminRole, superadmin as superadminRole, user as userRole } from '$lib/server/permissions'
import { env } from '$lib/server/env'
import { getRequestEvent } from '$app/server'
import { db } from '$lib/server/db'

export const auth = betterAuth({
	baseURL: env.ORIGIN,
	secret: env.BETTER_AUTH_SECRET,
	database: drizzleAdapter(db, { provider: 'pg' }),
	emailAndPassword: { enabled: true },
	socialProviders: {},
	session: {
		expiresIn: 60 * 60 * 24 * 7
	},
	rateLimit: {
		enabled: true,
		window: 60,
		max: 10,
		storage: 'memory'
	},
	advanced: {
		ipAddress: {
			ipAddressHeaders: ['cf-connecting-ip', 'x-forwarded-for']
		}
	},
	plugins: [
		admin({
			ac,
			roles: { user: userRole, admin: adminRole, superadmin: superadminRole },
			adminRoles: ['admin', 'superadmin'],
			defaultRole: 'user'
		}),
		lastLoginMethod(),
		sveltekitCookies(getRequestEvent)
	]
})
