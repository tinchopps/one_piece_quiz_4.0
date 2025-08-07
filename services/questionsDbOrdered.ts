import { Question } from '@/types/game';

// Orden de sagas: east-blue, alabasta, skypea, water-7, thriller-bark, marineford, dressrosa, whole-cake-island, wano, punk-hazard

export const QUESTIONS_DB_ORDERED: Question[] = [
  // --- EAST BLUE ---
  // Easy
  { id: 2, saga: 'east-blue', difficulty: 'easy', question: '¿De qué material está hecho el sombrero de Luffy?', options: ['De goma', 'De tela', 'De algodón', 'De paja'], correct_answer: 'De paja' },
  { id: 3, saga: 'east-blue', difficulty: 'easy', question: '¿Quién fue el primer miembro en unirse a la tripulación de Luffy?', options: ['Nami', 'Zoro', 'Usopp', 'Sanji'], correct_answer: 'Zoro' },
  { id: 4, saga: 'east-blue', difficulty: 'easy', question: '¿Cuál es la fruta del diablo de Luffy?', options: ['Gomu Gomu no Mi', 'Mera Mera no Mi', 'Hie Hie no Mi', 'Gura Gura no Mi'], correct_answer: 'Gomu Gomu no Mi' },
  { id: 6, saga: 'east-blue', difficulty: 'easy', question: '¿Cuál es el sueño de Nami?', options: ['Dibujar un mapa del mundo', 'Ser fuerte', 'Encontrar tesoros', 'Navegar libre'], correct_answer: 'Dibujar un mapa del mundo' },
  { id: 8, saga: 'east-blue', difficulty: 'easy', question: '¿Cuántas espadas usa Zoro en su estilo de lucha?', options: ['Tres', 'Dos', 'Una', 'Cuatro'], correct_answer: 'Tres' },
  { id: 10, saga: 'east-blue', difficulty: 'easy', question: '¿Quién era el dueño del sombrero de paja antes que Luffy?', options: ['Shanks', 'Garp', 'Dragon', 'Mihawk'], correct_answer: 'Shanks' },
  { id: 25, saga: 'east-blue', difficulty: 'easy', question: '¿Luffy salvó a Zoro de ser ejecutado por la Marina?', options: ['Verdadero', 'Falso'], correct_answer: 'Verdadero' },
  { id: 51, saga: 'east-blue', difficulty: 'easy', question: '¿Cuál es el nombre del barco de los Sombreros de Paja en East Blue?', options: ['Going Merry', 'Thousand Sunny', 'Red Force', 'Oro Jackson'], correct_answer: 'Going Merry' },
  // Medium
  { id: 5, saga: 'east-blue', difficulty: 'medium', question: '¿Cómo se llama el restaurante donde trabajaba Sanji?', options: ['Baratie', 'Marine', 'Golden Merry', 'Red Force'], correct_answer: 'Baratie' },
  { id: 7, saga: 'east-blue', difficulty: 'medium', question: '¿Quién es el capitán de los Piratas del Gato Negro?', options: ['Kuro', 'Krieg', 'Arlong', 'Buggy'], correct_answer: 'Kuro' },
  { id: 9, saga: 'east-blue', difficulty: 'medium', question: '¿Cómo se llama el pueblo natal de Usopp?', options: ['Villa Syrup', 'Villa Orange', 'Cocoyasi', 'Shells Town'], correct_answer: 'Villa Syrup' },
  { id: 19, saga: 'east-blue', difficulty: 'medium', question: '¿Luffy derrotó a Buggy el Payaso en su primer enfrentamiento?', options: ['Verdadero', 'Falso'], correct_answer: 'Verdadero' },
  { id: 20, saga: 'east-blue', difficulty: 'medium', question: '¿Qué fruta del diablo tiene Buggy el Payaso?', options: ['Bara Bara no Mi', 'Gomu Gomu no Mi', 'Bomu Bomu no Mi', 'Suke Suke no Mi'], correct_answer: 'Bara Bara no Mi' },
  { id: 21, saga: 'east-blue', difficulty: 'medium', question: '¿Nami se unió a la tripulación de Luffy en el arco de Arlong Park?', options: ['Verdadero', 'Falso'], correct_answer: 'Verdadero' },
  { id: 22, saga: 'east-blue', difficulty: 'medium', question: '¿Qué fruta del diablo tiene Alvida después de su transformación?', options: ['Sube Sube no Mi', 'Bara Bara no Mi', 'Gomu Gomu no Mi', 'Bomu Bomu no Mi'], correct_answer: 'Sube Sube no Mi' },
  { id: 26, saga: 'east-blue', difficulty: 'medium', question: '¿Qué fruta del diablo tiene Smoker?', options: ['Moku Moku no Mi', 'Gomu Gomu no Mi', 'Hie Hie no Mi', 'Mera Mera no Mi'], correct_answer: 'Moku Moku no Mi' },
  { id: 53, saga: 'east-blue', difficulty: 'medium', question: '¿Cuántos miembros principales tiene la tripulación al final de East Blue?', options: ['5', '4', '6', '3'], correct_answer: '5' },
  { id: 70, saga: 'east-blue', difficulty: 'medium', question: '¿Cuál es la moneda oficial en la recompensa de los piratas?', options: ['Berries', 'Dólar Blue', 'Yenes', 'Moneda de Oro'], correct_answer: 'Berries' },
  // Hard
  { id: 23, saga: 'east-blue', difficulty: 'hard', question: '¿De cuánto es la recompensa de Higuma, el bandido de la montaña?', options: ['8.000.000', '4.000.000', '7.000.000', '1.500.000'], correct_answer: '8.000.000' },
  { id: 24, saga: 'east-blue', difficulty: 'hard', question: '¿Cómo se llama la tribu que derrotó a los piratas de Buggy?', options: ['Tribu Kumate', 'Tribu Kamuju', 'Tribu Tolteca', 'Tribu Poneglyph'], correct_answer: 'Tribu Kumate' },

  // --- ALABASTA ---
  // Easy
  { id: 11, saga: 'alabasta', difficulty: 'easy', question: '¿Cómo se llama la princesa de Alabasta?', options: ['Vivi', 'Nami', 'Robin', 'Tashigi'], correct_answer: 'Vivi' },
  { id: 12, saga: 'alabasta', difficulty: 'easy', question: '¿Cuál es la organización criminal principal en Alabasta?', options: ['Baroque Works', 'Marine', 'CP9', 'Arlong Park'], correct_answer: 'Baroque Works' },
  { id: 27, saga: 'alabasta', difficulty: 'easy', question: '¿Luffy derrotó a Crocodile en su primer enfrentamiento?', options: ['Falso', 'Verdadero'], correct_answer: 'Falso' },
  { id: 64, saga: 'alabasta', difficulty: 'easy', question: '¿Qué animal acompaña a los mugiwaras en el desierto de Alabasta?', options: ['Cangrejo', 'Lobo', 'Perro', 'Tortuga'], correct_answer: 'Cangrejo' },
  { id: 65, saga: 'alabasta', difficulty: 'easy', question: '¿Cómo se llama la ciudad principal de Alabasta?', options: ['Alubarna', 'Nanohana', 'Rainbase', 'Yuba'], correct_answer: 'Alubarna' },
  { id: 66, saga: 'alabasta', difficulty: 'easy', question: '¿Quién es el presidente de Baroque Works?', options: ['Mr. 0', 'Mr. 1', 'Mr. 2', 'Mr. 3'], correct_answer: 'Mr. 0' },
  { id: 67, saga: 'alabasta', difficulty: 'easy', question: '¿Qué nombre recibe el casino de Crocodile en Alabasta?', options: ['Rainbase', 'Alubarna', 'Nanohana', 'Yuba'], correct_answer: 'Rainbase' },
  // Medium
  { id: 14, saga: 'alabasta', difficulty: 'medium', question: '¿En qué desierto se encuentra Alabasta?', options: ['Sandora', 'Sahara', 'Gobi', 'Kalahari'], correct_answer: 'Sandora' },
  { id: 15, saga: 'alabasta', difficulty: 'medium', question: '¿Cómo se llaman los cocodrilos gigantes de Crocodile?', options: ['Bananawani', 'Kung-Fu Dugong', 'Sea King', 'Neptune'], correct_answer: 'Bananawani' },
  { id: 28, saga: 'alabasta', difficulty: 'medium', question: '¿Crocodile es uno de los Shichibukai?', options: ['Verdadero', 'Falso'], correct_answer: 'Verdadero' },
  { id: 29, saga: 'alabasta', difficulty: 'medium', question: '¿Cómo se llama el camello que acompaña a los Mugiwara en Alabasta?', options: ['Karoo', 'Matsuge', 'Peric', 'Pell'], correct_answer: 'Matsuge' },
  { id: 31, saga: 'alabasta', difficulty: 'medium', question: '¿Qué fruta del diablo tiene Crocodile?', options: ['Suna Suna no Mi', 'Gomu Gomu no Mi', 'Mera Mera no Mi', 'Hie Hie no Mi'], correct_answer: 'Suna Suna no Mi' },
  { id: 33, saga: 'alabasta', difficulty: 'medium', question: '¿Quién es el líder de los Rebeldes en Alabasta?', options: ['Kohza', 'Zoah', 'Chaka', 'Pell'], correct_answer: 'Kohza' },
  { id: 63, saga: 'alabasta', difficulty: 'medium', question: '¿Cómo se llama el jefe de la guardia real de Alabasta?', options: ['Igaram', 'Chaka', 'Pell', 'Cobra'], correct_answer: 'Igaram' },
  { id: 71, saga: 'alabasta', difficulty: 'medium', question: '¿Qué unidad de medida se usa para el agua en el desierto de Alabasta?', options: ['Litros', 'Extol', 'Barriles', 'Botellas'], correct_answer: 'Litros' },
  // Hard
  { id: 13, saga: 'alabasta', difficulty: 'hard', question: '¿Cuál es el nombre de la esposa de Toto, el padre de Koza?', options: ['Aswa', 'Soan', 'Robin', 'Tashigi'], correct_answer: 'Aswa' },
  { id: 54, saga: 'alabasta', difficulty: 'hard', question: '¿Cuál era el valor de la recompensa de Crocodile antes de ser Shichibukai?', options: ['81.000.000', '96.000.000', '100.000.000', '45.000.000'], correct_answer: '81.000.000' },
  { id: 68, saga: 'alabasta', difficulty: 'hard', question: '¿Cuál es el nombre completo, apodo y número del agente de Baroque Works conocido como Mr. 2?', options: ['Mr. 2 Bon Clay (Bentham)', 'Mr. 2 Bon Kurei (Bentham)', 'Mr. 2 Bon Clay (Daz Bones)', 'Mr. 2 Bon Kurei (Daz Bones)'], correct_answer: 'Mr. 2 Bon Clay (Bentham)' },
  { id: 69, saga: 'alabasta', difficulty: 'hard', question: '¿Cuál es el verdadero nombre de la agente de Baroque Works conocida como Miss Doublefinger?', options: ['Jarel', 'Zhela', 'Zala', 'Shigi'], correct_answer: 'Zala' },

  // --- SKYPEA ---
  // Easy
  { id: 16, saga: 'skypea', difficulty: 'easy', question: '¿Cómo se llama la isla en el cielo?', options: ['Skypea', 'Skylands', 'Cloud Island', 'Heaven'], correct_answer: 'Skypea' },
  { id: 39, saga: 'skypea', difficulty: 'easy', question: '¿Quién encontró el Poneglyph en Skypiea?', options: ['Robin', 'Nami', 'Luffy', 'Zoro'], correct_answer: 'Robin' },
  { id: 42, saga: 'skypea', difficulty: 'easy', question: '¿Cómo se llama el arca que construye Enel?', options: ['Maxim', 'Nola', 'Pierre', 'Upper Yard'], correct_answer: 'Maxim' },
  { id: 42, saga: 'skypea', difficulty: 'easy', question: '¿Quién ayudó a Luffy a derrotar a Enel?', options: ['Nami', 'Zoro', 'Sanji', 'Usopp'], correct_answer: 'Nami' },
  { id: 43, saga: 'skypea', difficulty: 'easy', question: 'Luffy y su tripulación encontraron oro en Skypiea', options: ['Verdadero', 'Falso'], correct_answer: 'Verdadero' },
  { id: 44, saga: 'skypea', difficulty: 'easy', question: '¿Qué habilidad tiene la fruta del diablo de Enel?', options: ['Controlar la electricidad', 'Controlar el fuego', 'Controlar el hielo', 'Controlar el agua'], correct_answer: 'Controlar la electricidad' },
  { id: 37, saga: 'skypea', difficulty: 'easy', question: '¿Enel fue derrotado por Luffy en Skypiea?', options: ['Verdadero', 'Falso'], correct_answer: 'Verdadero' },
  // Medium
  { id: 17, saga: 'skypea', difficulty: 'medium', question: '¿Quién era el dios de Skypea antes de Enel?', options: ['Gan Fall', 'Gan Dan', 'Fall Sain', 'Dios Satori'], correct_answer: 'Gan Fall' },
  { id: 18, saga: 'skypea', difficulty: 'medium', question: '¿Cuál es la fruta del diablo de Enel?', options: ['Goro Goro no Mi', 'Pika Pika no Mi', 'Magu Magu no Mi', 'Hie Hie no Mi'], correct_answer: 'Goro Goro no Mi' },
  { id: 38, saga: 'skypea', difficulty: 'medium', question: '¿Cuánto deben pagar los visitantes que visitan Skypea?', options: ['1.000.000.000 Extol', '100.000 Extol', '10.000 Extol', '1.000 Extol'], correct_answer: '1.000.000.000 Extol' },
  { id: 40, saga: 'skypea', difficulty: 'medium', question: '¿Enel planeaba destruir Skypiea?', options: ['Verdadero', 'Falso'], correct_answer: 'Verdadero' },
  { id: 41, saga: 'skypea', difficulty: 'medium', question: '¿Luffy usó su Gear Second en Skypiea?', options: ['Falso', 'Verdadero'], correct_answer: 'Falso' },
  { id: 45, saga: 'skypea', difficulty: 'medium', question: '¿Qué fruta comió Pierre, la mascota de Gan Fall?', options: ['Uma Uma no Mi', 'Tori Tori no Mi', 'Mera Mera no Mi', 'Gomu Gomu no Mi'], correct_answer: 'Uma Uma no Mi' },
  { id: 45, saga: 'skypea', difficulty: 'medium', question: '¿Luffy usó su Gear Third en Skypiea?', options: ['Falso', 'Verdadero'], correct_answer: 'Falso' },
  { id: 72, saga: 'skypea', difficulty: 'medium', question: '¿Cuál es la moneda oficial en Skypea?', options: ['Extol', 'Berries', 'SkyDollars', 'Dials'], correct_answer: 'Extol' },
  // Hard
  { id: 37, saga: 'skypea', difficulty: 'hard', question: '¿cómo es el nombre del arma principal que usa Enel para atacar?', options: ['Nonosama Bo', 'Goro Goro', 'Thor', 'Vari Goro'], correct_answer: 'Nonosama Bo' },
  { id: 55, saga: 'skypea', difficulty: 'hard', question: '¿Cuántos metros puede alcanzar la Knock Up Stream?', options: ['7.000', '5.000', '10.000', '3.000'], correct_answer: '7.000' },
  { id: 55, saga: 'skypea', difficulty: 'hard', question: '¿Cuál es el nombre del guerrero shandiano líder?', options: ['Wyper', 'Gan Fall', 'Satori', 'Ohm'], correct_answer: 'Wyper' },
  { id: 56, saga: 'skypea', difficulty: 'hard', question: '¿Cómo se llamaba la hija de Kalgara?', options: ['Mousse', 'Nola', 'Robin', 'Vivi'], correct_answer: 'Mousse' },
  { id: 56, saga: 'skypea', difficulty: 'hard', question: '¿Qué unidad de medida usan en Skypiea para la electricidad de Enel?', options: ['Voltios', 'Vearth', 'Dials', 'Sky Units'], correct_answer: 'Voltios' },
  { id: 57, saga: 'skypea', difficulty: 'hard', question: '¿Cuál es el nombre del tallo enorme que se encuentra en el centro de Upper Yard, en Skypiea?', options: ['Giant Jack', 'Maxim', 'Nola', 'Knock Up Stream'], correct_answer: 'Giant Jack' },

  // --- WATER 7 ---
  // Easy
  { id: 1001, saga: 'water-7', difficulty: 'easy', question: '¿Cómo se llama el carpintero que se une a la tripulación en Water 7?', options: ['Franky', 'Iceburg', 'Paulie', 'Kokoro'], correct_answer: 'Franky' },
  { id: 1002, saga: 'water-7', difficulty: 'easy', question: '¿Cuál es el nombre del tren marino que conecta Water 7 con otras islas?', options: ['Puffing Tom', 'Rocketman', 'Sea Train', 'Going Merry'], correct_answer: 'Puffing Tom' },
  { id: 1003, saga: 'water-7', difficulty: 'easy', question: '¿Quién es el alcalde de Water 7?', options: ['Iceburg', 'Franky', 'Kokoro', 'Paulie'], correct_answer: 'Iceburg' },
  // Medium
  { id: 1004, saga: 'water-7', difficulty: 'medium', question: '¿Cómo se llama la organización secreta que ataca Water 7?', options: ['CP9', 'Baroque Works', 'Revolucionarios', 'Marina'], correct_answer: 'CP9' },
  { id: 1005, saga: 'water-7', difficulty: 'medium', question: '¿Qué le sucede al Going Merry en Water 7?', options: ['Se rompe', 'Es robado', 'Es mejorado', 'Es vendido'], correct_answer: 'Se rompe' },
  { id: 1006, saga: 'water-7', difficulty: 'medium', question: '¿Quién es el líder de la Galley-La Company?', options: ['Iceburg', 'Franky', 'Paulie', 'Lucci'], correct_answer: 'Iceburg' },
  { id: 1010, saga: 'water-7', difficulty: 'medium', question: '¿Cómo se llama la estación de tren de Water 7?', options: ['Blue Station', 'Water Station', 'Dock 1', 'Galley-La Station'], correct_answer: 'Blue Station' },
  // Hard
  { id: 1007, saga: 'water-7', difficulty: 'hard', question: '¿Cuál es el verdadero nombre de Franky?', options: ['Cutty Flam', 'Tom', 'Paulie', 'Iceburg'], correct_answer: 'Cutty Flam' },
  { id: 1008, saga: 'water-7', difficulty: 'hard', question: '¿Quién traiciona a Iceburg y revela ser miembro de CP9?', options: ['Rob Lucci', 'Kaku', 'Kalifa', 'Todos los anteriores'], correct_answer: 'Todos los anteriores' },
  { id: 1009, saga: 'water-7', difficulty: 'hard', question: '¿Qué objeto importante roba Robin en Water 7?', options: ['Pluton blueprints', 'Poneglyph', 'Dials', 'Log Pose'], correct_answer: 'Pluton blueprints' },

  // --- THRILLER BARK ---
  // Easy
  { id: 1101, saga: 'thriller-bark', difficulty: 'easy', question: '¿Quién es el villano principal de Thriller Bark?', options: ['Gecko Moria', 'Perona', 'Hogback', 'Absalom'], correct_answer: 'Gecko Moria' },
  { id: 1102, saga: 'thriller-bark', difficulty: 'easy', question: '¿Qué poder tiene la fruta del diablo de Gecko Moria?', options: ['Controlar sombras', 'Controlar fuego', 'Controlar hielo', 'Controlar animales'], correct_answer: 'Controlar sombras' },
  { id: 1103, saga: 'thriller-bark', difficulty: 'easy', question: '¿Cómo se llama el esqueleto que se une a la tripulación en Thriller Bark?', options: ['Brook', 'Franky', 'Robin', 'Chopper'], correct_answer: 'Brook' },
  // Medium
  { id: 1104, saga: 'thriller-bark', difficulty: 'medium', question: '¿Quién es la princesa fantasma en Thriller Bark?', options: ['Perona', 'Nami', 'Robin', 'Lola'], correct_answer: 'Perona' },
  { id: 1105, saga: 'thriller-bark', difficulty: 'medium', question: '¿Qué le roba Gecko Moria a Luffy?', options: ['Su sombra', 'Su sombrero', 'Su fuerza', 'Su fruta del diablo'], correct_answer: 'Su sombra' },
  { id: 1106, saga: 'thriller-bark', difficulty: 'medium', question: '¿Cómo se llama el barco gigante de Thriller Bark?', options: ['Thriller Bark', 'Sunny', 'Going Merry', 'Puffing Tom'], correct_answer: 'Thriller Bark' },
  { id: 1110, saga: 'thriller-bark', difficulty: 'medium', question: '¿Cómo se llama la técnica de Brook que usa para derrotar zombies?', options: ['Soul Solid', 'Hanauta Sancho', 'Three-Sword Style', 'Gavotte Bond Avant'], correct_answer: 'Soul Solid' },
  // Hard
  { id: 1107, saga: 'thriller-bark', difficulty: 'hard', question: '¿Quién es el científico loco de Thriller Bark?', options: ['Hogback', 'Vegapunk', 'Caesar', 'Judge'], correct_answer: 'Hogback' },
  { id: 1108, saga: 'thriller-bark', difficulty: 'hard', question: '¿Qué animal es el zombie número 900?', options: ['Oars', 'Lola', 'Absalom', 'Ryuma'], correct_answer: 'Oars' },
  { id: 1109, saga: 'thriller-bark', difficulty: 'hard', question: '¿Quién derrota a Perona en Thriller Bark?', options: ['Usopp', 'Zoro', 'Sanji', 'Robin'], correct_answer: 'Usopp' },

  // --- MARINEFORD ---
  // Easy
  { id: 46, saga: 'marineford', difficulty: 'easy', question: '¿Qué fruta del diablo tiene Bartholomew Kuma?', options: ['Nikyu Nikyu no Mi', 'Bara Bara no Mi', 'Bomu Bomu no Mi', 'Tori Tori no Mi'], correct_answer: 'Nikyu Nikyu no Mi' },

  // --- DRESSROSA ---
  // Easy
  { id: 47, saga: 'dressrosa', difficulty: 'easy', question: '¿Quién derrotó a Doflamingo en Dressrosa?', options: ['Luffy', 'Law', 'Zoro', 'Sanji'], correct_answer: 'Luffy' },

  // --- WHOLE CAKE ISLAND ---
  // Medium
  { id: 48, saga: 'whole-cake-island', difficulty: 'medium', question: '¿Qué fruta del diablo tiene Charlotte Katakuri?', options: ['Mochi Mochi no Mi', 'Gomu Gomu no Mi', 'Hie Hie no Mi', 'Mera Mera no Mi'], correct_answer: 'Mochi Mochi no Mi' },

  // --- WANO ---
  // Medium
  { id: 49, saga: 'wano', difficulty: 'medium', question: '¿Kaido es conocido como la criatura más fuerte del mundo?', options: ['Verdadero', 'Falso'], correct_answer: 'Verdadero' },

  // --- PUNK HAZARD ---
  // Easy
  { id: 50, saga: 'punk-hazard', difficulty: 'easy', question: '¿Quién se unió a la tripulación de Luffy en Punk Hazard?', options: ['Ninguna es Correcta', 'Law', 'Caesar', 'Kin\'emon'], correct_answer: 'Ninguna es Correcta' },
];

// Copiá y pegá las preguntas ordenadas en cada bloque según corresponda.

// --- DEBUG: Verificación de cantidad de preguntas por saga y dificultad ---
function verificarPreguntasPorSagaOrdered() {
  // Configuración igual que STORY_MODE_CONFIG del original
  const STORY_MODE_CONFIG: Record<string, { easy: number; medium: number; hard: number }> = {
    'east-blue': { easy: 7, medium: 2, hard: 1 },
    'alabasta': { easy: 5, medium: 3, hard: 2 },
    'skypea': { easy: 4, medium: 3, hard: 3 }
  };
  const sagas = Object.keys(STORY_MODE_CONFIG);
  sagas.forEach(saga => {
    const easy = QUESTIONS_DB_ORDERED.filter(q => q.saga === saga && q.difficulty === 'easy').length;
    const medium = QUESTIONS_DB_ORDERED.filter(q => q.saga === saga && q.difficulty === 'medium').length;
    const hard = QUESTIONS_DB_ORDERED.filter(q => q.saga === saga && q.difficulty === 'hard').length;
    const conf = STORY_MODE_CONFIG[saga];
    console.log(`Saga: ${saga}`);
    console.log(`  Easy:   ${easy}/${conf.easy} ${easy < conf.easy ? '❌' : '✅'}`);
    console.log(`  Medium: ${medium}/${conf.medium} ${medium < conf.medium ? '❌' : '✅'}`);
    console.log(`  Hard:   ${hard}/${conf.hard} ${hard < conf.hard ? '❌' : '✅'}`);
  });
}

if (require.main === module) {
  verificarPreguntasPorSagaOrdered();
}
