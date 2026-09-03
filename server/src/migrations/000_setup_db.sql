-- migrations/000_setup_db.sql
--
-- WARNING: THIS FILE IS DESTRUCTIVE.
-- Running this will permanently delete the database named below,
-- including ALL data in it. This cannot be undone.
--
-- Use this ONLY when you want to wipe and recreate the database
-- from scratch (e.g. first-time setup, or resetting a local dev copy).
-- Do NOT run this against a production or shared database.
--
-- Replace "fitness_app" below with whatever database name you want to use.
-- This file must be run WITHOUT connecting to that database first
-- (e.g. run it while connected to the default "postgres" database),
-- since Postgres won't let you drop a database you're currently inside.

DROP DATABASE IF EXISTS fitness_app;
CREATE DATABASE fitness_app;
\c fitness_app