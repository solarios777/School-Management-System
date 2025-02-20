import { z } from "zod";


export const LoginSchema = z.object({
    name: z.string().min(1, "Username is required"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    role: z.enum(["user", "parent", "student", "teacher", "admin"], {
        errorMap: () => ({ message: "Role is required" }),
    }),
});

export const RegisterSchema = z.object({
    email: z.string().email({ message: "Invalid email!" }),
    password: z.string().min(6, { message: "Minimum 6 characters is required!" }),
    name: z.string().min(1, { message: "First name is required!" }),    
   
});


export const AdminSchema = z.object({
   id: z.string().optional(),
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters long!" })
    .max(20, { message: "Username must be at most 20 characters long!" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long!" })
    .optional()
    .or(z.literal("")),
  name: z.string().min(1, { message: "First name is required!" }),
  surname: z.string().min(1, { message: "Last name is required!" }),
  email: z
    .string()
    .email({ message: "Invalid email address!" })
    .optional()
    .or(z.literal("")),
  phone: z.string().optional(),
  address: z.string(),
  img: z.string().optional(),
  bloodType: z.string().min(1, { message: "Blood Type is required!" }),
  birthday: z.coerce.date({ message: "Birthday is required!" }),
  sex: z.enum(["MALE", "FEMALE"], { message: "Sex is required!" }),
  role: z.enum(["TEACHER", "ADMIN", "STUDENT", "PARENT"], { message: "Role is required!" }),
 });

export type AdminFormValues = z.infer<typeof AdminSchema>;
// Ensure UserRole and UserSex enums are defined and imported

export const teacherSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, { message: "First name is required!" }),
  surname: z.string().min(1, { message: "Last name is required!" }),
  email: z
    .string()
    .email({ message: "Invalid email address!" })
    .optional()
    .or(z.literal("")),
  phone: z.string().optional(),
  address: z.string(),
  img: z.string().optional(),
  bloodType: z.string().min(1, { message: "Blood Type is required!" }),
  birthday: z.coerce.date({ message: "Birthday is required!" }),
  sex: z.enum(["MALE", "FEMALE"], { message: "Sex is required!" }),
  role: z.enum(["TEACHER", "ADMIN", "STUDENT", "PARENT"], { message: "Role is required!" }), // Add roles as needed
});

export type TeacherSchema = z.infer<typeof teacherSchema>;

export const parentSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, { message: "First name is required!" }),
  surname: z.string().min(1, { message: "Last name is required!" }),
  email: z
    .string()
    .email({ message: "Invalid email address!" })
    .optional()
    .or(z.literal("")),
  phone: z.string().optional(),
  address: z.string(),
  img: z.string().optional(),
  bloodType: z.string().min(1, { message: "Blood Type is required!" }),
  birthday: z.coerce.date({ message: "Birthday is required!" }),
  sex: z.enum(["MALE", "FEMALE"], { message: "Sex is required!" }),
  role: z.enum(["TEACHER", "ADMIN", "STUDENT", "PARENT"], { message: "Role is required!" }),
});



export type ParentSchema = z.infer<typeof parentSchema>;

export const subjectSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, { message: "Subject name is required!" }),
});
export type SubjectSchema = z.infer<typeof subjectSchema>;
export const sectionSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, { message: "Subject name is required!" }),
});
export type SectionSchema = z.infer<typeof sectionSchema>;

export const studentSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, { message: "First name is required!" }),
  surname: z.string().min(1, { message: "Last name is required!" }),
  email: z
    .string()
    .email({ message: "Invalid email address!" })
    .optional()
    .or(z.literal("")),
  phone: z.string().optional(),
  address: z.string(),
  img: z.string().optional(),
  bloodType: z.string().min(1, { message: "Blood Type is required!" }),
  birthday: z.coerce.date({ message: "Birthday is required!" }),
  sex: z.enum(["MALE", "FEMALE"], { message: "Sex is required!" }),
  role: z.enum(["TEACHER", "ADMIN", "STUDENT", "PARENT"], { message: "Role is required!" }),
});

export type StudentSchema = z.infer<typeof studentSchema>;

export const changePasswordSchema = z.object({
  
  id: z.string().optional(),
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters long!" })
    .max(20, { message: "Username must be at most 20 characters long!" }),
  oldPassword: z.string().min(6, { message: "Minimum 6 characters is required!" }),
  newPassword: z
    .string()
    .min(6, { message: "Minimum 6 characters is required!" })
    .max(20, { message: "Maximum 20 characters is required!" }),
  confirmPassword: z
    .string()
    .min(6, { message: "Minimum 6 characters is required!" })
    .max(20, { message: "Maximum 20 characters is required!" }),
  role: z.enum(["TEACHER", "ADMIN", "STUDENT", "PARENT"], { message: "Role is required!" }),

})
export type ChangePasswordSchema = z.infer<typeof changePasswordSchema >;


const currentYear = new Date().getFullYear();

export const superviserSchema = z.object({
  id: z.string().optional(),
  teachername: z
    .string()
    .min(3, { message: "Teacher name must be at least 3 characters long!" }),
  grade: z.coerce.string().min(1, { message: "Grade is required!" }),
  classname: z.coerce.string().min(1, { message: "Section is required!" }),
  year: z.coerce
    .number()
    .int({ message: "Year must be an integer!" })
    .min(currentYear, { message: `Year must be ${currentYear}!` })
    .max(currentYear, { message: `Year must be ${currentYear}!` }),
});

export type SuperviserSchema = z.infer<typeof superviserSchema >;


export const teacherAssignmentSchema = z.object({
  id: z.string().optional(),
  teachername: z
    .string()
    .min(3, { message: "Teacher name must be at least 3 characters long!" }),
  subjectname: z.string().min(1, { message: "Subject name is required!" }),
  grade: z.coerce.string().min(1, { message: "Grade is required!" }),
  classname: z.coerce.string().min(1, { message: "Section is required!" }),
  year: z.coerce
    .string()
    .min(3, { message: "Year is required!" }),
});

export type TeacherAssignmentSchema = z.infer<typeof teacherAssignmentSchema>;

export const studentEnrollmentSchema= z.object({
  id: z.string().optional(),
  studentname: z
    .string()
    .min(3, { message: "Teacher name must be at least 3 characters long!" }),
  grade: z.coerce.number().min(1, { message: "Grade is required!" }),
  classname: z.coerce.string().min(1, { message: "Section is required!" }),
 year: z.coerce
    .string()
    .min(3, { message: "Year is required!" }),
});
export type StudentEnrollmentSchema = z.infer<typeof studentEnrollmentSchema>;
