// import { TeacherForm } from "@/components/auth/teacherRegister-form"; 
import { SubjectForm } from "@/components/auth/subjectRegister-form";
import { TeacherForm } from "@/components/auth/teacherRegister-form";
import { StudentForm } from "@/components/auth/studentRegister-form";
import { RegisterForm } from "@/components/auth/userRegister-form";
import { AdminRegisterForm } from "@/components/auth/adminRegister-form";



const register = () => {
  return (
    <div>
      {/* <StudentForm />  */}
      {/* <TeacherForm/> */}
      <AdminRegisterForm/>
      {/* <RegisterForm/> */}
    </div>
  );
}

export default register;