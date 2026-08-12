import type { Workout } from '../types/workout';

type WorkoutListProps = {
  workouts: Workout[];
}


const WorkoutList = ({ workouts }: WorkoutListProps) => {
  return (
    <div>
      <h1>WorkoutList</h1>
      {workouts.map((workout) => (
        <p key={workout.id}>{workout.name}</p>
      ))}
    </div>
  );
};

export default WorkoutList;
