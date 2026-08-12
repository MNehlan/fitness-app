import type { Workout } from '../types/workout';

type WorkoutSummaryProps = {
  workouts: Workout[];
}

const WorkoutSummary = ({ workouts }: WorkoutSummaryProps) => {
  return (
    <div>
      <h1>WorkoutSummary</h1>
      {workouts.map((workout) => (
        <p key={workout.id}>{workout.name}</p>
      ))}
    </div>
  );
};

export default WorkoutSummary;
