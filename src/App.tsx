import React from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import LoginPage from './pages/LoginPage.tsx';
import ActivityPage from "./pages/ActivityPage.tsx";
import SubActivityPage from "./pages/SubActivityPage.tsx";

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