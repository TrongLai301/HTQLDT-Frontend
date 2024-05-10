import './App.css';
import { Route, Routes } from 'react-router-dom';
import PersonalNeeds from './components/Recruitment/personalNeeds';
import './assets/css/index.css'
import Test from './components/Recruitment/test'
import Users from './components/users/users';
import Training from './components/training/training';

function App() {
  return (
    <>
      <Routes>
        <Route path='/recruitment' element={<PersonalNeeds />} />
        <Route path='/users' element={<Users />} />
        <Route path='/training' element={<Training />} />
        <Route path='/' element={<Test />} />
      </Routes>
    </>
  );
}

export default App;