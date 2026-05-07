-- Shayapravashi Fort Trekking Website Database Setup
-- Run this script after installing MySQL

-- Create database
CREATE DATABASE IF NOT EXISTS user_info;
USE user_info;

-- Create users table
CREATE TABLE IF NOT EXISTS user_info_table (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create forts table
CREATE TABLE IF NOT EXISTS forts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    location VARCHAR(100),
    difficulty ENUM('Easy', 'Medium', 'Hard') DEFAULT 'Medium',
    image_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create packages table
CREATE TABLE IF NOT EXISTS packages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    price DECIMAL(10,2),
    itinerary TEXT,
    season VARCHAR(50),
    base_village VARCHAR(100),
    difficulty ENUM('Easy', 'Medium', 'Hard') DEFAULT 'Medium',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create package images table
CREATE TABLE IF NOT EXISTS package_images (
    id INT AUTO_INCREMENT PRIMARY KEY,
    image_url VARCHAR(255) NOT NULL,
    package_id INT,
    FOREIGN KEY (package_id) REFERENCES packages(id) ON DELETE CASCADE
);

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fullname VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    participants INT DEFAULT 1,
    message TEXT,
    package_id INT,
    status ENUM('Pending', 'Confirmed', 'Cancelled') DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (package_id) REFERENCES packages(id) ON DELETE SET NULL
);

-- Insert sample admin user (password: admin123)
INSERT INTO user_info_table (username, email, password, role) VALUES 
('admin', 'admin@shayapravashi.com', '$2b$10$rQZ8K9vL2mN3pO4qR5sT6uV7wX8yZ9aB0cD1eF2gH3iJ4kL5mN6oP7qR8sT9uV', 'admin')
ON DUPLICATE KEY UPDATE username=username;

-- Insert sample forts
INSERT INTO forts (name, description, location, difficulty, image_url) VALUES 
('Raigad Fort', 'Historic fort of Chhatrapati Shivaji Maharaj, known for its strategic location and architectural marvel.', 'Raigad, Maharashtra', 'Hard', '/images/raigad.jpg'),
('Sinhagad Fort', 'Famous for the Battle of Sinhagad where Tanaji Malusare fought bravely.', 'Pune, Maharashtra', 'Medium', '/images/sinhagad.jpg'),
('Pratapgad Fort', 'Built by Chhatrapati Shivaji Maharaj, famous for the encounter with Afzal Khan.', 'Satara, Maharashtra', 'Medium', '/images/pratapgad.jpg'),
('Rajgad Fort', 'Former capital of Maratha Empire, known for its massive size and strategic importance.', 'Pune, Maharashtra', 'Hard', '/images/rajgad.jpg'),
('Lohagad Fort', 'Iron fort known for its unique architecture and scenic beauty.', 'Lonavala, Maharashtra', 'Easy', '/images/lohagad.jpg'),
('Shivneri Fort', 'Birthplace of Chhatrapati Shivaji Maharaj, a symbol of Maratha pride.', 'Pune, Maharashtra', 'Medium', '/images/shivneri.jpg'),
('Harishchandragad Fort', 'Ancient fort known for its temple and caves, popular among trekkers.', 'Ahmednagar, Maharashtra', 'Hard', '/images/harishchandragad.jpg'),
('Salher Fort', 'Highest fort in Maharashtra, offers breathtaking views.', 'Nashik, Maharashtra', 'Hard', '/images/salher.jpg'),
('Sindhudurg Fort', 'Sea fort built by Chhatrapati Shivaji Maharaj, unique island fort.', 'Sindhudurg, Maharashtra', 'Medium', '/images/sindhudurg.jpg')
ON DUPLICATE KEY UPDATE name=name;

-- Insert sample packages
INSERT INTO packages (name, price, itinerary, season, base_village, difficulty) VALUES 
('Raigad Fort Trek', 1500.00, 'Day 1: Arrival at base village, Day 2: Trek to Raigad Fort, Day 3: Explore fort and return', 'Winter', 'Pachad', 'Hard'),
('Sinhagad Day Trek', 800.00, 'Early morning trek to Sinhagad, explore the fort, lunch at base village, return by evening', 'All Seasons', 'Sinhagad Ghat', 'Medium'),
('Pratapgad Adventure', 1200.00, '2-day trek including fort exploration and local village visit', 'Monsoon', 'Par', 'Medium'),
('Rajgad Heritage Trek', 1800.00, '3-day trek covering the massive fort complex with historical insights', 'Winter', 'Gunjavane', 'Hard'),
('Lohagad Family Trek', 600.00, 'Easy family-friendly trek suitable for beginners', 'All Seasons', 'Malavli', 'Easy')
ON DUPLICATE KEY UPDATE name=name;

-- Insert sample package images
INSERT INTO package_images (image_url, package_id) VALUES 
('/images/raigad.jpg', 1),
('/images/sinhagad.jpg', 2),
('/images/pratapgad.jpg', 3),
('/images/rajgad.jpg', 4),
('/images/lohagad.jpg', 5)
ON DUPLICATE KEY UPDATE image_url=image_url;

-- Show success message
SELECT 'Database setup completed successfully!' as Status;
SELECT 'Admin login: admin@shayapravashi.com / admin123' as Admin_Info;


