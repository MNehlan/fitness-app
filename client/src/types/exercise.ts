export interface Exercise {
  id: string;
  name: string;
  description: string | null;
}

export interface ExerciseFormState {
  name: string;
  description?: string;
}