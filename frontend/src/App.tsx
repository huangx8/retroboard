import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import BoardList from './components/BoardList'
import Whiteboard from './components/Whiteboard'
import './App.css'

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<BoardList />} />
          <Route path="/board/:boardId" element={<Whiteboard />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
