import { Question } from '@/types/game';
import { supabase } from './supabaseClient';
// import { SAGA_API_NAMES } from '@/constants/sagas'; // 🔒 No necesario por ahora

export const QUESTIONS_DB: Question[] = [
  // East Blue Questions 
  // ❌ ELIMINADA ID 1: "¿Cuál es el sueño de Luffy?" - Feedback: "el sueño de luffy es otra cosa"
  {
    id: 2,
    saga: 'east-blue',
    difficulty: 'easy',
    question: '¿De qué material está hecho el sombrero de Luffy?',
    options: ['De goma', 'De tela', 'De algodón', 'De paja'],
    correct_answer: 'De paja'
  },
  {
    id: 3,
    saga: 'east-blue',
    difficulty: 'easy', // 🔄 CAMBIO: medium → easy (Feedback: "esta es facil")
    question: '¿Quién fue el primer miembro en unirse a la tripulación de Luffy?',
    options: ['Nami', 'Zoro', 'Usopp', 'Sanji'],
    correct_answer: 'Zoro'
  },
  {
    id: 4,
    saga: 'east-blue',
    difficulty: 'easy', // 🔄 CAMBIO: medium → easy (Feedback: "de mediano a facil")
    question: '¿Cuál es la fruta del diablo de Luffy?',
    options: ['Gomu Gomu no Mi', 'Mera Mera no Mi', 'Hie Hie no Mi', 'Gura Gura no Mi'],
    correct_answer: 'Gomu Gomu no Mi'
  },
  {
    id: 5,
    saga: 'east-blue',
    difficulty: 'medium', // 🔄 CAMBIO: hard → medium (Feedback: "mediana")
    question: '¿Cómo se llama el restaurante donde trabajaba Sanji?',
    options: ['Baratie', 'Marine', 'Golden Merry', 'Red Force'],
    correct_answer: 'Baratie'
  },
  {
    id: 6,
    saga: 'east-blue',
    difficulty: 'easy',
    question: '¿Cuál es el sueño de Nami?',
    options: ['Dibujar un mapa del mundo', 'Ser fuerte', 'Encontrar tesoros', 'Navegar libre'],
    correct_answer: 'Dibujar un mapa del mundo'
  },
  {
    id: 7,
    saga: 'east-blue',
    difficulty: 'medium',
    question: '¿Quién es el capitán de los Piratas del Gato Negro?',
    options: ['Kuro', 'Krieg', 'Arlong', 'Buggy'],
    correct_answer: 'Kuro'
  },
  {
    id: 8,
    saga: 'east-blue',
    difficulty: 'easy',
    question: '¿Cuántas espadas usa Zoro en su estilo de lucha?',
    options: ['Tres', 'Dos', 'Una', 'Cuatro'],
    correct_answer: 'Tres'
  },
  {
    id: 9,
    saga: 'east-blue',
    difficulty: 'medium', // 🔄 CAMBIO: easy → medium (Feedback: "cambiar de facil a mediano")
    question: '¿Cómo se llama el pueblo natal de Usopp?',
    options: ['Villa Syrup', 'Villa Orange', 'Cocoyasi', 'Shells Town'],
    correct_answer: 'Villa Syrup'
  },
  {
    id: 10,
    saga: 'east-blue',
    difficulty: 'easy',
    question: '¿Quién era el dueño del sombrero de paja antes que Luffy?', // 🔄 REFORMULADA (Feedback: "Cambiar estructura de pregunta, quita el nombre de roger")
    options: ['Shanks', 'Garp', 'Dragon', 'Mihawk'],
    correct_answer: 'Shanks'
  },

  // Alabasta Questions
  {
    id: 11,
    saga: 'alabasta',
    difficulty: 'easy',
    question: '¿Cómo se llama la princesa de Alabasta?',
    options: ['Vivi', 'Nami', 'Robin', 'Tashigi'],
    correct_answer: 'Vivi'
  },
  {
    id: 12,
    saga: 'alabasta',
    difficulty: 'easy',
    question: '¿Cuál es la organización criminal principal en Alabasta?',
    options: ['Baroque Works', 'Marine', 'CP9', 'Arlong Park'],
    correct_answer: 'Baroque Works'
  },
  {
    id: 13,
    saga: 'alabasta',
    difficulty: 'hard',
    question: '¿Cuál es el nombre de la esposa de Toto, el padre de Koza?',
    options: ['Aswa', 'Soan', 'Robin', 'Tashigi'],
    correct_answer: 'Aswa'
  },
  {
    id: 14,
    saga: 'alabasta',
    difficulty: 'medium', // Cambiado de fácil a mediano
    question: '¿En qué desierto se encuentra Alabasta?',
    options: ['Sandora', 'Sahara', 'Gobi', 'Kalahari'],
    correct_answer: 'Sandora'
  },
  {
    id: 15,
    saga: 'alabasta',
    difficulty: 'medium', // Cambiado de fácil a mediano
    question: '¿Cómo se llaman los cocodrilos gigantes de Crocodile?',
    options: ['Bananawani', 'Kung-Fu Dugong', 'Sea King', 'Neptune'],
    correct_answer: 'Bananawani'
  },

  // Skypea Questions
  {
    id: 16,
    saga: 'skypea',
    difficulty: 'easy',
    question: '¿Cómo se llama la isla en el cielo?',
    options: ['Skypea', 'Skylands', 'Cloud Island', 'Heaven'],
    correct_answer: 'Skypea'
  },
  {
    id: 17,
    saga: 'skypea',
    difficulty: 'medium',
    question: '¿Quién era el dios de Skypea antes de Enel?',
    options: ['Gan Fall', 'Gan Dan', 'Fall Sain', 'Dios Satori'],
    correct_answer: 'Gan Fall'
  },
  {
    id: 18,
    saga: 'skypea',
    difficulty: 'medium', // Cambiado de difícil a mediano
    question: '¿Cuál es la fruta del diablo de Enel?',
    options: ['Goro Goro no Mi', 'Pika Pika no Mi', 'Magu Magu no Mi', 'Hie Hie no Mi'],
    correct_answer: 'Goro Goro no Mi'
  },
  {
    id: 37,
    saga: 'skypea',
    difficulty: 'hard',
    question: '¿cómo es el nombre del arma principal que usa Enel para atacar?',
    options: ['Nonosama Bo', 'Goro Goro', 'Thor', 'Vari Goro'],
    correct_answer: 'Nonosama Bo'
  },
  {
    id: 38,
    saga: 'skypea',
    difficulty: 'medium',
    question: '¿Cuánto deben pagar los visitantes que visitan Skypea?',
    options: ['1.000.000.000 Extol', '100.000 Extol', '10.000 Extol', '1.000 Extol'],
    correct_answer: '1.000.000.000 Extol'
  },
  {
    id: 42,
    saga: 'skypea',
    difficulty: 'easy',
    question: '¿Cómo se llama el arca que construye Enel?',
    options: ['Maxim', 'Nola', 'Pierre', 'Upper Yard'],
    correct_answer: 'Maxim'
  },
  {
    id: 45,
    saga: 'skypea',
    difficulty: 'medium',
    question: '¿Qué fruta comió Pierre, la mascota de Gan Fall?',
    options: ['Uma Uma no Mi', 'Tori Tori no Mi', 'Mera Mera no Mi', 'Gomu Gomu no Mi'],
    correct_answer: 'Uma Uma no Mi'
  },
  {
    id: 55,
    saga: 'skypea',
    difficulty: 'hard',
    question: '¿Cuántos metros puede alcanzar la Knock Up Stream?',
    options: ['7.000', '5.000', '10.000', '3.000'],
    correct_answer: '7.000'
  },
  {
    id: 56,
    saga: 'skypea',
    difficulty: 'hard',
    question: '¿Cómo se llamaba la hija de Kalgara?',
    options: ['Mousse', 'Nola', 'Robin', 'Vivi'],
    correct_answer: 'Mousse'
  },
  // NUEVA PREGUNTA DIFÍCIL SKYPEA
  {
    id: 57,
    saga: 'skypea',
    difficulty: 'hard',
    question: '¿Cuál es el nombre del tallo enorme que se encuentra en el centro de Upper Yard, en Skypiea?',
    options: ['Giant Jack', 'Maxim', 'Nola', 'Knock Up Stream'],
    correct_answer: 'Giant Jack'
  },

  // East Blue - Preguntas adicionales de la API
  {
    id: 19,
    saga: 'east-blue',
    difficulty: 'medium',
    question: '¿Luffy derrotó a Buggy el Payaso en su primer enfrentamiento?',
    options: ['Verdadero', 'Falso'],
    correct_answer: 'Verdadero'
  },
  {
    id: 20,
    saga: 'east-blue',
    difficulty: 'medium',
    question: '¿Qué fruta del diablo tiene Buggy el Payaso?',
    options: ['Bara Bara no Mi', 'Gomu Gomu no Mi', 'Bomu Bomu no Mi', 'Suke Suke no Mi'],
    correct_answer: 'Bara Bara no Mi'
  },
  {
    id: 21,
    saga: 'east-blue',
    difficulty: 'medium',
    question: '¿Nami se unió a la tripulación de Luffy en el arco de Arlong Park?',
    options: ['Verdadero', 'Falso'],
    correct_answer: 'Verdadero'
  },
  {
    id: 22,
    saga: 'east-blue',
    difficulty: 'medium',
    question: '¿Qué fruta del diablo tiene Alvida después de su transformación?',
    options: ['Sube Sube no Mi', 'Bara Bara no Mi', 'Gomu Gomu no Mi', 'Bomu Bomu no Mi'],
    correct_answer: 'Sube Sube no Mi'
  },
  {
    id: 23,
    saga: 'east-blue',
    difficulty: 'hard',
    question: '¿De cuánto es la recompensa de Higuma, el bandido de la montaña?',
    options: ['8.000.000', '4.000.000', '7.000.000', '1.500.000'],
    correct_answer: '8.000.000'
  },
  {
    id: 24,
    saga: 'east-blue',
    difficulty: 'hard',
    question: '¿Cómo se llama la tribu que derrotó a los piratas de Buggy?',
    options: ['Tribu Kumate', 'Tribu Kamuju', 'Tribu Tolteca', 'Tribu Poneglyph'],
    correct_answer: 'Tribu Kumate'
  },
  {
    id: 25,
    saga: 'east-blue',
    difficulty: 'easy',
    question: '¿Luffy salvó a Zoro de ser ejecutado por la Marina?',
    options: ['Verdadero', 'Falso'],
    correct_answer: 'Verdadero'
  },
  {
    id: 26,
    saga: 'east-blue',
    difficulty: 'medium',
    question: '¿Qué fruta del diablo tiene Smoker?',
    options: ['Moku Moku no Mi', 'Gomu Gomu no Mi', 'Hie Hie no Mi', 'Mera Mera no Mi'],
    correct_answer: 'Moku Moku no Mi'
  },

  // East Blue - Preguntas fáciles adicionales para completar 7
  {
    id: 51,
    saga: 'east-blue',
    difficulty: 'easy',
    question: '¿Cuál es el nombre del barco de los Sombreros de Paja en East Blue?', // ✏️ REFORMULADA (Feedback: "estructurar pregunta")
    options: ['Going Merry', 'Thousand Sunny', 'Red Force', 'Oro Jackson'],
    correct_answer: 'Going Merry'
  },
  // ❌ ELIMINADA ID 52: "¿Qué tipo de fruta del diablo comió Luffy?" - Feedback: "borrar pregunta"
  {
    id: 53,
    saga: 'east-blue',
    difficulty: 'medium', // 🔄 CAMBIO: easy → medium (Feedback: "facil a mediano")
    question: '¿Cuántos miembros principales tiene la tripulación al final de East Blue?',
    options: ['5', '4', '6', '3'],
    correct_answer: '5'
  },

  // Alabasta - Preguntas adicionales de la API
  {
    id: 27,
    saga: 'alabasta',
    difficulty: 'easy', // Cambiado de mediano a fácil
    question: '¿Luffy derrotó a Crocodile en su primer enfrentamiento?',
    options: ['Falso', 'Verdadero'],
    correct_answer: 'Falso'
  },
  {
    id: 28,
    saga: 'alabasta',
    difficulty: 'medium',
    question: '¿Crocodile es uno de los Shichibukai?',
    options: ['Verdadero', 'Falso'],
    correct_answer: 'Verdadero'
  },
  {
    id: 29,
    saga: 'alabasta',
    difficulty: 'medium',
    question: '¿Cómo se llama el camello que acompaña a los Mugiwara en Alabasta?',
    options: ['Karoo', 'Matsuge', 'Peric', 'Pell'],
    correct_answer: 'Matsuge'
  },
  // Nuevas preguntas fáciles para Alabasta
  // Nuevas preguntas fáciles para Alabasta (sin repetir contenido)
  {
    id: 63,
    saga: 'alabasta',
    difficulty: 'medium',
    question: '¿Cómo se llama el jefe de la guardia real de Alabasta?',
    options: ['Igaram', 'Chaka', 'Pell', 'Cobra'],
    correct_answer: 'Igaram'
  },
  {
    id: 64,
    saga: 'alabasta',
    difficulty: 'easy',
    question: '¿Qué animal acompaña a los mugiwaras en el desierto de Alabasta?',
    options: ['Cangrejo', 'Lobo', 'Perro', 'Tortuga'],
    correct_answer: 'Cangrejo'
  },
  {
    id: 65,
    saga: 'alabasta',
    difficulty: 'easy',
    question: '¿Cómo se llama la ciudad principal de Alabasta?',
    options: ['Alubarna', 'Nanohana', 'Rainbase', 'Yuba'],
    correct_answer: 'Alubarna'
  },
  {
    id: 66,
    saga: 'alabasta',
    difficulty: 'easy',
    question: '¿Quién es el presidente de Baroque Works?',
    options: ['Mr. 0', 'Mr. 1', 'Mr. 2', 'Mr. 3'],
    correct_answer: 'Mr. 0'
  },
  {
    id: 67,
    saga: 'alabasta',
    difficulty: 'easy',
    question: '¿Qué nombre recibe el casino de Crocodile en Alabasta?',
    options: ['Rainbase', 'Alubarna', 'Nanohana', 'Yuba'],
    correct_answer: 'Rainbase'
  },
  {
    id: 31,
    saga: 'alabasta',
    difficulty: 'medium', // Cambiado de fácil a mediano
    question: '¿Qué fruta del diablo tiene Crocodile?',
    options: ['Suna Suna no Mi', 'Gomu Gomu no Mi', 'Mera Mera no Mi', 'Hie Hie no Mi'],
    correct_answer: 'Suna Suna no Mi'
  },
  {
    id: 33,
    saga: 'alabasta',
    difficulty: 'medium', // Cambiado de fácil a mediano
    question: '¿Quién es el líder de los Rebeldes en Alabasta?',
    options: ['Kohza', 'Zoah', 'Chaka', 'Pell'],
    correct_answer: 'Kohza'
  },
  {
    id: 54,
    saga: 'alabasta',
    difficulty: 'hard',
    question: '¿Cuál era el valor de la recompensa de Crocodile antes de ser Shichibukai?',
    options: ['81.000.000', '96.000.000', '100.000.000', '45.000.000'],
    correct_answer: '81.000.000'
  },
  // Super difíciles Alabasta
  {
    id: 68,
    saga: 'alabasta',
    difficulty: 'hard',
    question: '¿Cuál es el nombre completo, apodo y número del agente de Baroque Works conocido como Mr. 2?',
    options: ['Mr. 2 Bon Clay (Bentham)', 'Mr. 2 Bon Kurei (Bentham)', 'Mr. 2 Bon Clay (Daz Bones)', 'Mr. 2 Bon Kurei (Daz Bones)'],
    correct_answer: 'Mr. 2 Bon Clay (Bentham)'
  },
  {
    id: 69,
    saga: 'alabasta',
    difficulty: 'hard',
    question: '¿Cuál es el verdadero nombre de la agente de Baroque Works conocida como Miss Doublefinger?',
    options: ['Jarel', 'Zhela', 'Zala', 'Shigi'],
    correct_answer: 'Zala'
  },

  // Skypea - Preguntas adicionales de la API
  {
    id: 37,
    saga: 'skypea',
    difficulty: 'easy',
    question: '¿Enel fue derrotado por Luffy en Skypiea?',
    options: ['Verdadero', 'Falso'],
    correct_answer: 'Verdadero'
  },
  {
    id: 38,
    saga: 'skypea',
    difficulty: 'medium',
    question: '¿Luffy derrotó a Enel usando goma?',
    options: ['Verdadero', 'Falso'],
    correct_answer: 'Verdadero'
  },
  {
    id: 39,
    saga: 'skypea',
    difficulty: 'easy',
    question: '¿Quién encontró el Poneglyph en Skypiea?',
    options: ['Robin', 'Nami', 'Luffy', 'Zoro'],
    correct_answer: 'Robin'
  },
  {
    id: 40,
    saga: 'skypea',
    difficulty: 'medium',
    question: '¿Enel planeaba destruir Skypiea?',
    options: ['Verdadero', 'Falso'],
    correct_answer: 'Verdadero'
  },
  {
    id: 41,
    saga: 'skypea',
    difficulty: 'medium',
    question: '¿Luffy usó su Gear Second en Skypiea?',
    options: ['Falso', 'Verdadero'],
    correct_answer: 'Falso'
  },
  {
    id: 42,
    saga: 'skypea',
    difficulty: 'easy',
    question: '¿Quién ayudó a Luffy a derrotar a Enel?',
    options: ['Nami', 'Zoro', 'Sanji', 'Usopp'],
    correct_answer: 'Nami'
  },
  {
    id: 43,
    saga: 'skypea',
    difficulty: 'easy',
    question: 'Luffy y su tripulación encontraron oro en Skypiea',
    options: ['Verdadero', 'Falso'],
    correct_answer: 'Verdadero'
  },
  {
    id: 44,
    saga: 'skypea',
    difficulty: 'easy',
    question: '¿Qué habilidad tiene la fruta del diablo de Enel?',
    options: ['Controlar la electricidad', 'Controlar el fuego', 'Controlar el hielo', 'Controlar el agua'],
    correct_answer: 'Controlar la electricidad'
  },
  {
    id: 45,
    saga: 'skypea',
    difficulty: 'medium',
    question: '¿Luffy usó su Gear Third en Skypiea?',
    options: ['Falso', 'Verdadero'],
    correct_answer: 'Falso'
  },

  // Skypea - Preguntas difíciles adicionales para completar 3
  // PREGUNTAS DE UNIDAD DE MEDIDA EXTRA
  {
    id: 70,
    saga: 'east-blue',
    difficulty: 'medium',
    question: '¿Cuál es la moneda oficial en la recompensa de los piratas?',
    options: ['Berries', 'Dólar Blue', 'Yenes', 'Moneda de Oro'],
    correct_answer: 'Berries'
  },
  {
    id: 71,
    saga: 'alabasta',
    difficulty: 'medium',
    question: '¿Qué unidad de medida se usa para el agua en el desierto de Alabasta?',
    options: ['Litros', 'Extol', 'Barriles', 'Botellas'],
    correct_answer: 'Litros'
  },
  {
    id: 72,
    saga: 'skypea',
    difficulty: 'medium',
    question: '¿Cuál es la moneda oficial en Skypea?',
    options: ['Extol', 'Berries', 'SkyDollars', 'Dials'],
    correct_answer: 'Extol'
  },
  {
    id: 55,
    saga: 'skypea',
    difficulty: 'hard',
    question: '¿Cuál es el nombre del guerrero shandiano líder?',
    options: ['Wyper', 'Gan Fall', 'Satori', 'Ohm'],
    correct_answer: 'Wyper'
  },
  {
    id: 56,
    saga: 'skypea',
    difficulty: 'hard',
    question: '¿Qué unidad de medida usan en Skypiea para la electricidad de Enel?',
    options: ['Voltios', 'Vearth', 'Dials', 'Sky Units'],
    correct_answer: 'Voltios'
  },

  // Nuevas sagas adicionales (para futuras expansiones)
  {
    id: 46,
    saga: 'marineford',
    difficulty: 'easy',
    question: '¿Qué fruta del diablo tiene Bartholomew Kuma?',
    options: ['Nikyu Nikyu no Mi', 'Bara Bara no Mi', 'Bomu Bomu no Mi', 'Tori Tori no Mi'],
    correct_answer: 'Nikyu Nikyu no Mi'
  },
  {
    id: 47,
    saga: 'dressrosa',
    difficulty: 'easy',
    question: '¿Quién derrotó a Doflamingo en Dressrosa?',
    options: ['Luffy', 'Law', 'Zoro', 'Sanji'],
    correct_answer: 'Luffy'
  },
  {
    id: 48,
    saga: 'whole-cake-island',
    difficulty: 'medium',
    question: '¿Qué fruta del diablo tiene Charlotte Katakuri?',
    options: ['Mochi Mochi no Mi', 'Gomu Gomu no Mi', 'Hie Hie no Mi', 'Mera Mera no Mi'],
    correct_answer: 'Mochi Mochi no Mi'
  },
  {
    id: 49,
    saga: 'wano',
    difficulty: 'medium',
    question: '¿Kaido es conocido como la criatura más fuerte del mundo?',
    options: ['Verdadero', 'Falso'],
    correct_answer: 'Verdadero'
  },
  {
    id: 50,
    saga: 'punk-hazard',
    difficulty: 'easy',
    question: '¿Quién se unió a la tripulación de Luffy en Punk Hazard?',
    options: ['Ninguna es Correcta', 'Law', 'Caesar', 'Kin\'emon'],
    correct_answer: 'Ninguna es Correcta'
  },
  // Water 7 Questions
  {
    id: 1001,
    saga: 'water-7',
    difficulty: 'easy',
    question: '¿Cómo se llama el carpintero que se une a la tripulación en Water 7?',
    options: ['Franky', 'Iceburg', 'Paulie', 'Kokoro'],
    correct_answer: 'Franky'
  },
  {
    id: 1002,
    saga: 'water-7',
    difficulty: 'easy',
    question: '¿Cuál es el nombre del tren marino que conecta Water 7 con otras islas?',
    options: ['Puffing Tom', 'Rocketman', 'Sea Train', 'Going Merry'],
    correct_answer: 'Puffing Tom'
  },
  {
    id: 1003,
    saga: 'water-7',
    difficulty: 'easy',
    question: '¿Quién es la alcaldesa de Water 7?',
    options: ['Iceburg', 'Franky', 'Kokoro', 'Paulie'],
    correct_answer: 'Iceburg'
  },
  {
    id: 1004,
    saga: 'water-7',
    difficulty: 'medium',
    question: '¿Cómo se llama la organización secreta que ataca Water 7?',
    options: ['CP9', 'Baroque Works', 'Revolucionarios', 'Marina'],
    correct_answer: 'CP9'
  },
  {
    id: 1005,
    saga: 'water-7',
    difficulty: 'medium',
    question: '¿Qué le sucede al Going Merry en Water 7?',
    options: ['Se rompe', 'Es robado', 'Es mejorado', 'Es vendido'],
    correct_answer: 'Se rompe'
  },
  {
    id: 1006,
    saga: 'water-7',
    difficulty: 'medium',
    question: '¿Quién es el líder de la Galley-La Company?',
    options: ['Iceburg', 'Franky', 'Paulie', 'Lucci'],
    correct_answer: 'Iceburg'
  },
  {
    id: 1007,
    saga: 'water-7',
    difficulty: 'hard',
    question: '¿Cuál es el verdadero nombre de Franky?',
    options: ['Cutty Flam', 'Tom', 'Paulie', 'Iceburg'],
    correct_answer: 'Cutty Flam'
  },
  {
    id: 1008,
    saga: 'water-7',
    difficulty: 'hard',
    question: '¿Quién traiciona a Iceburg y revela ser miembro de CP9?',
    options: ['Rob Lucci', 'Kaku', 'Kalifa', 'Todos los anteriores'],
    correct_answer: 'Todos los anteriores'
  },
  {
    id: 1009,
    saga: 'water-7',
    difficulty: 'hard',
    question: '¿Qué objeto importante roba Robin en Water 7?',
    options: ['Pluton blueprints', 'Poneglyph', 'Dials', 'Log Pose'],
    correct_answer: 'Pluton blueprints'
  },
  {
    id: 1010,
    saga: 'water-7',
    difficulty: 'medium',
    question: '¿Cómo se llama la estación de tren de Water 7?',
    options: ['Blue Station', 'Water Station', 'Dock 1', 'Galley-La Station'],
    correct_answer: 'Blue Station'
  },

  // Thriller Bark Questions
  {
    id: 1101,
    saga: 'thriller-bark',
    difficulty: 'easy',
    question: '¿Quién es el villano principal de Thriller Bark?',
    options: ['Gecko Moria', 'Perona', 'Hogback', 'Absalom'],
    correct_answer: 'Gecko Moria'
  },
  {
    id: 1102,
    saga: 'thriller-bark',
    difficulty: 'easy',
    question: '¿Qué poder tiene la fruta del diablo de Gecko Moria?',
    options: ['Controlar sombras', 'Controlar fuego', 'Controlar hielo', 'Controlar animales'],
    correct_answer: 'Controlar sombras'
  },
  {
    id: 1103,
    saga: 'thriller-bark',
    difficulty: 'easy',
    question: '¿Cómo se llama el esqueleto que se une a la tripulación en Thriller Bark?',
    options: ['Brook', 'Franky', 'Robin', 'Chopper'],
    correct_answer: 'Brook'
  },
  {
    id: 1104,
    saga: 'thriller-bark',
    difficulty: 'medium',
    question: '¿Quién es la princesa fantasma en Thriller Bark?',
    options: ['Perona', 'Nami', 'Robin', 'Lola'],
    correct_answer: 'Perona'
  },
  {
    id: 1105,
    saga: 'thriller-bark',
    difficulty: 'medium',
    question: '¿Qué le roba Gecko Moria a Luffy?',
    options: ['Su sombra', 'Su sombrero', 'Su fuerza', 'Su fruta del diablo'],
    correct_answer: 'Su sombra'
  },
  {
    id: 1106,
    saga: 'thriller-bark',
    difficulty: 'medium',
    question: '¿Cómo se llama el barco gigante de Thriller Bark?',
    options: ['Thriller Bark', 'Sunny', 'Going Merry', 'Puffing Tom'],
    correct_answer: 'Thriller Bark'
  },
  {
    id: 1107,
    saga: 'thriller-bark',
    difficulty: 'hard',
    question: '¿Quién es el científico loco de Thriller Bark?',
    options: ['Hogback', 'Vegapunk', 'Caesar', 'Judge'],
    correct_answer: 'Hogback'
  },
  {
    id: 1108,
    saga: 'thriller-bark',
    difficulty: 'hard',
    question: '¿Qué animal es el zombie número 900?',
    options: ['Oars', 'Lola', 'Absalom', 'Ryuma'],
    correct_answer: 'Oars'
  },
  {
    id: 1109,
    saga: 'thriller-bark',
    difficulty: 'hard',
    question: '¿Quién derrota a Perona en Thriller Bark?',
    options: ['Usopp', 'Zoro', 'Sanji', 'Robin'],
    correct_answer: 'Usopp'
  },
  {
    id: 1110,
    saga: 'thriller-bark',
    difficulty: 'medium',
    question: '¿Cómo se llama la técnica de Brook que usa para derrotar zombies?',
    options: ['Soul Solid', 'Hanauta Sancho', 'Three-Sword Style', 'Gavotte Bond Avant'],
    correct_answer: 'Soul Solid'
  },
];

// (Eliminada función duplicada de story mode; la lógica vive dentro de la clase QuestionsAPI)

export class QuestionsAPI {
  // 🔒 API EXTERNA TEMPORALMENTE DESHABILITADA
  // private static readonly API_BASE_URL = 'https://trivia-one-piece-api.onrender.com';
  
  // Configuración para el modo historia
  public static readonly STORY_MODE_CONFIG: {
    [key: string]: { easy: number; medium: number; hard: number }
  } = {
    'east-blue': { easy: 7, medium: 2, hard: 1 },
    'alabasta': { easy: 5, medium: 3, hard: 2 },
    'skypea': { easy: 4, medium: 3, hard: 3 }
  };

  /* 🔒 MÉTODOS DE API EXTERNA COMENTADOS HASTA MEJORAR LA API
  
  // Función para convertir el formato de pregunta de la API externa a nuestro formato
  private static convertAPIQuestion(apiQuestion: any, index: number): Question {
    const allOptions = [apiQuestion.correct_answer, ...apiQuestion.incorrect_answers];
    const shuffledOptions = allOptions.sort(() => Math.random() - 0.5);
    
    return {
      id: Date.now() + index, // ID temporal único
      saga: Object.keys(SAGA_API_NAMES).find(key => SAGA_API_NAMES[key] === apiQuestion.saga) || 'east-blue',
      difficulty: apiQuestion.difficulty,
      question: apiQuestion.question,
      options: shuffledOptions,
      correct_answer: apiQuestion.correct_answer
    };
  }

  // Función para obtener preguntas de la API externa
  private static async fetchFromExternalAPI(
    saga: string,
    amount: number = 10,
    difficulty?: 'easy' | 'medium' | 'hard'
  ): Promise<Question[]> {
    try {
      const sagaName = SAGA_API_NAMES[saga] || saga;
      let url = `${this.API_BASE_URL}/questions?amount=${amount}`;
      
      // Agregar parámetros de saga y dificultad si se especifican
      if (sagaName !== saga) {
        url += `&saga=${encodeURIComponent(sagaName)}`;
      }
      if (difficulty) {
        url += `&difficulty=${difficulty}`;
      }

      console.log(`🌐 Intentando obtener preguntas de API externa: ${url}`);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 segundos timeout
      
      const response = await fetch(url, {
        method: 'GET',
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`API respondió con error: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.results && Array.isArray(data.results)) {
        console.log(`✅ API externa devolvió ${data.results.length} preguntas`);
        return data.results.map((q: any, index: number) => this.convertAPIQuestion(q, index));
      } else {
        throw new Error('Formato de respuesta de API inválido');
      }
    } catch (error: any) {
      console.log(`❌ Error al obtener preguntas de API externa: ${error.message}`);
      throw error;
    }
  }
  
  */ // FIN DE MÉTODOS DE API EXTERNA COMENTADOS

  // Función para mezclar las opciones de una pregunta
  private static shuffleOptions(question: Question): Question {
    const correctAnswer = question.correct_answer;
    const shuffledOptions = [...question.options].sort(() => Math.random() - 0.5);
    
    return {
      ...question,
      options: shuffledOptions,
      correct_answer: correctAnswer // La respuesta correcta no cambia
    };
  }

  // Función para obtener preguntas en modo historia (distribución fija 4/3/3 con fallbacks)
  private static getStoryModeQuestions(
    _saga: string,
    filteredQuestions: Question[]
  ): Question[] {
    const TARGET = { easy: 4, medium: 3, hard: 3 } as const;

    // Particionar por dificultad
    const easyAll = filteredQuestions.filter(q => q.difficulty === 'easy');
    const mediumAll = filteredQuestions.filter(q => q.difficulty === 'medium');
    const hardAll = filteredQuestions.filter(q => q.difficulty === 'hard');

  console.log(`[StoryMode] Pool saga=${_saga} -> easy=${easyAll.length} medium=${mediumAll.length} hard=${hardAll.length} total=${filteredQuestions.length}`);

    const pick = (arr: Question[], n: number) => {
      if (n <= 0) return [];
      return [...arr].sort(() => Math.random() - 0.5).slice(0, Math.min(n, arr.length));
    };

    // Selección base
    const baseEasy = pick(easyAll, TARGET.easy);
    const baseMedium = pick(mediumAll, TARGET.medium);
    const baseHard = pick(hardAll, TARGET.hard);

    const usedIds = new Set<number>([...baseEasy, ...baseMedium, ...baseHard].map(q => q.id));
    const fallback: Question[] = [];

  console.log(`[StoryMode] Base picked -> easy=${baseEasy.length} medium=${baseMedium.length} hard=${baseHard.length}`);

    // Fallback hard -> medium
    const hardDeficit = TARGET.hard - baseHard.length;
    if (hardDeficit > 0) {
      const mediumRemaining = mediumAll.filter(q => !usedIds.has(q.id));
      const extraMediumForHard = pick(mediumRemaining, hardDeficit);
      extraMediumForHard.forEach(q => usedIds.add(q.id));
      fallback.push(...extraMediumForHard);
  console.log(`[StoryMode] Fallback hard→medium added=${extraMediumForHard.length}`);
    }

    // Fallback medium -> easy (después de posible consumo para hard)
    const currentMediumCount = baseMedium.length; // no contamos los usados como fallback for hard en baseMedium
    const mediumDeficit = TARGET.medium - currentMediumCount;
    if (mediumDeficit > 0) {
      const easyRemaining = easyAll.filter(q => !usedIds.has(q.id));
      const extraEasyForMedium = pick(easyRemaining, mediumDeficit);
      extraEasyForMedium.forEach(q => usedIds.add(q.id));
      fallback.push(...extraEasyForMedium);
  console.log(`[StoryMode] Fallback medium→easy added=${extraEasyForMedium.length}`);
    }

    // Construir lista en orden: easy -> medium -> hard -> fallback
    let ordered: Question[] = [...baseEasy, ...baseMedium, ...baseHard, ...fallback];

    // Si aún no llegamos a 10, rellenar con restantes (sin repetir) manteniendo orden de dificultad ascendente
    if (ordered.length < 10) {
      const remainingEasy = easyAll.filter(q => !usedIds.has(q.id));
      remainingEasy.forEach(q => usedIds.add(q.id));
      const remainingMedium = mediumAll.filter(q => !usedIds.has(q.id));
      remainingMedium.forEach(q => usedIds.add(q.id));
      const remainingHard = hardAll.filter(q => !usedIds.has(q.id));

      const remainingOrdered = [...remainingEasy, ...remainingMedium, ...remainingHard];
      ordered = [...ordered, ...remainingOrdered.slice(0, 10 - ordered.length)];
      console.log(`[StoryMode] Relleno final added=${Math.max(0, ordered.length - (baseEasy.length + baseMedium.length + baseHard.length + fallback.length))}`);
    }

    // Limitar a 10 y mezclar SOLO opciones internas, no el orden de las preguntas
    const finalSet = ordered.slice(0, 10).map(q => this.shuffleOptions(q));
    const finalCounts = finalSet.reduce((acc: Record<string, number>, q) => { acc[q.difficulty] = (acc[q.difficulty]||0)+1; return acc; }, {} as Record<string, number>);
    console.log(`[StoryMode] Final counts -> easy=${finalCounts.easy||0} medium=${finalCounts.medium||0} hard=${finalCounts.hard||0}`);
    console.log('[StoryMode] Order:', finalSet.map(q => q.difficulty).join(' > '));
    return finalSet;
  }

  static async getQuestions(
    saga: string,
    amount: number = 10,
    difficulty?: 'easy' | 'medium' | 'hard',
    isStoryMode: boolean = false
  ): Promise<Question[]> {
    // Primero intentar obtener preguntas desde Supabase
    try {
      let query = supabase
        .from('questions')
        .select('*');

      // Filtros por saga
      if (!isStoryMode && (saga === 'all' || saga === '*' || saga === 'libre')) {
        // No filtrar saga, traer todas
      } else {
        query = query.eq('saga', saga);
      }

      // Filtro por dificultad
      if (difficulty) {
        query = query.eq('difficulty', difficulty);
      }

      // Limitar cantidad
      if (isStoryMode && amount === 10) {
        // Para modo historia necesitamos un pool más grande para garantizar distribución.
        const fetchLimit = parseInt(process.env.STORY_MODE_FETCH_LIMIT || '60', 10);
        query = query.limit(fetchLimit);
      } else {
        query = query.limit(amount);
      }

      const { data, error } = await query;
      if (error) throw error;
      if (data && data.length > 0) {
        // Mapear opciones si vienen como string JSON
        const questions: Question[] = data.map((q: any) => ({
          ...q,
          options: typeof q.options === 'string' ? JSON.parse(q.options) : q.options
        }));

        // Si es modo historia, aplicar patrón especial
        if (isStoryMode && amount === 10) {
          console.log(`[StoryMode] Supabase devolvió ${questions.length} preguntas para saga=${saga}`);
          return this.getStoryModeQuestions(saga, questions);
        }

        // Mezclar opciones y devolver
        return questions.map(q => this.shuffleOptions(q));
      }
    } catch (err) {
      console.log('❌ Error al obtener preguntas de Supabase, usando local:', err);
    }

    // Fallback: usar base local
    console.log('📚 Usando base de datos local de preguntas');
    await new Promise(resolve => setTimeout(resolve, 300)); // Simular delay de API

    let filteredQuestions: Question[];
    if (!isStoryMode && (saga === 'all' || saga === '*' || saga === 'libre')) {
      filteredQuestions = [...QUESTIONS_DB];
    } else {
      const localSaga = saga === 'skypea' ? 'skypea' : saga;
      filteredQuestions = QUESTIONS_DB.filter(q => q.saga === localSaga);
    }

    if (isStoryMode && amount === 10) {
      const localSaga = saga === 'skypea' ? 'skypea' : saga;
      return this.getStoryModeQuestions(localSaga, filteredQuestions);
    }

    if (difficulty) {
      filteredQuestions = filteredQuestions.filter(q => q.difficulty === difficulty);
    }

    const shuffled = filteredQuestions.sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, Math.min(amount, shuffled.length));
    return selected.map(q => this.shuffleOptions(q));
  }

  static async checkAnswer(questionId: number, answer: string): Promise<boolean> {
    // 🔒 VALIDACIÓN SIMPLIFICADA - Solo local hasta mejorar API
    /*
    // Para preguntas de la API externa (ID temporal basado en timestamp), 
    // hacer validación local simple
    if (questionId > 1000000000000) { // IDs de timestamp son muy grandes
      // Para preguntas de API externa, no tenemos ID persistente para verificar
      // En su lugar, la validación ya se hizo en el cliente
      return true; // Asumimos que la validación del cliente es correcta
    }
    */
    
    // 📚 VALIDACIÓN LOCAL SOLAMENTE
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const question = QUESTIONS_DB.find(q => q.id === questionId);
    return question ? question.correct_answer === answer : false;
  }

  static getQuestionsCount(saga: string): number {
    return QUESTIONS_DB.filter(q => q.saga === saga).length;
  }
}

// Utilidad para verificar cantidad de preguntas por saga y dificultad
export function verificarPreguntasPorSaga() {
  const config = QuestionsAPI.STORY_MODE_CONFIG;
  const sagas = Object.keys(config);
  sagas.forEach(saga => {
    const easy = QUESTIONS_DB.filter(q => q.saga === saga && q.difficulty === 'easy').length;
    const medium = QUESTIONS_DB.filter(q => q.saga === saga && q.difficulty === 'medium').length;
    const hard = QUESTIONS_DB.filter(q => q.saga === saga && q.difficulty === 'hard').length;
    const conf = config[saga];
    console.log(`Saga: ${saga}`);
    console.log(`  Easy:   ${easy}/${conf.easy} ${easy < conf.easy ? '❌' : '✅'}`);
    console.log(`  Medium: ${medium}/${conf.medium} ${medium < conf.medium ? '❌' : '✅'}`);
    console.log(`  Hard:   ${hard}/${conf.hard} ${hard < conf.hard ? '❌' : '✅'}`);
  });
}


// Utilidad para mostrar preguntas por saga y dificultad
export function resumenPreguntasPorSaga() {
  const config = QuestionsAPI.STORY_MODE_CONFIG;
  const sagas = Object.keys(config);
  sagas.forEach(saga => {
    console.log(`\nSaga: ${saga}`);
    ['easy','medium','hard'].forEach(dif => {
      const preguntas = QUESTIONS_DB.filter(q => q.saga === saga && q.difficulty === dif);
      console.log(`  ${dif.toUpperCase()} (${preguntas.length}):`);
      preguntas.forEach(q => {
        console.log(`    [${q.id}] ${q.question}`);
      });
    });
  });
}

// --- DEBUG: Ejecutar verificación si se llama desde CLI ---
if (require.main === module) {
  verificarPreguntasPorSaga();
}