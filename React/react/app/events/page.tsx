'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Event {
  id: string;
  name: string;
  description: string;
  time: string;
  organisedBy: string;
  location: string;
  accessibility: 0 | 1 | 2; // 0 = None, 1 = PersonReading, 2 = Captions
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [buyingTicket, setBuyingTicket] = useState<string | null>(null);
  const [accessibilityFilter, setAccessibilityFilter] = useState<number | 'all'>('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('http://localhost:5154/api/Organisations/GetAllEvents');
        if (!response.ok) {
          throw new Error('Nie udało się pobrać wydarzeń');
        }
        const data = await response.json();
        console.log('Events data:', data);
        setEvents(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Wystąpił błąd podczas pobierania wydarzeń');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleBuyTicket = async (eventId: string) => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      router.push('/login');
      return;
    }

    setBuyingTicket(eventId);
    try {
      const response = await fetch(`http://localhost:5154/api/Users/BuyTicket/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventId),
      });

      if (!response.ok) {
        throw new Error('Nie udało się kupić biletu');
      }

      router.push('/tickets');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Wystąpił błąd podczas kupowania bilteu');
    } finally {
      setBuyingTicket(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userId');
    router.push('/login');
  };

  const getFilterLabel = () => {
    switch (accessibilityFilter) {
      case 1:
        return 'Lektor';
      case 2:
        return 'Napisy';
      default:
        return 'Wszystkie wydarzenia';
    }
  };

  const filteredEvents = events.filter(event =>
    accessibilityFilter === 'all' || event.accessibility === accessibilityFilter
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  const formatEventTime = (timeString: string) => {
    const date = new Date(timeString);
    return date.toLocaleString(undefined, {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  const getLoginOrLogoutMenu = () => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      return (
        <button
          onClick={handleLogout}
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Zaloguj
        </button>
      );
    }
	return (
      <div className="flex items-center space-x-4">
        <Link
          href="/tickets"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-600 bg-indigo-100 hover:bg-indigo-200"
        >
          Moje bilety
        </Link>
        <button
          onClick={handleLogout}
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Wyloguj
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dostępne wydarzenia</h1>
          {getLoginOrLogoutMenu()}
        </div>

        <div className="mb-6">
          <div className="relative inline-block" ref={dropdownRef}>
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <svg className="mr-2 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              {getFilterLabel()}
              <svg className="ml-2 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {isFilterOpen && (
              <div className="origin-top-left absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100">
                <div className="py-1" role="menu" aria-orientation="vertical">
                  <button
                    onClick={() => {
                      setAccessibilityFilter('all');
                      setIsFilterOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm ${
                      accessibilityFilter === 'all'
                        ? 'bg-gray-100 text-gray-900'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                    role="menuitem"
                  >
                    Wszystkie wydarzenia
                  </button>
                  <button
                    onClick={() => {
                      setAccessibilityFilter(1);
                      setIsFilterOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm ${
                      accessibilityFilter === 1
                        ? 'bg-gray-100 text-gray-900'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                    role="menuitem"
                  >
                    Wydarzenia z lektorem
                  </button>
                  <button
                    onClick={() => {
                      setAccessibilityFilter(2);
                      setIsFilterOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm ${
                      accessibilityFilter === 2
                        ? 'bg-gray-100 text-gray-900'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                    role="menuitem"
                  >
                    Wydarzenia z napisami
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {filteredEvents.length === 0 ? (
              <li className="px-6 py-4">
                <p className="text-gray-500 text-center">Nie znaleziono wydarzeń z wybranym udogodnieniem.</p>
              </li>
            ) : (
              filteredEvents.map((event) => (
                <li key={event.id} className="px-6 py-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium text-gray-900 truncate">{event.name}</h3>
                        <p className="text-sm text-gray-500">Organizowane przez: {event.organisedBy}</p>
                      </div>
                      <p className="mt-2 text-gray-600 whitespace-pre-wrap">{event.description}</p>
                      <div className="mt-2 flex items-center text-sm text-gray-500">
                        <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {formatEventTime(event.time)}
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500">
                        <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" fill="currentColor" stroke="none" viewBox="0 0 24 24">
                          <path strokeWidth="0.025" d="m 12,16.475 q 2.475,-2 3.7375,-3.85 Q 17,10.775 17,9.15 17,6.9 15.6,5.45 14.2,4 12,4 9.8,4 8.4,5.45 7,6.9 7,9.15 7,10.775 8.2625,12.625 9.525,14.475 12,16.475 Z M 12,19 Q 8.475,16.4 6.7375,13.95 5,11.5 5,9.15 5,6.025 6.95,4.0125 8.9,2 12,2 15.1,2 17.05,4.0125 19,6.025 19,9.15 19,11.5 17.2625,13.95 15.525,16.4 12,19 Z m 0,-8 q 0.825,0 1.4125,-0.5875 Q 14,9.825 14,9 14,8.175 13.4125,7.5875 12.825,7 12,7 11.175,7 10.5875,7.5875 10,8.175 10,9 10,9.825 10.5875,10.4125 11.175,11 12,11 Z M 5,22 v -2 h 14 v 2 z M 12,9 Z"/>
                        </svg>
                        {event.location}
                      </div>
                      {typeof event.accessibility === 'number' && event.accessibility !== 0 && event.accessibility === 1 ? (
                        <div className="mt-2 flex items-center text-sm text-indigo-600">
                          <svg className="flex-shrink-0 mr-1.5 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                          Dostępny lektor
                        </div>
                        ) : (
                        <div className="mt-2 flex items-center text-sm text-indigo-600">
                          <svg className="flex-shrink-0 mr-1.5 h-5 w-5" fill="currentColor" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeWidth="0.025" d="M 5,20 Q 4.175,20 3.5875,19.4125 3,18.825 3,18 V 6 Q 3,5.175 3.5875,4.5875 4.175,4 5,4 H 19 Q 19.825,4 20.4125,4.5875 21,5.175 21,6 v 12 q 0,0.825 -0.5875,1.4125 Q 19.825,20 19,20 Z M 5,18 H 19 V 6 H 5 Z m 2,-3 h 3 q 0.425,0 0.7125,-0.2875 Q 11,14.425 11,14 V 13 H 9.5 v 0.5 h -2 v -3 h 2 V 11 H 11 V 10 Q 11,9.575 10.7125,9.2875 10.425,9 10,9 H 7 Q 6.575,9 6.2875,9.2875 6,9.575 6,10 v 4 Q 6,14.425 6.2875,14.7125 6.575,15 7,15 Z m 7,0 h 3 q 0.425,0 0.7125,-0.2875 Q 18,14.425 18,14 v -1 h -1.5 v 0.5 h -2 v -3 h 2 V 11 H 18 V 10 Q 18,9.575 17.7125,9.2875 17.425,9 17,9 H 14 Q 13.575,9 13.2875,9.2875 13,9.575 13,10 v 4 q 0,0.425 0.2875,0.7125 Q 13.575,15 14,15 Z M 5,18 V 6 Z"/>
                          </svg>
                          Dostępne napisy
                        </div>
                      )}
                    </div>
                    <div className="ml-6">
                      <button
                        onClick={() => handleBuyTicket(event.id)}
                        disabled={buyingTicket === event.id}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {buyingTicket === event.id ? (
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        ) : null}
                        {buyingTicket === event.id ? 'Kupowanie...' : 'Kup bilet'}
                      </button>
                    </div>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
