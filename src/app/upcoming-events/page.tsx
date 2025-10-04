"use client";

import { useState, useEffect } from "react";
import { NavigationLayout } from "@/components/navigation-layout";
import { Event } from "@/lib/database";
import { Calendar, Plus, X, Clock, User, ChevronLeft, ChevronRight } from "lucide-react";
import { useSession } from "@/contexts/session-context";
import { eventsApi } from "@/lib/api-client";

export default function UpcomingEventsPage() {
  const { user } = useSession();
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dateTime: ""
  });

  useEffect(() => {
    if (user) {
      loadEvents();
    }
  }, [user]);

  const loadEvents = async () => {
    try {
      const response = await eventsApi.getEvents();
      if (response.data && typeof response.data === 'object' && 'events' in response.data) {
        setEvents((response.data as { events: Event[] }).events);
      }
    } catch (error) {
      console.error('Failed to load events:', error);
    }
  };

  const handleAddEvent = async () => {
    if (!formData.title.trim() || !formData.dateTime) return;

    try {
      const response = await eventsApi.createEvent({
        title: formData.title.trim(),
        description: formData.description.trim() || undefined,
        dateTime: formData.dateTime,
        location: formData.location || undefined
      });

      if (response.data) {
        await loadEvents();
        setShowAddModal(false);
        setFormData({
          title: "",
          description: "",
          dateTime: ""
        });
      }
    } catch (error) {
      console.error('Failed to create event:', error);
    }
  };

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.getDate(),
      month: date.getMonth(),
      year: date.getFullYear(),
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  };

  const getEventsForDate = (day: number, month: number, year: number) => {
    return events.filter(event => {
      const eventDate = new Date(event.dateTime);
      return (
        eventDate.getDate() === day &&
        eventDate.getMonth() === month &&
        eventDate.getFullYear() === year
      );
    });
  };

  const navigateMonth = (direction: number) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + direction, 1));
  };

  const isToday = (day: number, month: number, year: number) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    );
  };

  const isPastDate = (day: number, month: number, year: number) => {
    const date = new Date(year, month, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDayOfMonth = getFirstDayOfMonth(currentDate);
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <NavigationLayout>
      <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">Upcoming Events</h1>
            <p className="text-gray-400 mt-1">Calendar of team events and important dates</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Plus className="h-5 w-5" />
            <span>Add Event</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800 rounded-lg p-6">
              {/* Calendar Header */}
              <div className="flex items-center justify-between mb-6">
                <button
                  onClick={() => navigateMonth(-1)}
                  className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <h2 className="text-xl font-bold text-white">
                  {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h2>
                <button
                  onClick={() => navigateMonth(1)}
                  className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>

              {/* Week Days */}
              <div className="grid grid-cols-7 gap-2 mb-4">
                {weekDays.map((day) => (
                  <div key={day} className="text-center text-sm font-medium text-gray-400 py-2">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Days */}
              <div className="grid grid-cols-7 gap-2">
                {/* Empty cells for days before month starts */}
                {Array.from({ length: firstDayOfMonth }).map((_, index) => (
                  <div key={`empty-${index}`} className="h-20"></div>
                ))}

                {/* Days of the month */}
                {Array.from({ length: daysInMonth }).map((_, index) => {
                  const day = index + 1;
                  const dayEvents = getEventsForDate(day, currentDate.getMonth(), currentDate.getFullYear());
                  const isCurrentDay = isToday(day, currentDate.getMonth(), currentDate.getFullYear());
                  const isPast = isPastDate(day, currentDate.getMonth(), currentDate.getFullYear());

                  return (
                    <div
                      key={day}
                      className={`h-20 border rounded-lg p-2 overflow-hidden cursor-pointer transition-colors ${
                        isCurrentDay
                          ? 'border-blue-500 bg-blue-900/20'
                          : isPast
                          ? 'border-gray-700 bg-gray-800/50'
                          : 'border-gray-700 bg-gray-800 hover:bg-gray-750'
                      }`}
                      onClick={() => dayEvents.length > 0 && setSelectedEvent(dayEvents[0])}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className={`text-sm font-medium ${
                          isCurrentDay ? 'text-blue-400' : isPast ? 'text-gray-500' : 'text-white'
                        }`}>
                          {day}
                        </span>
                        {dayEvents.length > 0 && (
                          <span className="bg-blue-600 text-white text-xs rounded-full px-1">
                            {dayEvents.length}
                          </span>
                        )}
                      </div>

                      {dayEvents.slice(0, 2).map((event, idx) => (
                        <div key={idx} className="text-xs truncate text-gray-300">
                          {event.title}
                        </div>
                      ))}

                      {dayEvents.length > 2 && (
                        <div className="text-xs text-gray-500">
                          +{dayEvents.length - 2} more
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Upcoming Events List */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Upcoming Events</h3>

              <div className="space-y-3">
                {events
                  .filter(event => new Date(event.dateTime) >= new Date())
                  .sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime())
                  .slice(0, 5)
                  .map((event) => {
                    const eventDate = formatDateTime(event.dateTime);
                    return (
                      <div
                        key={event.id}
                        onClick={() => setSelectedEvent(event)}
                        className="bg-gray-700 rounded-lg p-3 hover:bg-gray-600 transition-colors cursor-pointer"
                      >
                        <h4 className="font-medium text-white text-sm mb-1">{event.title}</h4>
                        <div className="text-xs text-gray-400 space-y-1">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-3 w-3" />
                            <span>{monthNames[eventDate.month]} {eventDate.date}, {eventDate.year}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="h-3 w-3" />
                            <span>{eventDate.time}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <User className="h-3 w-3" />
                            <span>{event.createdByName}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>

              {events.filter(event => new Date(event.dateTime) >= new Date()).length === 0 && (
                <p className="text-gray-500 text-center py-8">No upcoming events</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Event Detail Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-black/50" onClick={() => setSelectedEvent(null)}>
          <div className="bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold text-white">Event Details</h2>
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">{selectedEvent.title}</h3>
                </div>

                {selectedEvent.description && (
                  <div>
                    <p className="text-gray-300 leading-relaxed">{selectedEvent.description}</p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-700">
                  <div>
                    <p className="text-gray-500 text-sm mb-1">Date & Time</p>
                    <p className="text-white font-medium flex items-center space-x-2">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(selectedEvent.dateTime).toLocaleString()}</span>
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm mb-1">Created by</p>
                    <p className="text-white font-medium flex items-center space-x-2">
                      <User className="h-4 w-4" />
                      <span>{selectedEvent.createdByName}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Event Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-black/50">
          <div className="bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Add Event</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Event Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                  placeholder="Enter event title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Date & Time *
                </label>
                <input
                  type="datetime-local"
                  value={formData.dateTime}
                  onChange={(e) => setFormData({...formData, dateTime: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={4}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none resize-none"
                  placeholder="Enter event description"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddEvent}
                disabled={!formData.title.trim() || !formData.dateTime}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Event
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </NavigationLayout>
  );
}