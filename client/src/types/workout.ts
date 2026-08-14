export type Difficulty = 'easy' | 'medium' | 'hard'

export type Workout = {
  id: string;
  name: string;
  difficulty: Difficulty
};