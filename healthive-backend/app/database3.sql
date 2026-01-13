USE calorie_app;

-- USERS
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- USER PROFILES
CREATE TABLE user_profiles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,

    weight FLOAT,
    height FLOAT,
    age INT,
    gender ENUM('Laki-laki','Perempuan'),
    activity_level ENUM(
        'Kurang Aktif',
        'Sedikit Aktif',
        'Cukup Aktif',
        'Sangat Aktif',
        'Ekstra Aktif'
    ),

    bmi FLOAT,
    daily_target INT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

-- FOODS
CREATE TABLE foods (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    category ENUM(
        'karbohidrat',
        'protein',
        'sayur',
        'buah',
        'lemak',
        'produk susu'
    ) NOT NULL,

    calories_per_gram FLOAT NOT NULL,
    protein_per_gram FLOAT NOT NULL,
    carbs_per_gram FLOAT NOT NULL,
    fat_per_gram FLOAT NOT NULL
);

-- USER FOOD LOGS
CREATE TABLE user_food_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    food_id INT NOT NULL,

    gram FLOAT NOT NULL,

    calories FLOAT NOT NULL,
    protein FLOAT NOT NULL,
    carbs FLOAT NOT NULL,
    fat FLOAT NOT NULL,

    log_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    FOREIGN KEY (food_id)
        REFERENCES foods(id)
        ON DELETE CASCADE
);
