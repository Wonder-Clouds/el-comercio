import { BrowserRouter } from 'react-router'
import AppRoutes from './routes/AppRoutes'
import Header from './components/shared/Header'

function App() {

  return (
    <BrowserRouter>
      <Header />
      <div className="max-w-7xl mx-auto mt-12">
        <AppRoutes />
      </div>
    </BrowserRouter>
  )
}

export default App
