'use client'

import { useState } from 'react'
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  isSameMonth,
  isSameDay,
  parseISO
} from 'date-fns'
import { de } from 'date-fns/locale'
import EventCard from './EventCard'
import type { CommunityId } from '@/lib/constants'

interface Event {
  id: string
  title: string
  description?: string
  location?: string
  starts_at: string
  ends_at?: string
  community: CommunityId
}

interface CalendarViewProps {
  events: Event[]
  viewMode?: 'month' | 'list'
}

export default function CalendarView({ events, viewMode: initialViewMode = 'list' }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [viewMode, setViewMode] = useState<'month' | 'list'>(initialViewMode)

  // Gruppiere Events nach Datum für Listenansicht
  const groupedEvents = events.reduce((acc, event) => {
    const dateKey = format(parseISO(event.starts_at), 'yyyy-MM-dd')
    if (!acc[dateKey]) {
      acc[dateKey] = []
    }
    acc[dateKey].push(event)
    return acc
  }, {} as Record<string, Event[]>)

  const sortedDates = Object.keys(groupedEvents).sort()

  // Monatsansicht Logik
  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const calendarStart = startOfWeek(monthStart, { locale: de })
  const calendarEnd = endOfWeek(monthEnd, { locale: de })

  const dateFormat = 'd'
  const rows: Date[][] = []
  let days: Date[] = []
  let day = calendarStart

  while (day <= calendarEnd) {
    for (let i = 0; i < 7; i++) {
      days.push(day)
      day = addDays(day, 1)
    }
    rows.push(days)
    days = []
  }

  const getEventsForDay = (date: Date) => {
    return events.filter(event => isSameDay(parseISO(event.starts_at), date))
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center justify-between gap-3 rounded-[16px] bg-[#f2f2f7] px-2 py-1 sm:justify-start">
          <button
            onClick={() => setCurrentDate(subMonths(currentDate, 1))}
            className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full text-[var(--app-ios-accent)] transition-colors hover:bg-white"
            aria-label="Vorheriger Monat"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <h2 className="mb-0 text-[19px] font-semibold sm:text-[26px]">
            {format(currentDate, 'MMMM yyyy', { locale: de })}
          </h2>

          <button
            onClick={() => setCurrentDate(addMonths(currentDate, 1))}
            className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full text-[var(--app-ios-accent)] transition-colors hover:bg-white"
            aria-label="Nächster Monat"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* View Toggle */}
        <div className="flex w-full gap-1 rounded-[10px] bg-[#e5e5ea] p-0.5 sm:w-auto">
          <button
            onClick={() => setViewMode('list')}
            className={`min-h-[38px] flex-1 rounded-[8px] px-4 py-2 text-[13px] font-medium transition-colors sm:flex-none ${
              viewMode === 'list'
                ? 'bg-white text-[var(--app-ios-ink)] shadow-sm'
                : 'text-[var(--app-ios-muted)]'
            }`}
          >
            Liste
          </button>
          <button
            onClick={() => setViewMode('month')}
            className={`min-h-[38px] flex-1 rounded-[8px] px-4 py-2 text-[13px] font-medium transition-colors sm:flex-none ${
              viewMode === 'month'
                ? 'bg-white text-[var(--app-ios-ink)] shadow-sm'
                : 'text-[var(--app-ios-muted)]'
            }`}
          >
            Monat
          </button>
        </div>
      </div>

      {/* Listenansicht (Mobile Default) */}
      {viewMode === 'list' && (
        <div className="space-y-6">
          {sortedDates.length === 0 ? (
            <div className="card text-center py-12">
              <p className="text-gray-500">Keine Events im aktuellen Monat</p>
            </div>
          ) : (
            sortedDates.map(dateKey => {
              const date = parseISO(dateKey)
              const dayEvents = groupedEvents[dateKey]

              return (
                <div key={dateKey}>
                  <h3 className="mb-3 text-[17px] font-semibold text-[var(--app-ios-ink)] md:text-lg">
                    {format(date, 'EEEE, d. MMMM yyyy', { locale: de })}
                  </h3>
                  <div className="space-y-3">
                    {dayEvents.map(event => (
                      <EventCard
                        key={event.id}
                        title={event.title}
                        description={event.description}
                        location={event.location}
                        startsAt={event.starts_at}
                        endsAt={event.ends_at}
                        community={event.community}
                        compact
                      />
                    ))}
                  </div>
                </div>
              )
            })
          )}
        </div>
      )}

      {/* Monatsansicht */}
      {viewMode === 'month' && (
        <div className="overflow-hidden rounded-[20px] border border-[var(--app-ios-line)] bg-white shadow-[0_1px_2px_rgba(15,23,20,0.04)]">
          {/* Wochentage Header */}
          <div className="grid grid-cols-7 border-b border-[var(--app-ios-line)] bg-[#f2f2f7]">
            {['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'].map(day => (
              <div key={day} className="py-2 text-center text-[11px] font-semibold uppercase tracking-[0.06em] text-[var(--muted)] sm:text-sm">
                {day}
              </div>
            ))}
          </div>

          {/* Kalendertage */}
          {rows.map((week, weekIdx) => (
            <div key={weekIdx} className="grid grid-cols-7 border-b last:border-b-0">
              {week.map((day, dayIdx) => {
                const dayEvents = getEventsForDay(day)
                const isCurrentMonth = isSameMonth(day, currentDate)
                const isToday = isSameDay(day, new Date())

                return (
                  <div
                    key={dayIdx}
                    className={`min-h-[86px] border-r p-1.5 last:border-r-0 sm:min-h-[100px] sm:p-2 ${
                      !isCurrentMonth ? 'bg-[rgba(31,77,67,0.03)]' : ''
                    } ${isToday ? 'bg-[var(--app-ios-accent-soft)]' : ''}`}
                  >
                    <div className={`mb-1 text-sm font-semibold ${!isCurrentMonth ? 'text-gray-400' : ''}`}>
                      {format(day, dateFormat)}
                    </div>
                    <div className="space-y-1">
                      {dayEvents.slice(0, 2).map(event => (
                        <div
                          key={event.id}
                          className={`truncate rounded px-1.5 py-1 text-[10px] text-white sm:text-xs ${
                            event.community === 'sheridan-junia' ? 'bg-sheridan-blue' :
                            event.community === 'wagnisshare' ? 'bg-wagnis-orange' :
                            'bg-wogenau-green'
                          }`}
                          title={event.title}
                        >
                          {event.title}
                        </div>
                      ))}
                      {dayEvents.length > 2 && (
                        <div className="text-xs text-gray-500">
                          +{dayEvents.length - 2} weitere
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
