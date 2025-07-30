import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header.jsx'
import HomePage from './components/HomePage.jsx'
import AssessmentModePage from './pages/AssessmentModePage';
import GuidedQuizPage from './pages/GuidedQuizPage';
import QuizPageComplete from './pages/QuizPageComplete';
import EnhancedResultsPage from './pages/EnhancedResultsPage';
import ResultsPageFixed from './pages/ResultsPageFixed';
import AboutPage from './pages/AboutPage.jsx'
import FAQPage from './pages/FAQPage.jsx'
import ContactPage from './pages/ContactPage.jsx'
import './App.css'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white flex flex-col">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/assessment-mode" element={<AssessmentModePage />} />
            <Route path="/test" element={<GuidedQuizPage />} />
            <Route path="/test-classic" element={<QuizPageComplete />} />
            <Route path="/results" element={<EnhancedResultsPage />} />
            <Route path="/results-classic" element={<ResultsPageFixed />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/contact" element={<ContactPage />} />
          </Routes>
        </main>
        {/* <Footer /> */}
      </div>
    </Router>
  )
}

export default App


