BEGIN;

-- 1. Add all 9 missing foreign key indexes
CREATE INDEX IF NOT EXISTS idx_exercises_user_id ON exercises(user_id);
CREATE INDEX IF NOT EXISTS idx_exercises_source_exercise_id ON exercises(source_exercise_id);

CREATE INDEX IF NOT EXISTS idx_workouts_user_id ON workouts(user_id);
CREATE INDEX IF NOT EXISTS idx_workouts_source_workout_id ON workouts(source_workout_id);

CREATE INDEX IF NOT EXISTS idx_workout_exercises_exercise_id ON workout_exercises(exercise_id);

CREATE INDEX IF NOT EXISTS idx_plans_user_id ON plans(user_id);
CREATE INDEX IF NOT EXISTS idx_plans_source_plan_id ON plans(source_plan_id);

CREATE INDEX IF NOT EXISTS idx_plan_workouts_plan_id ON plan_workouts(plan_id);
CREATE INDEX IF NOT EXISTS idx_plan_workouts_workout_id ON plan_workouts(workout_id);

-- 2. Add unique constraint to plan_workouts
ALTER TABLE plan_workouts
  ADD CONSTRAINT plan_workouts_plan_workout_day_unique
  UNIQUE (plan_id, workout_id, day_number);

-- 3. Update ON DELETE rules on foreign keys
ALTER TABLE exercises
  DROP CONSTRAINT exercises_user_id_fkey,
  ADD CONSTRAINT exercises_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

ALTER TABLE workouts
  DROP CONSTRAINT workouts_user_id_fkey,
  ADD CONSTRAINT workouts_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

ALTER TABLE workout_exercises
  DROP CONSTRAINT workout_exercises_workout_id_fkey,
  ADD CONSTRAINT workout_exercises_workout_id_fkey
    FOREIGN KEY (workout_id) REFERENCES workouts(id) ON DELETE CASCADE,
  DROP CONSTRAINT workout_exercises_exercise_id_fkey,
  ADD CONSTRAINT workout_exercises_exercise_id_fkey
    FOREIGN KEY (exercise_id) REFERENCES exercises(id) ON DELETE RESTRICT;

ALTER TABLE workout_sets
  DROP CONSTRAINT workout_sets_workout_exercise_id_fkey,
  ADD CONSTRAINT workout_sets_workout_exercise_id_fkey
    FOREIGN KEY (workout_exercise_id) REFERENCES workout_exercises(id) ON DELETE CASCADE;

ALTER TABLE plans
  DROP CONSTRAINT plans_user_id_fkey,
  ADD CONSTRAINT plans_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

ALTER TABLE plan_workouts
  DROP CONSTRAINT plan_workouts_plan_id_fkey,
  ADD CONSTRAINT plan_workouts_plan_id_fkey
    FOREIGN KEY (plan_id) REFERENCES plans(id) ON DELETE CASCADE,
  DROP CONSTRAINT plan_workouts_workout_id_fkey,
  ADD CONSTRAINT plan_workouts_workout_id_fkey
    FOREIGN KEY (workout_id) REFERENCES workouts(id) ON DELETE CASCADE;

COMMIT;
