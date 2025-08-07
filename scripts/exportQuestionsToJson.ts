import { QUESTIONS_DB_ORDERED } from '../services/questionsDbOrdered';
import fs from 'fs';

// Asegúrate de que cada pregunta tenga los campos: saga, difficulty, question, options, correct_answer
const questions = QUESTIONS_DB_ORDERED.map(q => ({
  saga: q.saga,
  difficulty: q.difficulty,
  question: q.question,
  options: q.options,
  correct_answer: q.correct_answer,
}));

fs.writeFileSync(
  './questions_export.json',
  JSON.stringify(questions, null, 2),
  'utf-8'
);

console.log(`Exported ${questions.length} questions to questions_export.json`);
