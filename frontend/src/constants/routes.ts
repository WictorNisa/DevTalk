export const ROUTES = {
    HOME: '/',
    LOGIN: '/login',
    DASHBOARD: '/dashboard',
    CHANNEL: (id: string) => `/channels/${id}`,
    NOT_FOUND: '/404'
} as const

