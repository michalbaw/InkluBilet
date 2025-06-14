'use client';

import { getCityName } from '@/app/pomocnicze/tlumaczenieNazw';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
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
  type: 0 | 1; // 0 = Normal, 1 = Discounted
}

export default function TicketDetailsPage() {
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      router.push('/logowanie');
      return;
    }

    const fetchTicket = async () => {
      try {
        const response = await fetch(`http://localhost:5154/api/Users/GetTicket/${params.id}`);

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Nie znaleziono biletu');
          }
          throw new Error('Nie udało się pobrać szczegółów biletu');
        }

        const data = await response.json();
        setTicket(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Wystąpił błąd podczas pobierania szczegółów biletu');
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      fetchTicket();
    }
  }, [params.id, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error || !ticket) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Błąd</h3>
              <div className="mt-2 max-w-xl text-sm text-gray-500">
                <p>{error || 'Nie udało się załadować biletu'}</p>
              </div>
              <div className="mt-5">
                <Link
                  href="/bilety"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Wróć do biletów
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <Link
            href="/bilety"
            className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500"
          >
            <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Wróć do biletów
          </Link>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-2xl leading-6 font-bold text-gray-900">
              Szczegóły biletu
            </h3>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
            <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-gray-500">Nazwa wydarzenia</dt>
                <dd className="mt-1 text-lg text-gray-900">{ticket.event.name}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-gray-500">Opis</dt>
                <dd className="mt-1 text-gray-900 whitespace-pre-wrap">{ticket.event.description}</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Data</dt>
                <dd className="mt-1 text-gray-900">{new Date(ticket.event.time).toLocaleDateString()}</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Godzina</dt>
                <dd className="mt-1 text-gray-900">{new Date(ticket.event.time).toLocaleTimeString()}</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Miejsce</dt>
                <dd className="mt-1 text-gray-900">{ticket.event.location}</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Miasto</dt>
                <dd className="mt-1 text-gray-900">{getCityName(ticket.event.city)}</dd>
                </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Identyfikator biletu</dt>
                <dd className="mt-1 font-mono text-gray-900">{ticket.id}</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Rodzaj biletu</dt>
                <dd className="mt-1 text-gray-900">{ticket.type === 0 ? 'Normalny' : 'Ulgowy'}</dd>
              </div>
              {ticket.event.accessibility !== 0 && (
                <div className="sm:col-span-2">
                  <h4 className="text-sm font-medium text-gray-500">Udogodnienia</h4>
                  {ticket.event.accessibility === 1 ? (
                    <div className="mt-1 flex items-center text-sm text-indigo-600">
                      <svg className="flex-shrink-0 mr-1.5 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    Tłumacz migowego
                    </div>
                  ) : (
                    <div className="mt-2 flex items-center text-sm text-indigo-600">
                      <svg className="flex-shrink-0 mr-1.5 h-5 w-5" fill="currentColor" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeWidth="0.025" d="M 5,20 Q 4.175,20 3.5875,19.4125 3,18.825 3,18 V 6 Q 3,5.175 3.5875,4.5875 4.175,4 5,4 H 19 Q 19.825,4 20.4125,4.5875 21,5.175 21,6 v 12 q 0,0.825 -0.5875,1.4125 Q 19.825,20 19,20 Z M 5,18 H 19 V 6 H 5 Z m 2,-3 h 3 q 0.425,0 0.7125,-0.2875 Q 11,14.425 11,14 V 13 H 9.5 v 0.5 h -2 v -3 h 2 V 11 H 11 V 10 Q 11,9.575 10.7125,9.2875 10.425,9 10,9 H 7 Q 6.575,9 6.2875,9.2875 6,9.575 6,10 v 4 Q 6,14.425 6.2875,14.7125 6.575,15 7,15 Z m 7,0 h 3 q 0.425,0 0.7125,-0.2875 Q 18,14.425 18,14 v -1 h -1.5 v 0.5 h -2 v -3 h 2 V 11 H 18 V 10 Q 18,9.575 17.7125,9.2875 17.425,9 17,9 H 14 Q 13.575,9 13.2875,9.2875 13,9.575 13,10 v 4 q 0,0.425 0.2875,0.7125 Q 13.575,15 14,15 Z M 5,18 V 6 Z"/>
                      </svg>
                      Napisy
                    </div>
                  )}
                </div>
              )}
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
