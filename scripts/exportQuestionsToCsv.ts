import fs from 'fs';

// Lee el JSON exportado previamente
const questions = JSON.parse(fs.readFileSync('./questions_export.json', 'utf-8'));

// Encabezados del CSV
const headers = ['saga', 'difficulty', 'question', 'options', 'correct_answer'];

// Convierte cada pregunta a una fila CSV
const rows = questions.map((q: any) => [
  q.saga,
  q.difficulty,
  q.question.replace(/\n/g, ' '),
  JSON.stringify(q.options),
  q.correct_answer
]);

// Arma el CSV

const csv = [
  headers.join(','),
  ...rows.map((row: any[]) => row.map((field: any) => '"' + String(field).replace(/"/g, '""') + '"').join(','))
].join('\n');

fs.writeFileSync('./questions_export.csv', csv, 'utf-8');
console.log(`Exported ${questions.length} questions to questions_export.csv`);
