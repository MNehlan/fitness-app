import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className='bg-gray-900 text-gray-100 p-4'>
      <h1 className='text-4xl font-bold mb-2'>Fitness App</h1>
      <div className='flex gap-6 text-gray-300 justify-between'>
        <Link to='/'>Fitness</Link>
        <Link to='/dashboard'>Dashboard</Link>
        <a href='#'>Workouts</a>
        <Link to='/exercises'>Exercises</Link>
        <a href='#'>Progress</a>
      </div>
    </nav>
  );
};

export default Navbar;
