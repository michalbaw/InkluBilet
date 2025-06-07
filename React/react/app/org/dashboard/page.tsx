'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Event {
  id: string;
  name: string;
  description: string;
  time: string;
  location: string;
}

export default function OrgDashboard() {
  const [events, setEvents] = useState<Event[]>([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const orgId = localStorage.getItem('orgId');
    if (!orgId) {
      router.push('/org/login');
      return;
    }

    const fetchEvents = async () => {
      try {
        const response = await fetch(`http://localhost:5154/api/Organisations/GetOrgEvents/${orgId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch events');
        }
        const data = await response.json();
        setEvents(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred while fetching events');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, [router]);

  const handleAddEvent = () => {
    router.push('/org/events/new');
  };

  const handleLogout = () => {
    localStorage.removeItem('orgId');
    router.push('/org/login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Your Events</h1>
          <div className="flex items-center space-x-4">
            <button
              onClick={handleLogout}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Logout
            </button>
            <button
              onClick={handleAddEvent}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Add New Event
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 text-red-500 text-center">
            {error}
          </div>
        )}

        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {events.length === 0 ? (
              <li className="px-6 py-4 text-center text-gray-500">
                No events found. Create your first event!
              </li>
            ) : (
              events.map((event) => (
                <li key={event.id} className="hover:bg-gray-50">
                  <Link href={`/org/events/${event.id}`}>
                    <div className="px-6 py-4 flex items-center cursor-pointer">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-lg font-medium text-indigo-600 truncate">
                            {event.name}
                          </p>
                          <div className="ml-2 flex-shrink-0 flex">
                            <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              {event.time}
                            </p>
                          </div>
                        </div>
                        <div className="mt-2">
                          <p className="text-sm text-gray-500 truncate">
                            {event.location}
                          </p>
                          <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                            {event.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </div>
  );
} 