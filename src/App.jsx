import React from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import ActivityPage from "./pages/ActivityPage.jsx";
import SubActivityPage from "./pages/SubActivityPage.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage/>}/>
        <Route path="/activities" element={<ActivityPage/>}/>
        <Route path="/activities/:id" element={<SubActivityPage/>}/>
      </Routes>
    </Router>
  );
}

export default App;