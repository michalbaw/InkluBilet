'use client';

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
}

// Helper functions for date/time handling
const formatDateForInput = (dateString: string) => {
  const date = new Date(dateString);
  return date.toISOString().split('T')[0];
};

const formatTimeForInput = (dateString: string) => {
  const date = new Date(dateString);
  return date.toTimeString().slice(0, 5); // Get HH:MM format
};

const combineDateAndTime = (date: string, time: string) => {
  return new Date(`${date}T${time}`).toISOString();
};

export default function EventDetailPage() {
  const [event, setEvent] = useState<Event | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();
  const params = useParams();

  // Form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [timeOfDay, setTimeOfDay] = useState('');
  const [location, setLocation] = useState('');
  const [accessibility, setAccessibility] = useState<0 | 1 | 2>(0);

  useEffect(() => {
    const orgId = localStorage.getItem('orgId');
    if (!orgId) {
      router.push('/org/logowanie');
      return;
    }

    const fetchEvent = async () => {
      try {
        const response = await fetch(`http://localhost:5154/api/Organisations/GetOrgEvents/${orgId}`);
        if (!response.ok) {
          throw new Error('Nie udało się pobrać wydarzenia');
        }
        const events = await response.json();
        const currentEvent = events.find((e: Event) => e.id === params.id);

        if (!currentEvent) {
          throw new Error('Nie znaleziono wydarzenia');
        }

        setEvent(currentEvent);
        // Initialize form state
        setName(currentEvent.name);
        setDescription(currentEvent.description);
        setDate(formatDateForInput(currentEvent.time));
        setTimeOfDay(formatTimeForInput(currentEvent.time));
        setLocation(currentEvent.location);
        setAccessibility(currentEvent.accessibility);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Wystąpił błąd podczas pobierania wydarzenia');
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      fetchEvent();
    }
  }, [params.id, router]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSaving(true);

    try {
      const orgId = localStorage.getItem('orgId');
      const combinedTime = combineDateAndTime(date, timeOfDay);

      const response = await fetch(`http://localhost:5154/api/Organisations/ChangeEvent/${orgId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventId: params.id,
          newEvent: {
            name,
            description,
            time: combinedTime,
            location,
            accessibility,
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Nie udało się zaktualizować wydarzenia');
      }

      // Update local state
      setEvent({
        id: params.id as string,
        name,
        description,
        time: combinedTime,
        location,
        accessibility,
      });
      setIsEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Wystąpił błąd podczas aktualizacji wydarzenia');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Nie znaleziono wydarzenia</h2>
          <Link href="/org/panel-zarzadzania" className="mt-4 text-indigo-600 hover:text-indigo-500">
            Wróć do panelu
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <Link
            href="/org/panel-zarzadzania"
            className="text-indigo-600 hover:text-indigo-500 flex items-center"
          >
            <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L4.414 9H17a1 1 0 110 2H4.414l5.293 5.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Wróć do panelu
          </Link>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Edytuj wydarzenie
            </button>
          )}
        </div>

        {error && (
          <div className="mb-4 text-red-500 text-center">
            {error}
          </div>
        )}

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          {isEditing ? (
            <form onSubmit={handleSave} className="p-6 space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Nazwa wydarzenia
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900"
                  placeholder="Nazwa wydarzenia"
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Opis
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  rows={4}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900"
                  placeholder="Opis wydarzenia"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                    Data
                  </label>
                  <input
                    type="date"
                    id="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900"
                  />
                </div>

                <div>
                  <label htmlFor="time" className="block text-sm font-medium text-gray-700">
                    Godzina
                  </label>
                  <input
                    type="time"
                    id="time"
                    value={timeOfDay}
                    onChange={(e) => setTimeOfDay(e.target.value)}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                  Miejsce
                </label>
                <input
                  type="text"
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900"
                  placeholder="Miejsce wydarzenia"
                />
              </div>

              <div>
                <label htmlFor="accessibility" className="block text-sm font-medium text-gray-700">
                  Oferowane udogodnienia
                </label>
                <select
                  id="accessibility"
                  value={accessibility}
                  onChange={(e) => setAccessibility(Number(e.target.value) as 0 | 1 | 2)}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900"
                >
                  <option value="0">Brak</option>
                  <option value="1">Lektor</option>
                  <option value="2">Napisy</option>
                </select>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Anuluj
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  {isSaving ? 'Zapisywanie...' : 'Zapisz zmiany'}
                </button>
              </div>
            </form>
          ) : (
            <div className="px-6 py-5">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{event.name}</h3>
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Opis</h4>
                  <p className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">{event.description}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Data i godzina</h4>
                  <p className="mt-1 text-sm text-gray-900">{new Date(event.time).toLocaleString()}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Miejsce</h4>
                  <p className="mt-1 text-sm text-gray-900">{event.location}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Oferowane udogodnienia</h4>
                  <p className="mt-1 text-sm text-gray-900">
                    {event.accessibility === 0 ? 'Brak specjalnych udogodnień' :
                     event.accessibility === 1 ? 'Lektor' :
                     'Napisy'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
