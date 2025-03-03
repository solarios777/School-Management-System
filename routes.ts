
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

export const routeAccessMap = {
  "/admin": ["admin"],
  "/list/register": ["admin"],
  "/list/teachers": ["admin"],
  "/list/teachers/[id]": ["admin", "teacher"], // Dynamic route for teachers
  "/list/students": ["admin"],
  "/list/students/[id]": ["admin", "student"], // Dynamic route for students
  "/list/parents": ["admin"],
  "/list/parents/[id]": ["admin", "parent"], // Dynamic route for parents
  "/list/subjects": ["admin"],
  "/list/classes": ["admin"],
  "/list/attendance": ["admin"],
  "/list/lessons": ["admin", "teacher", "student", "parent"],
  "/list/exams": ["admin", "teacher", "student", "parent"],
  "/list/assignments": ["admin", "teacher", "student", "parent"],
  "/list/results": ["admin", "teacher", "student", "parent"],
  "/list/event": ["admin", "teacher", "student", "parent"],
  "/list/messages": ["admin", "teacher", "student", "parent"],
  "/list/announcements": ["admin", "teacher", "student", "parent"],
  "/list/schedule": ["admin"],
  "/list/tasks": ["admin"],
  "/list/resultDashboard": ["admin", "teacher"],
  "/list/addResults": ["admin", "teacher"],
  "/list/viewResults": ["admin", "teacher"],
  "/list/singleStudentResult": ["admin", "teacher"],
  "/list/changePassword": ["admin", "teacher", "student", "parent"],
  "/settings/preferences": ["admin", "teacher", "student", "parent"],
  "/logout": ["admin", "teacher", "student", "parent"],
};