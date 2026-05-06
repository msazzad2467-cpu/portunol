export const CONFIG = {
  version: '1.0.0',
  maintenanceMode: false,
  announcement: {
    message: '¡Pura Vida! O DELE Simulador está online.',
    active: false,
    type: 'info' as const,
  },
  xpMultiplier: 1,
  adminEmails: ['m.sazzad2467@gmail.com'],
  geminiModel: 'gemini-2.0-flash-exp',
  featureFlags: {
    aiTutor: true,
    writingAssistant: true,
    community: false,
    srsEnabled: true, // legacy compatibility
    conversaçãoEnabled: true, // legacy compatibility
    adsEnabled: true, // legacy compatibility
  },
  unityAds: {
    gameId: '54321', // Example ID
    bannerPlacement: 'Banner_Android',
    interstitialPlacement: 'Interstitial_Android',
    rewardedPlacement: 'Rewarded_Android',
  },
  iaCredits: {
    rewardAmount: 25,
    initialAmount: 500,
    skipModuleCost: 100,
    skipLessonCost: 20,
  },
  costs: {
    conversationSession: 10,
    examGeneration: 50,
    skipLesson: 20,
    skipModule: 100,
    streakShield: 50
  },
  earnings: {
    dailyCheckin: 20,
    dailyMission: 15,
    adReward: 25,
    initialBonus: 500
  },
  scenarios: [
    { id: 'restaurante', name: 'No Restaurante', description: 'Pedir comida e pagar a conta.', initialMessage: '¡Hola! Bienvenido al restaurante. ¿Tienen una reserva?' },
    { id: 'entrevista', name: 'Entrevista de Emprego', description: 'Registro formal e profissional.', initialMessage: 'Buenos días. Bienvenido a nuestra empresa. ¿Puede presentarse?' },
    { id: 'medico', name: 'Consulta Médica', description: 'Sintomas e vocabulário de saúde.', initialMessage: 'Dígame, ¿qué síntomas tiene hoy?' },
    { id: 'hotel', name: 'Check-in no Hotel', description: 'Pedidos e reclamações.', initialMessage: 'Buenas tardes. ¿En qué puedo ayudarle con su reserva?' },
    { id: 'universidade', name: 'Matrícula Universitária', description: 'Registro acadêmico e requisitos.', initialMessage: 'Hola, ¿vienes a matricularte en alguna carrera?' }
  ],
  examPrompts: {
    writing: 'Escriba un texto de entre 80 y 150 palabras...',
  },
  externalApis: {
    gemini: '',
    unity: '',
    other: ''
  }
};

export const isAdmin = (email?: string | null) => !!email && CONFIG.adminEmails.includes(email);
