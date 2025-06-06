import { Toaster } from "../ui/toaster";
import Header from "./Header";

function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Header />
      <main>{children}</main>
      <Toaster />
    </div>
  )
}

export default MainLayout;