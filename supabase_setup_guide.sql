-- ==============================================================
-- SUPABASE CLOUD SQL SCRIPT
-- Paste this into your Supabase Dashboard -> SQL Editor and click RUN
-- ==============================================================

-- 1. Create the student_records table in Supabase
CREATE TABLE IF NOT EXISTS student_records (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    rollno TEXT UNIQUE NOT NULL,
    password TEXT DEFAULT 'password123',
    father TEXT,
    phone TEXT,
    email TEXT,
    department TEXT DEFAULT 'Computer Science',
    semester INT DEFAULT 5,
    passing_year INT DEFAULT 2028,
    college TEXT DEFAULT 'NIT Trichy',
    university TEXT DEFAULT 'Anna University',
    marks INT DEFAULT 0,
    percentage NUMERIC(5,2) DEFAULT 0.00,
    attendance INT DEFAULT 0,
    midterm INT DEFAULT 0,
    lab_score INT DEFAULT 0,
    assignments_completed INT DEFAULT 0,
    risk_score INT DEFAULT 0,
    risk_category TEXT DEFAULT 'Safe',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Enable public read and write access for the web portal
ALTER TABLE student_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access" 
ON student_records FOR SELECT 
USING (true);

CREATE POLICY "Allow public insert access" 
ON student_records FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow public update access" 
ON student_records FOR UPDATE 
USING (true);

CREATE POLICY "Allow public delete access" 
ON student_records FOR DELETE 
USING (true);

-- 3. Seed initial 10 students
INSERT INTO student_records 
(name, rollno, password, father, phone, email, department, semester, passing_year, college, university, marks, percentage, attendance, midterm, lab_score, assignments_completed, risk_score, risk_category)
VALUES
('Aarav Sharma', 'CS2024001', 'password123', 'Rajesh Sharma', '9876543210', 'aarav.s@college.edu', 'Computer Science', 5, 2028, 'NIT Trichy', 'Anna University', 458, 91.6, 92, 88, 95, 98, 0, 'Safe'),
('Priya Patel', 'CS2024002', 'password123', 'Vikram Patel', '9876543211', 'priya.p@college.edu', 'Computer Science', 5, 2028, 'NIT Trichy', 'Anna University', 472, 94.4, 96, 94, 97, 100, 0, 'Safe'),
('Rahul Verma', 'EC2024003', 'password123', 'Suresh Verma', '9876543212', 'rahul.v@college.edu', 'Electronics', 5, 2028, 'NIT Trichy', 'Anna University', 312, 62.4, 58, 52, 48, 45, 68, 'Critical'),
('Sneha Gupta', 'ME2024004', 'password123', 'Anil Gupta', '9876543213', 'sneha.g@college.edu', 'Mechanical', 5, 2028, 'NIT Trichy', 'Anna University', 389, 77.8, 78, 72, 80, 85, 23, 'Moderate'),
('Karan Singh', 'CS2024005', 'password123', 'Harpreet Singh', '9876543214', 'karan.s@college.edu', 'Computer Science', 5, 2028, 'NIT Trichy', 'Anna University', 278, 55.6, 48, 42, 38, 35, 91, 'Critical'),
('Ananya Reddy', 'EC2024006', 'password123', 'Krishna Reddy', '9876543215', 'ananya.r@college.edu', 'Electronics', 5, 2028, 'NIT Trichy', 'Anna University', 425, 85.0, 88, 82, 90, 92, 0, 'Safe'),
('Vikash Kumar', 'ME2024007', 'password123', 'Ramesh Kumar', '9876543216', 'vikash.k@college.edu', 'Mechanical', 5, 2028, 'NIT Trichy', 'Anna University', 345, 69.0, 65, 60, 55, 62, 48, 'Watchlist'),
('Divya Nair', 'CS2024008', 'password123', 'Sunil Nair', '9876543217', 'divya.n@college.edu', 'Computer Science', 5, 2028, 'NIT Trichy', 'Anna University', 445, 89.0, 91, 86, 92, 95, 0, 'Safe'),
('Arjun Mehta', 'EC2024009', 'password123', 'Prakash Mehta', '9876543218', 'arjun.m@college.edu', 'Electronics', 5, 2028, 'NIT Trichy', 'Anna University', 298, 59.6, 55, 48, 45, 50, 74, 'Critical'),
('Meera Joshi', 'ME2024010', 'password123', 'Deepak Joshi', '9876543219', 'meera.j@college.edu', 'Mechanical', 5, 2028, 'NIT Trichy', 'Anna University', 410, 82.0, 84, 78, 85, 88, 14, 'Safe')
ON CONFLICT (rollno) DO NOTHING;
