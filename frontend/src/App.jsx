import Hero from './components/Hero'
import Features from './components/Features'
import Footer from './components/Footer'
import './styles/globals.css'
import './App.css'

function App() {
  return (
    <div className="app">
      <Hero />
      <main id="main">
        <Features />
      </main>
      <Footer />
    </div>
  )
}

export default App
