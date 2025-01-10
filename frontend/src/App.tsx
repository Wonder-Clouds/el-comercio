import { BrowserRouter } from 'react-router'
import AppRoutes from './routes/AppRoutes'
import Header from './components/shared/Header'

function App() {

  return (
    <BrowserRouter>
      <Header />
      <AppRoutes />
    </BrowserRouter>
  )
}

export default App
