import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Exercises from './pages/Exercises';

const App = () => {
  return (
    <div className='min-h-screen bg-gray-900'>
      <Navbar />
      <Routes>
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/exercises' element={<Exercises />} />
      </Routes>
    </div>
  );
};

export default App;
