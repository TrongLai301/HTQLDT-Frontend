import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './components/pages/login/login';
import Register from './components/pages/login/register';
import PageWait from './components/standbyPage/pageWait';
 import Users from './components/users/users';
import AuthContext from './components/checkToken/AuthContext';
import NotFoundPage from './components/pages/NotFoundPage/notFoundPage';
import Training from './components/training/training';
import HomePage from './components/pages/homePage/homePage';
import { MarkInternModal } from './components/pages/InternPage/markInternModal';
import './assets/css/index.css';
import TrainingStats from './components/stats/trainingStats/trainingStats';
import RecruitmentStats from './components/stats/recruitmentStats/recruitmentStats';
import PersonalNeeds from './components/Recruitment/personalNeeds';
import CandidateManagement from './components/Recruitment/candidateManagement';
import RecruitmentPlan from './components/Recruitment/recruitmentPlan';
import axiosInstance from './components/checkToken/axiosInstance';
import ClientPage from './components/clientPage/clientPage';
import './assets/css/responsive.css'
import Email from './components/fragment/email/email';

function App() {

    return (
        <>
            <Email />
            <Routes>
                <Route path="/dashboard" element={<AuthContext><HomePage /></AuthContext>} />
                <Route path="/" element={<AuthContext><ClientPage /></AuthContext>} />
                <Route path="/users" element={<AuthContext><Users /></AuthContext>} />
                <Route path="/intern" element={<AuthContext><MarkInternModal userID={1} /></AuthContext>} />
                <Route path="/login" element={<AuthContext><Login /></AuthContext>} />
                <Route path="/register" element={<AuthContext><Register /></AuthContext>} />
                <Route path="/pageWait" element={<AuthContext><PageWait /></AuthContext>} />
                <Route path="/notFound" element={<NotFoundPage />} />
                <Route path="/training" element={<AuthContext><Training /></AuthContext>} />
                <Route path="/training/stats" element={<AuthContext><TrainingStats /></AuthContext>} />
                <Route path="/recruitment/stats" element={<AuthContext><RecruitmentStats /></AuthContext>} />
                <Route path="/recruitment/personalNeeds" element={<AuthContext><PersonalNeeds  /></AuthContext>} />
                <Route path="/recruitment/candidateManagement" element={<AuthContext><CandidateManagement /></AuthContext>} />
                <Route path="/recruitment/recruitmentPlan" element={<AuthContext><RecruitmentPlan /></AuthContext>} />
            </Routes>
        </>
    );
}

export default App;
