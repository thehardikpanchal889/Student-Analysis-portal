import { createClient } from '@supabase/supabase-js';

// Configuration: Replace with your Supabase Project details or set in .env
// VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

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
      rollno: s.rollno,
      password: s.password || 'password123',
      father: s.father || '',
      phone: s.phone || '',
      email: s.email || '',
      department: s.department,
      semester: s.semester,
      passing_year: s.passing_year,
      college: s.college,
      university: s.university,
      marks: s.marks,
      percentage: s.percentage,
      attendance: s.attendance,
      midterm: s.midterm,
      lab_score: s.labScore,
      assignments_completed: s.assignmentsCompleted,
      risk_score: s.riskScore || 0,
      risk_category: typeof s.riskCategory === 'object' ? s.riskCategory.label : (s.riskCategory || 'Safe')
    };

    const { data, error } = await supabase
      .from('student_records')
      .insert([payload])
      .select();

    if (error) throw error;
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
      rollno: s.rollno,
      password: s.password,
      father: s.father,
      phone: s.phone,
      email: s.email,
      department: s.department,
      semester: s.semester,
      passing_year: s.passing_year,
      college: s.college,
      university: s.university,
      marks: s.marks,
      percentage: s.percentage,
      attendance: s.attendance,
      midterm: s.midterm,
      lab_score: s.labScore,
      assignments_completed: s.assignmentsCompleted,
      risk_score: s.riskScore || 0,
      risk_category: typeof s.riskCategory === 'object' ? s.riskCategory.label : (s.riskCategory || 'Safe')
    };

    const { error } = await supabase
      .from('student_records')
      .update(payload)
      .eq('id', id);

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
export async function deleteStudentFromCloud(id) {
  if (!isCloudEnabled || !supabase) return false;
  try {
    const { error } = await supabase
      .from('student_records')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (err) {
    console.error('Failed to delete from cloud:', err);
    return false;
  }
}
