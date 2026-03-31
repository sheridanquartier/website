export type CommunityId = 'sheridan-junia' | 'wagnisshare' | 'wogenau'

export const COMMUNITIES = {
  'sheridan-junia': {
    name: 'Sheridan Park & Junia',
    color: 'sheridan-blue',
    bgColor: 'bg-sheridan-blue',
    textColor: 'text-sheridan-blue',
    borderColor: 'border-sheridan-blue'
  },
  'wagnisshare': {
    name: 'wagnisSHARE',
    color: 'wagnis-orange',
    bgColor: 'bg-wagnis-orange',
    textColor: 'text-wagnis-orange',
    borderColor: 'border-wagnis-orange'
  },
  'wogenau': {
    name: 'WOGENAU',
    color: 'wogenau-green',
    bgColor: 'bg-wogenau-green',
    textColor: 'text-wogenau-green',
    borderColor: 'border-wogenau-green'
  }
} as const

export const CATEGORIES = [
  'Gegenstände',
  'Mitfahrt',
  'Aktivität',
  'Kleidung',
  'Trödel & Verkauf',
  'Verschenken',
  'Sonstiges'
] as const

export const POST_TYPES = [
  { value: 'angebot', label: 'Angebot' },
  { value: 'gesuch', label: 'Gesuch' },
  { value: 'tausch', label: 'Tauschen' }
] as const

export const TRADE_TYPES = [
  { value: 'tausch', label: 'Tausch' },
  { value: 'skill-angebot', label: 'Skill-Angebot' },
  { value: 'skill-gesuch', label: 'Skill-Gesuch' }
] as const
