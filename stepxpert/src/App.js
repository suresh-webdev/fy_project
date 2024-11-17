import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./Components/Login";
import Dashboard from "./Pages/Dashboard";
import VideoStream from "./Components/VideoStream";
import "./index.css"
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} /> {/* Login route */}
        <Route path="/dashboard" element={<Dashboard />} /> {/* Dashboard route */}
        <Route path="/video" element={<VideoStream />} />
      </Routes>
    </Router>
    
  );
}

export default App;
