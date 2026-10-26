import { createClient } from '@supabase/supabase-js';

// Configuration: Replace with your Supabase Project details or set in .env
// VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://oppnyzpwcakbzidfkonn.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9wcG55enB3Y2FrYnppZGZrb25uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI5OTM2NDgsImV4cCI6MjEwODU2OTY0OH0.6NVOioUspwpMz4vZGLh6ZuGRb8k7AvjXfHpx2saD3TA';

export const isCloudEnabled = Boolean(supabaseUrl && supabaseAnonKey && !supabaseUrl.includes('YOUR_'));

export const supabase = isCloudEnabled ? createClient(supabaseUrl, supabaseAnonKey) : null;

/**
 * Fetch all students from Supabase cloud database
 */
export async function fetchStudentsFromCloud() {
  if (!isCloudEnabled || !supabase) return null;
  try {
    const { data, error } = await supabase
      .from('student_records')
      .select('*')
      .order('id', { ascending: true });

    if (error) {
      console.warn('Supabase fetch error:', error.message);
      return null;
    }

    // Map database snake_case columns back to component keys
    return data.map(s => ({
      id: s.id,
      name: s.name,
      rollno: s.rollno,
      password: s.password || 'password123',
      father: s.father || '',
      phone: s.phone || '',
      email: s.email || '',
      department: s.department || 'Computer Science',
      semester: s.semester || 5,
      passing_year: s.passing_year || 2028,
      college: s.college || 'NIT Trichy',
      university: s.university || 'Anna University',
      marks: s.marks || 0,
      percentage: Number(s.percentage) || 0,
      attendance: s.attendance || 0,
      midterm: s.midterm || 0,
      labScore: s.lab_score || s.labScore || 0,
      assignmentsCompleted: s.assignments_completed || s.assignmentsCompleted || 0,
      riskScore: s.risk_score || 0,
      riskCategory: s.risk_category || 'Safe'
    }));
  } catch (err) {
    console.error('Failed to connect to cloud database:', err);
    return null;
  }
}

/**
 * Insert a new student record into cloud database
 */
export async function insertStudentToCloud(s) {
  if (!isCloudEnabled || !supabase) return null;
  try {
    const payload = {
      name: s.name,
      rollno: s.rollno.trim().toUpperCase(),
      password: s.password || 'password123',
      father: s.father || '',
      phone: s.phone || '',
      email: s.email || '',
      department: s.department || 'Computer Science',
      semester: parseInt(s.semester) || 5,
      passing_year: parseInt(s.passing_year) || 2028,
      college: s.college || 'NIT Trichy',
      university: s.university || 'Anna University',
      marks: parseInt(s.marks) || 0,
      percentage: parseFloat(s.percentage) || 0,
      attendance: parseInt(s.attendance) || 0,
      midterm: parseInt(s.midterm) || 0,
      lab_score: parseInt(s.labScore || s.lab_score) || 0,
      assignments_completed: parseInt(s.assignmentsCompleted || s.assignments_completed) || 0,
      risk_score: parseInt(s.riskScore || s.risk_score) || 0,
      risk_category: typeof s.riskCategory === 'object' ? s.riskCategory.label : (s.riskCategory || s.risk_category || 'Safe')
    };

    console.log('Sending payload to Supabase:', payload);

    const { data, error } = await supabase
      .from('student_records')
      .upsert([payload], { onConflict: 'rollno' })
      .select();

    if (error) {
      console.error('Supabase error inserting student:', error);
      throw error;
    }
    console.log('Successfully saved to Supabase:', data);
    return data && data[0] ? data[0] : null;
  } catch (err) {
    console.error('Failed to insert into cloud:', err);
    return null;
  }
}

/**
 * Update an existing student record in cloud database
 */
export async function updateStudentInCloud(id, s) {
  if (!isCloudEnabled || !supabase) return false;
  try {
    const payload = {
      name: s.name,
      rollno: s.rollno.trim().toUpperCase(),
      password: s.password || 'password123',
      father: s.father || '',
      phone: s.phone || '',
      email: s.email || '',
      department: s.department,
      semester: parseInt(s.semester) || 5,
      passing_year: parseInt(s.passing_year) || 2028,
      college: s.college,
      university: s.university,
      marks: parseInt(s.marks) || 0,
      percentage: parseFloat(s.percentage) || 0,
      attendance: parseInt(s.attendance) || 0,
      midterm: parseInt(s.midterm) || 0,
      lab_score: parseInt(s.labScore || s.lab_score) || 0,
      assignments_completed: parseInt(s.assignmentsCompleted || s.assignments_completed) || 0,
      risk_score: parseInt(s.riskScore || s.risk_score) || 0,
      risk_category: typeof s.riskCategory === 'object' ? s.riskCategory.label : (s.riskCategory || s.risk_category || 'Safe')
    };

    const { error } = await supabase
      .from('student_records')
      .upsert([payload], { onConflict: 'rollno' });

    if (error) throw error;
    return true;
  } catch (err) {
    console.error('Failed to update in cloud:', err);
    return false;
  }
}

/**
 * Delete a student record from cloud database
 */
export async function deleteStudentFromCloud(id, rollno) {
  if (!isCloudEnabled || !supabase) return false;
  try {
    let query = supabase.from('student_records').delete();
    if (rollno) {
      query = query.eq('rollno', rollno);
    } else {
      query = query.eq('id', id);
    }
    const { error } = await query;
    if (error) throw error;
    return true;
  } catch (err) {
    console.error('Failed to delete from cloud:', err);
    return false;
  }
}
