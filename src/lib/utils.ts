import { clsx, type ClassValue } from 'clsx'
import { format, parseISO } from 'date-fns'

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

export function formatPercent(value: number) {
  return `${Math.round(value * 100)}%`
}

export function formatDayKey(dateKey: string, pattern = 'dd MMM') {
  return format(parseISO(dateKey), pattern)
}

export function toDateKey(date: Date) {
  return format(date, 'yyyy-MM-dd')
}

export function getInitials(fullName: string) {
  return fullName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}

export function formatRangeLabel(days: number) {
  if (days === 7) return 'Week'
  if (days === 30) return 'Month'
  return `${days} days`
}

export function titleCase(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1)
}
