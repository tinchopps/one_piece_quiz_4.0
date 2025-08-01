// services/feedbackService.ts
const SUPABASE_URL = 'https://feuwpfmbhsdtlzrxjrsv.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZldXdwZm1iaHNkdGx6cnhqcnN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQwNTk4NTgsImV4cCI6MjA2OTYzNTg1OH0.V7R3Y_tb7M7dG1HBs0W5M8fARWy7SydDhQb1wF-NTpY'; // Copia la publishable key o anon key de SupabaseKEY

export async function sendFeedback(feedback: {
  question: string;
  user_answer: string;
  correct_answer: string;
  is_correct: boolean;
  username?: string | null;
  problem_type?: string | null;
  comment?: string;
  rating?: number;
  unique_id?: string;
  timestamp?: string;
}) {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/feedback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify(feedback),
    });
    
    if (!res.ok) {
      console.error('Error en respuesta Supabase:', res.status, res.statusText);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error enviando a Supabase:', error);
    return false;
  }
}
