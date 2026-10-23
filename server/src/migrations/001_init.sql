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
    user_id UUID REFERENCES users (id),
    source_exercise_id UUID REFERENCES exercises (id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now (),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now ()
  );

CREATE TABLE
  workouts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    name VARCHAR(255) NOT NULL,
    difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
    user_id UUID REFERENCES users (id),
    source_workout_id UUID REFERENCES workouts (id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now (),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now ()
  );

CREATE TABLE
  workout_exercises (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    workout_id UUID NOT NULL REFERENCES workouts (id),
    exercise_id UUID NOT NULL REFERENCES exercises (id),
    position INTEGER NOT NULL CHECK (position > 0),
    UNIQUE (workout_id, position)
  );

CREATE TABLE
  workout_sets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    workout_exercise_id UUID NOT NULL REFERENCES workout_exercises (id),
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
    user_id UUID REFERENCES users (id),
    source_plan_id UUID REFERENCES plans (id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now (),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now ()
  );

CREATE TABLE
  plan_workouts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    plan_id UUID NOT NULL REFERENCES plans (id),
    workout_id UUID NOT NULL REFERENCES workouts (id),
    day_number INTEGER NOT NULL CHECK (day_number > 0)
  );