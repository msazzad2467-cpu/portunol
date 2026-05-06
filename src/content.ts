import { Module, Level, LessonType, GrammarTopic, LibraryItem, DictionaryEntry, ExamMock } from './types';

export const SPANISH_PLUS: Module[] = [
  ...Array.from({ length: 400 }).map((_, i) => ({
    id: `plus-${i}`,
    level: (i < 60 ? 'A2' : i < 180 ? 'B2' : 'C2') as Level,
    title: [
      'Entrevista de Emprego', 'No Hospital: Sintomas', 'Abrindo Conta Bancária', 
      'Negociação de Contrato', 'Emergência no Aeroporto', 'Expressões de Paquera',
      'Debate: Mudanças Climáticas', 'Gírias de Madrid', 'O Voseo Argentino',
      'Espanhol para TI', 'Termos Jurídicos Básicos', 'Resumo Acadêmico',
      'Humor e Piadas Curtas', 'Provérbios de Cervantes', 'Culinária Peruana',
      'O Dialeto Chileno', 'E-mails Formais', 'Reuniões por Zoom', 
      'Sotaque Caribenho', 'Cinema Espanhol', 'Culinária Cubana', 'Literatura Mexicana',
      'História Pré-Colombiana', 'Geografia Andina', 'Música Urbana', 'Arte Barroca',
      'Marketing Digital', 'Psicologia do Esporte', 'Gastronomia Molecular'
    ][i % 29] + ` (${Math.floor(i/29) + 1})`,
    description: `Lição avançada focada em situações de ${['trabalho', 'saúde', 'dia a dia', 'cultura', 'acadêmico', 'tecnologia', 'arte', 'esportes'][ i % 8]}.`,
    isLocked: i > 0,
    completion: 0,
    lessons: [
      { id: `pl-${i}-1`, type: 'flashcard' as LessonType, question: 'Traduza o termo principal', answer: 'Término', context: 'Vocabulário.' },
      { id: `pl-${i}-2`, type: 'multiple-choice' as LessonType, question: 'Qual a forma correta?', answer: 'Opción A', options: ['Opción A', 'Opción B', 'Opción C'] },
      { id: `pl-${i}-3`, type: 'speaking' as LessonType, question: 'Pratique a pronúncia', answer: 'Regionalismo', audioText: 'Regionalismo' }
    ]
  }))
];

export const LEARNING_IDEAS = [
  ...Array.from({ length: 300 }).map((_, i) => ({
    id: i + 1,
    title: [
      'Shadowing de Podcast', 'Diário de Bordo', 'Missão: Supermercado', 'Shadowing de Música',
      'Mudar Idioma do Celular', 'Post-its pela Casa', 'Ler Notícias em Voz Alta',
      'Escrever um Poema', 'Conversar com IA', 'Assistir Série sem Legenda',
      'Ouvir Rádio Estrangeira', 'Culinária com Receita Espanhola', 'Jogar Online em Espanhol',
      'Fazer Lista de Tarefas', 'Comentar em Blogs', 'Ler Quadrinhos', 'Praticar com Aplicativo'
    ][i % 17] + ` #${Math.floor(i/17) + 1}`,
    desc: `Pratique espanhol por ${5 + (i%30)} minutos usando ${['música', 'filmes', 'notícias', 'redes sociais', 'literatura', 'podcasts', 'fóruns'][i % 7]}.`,
    category: ['Cultura', 'Gramática', 'Prática', 'Escuta', 'Falar', 'Escrever', 'Ler'][i % 7]
  }))
];

export const DAILY_PLAN = [
  { id: 'dp1', title: 'Verbo Ser vs Estar', type: 'grammar', duration: '2 min', done: false, moduleId: 'g-2' },
  { id: 'dp2', title: 'Vocabulário: Casa', type: 'vocabulary', duration: '5 min', done: false, srsCount: 10 },
  { id: 'dp3', title: 'Ditado Rápido', type: 'listening', duration: '1 min', done: false },
  { id: 'dp4', title: 'Pronúncia: R vibrante', type: 'speaking', duration: '2 min', done: false }
];

export const MICRO_LESSONS = [
  {
    id: 'm1',
    title: 'Por vs Para',
    tip: 'Use "PARA" para destino ou finalidade. Use "POR" para causa ou meio.',
    example: 'Este regalo es PARA ti. / Voy POR tren.',
    quiz: [
      { id: 'm1q1', type: 'multiple-choice' as LessonType, question: 'Gracias ___ la ayuda.', answer: 'por', options: ['por', 'para'] }
    ]
  },
  {
    id: 'm2',
    title: 'Falsos Cognatos',
    tip: '"Embarazada" NÃO significa embaraçada. Significa GRÁVIDA.',
    example: 'Ella está embarazada de 3 meses.',
    quiz: [
      { id: 'm2q1', type: 'multiple-choice' as LessonType, question: 'Maria está ___. (Grávida)', answer: 'embarazada', options: ['embarazada', 'avergonzada'] }
    ]
  }
];

export const PHRASE_OF_THE_DAY = {
  es: 'La práctica hace al maestro.',
  pt: 'A prática faz o mestre.',
  audio: 'La prática hace al maestro.'
};

export const WORD_OF_THE_DAY = {
  es: 'Aprovechar',
  pt: 'Aproveitar',
  usage: 'Debes aprovechar el tiempo.',
  type: 'verbo'
};

export const DICTIONARY_DATA: DictionaryEntry[] = [
  {
    id: 'd1',
    es: 'Aprovechar',
    pt: 'Aproveitar',
    type: 'verbo',
    examples: [
      { es: 'Debes aprovechar el tiempo libre.', pt: 'Você deve aproveitar o tempo livre.' },
      { es: 'Aprovecharon la oferta para viajar.', pt: 'Aproveitaram a oferta para viajar.' }
    ],
    conjugationId: 'aprovechar'
  },
  {
    id: 'd2',
    es: 'Embarazada',
    pt: 'Grávida',
    type: 'adjetivo',
    gender: 'f',
    examples: [
      { es: 'Ella está embarazada de seis meses.', pt: 'Ela está grávida de seis meses.' }
    ]
  },
  {
    id: 'd3',
    es: 'Vaso',
    pt: 'Copo',
    type: 'substantivo',
    gender: 'm',
    examples: [
      { es: '¿Me das un vaso de agua, por favor?', pt: 'Você me dá um copo de água, por favor?' }
    ]
  }
];

export const CONJUGATIONS: Record<string, any> = {
  'hablar': {
    verb: 'HABLAR',
    translation: 'Falar',
    present: [
      { p: 'Yo', v: 'hablo' },
      { p: 'Tú', v: 'hablas' },
      { p: 'Él/Ella', v: 'habla' },
      { p: 'Nosotros', v: 'hablamos' },
      { p: 'Vosotros', v: 'habláis' },
      { p: 'Ellos', v: 'hablan' },
    ]
  },
  'aprovechar': {
    verb: 'APROVECHAR',
    translation: 'Aproveitar',
    present: [
      { p: 'Yo', v: 'aprovecho' },
      { p: 'Tú', v: 'aprovechas' },
      { p: 'Él/Ella', v: 'aprovecha' },
      { p: 'Nosotros', v: 'aprovechamos' },
      { p: 'Vosotros', v: 'aprovecháis' },
      { p: 'Ellos', v: 'aprovechan' },
    ]
  }
};

export const EXAM_MOCKS: ExamMock[] = [
  {
    id: 'dele-a2-1',
    title: 'Simulado DELE A2 - Básico',
    examType: 'DELE',
    level: 'A2',
    sections: [
      {
        id: 's1',
        type: 'reading',
        duration: 60,
        questions: [
          { id: 'q1', type: 'mcq', question: '¿Dónde vive Pedro?', options: ['Madrid', 'Barcelona', 'Sevilla'], answer: 'Madrid' }
        ]
      }
    ]
  },
  {
    id: 'dele-b1-1',
    title: 'Simulado DELE B1 - Intermediário',
    examType: 'DELE',
    level: 'B1',
    sections: [
      {
        id: 's1',
        type: 'reading',
        duration: 70,
        questions: [
          { id: 'q1', type: 'mcq', question: '¿Cuál es el propósito del autor?', options: ['Informar', 'Criticar', 'Elogiar'], answer: 'Informar' }
        ]
      }
    ]
  },
  {
    id: 'dele-b2-1',
    title: 'Simulado DELE B2 - Avançado',
    examType: 'DELE',
    level: 'B2',
    sections: [
      {
        id: 's1',
        type: 'reading',
        duration: 70,
        questions: [
          { id: 'q1', type: 'mcq', question: '¿Cuál es o tema principal do texto?', options: ['A', 'B', 'C'], answer: 'A' }
        ]
      }
    ]
  },
  {
    id: 'siele-global-1',
    title: 'SIELE Global - Completo',
    examType: 'SIELE',
    level: 'B2',
    sections: [
      {
        id: 's1',
        type: 'reading',
        duration: 60,
        questions: [
          { id: 'q1', type: 'mcq', question: 'De acordo com o gráfico...', options: ['Opção 1', 'Opção 2'], answer: 'Opção 1' }
        ]
      }
    ]
  },
  {
    id: 'dele-c1-1',
    title: 'Simulado DELE C1 - Especialista',
    examType: 'DELE',
    level: 'C1',
    sections: [
      {
        id: 's1',
        type: 'reading',
        duration: 90,
        questions: [
          { id: 'q1', type: 'mcq', question: '¿Qué se infiere de la metáfora usada?', options: ['Olvido', 'Esperanza', 'Miedo'], answer: 'Olvido' }
        ]
      }
    ]
  }
];

export const CURRICULUM: Module[] = [
  ...(['A1', 'A2', 'B1', 'B2', 'C1', 'C2'] as Level[]).flatMap((level, levelIdx) => 
    Array.from({ length: 150 }).map((_, i) => ({
      id: `${level.toLowerCase()}-${i + 1}`,
      level,
      title: [
        // A1
        ['Essenciais', 'Família', 'Casa', 'Restaurante', 'Supermercado', 'Cores', 'Saudações', 'Números', 'Animais', 'Corpo', 'Tempo', 'Clima', 'Escola', 'Trabalho', 'Hobby'],
        // A2
        ['Viagens', 'Profissões', 'Lazer', 'Saúde', 'Turismo', 'Transporte', 'Roupas', 'Clima', 'Cidade', 'Hobbies', 'Música', 'Cinema', 'Esportes', 'Natureza', 'Tecnologia'],
        // B1
        ['Experiências', 'Desejos', 'Ambiente', 'Tecnologia', 'Mídia', 'Sociedade', 'Culinária', 'Educação', 'Trabalho', 'Planos', 'Amigos', 'Futuro', 'Opiniões', 'Rotina', 'Cultura'],
        // B2
        ['História', 'Política', 'Cinema', 'Arte', 'Economia', 'Literatura', 'Ciência', 'Filosofia', 'Ética', 'Globalização', 'Psicologia', 'Sociologia', 'Justiça', 'Direito', 'Mídia'],
        // C1
        ['Direito', 'Finanças', 'Psicologia', 'Sociologia', 'Engenharia', 'Medicina', 'Religião', 'Antropologia', 'Estatística', 'Geopolítica', 'Diplomacia', 'Urbanismo', 'Design', 'Teatro', 'Ópera'],
        // C2
        ['Século de Ouro', 'Linguística', 'Metafísica', 'Ontologia', 'Semiótica', 'Pós-Modernismo', 'Neurociência', 'Astrofísica', 'Quântica', 'Teoria da Arte', 'Epistemologia', 'Lógica', 'Estética', 'Poesia', 'Retórica']
      ][levelIdx][i % 15] + ` Part ${Math.floor(i/15) + 1}`,
      description: `Módulo abrangente de nível ${level} cobrindo ${['vocabulário', 'gramática', 'prática oral', 'compreensão', 'escrita'][i % 5]} sobre o tema.`,
      isLocked: levelIdx > 0 || i > 0,
      completion: 0,
      lessons: [
        { id: `l-${level}-${i}-1`, type: 'flashcard' as LessonType, question: 'Termo de estudo', answer: 'Resposta', context: 'Exemplo de uso.' },
        { id: `l-${level}-${i}-2`, type: 'multiple-choice' as LessonType, question: 'Pergunta de verificação?', answer: 'Certo', options: ['Certo', 'Errado', 'Talvez'] },
        { id: `l-${level}-${i}-3`, type: 'cloze' as LessonType, question: 'Complete a ___ . (Frase)', answer: 'frase' }
      ]
    }))
  ),
  // Add special regional modules
  {
    id: 'reg-col',
    level: 'B1',
    title: 'Variante: Colômbia 🇨🇴',
    description: 'Gírias de Bogotá e Medellín.',
    isLocked: true,
    completion: 0,
    lessons: [
       { id: 'l-col-1', type: 'multiple-choice' as LessonType, question: '¿Qué significa "¡Qué bacano!"?', answer: 'Legal', options: ['Legal', 'Ruim'] }
    ]
  },
  {
    id: 'reg-chi',
    level: 'B2',
    title: 'Variante: Chile 🇨🇱',
    description: 'O dialeto mais rápido da América Latina.',
    isLocked: true,
    completion: 0,
    lessons: [
       { id: 'l-chi-1', type: 'cloze' as LessonType, question: '¿Cómo ___ ? (Está)', answer: 'estái' }
    ]
  }
];

export const GRAMMAR_BOOK: GrammarTopic[] = [
  ...Array.from({ length: 200 }).map((_, i) => ({
    id: `g-ext-${i}`,
    title: [
      'Subjuntivo Imperfeito', 'Condicional Composto', 'Por vs Para Avançado',
      'Voz Passiva', 'Orações Concessionais', 'Gerúndio e Particípio',
      'Pronomes Relativos', 'Adjetivos Invariáveis', 'Pretérito Pluscuamperfecto',
      'Concordância Nominal', 'Perífrases Verbais', 'Acentuação e Tildes',
      'Uso de Mayúsculas', 'Expressões Idiomáticas', 'Verbos Flexivos',
      'Orações Subordinadas', 'Comparativos e Superlativos', 'Imperativo Afirmativo',
      'Imperativo Negativo', 'Advérbios de Tempo'
    ][i % 20] + ` - Vol ${Math.floor(i/20) + 1}`,
    explanation: `Explicação detalhada sobre este tópico gramatical para estudantes de nível ${['A1', 'A2', 'B1', 'B2', 'C1', 'C2'][i % 6]}.`,
    examples: [
      { es: 'Ejemplo de uso en contexto.', pt: 'Exemplo de uso em contexto.' }
    ],
    quiz: [
      { id: `gq-ext-${i}`, type: 'multiple-choice' as 'multiple-choice' | 'cloze', question: 'Pergunta de teste gramatical?', answer: 'Certo', options: ['Certo', 'Errado'] }
    ]
  })),
  {
    id: 'g-1',
    title: 'Artigos e Gêneros',
    explanation: 'Terminações em -ma, -pa, -ta que são masculinas (el problema).',
    examples: [
      { es: 'El problema es grave.', pt: 'O problema é grave.' }
    ],
    quiz: [
      { id: 'gq1', type: 'multiple-choice', question: 'A palavra "Planeta" é:', answer: 'Masculino', options: ['Masculino', 'Feminino'] }
    ]
  }
];

export const PHRASEBOOK = [
  { category: 'Viagem', phrases: [
    { es: '¿Dónde está la estación?', pt: 'Onde fica a estação?', note: 'Básico.' }
  ]}
];

export const REAL_SPANISH = [
  { region: 'México 🇲🇽', slang: [
    { term: 'Chido', meaning: 'Legal', example: 'Está chido.' }
  ]}
];

export const LIBRARY: LibraryItem[] = [
  ...Array.from({ length: 500 }).map((_, i) => ({
    id: `lib-ext-${i}`,
    title: [
      'O Impacto da IA na Arte', 'Crise Climática nos Andes', 'A Economia do Lítio',
      'Migração e Identidade', 'Gastronomia de Fusão', 'O Realismo Mágico',
      'Sustentabilidade Urbana', 'Festivais Esquecidos', 'Arquitetura Colonial',
      'Desafios da Educação', 'Cidades Inteligentes', 'Energias Renováveis',
      'Turismo de Aventura', 'Patrimônio Mundial', 'Oceanografia', 'Biotecnologia',
      'Exploração Espacial', 'Nanotecnologia', 'Cibersegurança', 'Economia Criativa'
    ][i % 20] + ` (Edição ${Math.floor(i/20) + 1})`,
    level: (i < 100 ? 'A1' : i < 200 ? 'A2' : i < 300 ? 'B1' : i < 400 ? 'B2' : 'C1') as Level,
    type: (i % 2 === 0 ? 'reading' : 'listening') as any,
    content: `Este é um conteúdo expandido focado em ${['sociedade', 'tecnologia', 'meio ambiente', 'história', 'cultura', 'economia', 'saúde'][i % 7]} para prática intensa. O desenvolvimento das habilidades linguísticas requer exposição constante a materiais diversos e complexos, permitindo ao estudante absorver nuances regionais e contextuais do espanhol moderno.`
  })),
  // --- LEITURA (READING) ---
  {
    id: 'r1',
    title: 'Un dia en Madrid',
    level: 'A1',
    type: 'reading',
    content: 'Madrid es la capital de España. Hay muchos museos y parques hermosos como el Retiro. La gente es amable and la comida es deliciosa, especialmente los churros con chocolate.'
  },
  {
    id: 'r2',
    title: 'La leyenda de El Dorado',
    level: 'B1',
    type: 'reading',
    content: 'El Dorado es una ciudad legendaria hecha de oro que buscaban los conquistadores españoles en América del Sur. Se dice que está escondida en la selva colombiana.'
  },
  {
    id: 'r3',
    title: 'Don Quijote (Fragmento)',
    level: 'C2',
    type: 'reading',
    content: '"En un lugar de la Mancha, de cuyo nombre no quiero acordarme, no ha mucho tiempo que vivía un hidalgo de los de lanza en astillero, adarga antigua, rocín flaco y galgo corredor...".'
  },
  {
    id: 'r4',
    title: 'O Dialeto Argentino',
    level: 'B2',
    type: 'reading',
    content: 'En Argentina se usa mucho el voseo. En lugar de decir "tú tienes", dicen "vos tenés". Esto le da un ritmo muy particular al habla rioplatense, sumado al sonido de la doble L.'
  },
  {
    id: 'r5',
    title: 'Espanhol para Negócios',
    level: 'C1',
    type: 'reading',
    content: 'La negociación internacional requiere un dominio preciso del lenguaje formal. Es fundamental conocer términos como "balance general", "flujo de caja" y "responsabilidad social corporativa".'
  },

  // --- ÁUDIO (LISTENING) ---
  {
    id: 'a1',
    title: 'Podcast: Vacaciones en Cancún',
    level: 'A2',
    type: 'listening',
    content: 'Bienvenidos a nuestro episodio sobre México. Cancún es famoso por sus playas blancas y mar turquesa. Puedes visitar las ruinas mayas de Chichén Itzá, que es una de las maravillas del mundo.'
  },
  {
    id: 'a2',
    title: 'Entrevista: Arte Callejero',
    level: 'B2',
    type: 'listening',
    content: 'Hoy hablamos con un artista de graffiti en Bogotá. El arte callejero ha transformado la ciudad en una galería abierta. Los colores cuentan historias de paz y esperanza en los muros de la capital.'
  },
  {
    id: 'a3',
    title: 'Notícias: Cambio Climático',
    level: 'C1',
    type: 'listening',
    content: 'Las temperaturas globales siguen aumentando drásticamente. Los glaciares en los Andes se están derritiendo, lo que afecta el suministro de agua para millones de personas en la región.'
  },
  {
    id: 'a4',
    title: 'Relato: Mi Familia en Madrid',
    level: 'A1',
    type: 'listening',
    content: 'Hola, me llamo Carlos. Mi familia es pequeña. Tengo un hermano que estudia medicina y una hermana que trabaja en un banco. Mis padres viven en un apartamento cerca de la Plaza Mayor.'
  },
  {
    id: 'a5',
    title: 'Debate: Inteligencia Artificial',
    level: 'C2',
    type: 'listening',
    content: '¿Es la IA una amenaza para el empleo creativo? Algunos expertos sostienen que potenciará la productividad, mientras que otros temen la pérdida de la esencia humana en la literatura y el arte.'
  }
];

export const DICAS_DO_DIA = [
  "Em espanhol, a letra 'H' é sempre muda.",
  "Estudar 15 minutos por dia é melhor que 2 horas uma vez por semana."
];
