import type { Workout } from '../types/workout';

type WorkoutListProps = {
  workouts: Workout[];
  onDelete: (id: string) => void;
};

const WorkoutList = ({ workouts, onDelete }: WorkoutListProps) => {
  return (
    <div>
      <h1>WorkoutList</h1>
      {workouts.map((workout) => (
        <div key={workout.id}>
          <p>{workout.name}</p>
          <button onClick={() => onDelete(workout.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
};

export default WorkoutList;
