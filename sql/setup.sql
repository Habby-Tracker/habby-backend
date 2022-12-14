DROP TABLE IF EXISTS moods;
DROP TABLE IF EXISTS habits;
DROP TABLE IF EXISTS goals;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS status;
DROP TABLE IF EXISTS time_periods;
DROP TABLE IF EXISTS habit_types;
DROP TABLE IF EXISTS users CASCADE;


CREATE TABLE users (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    EMAIL VARCHAR NOT NULL UNIQUE,
    password_hash VARCHAR NOT NULL,
    first_name VARCHAR,
    last_name VARCHAR,
    avatar VARCHAR,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE status (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR NOT NULL
);

CREATE TABLE habit_types (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR NOT NULL
);

CREATE TABLE time_periods (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR NOT NULL,
    day_count INT NOT NULL
);

CREATE TABLE categories (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR NOT NULL,
    default_icon text NOT NULL,
    user_id BIGINT,
    FOREIGN KEY (user_id) REFERENCES users (id)
);

CREATE TABLE goals (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id BIGINT,
    goal_category_id BIGINT NOT NULL,
    goal_name VARCHAR NOT NULL,
    time_period_id BIGINT NOT NULL,
    time_period_count INT NOT NULL,
    habit_type_id BIGINT,
    default_habit_name VARCHAR NOT NULL,
    status_id BIGINT NOT NULL DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id),
    FOREIGN KEY (status_id) REFERENCES status (id),
    FOREIGN KEY (goal_category_id) REFERENCES categories(id),
    FOREIGN KEY (time_period_id) REFERENCES time_periods(id),
    FOREIGN KEY (habit_type_id) REFERENCES habit_types(id)
);

CREATE TABLE habits (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    goal_id INT NOT NULL, 
    user_id BIGINT NOT NULL,
    habit_name VARCHAR NOT NULL,
    status_id BIGINT NOT NULL DEFAULT 1,
    due_date TIMESTAMP NOT NULL,
    completed_date TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id),
    FOREIGN KEY (status_id) REFERENCES status (id),
    FOREIGN KEY (goal_id) REFERENCES goals(id)
);

CREATE TABLE moods (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    mood VARCHAR NOT NULL,
    date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    user_id BIGINT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users (id)
);


INSERT INTO habit_types (name) VALUES ('Daily'), ('Weekly');

INSERT INTO status (name) VALUES ('Active'), ('Inactive'), ('Completed');

INSERT INTO categories (name, default_icon, user_id) VALUES 
('Health', 'https://i.imgur.com/0Z0Z7Z0.png', null),
 ('Fitness', 'https://i.imgur.com/0Z0Z7Z0.png', null), 
 ('Nutrition', 'https://i.imgur.com/0Z0Z7Z0.png', null), 
 ('Mental Health', 'https://i.imgur.com/0Z0Z7Z0.png', null), 
 ('Social', 'https://i.imgur.com/0Z0Z7Z0.png', null), 
 ('Career', 'https://i.imgur.com/0Z0Z7Z0.png', null), 
 ('Finance', 'https://i.imgur.com/0Z0Z7Z0.png', null), 
 ('Education', 'https://i.imgur.com/0Z0Z7Z0.png', null), 
 ('Spiritual', 'https://i.imgur.com/0Z0Z7Z0.png', null), 
 ('Other', 'https://i.imgur.com/0Z0Z7Z0.png', null);

INSERT INTO time_periods (name, day_count) VALUES
('Days', 1),
('Weeks', 7),
('Months', 30);

INSERT INTO goals (user_id, goal_category_id, goal_name, time_period_id, habit_type_id, default_habit_name, status_id, time_period_count) VALUES
(null, '1', 'test goal', '1', '1', 'test goal', '1', 3),
(null, '1', 'test goal 2', '1', '1', 'test goal 2', '1', 20);
