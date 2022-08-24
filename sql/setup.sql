DROP TABLE IF EXISTS habits;
DROP TABLE IF EXISTS goals;
DROP TABLE IF EXISTS users;


CREATE TABLE users (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    EMAIL VARCHAR NOT NULL UNIQUE,
    password_hash VARCHAR NOT NULL,
    first_name VARCHAR,
    last_name VARCHAR,
    avatar VARCHAR,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE goals (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id BIGINT NOT NULL,
    goal_category_id BIGINT NOT NULL,
    goal_name VARCHAR NOT NULL,
    time_period_id INT NOT NULL,
    habit_type_id VARCHAR NOT NULL,
    default_habit_name VARCHAR NOT NULL,
    status_id BIGINT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id),
    FOREIGN KEY (status_id) REFERENCES status(id),
    FOREIGN KEY (goal_category_id) REFERENCES categories(id),
    FOREIGN KEY (time_period_id) REFERENCES time_periods(id),
    FOREIGN KEY (habit_type_id) REFERENCES habit_types(id)
);

CREATE TABLE habits (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    goal_id BIGINT NOT NULL, 
    user_id BIGINT NOT NULL,
    habit_name VARCHAR NOT NULL,
    status_id BIGINT NOT NULL,
    due_date TIMESTAMP NOT NULL,
    completed_date TIMESTAMP NOT NULL
    FOREIGN KEY (user_id) REFERENCES users (id),
    FOREIGN KEY (status_id) REFERENCES status(id),
    FOREIGN KEY (goal_id) REFERENCES goals(id)
);

CREATE TABLE habit_types (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR NOT NULL
);

CREATE TABLE status (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR NOT NULL
);


