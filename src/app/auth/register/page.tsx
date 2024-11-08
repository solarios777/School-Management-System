// import { TeacherForm } from "@/components/auth/teacherRegister-form"; 
import { SubjectForm } from "@/components/auth/subjectRegister-form";
import { TeacherForm } from "@/components/auth/teacherRegister-form";
import { StudentForm } from "@/components/auth/studentRegister-form";


const register = () => {
  return (
    <div>
      <StudentForm /> 
      {/* <TeacherForm/> */}
    </div>
  );
}

export default register;