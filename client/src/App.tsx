import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';

const App = () => {
  return (
    <div>
      <h1 className='text-4xl font-bold underline'>Fitness App</h1>
      <Navbar />
      <Dashboard />
    </div>
  );
};

export default App;
