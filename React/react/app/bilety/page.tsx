'use client';

import { getAccessibilityName, getCityName } from '../pomocnicze/tlumaczenieNazw';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Event {
  id: string;
  name: string;
  description: string;
  time: string;
  location: string;
  accessibility: 0 | 1 | 2; // 0 = None, 1 = PersonReading, 2 = Captions
  city: number
}

interface Ticket {
  id: string;
  event: Event;
  organiser: string;
}

export default function TicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      router.push('/logowanie');
      return;
    }

    const fetchTickets = async () => {
      try {
        const response = await fetch(`http://localhost:5154/api/Users/GetTicketList/${userId}`);

        if (!response.ok) {
          throw new Error('Nie udało się pobrać biletów');
        }

        const data = await response.json();
        setTickets(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Wystąpił błąd podczas pobierania biletów');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTickets();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('userId');
    router.push('/logowanie');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Moje bilety</h1>
          <div className="flex gap-4">
            <Link
              href="/wydarzenia"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-600 bg-indigo-100 hover:bg-indigo-200"
            >
              Przeglądaj wydarzenia
            </Link>
            <button
              onClick={handleLogout}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Wyloguj
            </button>
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

        {tickets.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">Nie masz jeszcze żadnych biletów.</p>
            <Link
              href="/wydarzenia"
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Przeglądaj dostępne wydarzenia
            </Link>
          </div>
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {tickets.map((ticket) => (
              <li key={ticket.id} className="px-6 py-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{ticket.event.name}</h3>
                    <div className="mt-2 flex items-center text-sm text-gray-500">
                      <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      {ticket.organiser}
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500">
                      <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {new Date(ticket.event.time).toLocaleDateString()}
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500">
                      <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {ticket.event.location}
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500">
                        <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        {getCityName(ticket.event.city)}
                      </div>
                    {ticket.event.accessibility !== 0 && (
                      <div className="mt-2 flex items-center text-sm text-indigo-600">
                        {ticket.event.accessibility === 1 ? (
                          <svg className="flex-shrink-0 mr-1.5 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                        ) : (
                          <svg className="flex-shrink-0 mr-1.5 h-5 w-5" fill="currentColor" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeWidth="0.025" d="M 5,20 Q 4.175,20 3.5875,19.4125 3,18.825 3,18 V 6 Q 3,5.175 3.5875,4.5875 4.175,4 5,4 H 19 Q 19.825,4 20.4125,4.5875 21,5.175 21,6 v 12 q 0,0.825 -0.5875,1.4125 Q 19.825,20 19,20 Z M 5,18 H 19 V 6 H 5 Z m 2,-3 h 3 q 0.425,0 0.7125,-0.2875 Q 11,14.425 11,14 V 13 H 9.5 v 0.5 h -2 v -3 h 2 V 11 H 11 V 10 Q 11,9.575 10.7125,9.2875 10.425,9 10,9 H 7 Q 6.575,9 6.2875,9.2875 6,9.575 6,10 v 4 Q 6,14.425 6.2875,14.7125 6.575,15 7,15 Z m 7,0 h 3 q 0.425,0 0.7125,-0.2875 Q 18,14.425 18,14 v -1 h -1.5 v 0.5 h -2 v -3 h 2 V 11 H 18 V 10 Q 18,9.575 17.7125,9.2875 17.425,9 17,9 H 14 Q 13.575,9 13.2875,9.2875 13,9.575 13,10 v 4 q 0,0.425 0.2875,0.7125 Q 13.575,15 14,15 Z M 5,18 V 6 Z"/>
                          </svg>
                        )}
                        {getAccessibilityName(ticket.event.accessibility)}
                      </div>
                    )}
                  </div>
                  <div className="ml-6">
                    <Link
                      href={`/bilety/${ticket.id}`}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Zobacz szczegóły
                    </Link>
                  </div>
                </div>
              </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
