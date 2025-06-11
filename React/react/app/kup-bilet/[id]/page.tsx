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

export default function EventDetailsPage() {
  const [event, setEvent] = useState<Event | null>(null);
  const [error, setError] = useState('');
  const [userError, setUserError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [normalTicketCount, setNormalTicketCount] = useState<number>(1);
  const [discountTicketCount, setDiscountTicketCount] = useState<number>(0);
  const [buyingTicket, setBuyingTicket] = useState(false);
  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      router.push('/logowanie');
      return;
    }

    const fetchEvent = async () => {
      try {
        const response = await fetch(`http://localhost:5154/api/Organisations/GetEvent/${params.id}`);

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Nie znaleziono wydarzenia');
          }
          throw new Error('Nie udało się pobrać szczegółów wydarzenia');
        }

        const data = await response.json();
        setEvent(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Wystąpił błąd podczas pobierania szczegółów wydarzenia');
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      fetchEvent();
    }
  }, [params.id, router]);

  const handleBuyTicket = async (normalTickets: number, discountTickets: number) => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      router.push('/logowanie');
      return;
    }
    if (normalTickets + discountTickets == 0) {
      setUserError("Proszę wybrać co najmniej jeden bilet");
      return;
    }

    setBuyingTicket(true);
    try {
      const response = await fetch(`http://localhost:5154/api/Users/BuyTicket/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({"EventId": params.id, "NormalTicketCount": normalTickets, "DiscountTicketCount": discountTickets}),
      });

      if (!response.ok) {
        throw new Error('Nie udało się kupić biletu');
      }

      router.push('/bilety');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Wystąpił błąd podczas kupowania bilteu');
    } finally {
      setBuyingTicket(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Błąd</h3>
              <div className="mt-2 max-w-xl text-sm text-gray-500">
                <p>{error || 'Nie udało się załadować wydarzenia'}</p>
              </div>
              <div className="mt-5">
                <Link
                  href="/wydarzenia"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Wróć do wydarzeń
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
            href="/wydarzenia"
            className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500"
          >
            <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Wróć do wydarzeń
          </Link>
        </div>

        <div className="flex justify-between px-4 py-5 sm:px-6">
          <h3 className="text-2xl leading-6 font-bold text-gray-900">
            Wybierz bilet
          </h3>

          <div className="ml-6">
            <button
              onClick={() => handleBuyTicket(normalTicketCount, discountTicketCount)}
              disabled={buyingTicket}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {buyingTicket ? 'Za chwilę nastąpi przekierowanie do płatności...' : 'Potwierdź i zapłać'}
            </button>
          </div>
        </div>

        {userError && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{userError}</p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white shadow overflow-hidden sm:rounded-lg px-4 py-5 sm:px-6 mb-5 flex justify-between items-center">
          <h4 className="text-2xl leading-6 font-bold text-gray-900">
            Normalny
          </h4>

          <input 
            type="number" 
            value={normalTicketCount} 
            onChange={e => {
              setNormalTicketCount(Number(e.target.value)); 
              setUserError('');
            }} 
            min="0" 
            max="100" 
            className="border rounded-md px-4 py-2 border-indigo-500 text-gray-900 font-medium"
          />
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg px-4 py-5 sm:px-6 mb-5 flex justify-between items-center">
          <h4 className="text-2xl leading-6 font-bold text-gray-900">
            Ulgowy
          </h4>

          <input 
            type="number" 
            value={discountTicketCount} 
            onChange={e => {
              setDiscountTicketCount(Number(e.target.value)); 
              setUserError('');
            }} 
            min="0" 
            max="100" 
            className="border rounded-md px-4 py-2 border-indigo-500 text-gray-900 font-medium"
          />
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-2xl leading-6 font-bold text-gray-900">
              Szczegóły wydarzenia
            </h3>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
            <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-gray-500">Nazwa wydarzenia</dt>
                <dd className="mt-1 text-lg text-gray-900">{event.name}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-gray-500">Opis</dt>
                <dd className="mt-1 text-gray-900 whitespace-pre-wrap">{event.description}</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Data</dt>
                <dd className="mt-1 text-gray-900">{new Date(event.time).toLocaleDateString()}</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Godzina</dt>
                <dd className="mt-1 text-gray-900">{new Date(event.time).toLocaleTimeString()}</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Miejsce</dt>
                <dd className="mt-1 text-gray-900">{event.location}</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Miasto</dt>
                <dd className="mt-1 text-gray-900">{getCityName(event.city)}</dd>
              </div>
              {event.accessibility !== 0 && (
                <div className="mt-2">
                  <h4 className="text-sm font-medium text-gray-500">Udogodnienia</h4>
                  {event.accessibility === 1 ? (
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
