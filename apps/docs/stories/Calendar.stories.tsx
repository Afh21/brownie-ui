import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Calendar, DatePicker, DateRangePicker, EventCalendar } from 'brownie-ui-calendar';

const meta: Meta<typeof Calendar> = {
  title: 'Components/Calendar',
  component: Calendar,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const [date, setDate] = useState(new Date());
    return (
      <div className="w-[400px]">
        <Calendar value={date} onChange={setDate} />
      </div>
    );
  },
};

export const DatePickerStory: Story = {
  render: () => {
    const [date, setDate] = useState<Date>();
    return (
      <div className="w-[320px]">
        <DatePicker 
          value={date} 
          onChange={setDate} 
          placeholder="Pick a date"
        />
      </div>
    );
  },
  name: 'DatePicker',
};

export const DateRangePickerStory: Story = {
  render: () => {
    const [range, setRange] = useState<{ start: Date; end: Date }>();
    return (
      <div className="w-[320px]">
        <DateRangePicker 
          value={range} 
          onChange={setRange}
          placeholder="Select date range"
        />
      </div>
    );
  },
  name: 'DateRangePicker',
};

export const EventCalendarStory: Story = {
  render: () => {
    const [date, setDate] = useState(new Date());
    
    const events = [
      {
        id: '1',
        title: 'Guitar lesson',
        start: new Date(2024, 3, 9, 14, 0),
        end: new Date(2024, 3, 9, 15, 0),
        category: 'music',
      },
      {
        id: '2',
        title: 'Kayaking',
        start: new Date(2024, 3, 6, 10, 0),
        end: new Date(2024, 3, 6, 12, 0),
        category: 'sport',
      },
      {
        id: '3',
        title: 'Zumba dance',
        start: new Date(2024, 3, 13, 18, 0),
        end: new Date(2024, 3, 13, 19, 0),
        category: 'dance',
      },
      {
        id: '4',
        title: 'Water aerobic',
        start: new Date(2024, 3, 17, 9, 0),
        end: new Date(2024, 3, 17, 10, 0),
        category: 'water',
      },
      {
        id: '5',
        title: 'Rythmic',
        start: new Date(2024, 3, 2, 16, 0),
        end: new Date(2024, 3, 2, 17, 0),
        category: 'music',
      },
      {
        id: '6',
        title: 'Zumba dance',
        start: new Date(2024, 3, 20, 18, 0),
        end: new Date(2024, 3, 20, 19, 0),
        category: 'dance',
      },
      {
        id: '7',
        title: 'Zumba dance',
        start: new Date(2024, 3, 22, 18, 0),
        end: new Date(2024, 3, 22, 19, 0),
        category: 'dance',
      },
      {
        id: '8',
        title: 'Water aerobic',
        start: new Date(2024, 3, 27, 9, 0),
        end: new Date(2024, 3, 27, 10, 0),
        category: 'water',
      },
    ];

    const categories = [
      { id: 'dance', name: 'Dance', color: '#8b5cf6' },
      { id: 'music', name: 'Music', color: '#3b82f6' },
      { id: 'sport', name: 'Sport', color: '#ec4899' },
      { id: 'water', name: 'Water', color: '#eab308' },
    ];

    return (
      <div className="w-[700px]">
        <EventCalendar
          value={date}
          onChange={setDate}
          events={events}
          categories={categories}
          onEventClick={(event) => console.log('Clicked:', event)}
          editable
          showLegend
        />
      </div>
    );
  },
  name: 'EventCalendar',
};

export const EventCalendarWithToday: Story = {
  render: () => {
    const [date, setDate] = useState(new Date());
    
    // Events relative to today
    const today = new Date();
    const events = [
      {
        id: '1',
        title: 'Meeting with team',
        start: today,
        end: today,
        category: 'work',
      },
      {
        id: '2',
        title: 'Lunch break',
        start: new Date(today.getTime() + 86400000),
        end: new Date(today.getTime() + 86400000),
        category: 'personal',
      },
    ];

    const categories = [
      { id: 'work', name: 'Work', color: '#3b82f6' },
      { id: 'personal', name: 'Personal', color: '#22c55e' },
    ];

    return (
      <div className="w-[700px]">
        <EventCalendar
          value={date}
          onChange={setDate}
          events={events}
          categories={categories}
          showLegend
        />
      </div>
    );
  },
  name: 'EventCalendar - Today',
};
