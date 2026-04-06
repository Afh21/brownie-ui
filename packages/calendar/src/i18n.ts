export type Locale = 'en' | 'es';

export interface Translations {
  // Navigation
  today: string;
  previous: string;
  next: string;
  
  // Views
  month: string;
  week: string;
  day: string;
  
  // Time
  allDay: string;
  time: string;
  
  // Events
  events: string;
  moreEvents: string;
  
  // Days of week (short)
  mon: string;
  tue: string;
  wed: string;
  thu: string;
  fri: string;
  sat: string;
  sun: string;
}

export const translations: Record<Locale, Translations> = {
  en: {
    today: 'Today',
    previous: 'Previous',
    next: 'Next',
    month: 'Month',
    week: 'Week',
    day: 'Day',
    allDay: 'All day',
    time: 'Time',
    events: 'events',
    moreEvents: 'more',
    mon: 'Mon',
    tue: 'Tue',
    wed: 'Wed',
    thu: 'Thu',
    fri: 'Fri',
    sat: 'Sat',
    sun: 'Sun',
  },
  es: {
    today: 'Hoy',
    previous: 'Anterior',
    next: 'Siguiente',
    month: 'Mes',
    week: 'Semana',
    day: 'Día',
    allDay: 'Todo el día',
    time: 'Hora',
    events: 'eventos',
    moreEvents: 'más',
    mon: 'Lun',
    tue: 'Mar',
    wed: 'Mié',
    thu: 'Jue',
    fri: 'Vie',
    sat: 'Sáb',
    sun: 'Dom',
  },
};

export function getTranslations(locale: Locale): Translations {
  return translations[locale] || translations.en;
}
