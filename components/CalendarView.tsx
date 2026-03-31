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
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setCurrentDate(subMonths(currentDate, 1))}
            className="p-2 hover:bg-gray-100 rounded-lg min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Vorheriger Monat"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <h2 className="text-xl sm:text-2xl font-bold">
            {format(currentDate, 'MMMM yyyy', { locale: de })}
          </h2>

          <button
            onClick={() => setCurrentDate(addMonths(currentDate, 1))}
            className="p-2 hover:bg-gray-100 rounded-lg min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Nächster Monat"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* View Toggle */}
        <div className="flex gap-2 w-full sm:w-auto">
          <button
            onClick={() => setViewMode('list')}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-lg font-medium transition-colors min-h-[44px] ${
              viewMode === 'list'
                ? 'bg-sheridan-blue text-white'
                : 'bg-gray-200 text-anthracite hover:bg-gray-300'
            }`}
          >
            Liste
          </button>
          <button
            onClick={() => setViewMode('month')}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-lg font-medium transition-colors min-h-[44px] ${
              viewMode === 'month'
                ? 'bg-sheridan-blue text-white'
                : 'bg-gray-200 text-anthracite hover:bg-gray-300'
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
                  <h3 className="text-lg font-semibold mb-3 text-sheridan-blue">
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
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {/* Wochentage Header */}
          <div className="grid grid-cols-7 bg-gray-100 border-b">
            {['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'].map(day => (
              <div key={day} className="text-center py-2 text-sm font-semibold text-gray-600">
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
                    className={`min-h-[80px] sm:min-h-[100px] p-1 sm:p-2 border-r last:border-r-0 ${
                      !isCurrentMonth ? 'bg-gray-50' : ''
                    } ${isToday ? 'bg-blue-50' : ''}`}
                  >
                    <div className={`text-sm font-semibold mb-1 ${!isCurrentMonth ? 'text-gray-400' : ''}`}>
                      {format(day, dateFormat)}
                    </div>
                    <div className="space-y-1">
                      {dayEvents.slice(0, 2).map(event => (
                        <div
                          key={event.id}
                          className={`text-xs p-1 rounded truncate ${
                            event.community === 'sheridan-junia' ? 'bg-sheridan-blue' :
                            event.community === 'wagnisshare' ? 'bg-wagnis-orange' :
                            'bg-wogenau-green'
                          } text-white`}
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
