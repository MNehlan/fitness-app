export type CreatedWorkout = {
    id: string;
    name: string;
    difficulty: "easy" | "medium" | "hard";
    created_at: Date;
    updated_at: Date;
};
