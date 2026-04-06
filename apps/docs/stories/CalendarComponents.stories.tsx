import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { EventCalendar, type CalendarEvent, type EventCategory } from 'brownie-ui-calendar';
import { addDays, setHours, startOfDay, format } from 'date-fns';
import { cn } from 'brownie-ui-core';

const meta: Meta<typeof EventCalendar> = {
  title: 'Components/EventCalendar',
  component: EventCalendar,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    events: { control: 'object' },
    categories: { control: 'object' },
    editable: { control: 'boolean' },
    showLegend: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof EventCalendar>;

// Categories
const defaultCategories: EventCategory[] = [
  { id: 'dance', name: 'Dance', color: '#8b5cf6' },
  { id: 'music', name: 'Music', color: '#f97316' },
  { id: 'sport', name: 'Sport', color: '#ec4899' },
  { id: 'water', name: 'Water', color: '#eab308' },
];

// Sample events
const generateSampleEvents = (): CalendarEvent[] => {
  const today = startOfDay(new Date());
  return [
    { id: '1', title: 'Guitar lesson', start: setHours(today, 10), end: setHours(today, 11), category: 'music' },
    { id: '2', title: 'Piano practice', start: setHours(addDays(today, 1), 15), end: setHours(addDays(today, 1), 16), category: 'music' },
    { id: '3', title: 'Zumba class', start: setHours(addDays(today, 2), 18), end: setHours(addDays(today, 2), 19), category: 'dance' },
    { id: '4', title: 'Hip Hop', start: setHours(addDays(today, 3), 17), end: setHours(addDays(today, 3), 18), category: 'dance' },
    { id: '5', title: 'Running', start: setHours(addDays(today, 4), 7), end: setHours(addDays(today, 4), 8), category: 'sport' },
    { id: '6', title: 'Yoga', start: setHours(addDays(today, 5), 9), end: setHours(addDays(today, 5), 10), category: 'sport' },
    { id: '7', title: 'Swimming', start: setHours(addDays(today, 6), 14), end: setHours(addDays(today, 6), 15), category: 'water' },
    { id: '8', title: 'Water aerobic', start: setHours(addDays(today, 1), 11), end: setHours(addDays(today, 1), 12), category: 'water' },
    { id: '9', title: 'Weekend workshop', start: addDays(today, -2), end: addDays(today, -2), category: 'dance', allDay: true },
    { id: '10', title: 'Competition', start: addDays(today, 5), end: addDays(today, 5), category: 'sport', allDay: true },
  ];
};

// Wrapper component demonstrating the new simple API
const CalendarDemo = ({ 
  initialView = 'month', 
  hourFormat = '24h',
  locale = 'es'
}: { 
  initialView?: 'month' | 'week' | 'day'; 
  hourFormat?: '12h' | '24h';
  locale?: 'en' | 'es';
}) => {
  const [events, setEvents] = useState<CalendarEvent[]>(generateSampleEvents());
  const [view, setView] = useState<'month' | 'week' | 'day'>(initialView);
  
  // Handle event drop (drag & drop)
  const handleEventDrop = (event: CalendarEvent, newDate: Date) => {
    const duration = event.end.getTime() - event.start.getTime();
    setEvents((prev) =>
      prev.map((e) =>
        e.id === event.id
          ? { ...e, start: newDate, end: new Date(newDate.getTime() + duration) }
          : e
      )
    );
  };

  // Handle event resize (drag bottom border)
  const handleEventResize = (event: CalendarEvent, newEndDate: Date) => {
    setEvents((prev) =>
      prev.map((e) =>
        e.id === event.id ? { ...e, end: newEndDate } : e
      )
    );
  };

  // Handle slot click (create event)
  const handleSlotClick = (date: Date, hour?: number) => {
    const title = prompt('Event title:');
    if (!title) return;
    
    const start = hour !== undefined ? setHours(date, hour) : date;
    const end = hour !== undefined ? setHours(date, hour + 1) : date;
    
    const newEvent: CalendarEvent = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      start,
      end,
      category: defaultCategories[0].id,
      allDay: hour === undefined,
    };
    
    setEvents((prev) => [...prev, newEvent]);
  };

  // Handle event click (edit/delete)
  const handleEventClick = (event: CalendarEvent) => {
    const action = confirm(`Delete "${event.title}"?`) ? 'delete' : null;
    if (action === 'delete') {
      setEvents((prev) => prev.filter((e) => e.id !== event.id));
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <EventCalendar
        events={events}
        categories={defaultCategories}
        view={view}
        onViewChange={setView}
        editable={true}
        showLegend={true}
        hourFormat={hourFormat}
        locale={locale}
        onEventDrop={handleEventDrop}
        onEventResize={handleEventResize}
        onSlotClick={handleSlotClick}
        onEventClick={handleEventClick}
      />
    </div>
  );
};

// Story 1: Editable (Drag & Drop) - Month View
export const Editable: Story = {
  render: () => <CalendarDemo initialView="month" />,
  parameters: {
    docs: {
      description: {
        story: 'Interactive calendar with drag & drop. Click on a slot to create events, click on an event to delete it.',
      },
    },
  },
};

// Story 2: Week View
export const WeekView: Story = {
  render: () => <CalendarDemo initialView="week" />,
  parameters: {
    docs: {
      description: {
        story: 'Week view with hourly slots and drag & drop support.',
      },
    },
  },
};

// Story 3: Day View
export const DayView: Story = {
  render: () => <CalendarDemo initialView="day" />,
  parameters: {
    docs: {
      description: {
        story: 'Single day view with detailed hourly breakdown.',
      },
    },
  },
};

// Story 4: 12-Hour Format (AM/PM)
export const HourFormat12h: Story = {
  render: () => <CalendarDemo initialView="week" hourFormat="12h" />,
  parameters: {
    docs: {
      description: {
        story: 'Week view using 12-hour format with AM/PM (02:00 PM instead of 14:00).',
      },
    },
  },
};

// Story 5: Read Only (No interactions)
export const ReadOnly: Story = {
  render: () => (
    <div className="max-w-6xl mx-auto">
      <EventCalendar
        events={generateSampleEvents()}
        categories={defaultCategories}
        editable={false}
        showLegend={true}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Read-only calendar without any interactions. Just displays events.',
      },
    },
  },
};

// Story 6: English Locale
export const EnglishLocale: Story = {
  render: () => <CalendarDemo initialView="month" locale="en" />,
  parameters: {
    docs: {
      description: {
        story: 'Calendar with English locale (default is Spanish).',
      },
    },
  },
};

// Story 7: Custom Event Component (Headless)
export const CustomEventComponent: Story = {
  render: () => (
    <div className="max-w-6xl mx-auto">
      <EventCalendar
        events={generateSampleEvents()}
        categories={defaultCategories}
        editable={true}
        locale="es"
        renderEvent={(event, props) => (
          <div
            className={cn(
              'px-3 py-2 rounded-lg text-sm font-medium shadow-sm border-l-4',
              props.isPastDay && 'opacity-60'
            )}
            style={{
              backgroundColor: props.isPastDay ? '#e5e7eb' : '#fef3c7',
              borderLeftColor: props.isPastDay ? '#9ca3af' : '#f59e0b',
              color: props.isPastDay ? '#6b7280' : '#92400e',
              cursor: props.draggable ? 'grab' : 'not-allowed',
            }}
            draggable={props.draggable}
            onDragStart={props.onDragStart}
            onClick={props.onClick}
          >
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold">
                {format(event.start, 'HH:mm')}
              </span>
              <span className="truncate">{event.title}</span>
            </div>
            {event.description && (
              <div className="text-xs mt-1 opacity-75 truncate">
                {event.description}
              </div>
            )}
          </div>
        )}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Calendar with custom event component using renderEvent prop. Fully headless - you control the styling.',
      },
    },
  },
};

// Story 8: Custom Brand Colors
export const CustomBrandColors: Story = {
  render: () => {
    const [events, setEvents] = useState<CalendarEvent[]>(generateSampleEvents());
    
    // Custom brand color palette
    const brandCategories: EventCategory[] = [
      { id: 'primary', name: 'Primary', color: '#0ea5e9' },    // Sky blue
      { id: 'secondary', name: 'Secondary', color: '#8b5cf6' }, // Violet
      { id: 'success', name: 'Success', color: '#22c55e' },    // Green
      { id: 'warning', name: 'Warning', color: '#f97316' },    // Orange
    ];
    
    // Map sample events to new categories
    const mappedEvents = events.map((e, i) => ({
      ...e,
      category: brandCategories[i % brandCategories.length].id,
    }));
    
    const handleEventDrop = (event: CalendarEvent, newDate: Date) => {
      const duration = event.end.getTime() - event.start.getTime();
      setEvents((prev) =>
        prev.map((e) =>
          e.id === event.id
            ? { ...e, start: newDate, end: new Date(newDate.getTime() + duration) }
            : e
        )
      );
    };
    
    return (
      <div className="max-w-6xl mx-auto">
        <div className="mb-4 p-4 bg-slate-50 rounded-lg text-sm text-slate-600">
          <strong>💡 Tip:</strong> Pass your own <code>categories</code> array with custom colors 
          to match your brand. Each event references a category by its <code>id</code>.
        </div>
        <EventCalendar
          events={mappedEvents}
          categories={brandCategories}
          editable={true}
          showLegend={true}
          onEventDrop={handleEventDrop}
        />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Calendar with custom brand colors. Define your own color palette via the categories prop.',
      },
    },
  },
};

// Story 9: Drag & Drop with Success Toast
export const DragDropWithToast: Story = {
  render: () => {
    const [events, setEvents] = useState<CalendarEvent[]>(generateSampleEvents());
    
    const handleEventDrop = (event: CalendarEvent, newDate: Date) => {
      const duration = event.end.getTime() - event.start.getTime();
      setEvents((prev) =>
        prev.map((e) =>
          e.id === event.id
            ? { ...e, start: newDate, end: new Date(newDate.getTime() + duration) }
            : e
        )
      );
      // A success toast will automatically appear confirming the move
    };
    
    return (
      <div className="max-w-6xl mx-auto">
        <div className="mb-4 p-4 bg-green-50 rounded-lg text-sm text-green-700">
          <strong>🎯 Try it:</strong> Drag an event to a new time slot. A success toast will appear 
          confirming the move with the new date and time.
        </div>
        <EventCalendar
          events={events}
          categories={defaultCategories}
          view="week"
          editable={true}
          onEventDrop={handleEventDrop}
        />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Drag & drop with automatic success toast notification. The toast shows the event title and new position.',
      },
    },
  },
};

// Story 10: Size Variants (Small, Medium, Big)
export const SizeVariants: Story = {
  render: () => (
    <div className="space-y-8">
      {/* Small Size */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Small (dots only)</h3>
        <div className="max-w-md">
          <EventCalendar
            events={generateSampleEvents()}
            categories={defaultCategories}
            size="small"
            showLegend={false}
          />
        </div>
      </div>
      
      {/* Medium Size (default) */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Medium (default)</h3>
        <div className="max-w-3xl">
          <EventCalendar
            events={generateSampleEvents()}
            categories={defaultCategories}
            size="medium"
            showLegend={false}
          />
        </div>
      </div>
      
      {/* Big Size */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Big (full events)</h3>
        <div className="max-w-4xl">
          <EventCalendar
            events={generateSampleEvents()}
            categories={defaultCategories}
            size="big"
            showLegend={true}
          />
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Calendar comes in three sizes: small (dots only), medium, and big (both show full events).',
      },
    },
  },
};

// Story 11: Today Highlighted in Week View
export const TodayHighlightedWeek: Story = {
  render: () => (
    <div className="max-w-6xl mx-auto">
      <div className="mb-4 p-4 bg-blue-50 rounded-lg text-sm text-blue-700">
        <strong>📅 Note:</strong> The current day is highlighted with a black border in Week and Day views.
      </div>
      <EventCalendar
        events={generateSampleEvents()}
        categories={defaultCategories}
        view="week"
        editable={true}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Week view with the current day highlighted by a black border around the column.',
      },
    },
  },
};

// Story 12: Day View with Compact Events
export const DayViewCompactEvents: Story = {
  render: () => (
    <div className="max-w-2xl mx-auto">
      <div className="mb-4 p-4 bg-purple-50 rounded-lg text-sm text-purple-700">
        <strong>🎯 Note:</strong> In Day view, events only take up the width of their content, not the full column.
      </div>
      <EventCalendar
        events={generateSampleEvents()}
        categories={defaultCategories}
        view="day"
        editable={true}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Day view where events have a compact width matching their content rather than full width.',
      },
    },
  },
};

// Story 13: Custom Hour Range (Business Hours)
export const CustomHourRange: Story = {
  render: () => {
    const [events, setEvents] = useState<CalendarEvent[]>(generateSampleEvents());
    
    const handleEventDrop = (event: CalendarEvent, newDate: Date) => {
      const duration = event.end.getTime() - event.start.getTime();
      setEvents((prev) =>
        prev.map((e) =>
          e.id === event.id
            ? { ...e, start: newDate, end: new Date(newDate.getTime() + duration) }
            : e
        )
      );
    };
    
    return (
      <div className="space-y-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-4 p-4 bg-blue-50 rounded-lg text-sm text-blue-700">
            <strong>⏰ Business Hours:</strong> Showing hours from 6:00 AM to 6:00 PM using <code>startHour={'{6}'} endHour={'{18}'}</code>
          </div>
          <EventCalendar
            events={events}
            categories={defaultCategories}
            view="week"
            editable={true}
            startHour={6}
            endHour={18}
            onEventDrop={handleEventDrop}
          />
        </div>
        
        <div className="max-w-2xl mx-auto">
          <div className="mb-4 p-4 bg-green-50 rounded-lg text-sm text-green-700">
            <strong>🌙 Evening Events:</strong> Showing hours from 6:00 PM to 12:00 AM using <code>startHour={'{18}'} endHour={'{24}'}</code>
          </div>
          <EventCalendar
            events={events}
            categories={defaultCategories}
            view="day"
            editable={true}
            startHour={18}
            endHour={24}
            onEventDrop={handleEventDrop}
          />
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Customize the hour range displayed in Week and Day views using startHour and endHour props.',
      },
    },
  },
};

// Story 14: Monochrome Theme (Black - Gray - LightGray)
export const MonochromeTheme: Story = {
  render: () => {
    const [events, setEvents] = useState<CalendarEvent[]>(generateSampleEvents());
    
    // Monochrome color palette
    const monochromeCategories: EventCategory[] = [
      { id: 'default', name: 'Event', color: '#000000' }, // Black events
    ];
    
    // Map all events to use the black category
    const monochromeEvents = events.map((e) => ({
      ...e,
      category: 'default',
    }));
    
    const handleEventDrop = (event: CalendarEvent, newDate: Date) => {
      const duration = event.end.getTime() - event.start.getTime();
      setEvents((prev) =>
        prev.map((e) =>
          e.id === event.id
            ? { ...e, start: newDate, end: new Date(newDate.getTime() + duration) }
            : e
        )
      );
    };
    
    const handleEventResize = (event: CalendarEvent, newEndDate: Date) => {
      setEvents((prev) =>
        prev.map((e) =>
          e.id === event.id ? { ...e, end: newEndDate } : e
        )
      );
    };
    
    return (
      <div className="space-y-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-4 p-4 bg-gray-100 rounded-lg text-sm text-gray-700">
            <strong>🎨 Monochrome Theme:</strong> Events in black, header in white, past days in light gray.
          </div>
          <EventCalendar
            events={monochromeEvents}
            categories={monochromeCategories}
            view="week"
            editable={true}
            onEventDrop={handleEventDrop}
            onEventResize={handleEventResize}
          />
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="mb-4 p-4 bg-gray-100 rounded-lg text-sm text-gray-700">
            <strong>📅 Month View:</strong> Same monochrome theme applied to month view.
          </div>
          <EventCalendar
            events={monochromeEvents}
            categories={monochromeCategories}
            view="month"
            editable={true}
            onEventDrop={handleEventDrop}
          />
        </div>
        
        <div className="max-w-2xl mx-auto">
          <div className="mb-4 p-4 bg-gray-100 rounded-lg text-sm text-gray-700">
            <strong>⏰ Day View:</strong> Monochrome theme in single day view.
          </div>
          <EventCalendar
            events={monochromeEvents}
            categories={monochromeCategories}
            view="day"
            editable={true}
            onEventDrop={handleEventDrop}
          />
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Monochrome theme using black for events, white for headers, and light gray for past days.',
      },
    },
  },
};
