import { LoginForm } from "@/components/auth/login-Form"; 

const Login = () => {
  return (
    <div className="h-screen flex items-center justify-center bg-cover bg-center" 
             style={{ backgroundImage: "url('/signin.webp')" }}>
      <LoginForm /> 
    </div>
  );
}

export default Login;