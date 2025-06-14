'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const combineDateAndTime = (date: string, time: string) => {
  return new Date(`${date}T${time}`).toISOString();
};

export default function NewEventPage() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [timeOfDay, setTimeOfDay] = useState('');
  const [location, setLocation] = useState('');
  const [accessibility, setAccessibility] = useState<0 | 1 | 2>(0);
  const [city, setCity] = useState<number>(0);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const orgId = localStorage.getItem('orgId');
      if (!orgId) {
        router.push('/org/logowanie');
        return;
      }

      const combinedTime = combineDateAndTime(date, timeOfDay);

      const response = await fetch(`http://localhost:5154/api/Organisations/AddEvent/${orgId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          description,
          time: combinedTime,
          location,
          accessibility,
          city,
        }),
      });

      if (!response.ok) {
        throw new Error('Nie udało się stworzyć wydarzenia');
      }

      // Redirect back to dashboard on success
      router.push('/org/panel-zarzadzania');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Wystąpił błąd podczas tworzenia wydarzenia');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center mb-8">
          <Link
            href="/org/panel-zarzadzania"
            className="text-indigo-600 hover:text-indigo-500 flex items-center"
          >
            <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L4.414 9H17a1 1 0 110 2H4.414l5.293 5.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Wróć do panelu
          </Link>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Tworzenie nowego wydarzenia</h3>
            <p className="mt-1 text-sm text-gray-500">
              Uzupełnij szczegóły nowego wydarzenia.
            </p>
          </div>

          {error && (
            <div className="px-4 py-3 bg-red-50">
              <div className="text-sm text-red-700">
                {error}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="border-t border-gray-200">
            <div className="px-4 py-5 space-y-6 sm:px-6">
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
                  placeholder="Szczegółowy opis wydarzenia"
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
                <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                  Miasto
                </label>
                <select
                  id="city"
                  value={city}
                  onChange={(e) => setCity(Number(e.target.value) as 0 | 1 | 2 | 3)}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900"
                >
                  <option value="0">Niesprecyzowane</option>
                  <option value="1">Kraków</option>
                  <option value="2">Warszawa</option>
                  <option value="3">Trójmiasto</option>
                </select>
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
            </div>

            <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {isLoading ? 'Tworzenie...' : 'Stwórz wydarzenie'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
