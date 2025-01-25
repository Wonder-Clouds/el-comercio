import LoginForm from "@/components/login/LoginForm";

export default function Login() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="relative z-10">
        <LoginForm />
      </div>
    </div>
  )
}

