import { QuestionsAPI, QUESTIONS_DB } from '../services/questionsApi';

async function run() {
  const saga = process.argv[2] || 'skypea';
  const iterations = parseInt(process.argv[3] || '5', 10);
  console.log(`\n=== Debug Story Mode (${iterations} runs) saga=${saga} ===`);

  for (let i = 0; i < iterations; i++) {
    const qs = await QuestionsAPI.getQuestions(saga, 10, undefined, true);
    const counts = qs.reduce((acc: Record<string, number>, q) => { acc[q.difficulty] = (acc[q.difficulty]||0)+1; return acc; }, {} as Record<string, number>);
    console.log(`Run #${i+1}: order=${qs.map(q=>q.difficulty).join('>')} counts=${JSON.stringify(counts)}`);
  }

  console.log('\nPool local (solo para referencia si fallback):');
  const easy = QUESTIONS_DB.filter(q=>q.saga===saga && q.difficulty==='easy').length;
  const medium = QUESTIONS_DB.filter(q=>q.saga===saga && q.difficulty==='medium').length;
  const hard = QUESTIONS_DB.filter(q=>q.saga===saga && q.difficulty==='hard').length;
  console.log(`Pool -> easy=${easy} medium=${medium} hard=${hard}`);
}

run().catch(e=>{ console.error(e); process.exit(1); });
