import { Home } from './pages/Home'
import { ThemeProvider } from './components/ThemeProvider'

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="json-formatter-theme">
      <Home />
    </ThemeProvider>
  )
}

export default App
