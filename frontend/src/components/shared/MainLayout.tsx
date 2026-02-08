import { Toaster } from "../ui/toaster";
import Header from "./Header";

function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">{children}</main>
      <Toaster />
    </div>
  )
}

export default MainLayout;