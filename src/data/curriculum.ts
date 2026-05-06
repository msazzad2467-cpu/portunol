import { Module } from '../types';

export const CURRICULUM: Module[] = [
  {
    id: 'a1-1',
    title: '¡Hola! Saludos y Presentaciones',
    level: 'A1',
    completion: 0,
    lessons: [
      { id: 'l1', type: 'multiple-choice', question: 'Como se diz "Bom dia" em espanhol?', options: ['Buenas noches', 'Hola', 'Buenos días', 'Hasta luego'], answer: 'Buenos días' },
      { id: 'l2', type: 'cloze', question: 'Yo ____ Pedro.', answer: 'soy', hint: 'Verbo ser' },
      { id: 'l3', type: 'speaking', question: 'Encantado de conocerte', audioText: 'Encantado de conocerte', answer: 'Encantado de conocerte' }
    ]
  },
  {
    id: 'a1-2',
    title: 'Los Números y La Edad',
    level: 'A1',
    completion: 0,
    isLocked: true,
    lessons: []
  },
  {
    id: 'a2-1',
    title: 'Mi Rutina Diaria',
    level: 'A2',
    completion: 0,
    isLocked: true,
    lessons: []
  },
  {
    id: 'b1-1',
    title: 'Verbos en Pasado',
    level: 'B1',
    completion: 0,
    isLocked: true,
    lessons: []
  }
];
