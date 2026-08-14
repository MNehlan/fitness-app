import { useState } from 'react';
import type { Workout, Difficulty } from '../types/workout';

type WorkoutListProps = {
  workouts: Workout[];
  onDelete: (id: string) => void;
  onUpdate: (id: string, newName: string, newDifficulty: Difficulty) => void;
};

const WorkoutList = ({ workouts, onDelete, onUpdate }: WorkoutListProps) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newName, setNewName] = useState('');
  const [newDifficulty, setNewDifficulty] = useState<Difficulty>('easy');

  function saveWorkout(id: string) {
    onUpdate(id, newName, newDifficulty);
    setEditingId(null);
    setNewName('');
    setNewDifficulty('easy');
  }

  function handleEdit(id: string, name: string, difficulty: Difficulty) {
    setEditingId(id);
    setNewName(name);
    setNewDifficulty(difficulty);
  }

  return (
    <div className='border my-6'>
      <h1>WorkoutList</h1>
      {workouts.map((workout) => (
        <div
          key={workout.id}
          className='border my-7'
        >
          {editingId === workout.id ? (
            <div>
              <input
                type='text'
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
              <select
                name='difficulty'
                value={newDifficulty}
                onChange={(e) => setNewDifficulty(e.target.value as Difficulty)}
              >
                <option value='easy'>Easy</option>
                <option value='medium'>Medium</option>
                <option value='hard'>Hard</option>
              </select>
              <button onClick={() => saveWorkout(workout.id)}>Save</button>
              <button onClick={() => setEditingId(null)}>Cancel</button>
            </div>
          ) : (
            <div>
              <p>{workout.name}</p>
              <p>{workout.difficulty}</p>
              <button
                onClick={() =>
                  handleEdit(workout.id, workout.name, workout.difficulty)
                }
              >
                Edit
              </button>
              <button onClick={() => onDelete(workout.id)}>Delete</button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default WorkoutList;
