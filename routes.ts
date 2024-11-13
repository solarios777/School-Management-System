
/**
 * this is an array of publicRoutes that are accesseable to everyone
 * this routes do not require authentication
 * @type {string[]}
 */
export const publicRoutes=[
    "/"
]



export const authRoutes=[
    "/auth/login",
    "/auth/register"
]


export const apiAuthPrefix="/api/auth"


export const DEFAULT_LOGIN_REDIRECT="/admin"