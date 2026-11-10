-- set the source_workout_id column to null when the workout got deleted
ALTER TABLE workouts
DROP CONSTRAINT workouts_source_workout_id_fkey,
ADD CONSTRAINT workouts_source_workout_id_fkey
FOREIGN KEY (source_workout_id)
REFERENCES workouts (id)
ON DELETE SET NULL;

ALTER TABLE exercises
DROP CONSTRAINT exercises_source_exercise_id_fkey,
ADD CONSTRAINT exercises_source_exercise_id_fkey
FOREIGN KEY (source_exercise_id)
REFERENCES exercises (id)
ON DELETE SET NULL;

ALTER TABLE plans
DROP CONSTRAINT plans_source_plan_id_fkey,
ADD CONSTRAINT plans_source_plan_id_fkey
FOREIGN KEY (source_plan_id)
REFERENCES plans (id)
ON DELETE SET NULL;