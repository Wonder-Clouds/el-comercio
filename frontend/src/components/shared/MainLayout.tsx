import Header from "./Header";

function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Header />
      <div className="mx-auto mt-12 max-w-7xl">
        <main>{children}</main>
      </div>
    </div>
  )
}

export default MainLayout;