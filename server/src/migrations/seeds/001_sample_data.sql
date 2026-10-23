
-- 1. Insert the system exercise if it doesn't already exist.
-- user_id IS NULL identifies system-provided exercises.

INSERT INTO exercises (name, description)
SELECT 'Bench Press', 'A compound chest exercise performed using a barbell.'
WHERE NOT EXISTS ( 
    SELECT 1 FROM exercises
    WHERE name = 'Bench Press' AND user_id IS NULL
);


-- 2. Insert the system workout if it doesn't already exist.

INSERT INTO workouts (name, difficulty)
SELECT 'Upper Body Beginner', 'easy'
WHERE NOT EXISTS ( 
    SELECT 1 FROM workouts 
    WHERE name = 'Upper Body Beginner' AND user_id IS NULL
);


-- 3. Connect Bench Press to Upper Body Beginner.
-- CROSS JOIN combines the matching workout and exercise rows.
-- WHERE NOT EXISTS avoids inserting the same placement twice.
-- Position 1 means Bench Press comes first.

INSERT INTO workout_exercises ( workout_id, exercise_id, position )
SELECT w.id, e.id, 1 FROM workouts AS w
CROSS JOIN exercises AS e
WHERE w.name = 'Upper Body Beginner'
  AND w.user_id IS NULL
  AND e.name = 'Bench Press'
  AND e.user_id IS NULL
  AND NOT EXISTS (
      SELECT 1
      FROM workout_exercises AS we
      WHERE we.workout_id = w.id
        AND we.position = 1
  );


-- 4. Add the planned sets for Bench Press.
-- Find the existing exercise placement instead of hardcoding its UUID.
-- Each VALUES row represents one set.
-- Weight is stored in kilograms.
-- Skip any set number that already exists for this placement.

INSERT INTO workout_sets ( workout_exercise_id, set_number, reps, weight )
SELECT we.id, s.set_number, s.reps, s.weight FROM workout_exercises AS we
JOIN workouts AS w ON w.id = we.workout_id
JOIN exercises AS e ON e.id = we.exercise_id
CROSS JOIN (
    VALUES
        (1, 10, 20::NUMERIC),
        (2, 8, 25::NUMERIC),
        (3, 8, 25::NUMERIC)
) AS s(set_number, reps, weight)
WHERE w.name = 'Upper Body Beginner'
  AND w.user_id IS NULL
  AND e.name = 'Bench Press'
  AND e.user_id IS NULL
  AND we.position = 1
  AND NOT EXISTS (
      SELECT 1 FROM workout_sets AS ws
      WHERE ws.workout_exercise_id = we.id
        AND ws.set_number = s.set_number
  );


-- 5. Create the system plan if it doesn't already exist.

INSERT INTO plans (name, description)
SELECT '30-Day Beginner Plan', 'A beginner-friendly fitness program.'
WHERE NOT EXISTS ( 
    SELECT 1 FROM plans WHERE name = '30-Day Beginner Plan' AND user_id IS NULL
);


-- 6. Schedule Upper Body Beginner on Day 1.
-- Find the existing plan and workout by name.
-- Avoid inserting the same schedule twice.

INSERT INTO plan_workouts ( plan_id, workout_id, day_number )
SELECT p.id, w.id, 1 FROM plans AS p
CROSS JOIN workouts AS w
WHERE p.name = '30-Day Beginner Plan'
  AND p.user_id IS NULL
  AND w.name = 'Upper Body Beginner'
  AND w.user_id IS NULL
  AND NOT EXISTS (
      SELECT 1 FROM plan_workouts AS pw
      WHERE pw.plan_id = p.id
        AND pw.workout_id = w.id
        AND pw.day_number = 1
  );