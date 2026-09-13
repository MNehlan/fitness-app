import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Exercises from './pages/Exercises';
import Workouts from './pages/Workouts';

const App = () => {
  return (
    <div className='min-h-screen bg-gray-900'>
      <Navbar />
      <Routes>
        <Route
          path='/dashboard'
          element={<Dashboard />}
        />
        <Route
          path='/exercises'
          element={<Exercises />}
        />
        <Route
          path='/workouts'
          element={<Workouts />}
        />
      </Routes>
    </div>
  );
};

export default App;
