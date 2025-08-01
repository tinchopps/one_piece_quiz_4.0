import { Question } from '@/types/game';
// import { SAGA_API_NAMES } from '@/constants/sagas'; // 🔒 No necesario por ahora

const QUESTIONS_DB: Question[] = [
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
];

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

  // Función para obtener preguntas en modo historia con patrón específico
  private static getStoryModeQuestions(
    saga: string,
    filteredQuestions: Question[]
  ): Question[] {
    const config = this.STORY_MODE_CONFIG[saga as keyof typeof this.STORY_MODE_CONFIG];
    if (!config) {
      // Si no hay configuración específica, usar distribución balanceada
      const shuffled = filteredQuestions.sort(() => Math.random() - 0.5);
      return shuffled.slice(0, 10).map(q => this.shuffleOptions(q));
    }

    const easyQuestions = filteredQuestions.filter(q => q.difficulty === 'easy');
    const mediumQuestions = filteredQuestions.filter(q => q.difficulty === 'medium');
    const hardQuestions = filteredQuestions.filter(q => q.difficulty === 'hard');

    // Verificar si tenemos suficientes preguntas de cada dificultad
    const neededEasy = config.easy;
    const neededMedium = config.medium;
    const neededHard = config.hard;

    // Si no hay suficientes preguntas, usar las disponibles y completar con otras
    let selectedQuestions: Question[] = [];

    // 1. Seleccionar preguntas fáciles (mezcladas aleatoriamente)
    const shuffledEasy = easyQuestions.sort(() => Math.random() - 0.5);
    const selectedEasy = shuffledEasy.slice(0, Math.min(neededEasy, shuffledEasy.length));
    selectedQuestions.push(...selectedEasy);

    // 2. Seleccionar preguntas medianas (mezcladas aleatoriamente)
    const shuffledMedium = mediumQuestions.sort(() => Math.random() - 0.5);
    const selectedMedium = shuffledMedium.slice(0, Math.min(neededMedium, shuffledMedium.length));
    selectedQuestions.push(...selectedMedium);

    // 3. Seleccionar preguntas difíciles (mezcladas aleatoriamente)
    const shuffledHard = hardQuestions.sort(() => Math.random() - 0.5);
    const selectedHard = shuffledHard.slice(0, Math.min(neededHard, shuffledHard.length));
    selectedQuestions.push(...selectedHard);

    // Si no llegamos a 10 preguntas, completar con preguntas restantes
    if (selectedQuestions.length < 10) {
      const usedIds = new Set(selectedQuestions.map(q => q.id));
      const remainingQuestions = filteredQuestions
        .filter(q => !usedIds.has(q.id))
        .sort(() => Math.random() - 0.5);
      
      const needed = 10 - selectedQuestions.length;
      selectedQuestions.push(...remainingQuestions.slice(0, needed));
    }

    // Mezclar las opciones de cada pregunta y mantener el orden por dificultad
    return selectedQuestions.slice(0, 10).map(q => this.shuffleOptions(q));
  }

  static async getQuestions(
    saga: string,
    amount: number = 10,
    difficulty?: 'easy' | 'medium' | 'hard',
    isStoryMode: boolean = false
  ): Promise<Question[]> {
    // 🔒 API EXTERNA TEMPORALMENTE DESHABILITADA
    // TODO: Reactivar cuando la API esté mejorada
    /*
    // Primero intentar con la API externa
    try {
      if (!isStoryMode) {
        // Para modo libre, usar directamente la API externa
        const externalQuestions = await this.fetchFromExternalAPI(saga, amount, difficulty);
        if (externalQuestions.length > 0) {
          return externalQuestions;
        }
      }
    } catch (error) {
      console.log('🔄 API externa falló, usando preguntas locales como fallback');
    }
    */

    // 📚 USANDO SOLO BASE DE DATOS LOCAL (más rápido y estable)
    console.log('📚 Usando base de datos local de preguntas');
    await new Promise(resolve => setTimeout(resolve, 300)); // Simular delay de API

    // Mapear saga para compatibilidad con datos locales
    const localSaga = saga === 'skypea' ? 'skypea' : saga; // Nuestros datos locales usan 'skypea'
    let filteredQuestions = QUESTIONS_DB.filter(q => q.saga === localSaga);
    
    // Si es modo historia, usar configuración específica
    if (isStoryMode && amount === 10) {
      return this.getStoryModeQuestions(localSaga, filteredQuestions);
    }
    
    // Modo libre o configuración custom
    if (difficulty) {
      filteredQuestions = filteredQuestions.filter(q => q.difficulty === difficulty);
    }

    // Shuffle y retornar la cantidad solicitada (con opciones mezcladas)
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