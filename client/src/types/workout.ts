export type Difficulty = 'easy' | 'medium' | 'hard';

export type Workout = {
  id: string;
  name: string;
  difficulty: Difficulty;
};

export interface CreateWorkout {
  name: string;
  difficulty: Difficulty;
}

export interface WorkoutFormState {
  name: string;
  difficulty: Difficulty;
}