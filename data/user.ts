// ./data/user.ts
import {getUserByParentname, getUserByStudentname, getUserByTeachername,getUserByAdminname} from "./getUser"

export async function getUserByUsernameForRole(username: string, role: string) {
    switch (role) {
        case "parent":
            return await getUserByParentname(username);
        case "student":
            return await getUserByStudentname(username);
        case "teacher":
            return await getUserByTeachername(username);
        case "admin":
            return await getUserByAdminname(username);
        default:
            return null; // Role not recognized
    }
}