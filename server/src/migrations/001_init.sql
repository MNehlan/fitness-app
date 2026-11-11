CREATE TABLE
  users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    name VARCHAR(30) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now (),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now ()
  );

CREATE TABLE
  exercises (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    user_id UUID REFERENCES users (id) ON DELETE CASCADE,
    source_exercise_id UUID REFERENCES exercises (id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now (),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now ()
  );
CREATE INDEX idx_exercises_user_id ON exercises(user_id);
CREATE INDEX idx_exercises_source_exercise_id ON exercises(source_exercise_id);


CREATE TABLE
  workouts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    name VARCHAR(255) NOT NULL,
    difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
    user_id UUID REFERENCES users (id) ON DELETE CASCADE,
    source_workout_id UUID REFERENCES workouts (id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now (),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now ()
  );
CREATE INDEX idx_workouts_user_id ON workouts(user_id);
CREATE INDEX idx_workouts_source_workout_id ON workouts(source_workout_id);

CREATE TABLE
  workout_exercises (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    workout_id UUID NOT NULL REFERENCES workouts (id) ON DELETE CASCADE,
    exercise_id UUID NOT NULL REFERENCES exercises (id) ON DELETE RESTRICT,
    position INTEGER NOT NULL CHECK (position > 0),
    UNIQUE (workout_id, position)
  );
CREATE INDEX idx_workout_exercises_exercise_id ON workout_exercises(exercise_id);

CREATE TABLE
  workout_sets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    workout_exercise_id UUID NOT NULL REFERENCES workout_exercises (id) ON DELETE CASCADE,
    set_number INTEGER NOT NULL CHECK (set_number > 0),
    reps INTEGER NOT NULL CHECK (reps > 0),
    weight NUMERIC CHECK (weight >= 0),
    UNIQUE (workout_exercise_id, set_number)
  );

CREATE TABLE
  plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    user_id UUID REFERENCES users (id) ON DELETE CASCADE,
    source_plan_id UUID REFERENCES plans (id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now (),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now ()
  );
CREATE INDEX idx_plans_user_id ON plans(user_id);
CREATE INDEX idx_plans_source_plan_id ON plans(source_plan_id);

CREATE TABLE
  plan_workouts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    plan_id UUID NOT NULL REFERENCES plans (id) ON DELETE CASCADE,
    workout_id UUID NOT NULL REFERENCES workouts (id) ON DELETE CASCADE,
    day_number INTEGER NOT NULL CHECK (day_number > 0),
    UNIQUE (plan_id, workout_id, day_number)
  );
CREATE INDEX idx_plan_workouts_plan_id ON plan_workouts(plan_id);
CREATE INDEX idx_plan_workouts_workout_id ON plan_workouts(workout_id);