import type { HabitDraft } from '../types/models'

export const categoryOptions = [
  'Focus',
  'Body',
  'Mind',
  'Sleep',
  'Learning',
  'Wellness',
]

export const colorOptions = [
  '#FF9A5A',
  '#76D6A8',
  '#71C7FF',
  '#F4BF72',
  '#D6A0FF',
  '#FF8C82',
]

export const iconOptions = [
  'sparkles',
  'brain',
  'dumbbell',
  'book-open',
  'moon-star',
  'heart-pulse',
  'target',
  'droplets',
]

export const timeSlotOptions = [
  'morning',
  'midday',
  'evening',
  'anytime',
] as const

export const weekdayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export const starterPackOptions = [
  {
    id: 'balanced-reset',
    title: 'Balanced Reset',
    description: 'Rebuild momentum with one mind habit, one body habit, and one evening reset.',
  },
  {
    id: 'deep-focus',
    title: 'Deep Focus',
    description: 'Reduce drift, add structure, and protect your most productive hours.',
  },
  {
    id: 'mind-body',
    title: 'Mind + Body',
    description: 'Pair calm, movement, and recovery so consistency feels sustainable.',
  },
] as const

export type StarterPackId = (typeof starterPackOptions)[number]['id']

export const starterPacks: Record<StarterPackId, HabitDraft[]> = {
  'balanced-reset': [
    {
      name: 'Morning Stretch',
      description: 'Five minutes of movement before screens.',
      category: 'Body',
      color: '#76D6A8',
      icon: 'dumbbell',
      scheduleType: 'daily',
      scheduledDays: [],
      preferredTimeSlot: 'morning',
      goalLabel: '5 min mobility',
      cueNote: 'Do it before coffee.',
      rewardNote: 'Start the day loose and awake.',
    },
    {
      name: 'Focus Sprint',
      description: 'One distraction-free work session.',
      category: 'Focus',
      color: '#71C7FF',
      icon: 'target',
      scheduleType: 'daily',
      scheduledDays: [],
      preferredTimeSlot: 'midday',
      goalLabel: '45 min sprint',
      cueNote: 'Block your first major task.',
      rewardNote: 'Earn a clean dashboard win.',
    },
    {
      name: 'Evening Shutdown',
      description: 'Close loops and plan tomorrow.',
      category: 'Sleep',
      color: '#F4BF72',
      icon: 'moon-star',
      scheduleType: 'daily',
      scheduledDays: [],
      preferredTimeSlot: 'evening',
      goalLabel: '10 min reset',
      cueNote: 'Run it after dinner.',
      rewardNote: 'Sleep with a quieter mind.',
    },
  ],
  'deep-focus': [
    {
      name: 'Inbox Zero Sprint',
      description: 'Process the top priority messages only.',
      category: 'Focus',
      color: '#71C7FF',
      icon: 'sparkles',
      scheduleType: 'weekly',
      scheduledDays: [1, 2, 3, 4, 5],
      preferredTimeSlot: 'morning',
      goalLabel: '20 min review',
      cueNote: 'Open email after planning.',
      rewardNote: 'Protect your attention.',
    },
    {
      name: 'Deep Work Block',
      description: 'One uninterrupted session for meaningful work.',
      category: 'Focus',
      color: '#FF9A5A',
      icon: 'target',
      scheduleType: 'weekly',
      scheduledDays: [1, 2, 3, 4, 5],
      preferredTimeSlot: 'midday',
      goalLabel: '90 min block',
      cueNote: 'Silence your notifications.',
      rewardNote: 'End the day with real progress.',
    },
    {
      name: 'Learning Note',
      description: 'Capture one lesson from the day.',
      category: 'Learning',
      color: '#D6A0FF',
      icon: 'book-open',
      scheduleType: 'daily',
      scheduledDays: [],
      preferredTimeSlot: 'evening',
      goalLabel: '1 insight',
      cueNote: 'Write before your shutdown.',
      rewardNote: 'Turn effort into memory.',
    },
  ],
  'mind-body': [
    {
      name: 'Breathing Reset',
      description: 'A short breathing round to downshift your stress.',
      category: 'Mind',
      color: '#D6A0FF',
      icon: 'brain',
      scheduleType: 'daily',
      scheduledDays: [],
      preferredTimeSlot: 'morning',
      goalLabel: '3 calm minutes',
      cueNote: 'Pair it with your first sip of water.',
      rewardNote: 'Start with steadier energy.',
    },
    {
      name: 'Daily Walk',
      description: 'Walk long enough to clear your head.',
      category: 'Body',
      color: '#76D6A8',
      icon: 'heart-pulse',
      scheduleType: 'daily',
      scheduledDays: [],
      preferredTimeSlot: 'evening',
      goalLabel: '20 minute walk',
      cueNote: 'Do it after classes or work.',
      rewardNote: 'Reset posture and mood.',
    },
    {
      name: 'Hydration Check',
      description: 'Track whether you hit your water goal.',
      category: 'Wellness',
      color: '#71C7FF',
      icon: 'droplets',
      scheduleType: 'daily',
      scheduledDays: [],
      preferredTimeSlot: 'anytime',
      goalLabel: '2 liters',
      cueNote: 'Keep the bottle visible.',
      rewardNote: 'Feel sharper through the day.',
    },
  ],
}
