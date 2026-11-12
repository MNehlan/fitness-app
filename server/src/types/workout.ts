interface CreatedWorkout {
    id: string;
    name: string;
    difficulty: "easy" | "medium" | "hard";
    created_at: Date;
    updated_at: Date;
}

interface WorkoutDetailRow {
    workout_id: string;
    workout_name: string;
    difficulty: "easy" | "medium" | "hard";
    created_at: Date;
    updated_at: Date;

    workout_exercise_id: string | null;
    exercise_id: string | null;
    position: number | null;

    exercise_name: string | null;
    exercise_description: string | null;

    set_id: string | null;
    set_number: number | null;
    reps: number | null;
    weight: string | null;
}

interface WorkoutSetResponse {
    id: string;
    set_number: number;
    reps: number;
    weight: string | null;
}

interface WorkoutExerciseResponse {
    workoutExerciseId: string;
    id: string;
    name: string;
    description: string | null;
    position: number;
    sets: WorkoutSetResponse[];
}

interface WorkoutDetailResponse {
    id: string;
    name: string;
    difficulty: "easy" | "medium" | "hard";
    created_at: Date;
    updated_at: Date;
    exercises: WorkoutExerciseResponse[];
}

interface WorkoutSetInput {
    id?: string;
    reps: number;
    weight?: number | null;
}

export type {
    CreatedWorkout,
    WorkoutDetailRow,
    WorkoutSetResponse,
    WorkoutExerciseResponse,
    WorkoutDetailResponse,
    WorkoutSetInput
};
