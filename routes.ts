
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

export const DEFAULT_LOGIN_REDIRECT="/admin/"
type RouteAccessMap = {
  [key: string]: string[];
};

export const routeAccessMap: RouteAccessMap = {
  "/admin(.*)": ["admin"],
  "/student(.*)": ["student"],
  "/teacher(.*)": ["teacher"],
  "/parent(.*)": ["parent"],
  "/list/teachers": ["admin"],
  "/list/students": ["admin"],
  "/list/parents": ["admin"],
  "/list/subjects": ["admin"],
  "/list/classes": ["admin", "teacher"],
  "/list/exams": ["admin", "teacher", "student", "parent"],
  "/list/assignments": ["admin", "teacher", "student", "parent"],
  "/list/results": ["admin", "teacher", "student", "parent"],
  "/list/attendance": ["admin", "teacher"],
  "/list/events": ["admin", "teacher", "student", "parent"],
  "/list/announcements": ["admin", "teacher", "student", "parent"],
};