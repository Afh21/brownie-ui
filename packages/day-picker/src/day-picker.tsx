import * as React from 'react';
import { cn } from 'brownie-ui-core';

export interface DayOption {
  day: string;
  date: number;
  fullDate?: Date;
  /** Whether this day is disabled (non-selectable) */
  disabled?: boolean;
}

/** Rich information about a selected day */
export interface DayInfo {
  /** The day object from the days array */
  day: DayOption;
  /** Index in the visible (filtered) days array */
  index: number;
  /** Original index in the unfiltered days array */
  originalIndex: number;
  /** Day of week name in current locale (short) */
  dayName: string;
  /** Day of week name in current locale (long) */
  dayNameLong: string;
  /** Day of month (1-31) */
  date: number;
  /** Full JavaScript Date object */
  fullDate: Date;
  /** ISO date string (YYYY-MM-DD) */
  isoDate: string;
  /** Month name in current locale (long) */
  monthName: string;
  /** Month name in current locale (short) */
  monthNameShort: string;
  /** Year (e.g., 2026) */
  year: number;
  /** Whether this day is currently selected */
  isSelected: boolean;
  /** Whether this day is disabled */
  isDisabled: boolean;
  /** Week number (1-52) */
  weekNumber: number;
  /** Timestamp */
  timestamp: number;
}

export type Locale = 'en' | 'es';

interface Translations {
  months: {
    long: string[];
    short: string[];
  };
  days: {
    long: string[];
    short: string[];
  };
}

const translations: Record<Locale, Translations> = {
  en: {
    months: {
      long: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
      short: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    },
    days: {
      long: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      short: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    },
  },
  es: {
    months: {
      long: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
      short: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
    },
    days: {
      long: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
      short: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
    },
  },
};

/** Get week number from date */
const getWeekNumber = (date: Date): number => {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
};

export interface DayPickerProps {
  days: DayOption[];
  selectedIndex?: number;
  defaultSelectedIndex?: number;
  /** Callback when a day is selected. Returns rich DayInfo object */
  onChange?: (dayInfo: DayInfo) => void;
  onNavigate?: (direction: 'prev' | 'next') => void;
  /** Number of days to render. If not provided, renders all days */
  visibleDays?: number;
  /** Array of day names to exclude (e.g., ['Sun', 'Sat'] to hide weekends) */
  excludedDays?: string[];
  /** Array of specific dates to disable (format: 'YYYY-MM-DD') */
  disabledDates?: string[];
  /** Controls if the previous arrow is enabled. If not provided, defaults to true when onNavigate is provided */
  canNavigatePrev?: boolean;
  /** Controls if the next arrow is enabled. If not provided, defaults to true when onNavigate is provided */
  canNavigateNext?: boolean;
  /** Whether to show the month name. Defaults to true */
  showMonth?: boolean;
  /** Format for month display. Defaults to 'long' (e.g., 'January'). Use 'short' for 'Jan' */
  monthFormat?: 'long' | 'short';
  /** Locale for translations: 'en' (default) or 'es' */
  locale?: Locale;
  /** Custom class names for different parts of the component */
  classNames?: {
    /** Container class */
    container?: string;
    /** Month header container class */
    monthHeader?: string;
    /** Month text class */
    monthText?: string;
    /** Navigation arrow button class */
    navButton?: string;
    /** Days container class */
    daysContainer?: string;
    /** Individual day button class (applied always) */
    day?: string;
    /** Day button class when selected */
    daySelected?: string;
    /** Day button class when disabled */
    dayDisabled?: string;
  };
  className?: string;
}

// Chevron Left Icon
const ChevronLeft = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="m15 18-6-6 6-6" />
  </svg>
);

// Chevron Right Icon
const ChevronRight = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="m9 18 6-6-6-6" />
  </svg>
);

export const DayPicker: React.FC<DayPickerProps> = ({
  days,
  selectedIndex,
  defaultSelectedIndex = 0,
  onChange,
  onNavigate,
  visibleDays,
  excludedDays,
  disabledDates,
  canNavigatePrev,
  canNavigateNext,
  showMonth = true,
  monthFormat = 'long',
  locale = 'en',
  classNames = {},
  className,
}) => {
  const [internalIndex, setInternalIndex] = React.useState(defaultSelectedIndex);
  const t = translations[locale];
  
  // Calculate original indices before filtering
  const daysWithOriginalIndex = React.useMemo(() => {
    return days.map((day, originalIndex) => ({ ...day, originalIndex }));
  }, [days]);
  
  // Filter and limit days based on props
  const visibleDaysList = React.useMemo(() => {
    let filtered = daysWithOriginalIndex;
    
    // Exclude specific days if provided
    if (excludedDays && excludedDays.length > 0) {
      filtered = filtered.filter(day => !excludedDays.includes(day.day));
    }
    
    // Limit number of days if visibleDays is provided
    if (visibleDays && visibleDays > 0) {
      filtered = filtered.slice(0, visibleDays);
    }
    
    return filtered;
  }, [daysWithOriginalIndex, visibleDays, excludedDays]);
  
  // Helper to check if a date is disabled
  const isDateDisabled = React.useCallback((day: DayOption): boolean => {
    if (day.disabled) return true;
    if (!disabledDates || !day.fullDate) return false;
    
    const dateStr = day.fullDate.toISOString().split('T')[0];
    return disabledDates.includes(dateStr);
  }, [disabledDates]);
  
  // Build rich DayInfo object
  const buildDayInfo = React.useCallback((
    dayItem: typeof visibleDaysList[0], 
    index: number,
    isSelected: boolean
  ): DayInfo => {
    const fullDate = dayItem.fullDate || new Date();
    const dayIndex = fullDate.getDay();
    const monthIndex = fullDate.getMonth();
    
    return {
      day: dayItem,
      index,
      originalIndex: dayItem.originalIndex,
      dayName: t.days.short[dayIndex],
      dayNameLong: t.days.long[dayIndex],
      date: dayItem.date,
      fullDate,
      isoDate: fullDate.toISOString().split('T')[0],
      monthName: t.months.long[monthIndex],
      monthNameShort: t.months.short[monthIndex],
      year: fullDate.getFullYear(),
      isSelected,
      isDisabled: isDateDisabled(dayItem),
      weekNumber: getWeekNumber(fullDate),
      timestamp: fullDate.getTime(),
    };
  }, [t, isDateDisabled]);
  
  // Translate days to current locale
  const translatedDays = React.useMemo(() => {
    return visibleDaysList.map(day => {
      if (!day.fullDate) return day;
      
      const dayIndex = day.fullDate.getDay();
      return {
        ...day,
        day: t.days.short[dayIndex],
      };
    });
  }, [visibleDaysList, t]);
  
  // Get month name from the first visible day
  const monthName = React.useMemo(() => {
    if (!showMonth || visibleDaysList.length === 0) return null;
    
    const firstDay = visibleDaysList[0].fullDate;
    if (!firstDay) return null;
    
    const monthIndex = firstDay.getMonth();
    const year = firstDay.getFullYear();
    const monthStr = t.months[monthFormat][monthIndex];
    
    return `${monthStr} ${year}`;
  }, [visibleDaysList, showMonth, monthFormat, t]);
  
  const activeIndex = selectedIndex !== undefined ? selectedIndex : internalIndex;
  
  const handleSelect = (index: number) => {
    const dayItem = visibleDaysList[index];
    if (isDateDisabled(dayItem)) return;
    
    if (selectedIndex === undefined) {
      setInternalIndex(index);
    }
    
    // Build and return rich DayInfo
    const dayInfo = buildDayInfo(dayItem, index, true);
    onChange?.(dayInfo);
  };

  // Determine if navigation arrows are enabled
  const isPrevEnabled = canNavigatePrev !== undefined ? canNavigatePrev : !!onNavigate;
  const isNextEnabled = canNavigateNext !== undefined ? canNavigateNext : !!onNavigate;

  return (
    <div className={cn('w-full', className, classNames.container)}>
      {/* Month Header - Dark bar */}
      {monthName && (
        <div className={cn(
          "flex justify-between items-center bg-stone-800 text-white rounded-t-xl px-4 py-3",
          classNames.monthHeader
        )}>
          {/* Previous Arrow in header */}
          <button
            onClick={() => isPrevEnabled && onNavigate?.('prev')}
            className={cn(
              'flex items-center justify-center w-8 h-8 rounded-full',
              'transition-all duration-200',
              isPrevEnabled 
                ? 'hover:bg-white/20 text-white cursor-pointer' 
                : 'opacity-30 cursor-not-allowed text-white/50',
              classNames.navButton
            )}
            disabled={!isPrevEnabled}
            aria-label="Previous week"
          >
            <ChevronLeft />
          </button>
          
          {/* Month Name */}
          <span className={cn(
            "text-sm font-semibold uppercase tracking-wide",
            classNames.monthText
          )}>
            {monthName}
          </span>
          
          {/* Next Arrow in header */}
          <button
            onClick={() => isNextEnabled && onNavigate?.('next')}
            className={cn(
              'flex items-center justify-center w-8 h-8 rounded-full',
              'transition-all duration-200',
              isNextEnabled 
                ? 'hover:bg-white/20 text-white cursor-pointer' 
                : 'opacity-30 cursor-not-allowed text-white/50',
              classNames.navButton
            )}
            disabled={!isNextEnabled}
            aria-label="Next week"
          >
            <ChevronRight />
          </button>
        </div>
      )}
      
      {/* Days Container */}
      <div className={cn(
        "flex justify-center items-center gap-1 bg-white p-1.5",
        monthName ? "rounded-b-xl" : "rounded-xl",
        classNames.daysContainer
      )}>
        {/* Previous Week Button (only shown when no month header) */}
        {!monthName && (
          <button
            onClick={() => isPrevEnabled && onNavigate?.('prev')}
            className={cn(
              'flex items-center justify-center',
              'w-10 h-14 rounded-lg',
              'border-none bg-transparent',
              'transition-all duration-200 ease-out',
              'text-stone-500',
              isPrevEnabled 
                ? 'hover:bg-black/5 hover:text-stone-700 cursor-pointer' 
                : 'opacity-30 cursor-not-allowed',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-400',
              classNames.navButton
            )}
            disabled={!isPrevEnabled}
            aria-label="Previous week"
          >
            <ChevronLeft />
          </button>
        )}

        {/* Days */}
        {translatedDays.map((day, index) => {
          const isActive = index === activeIndex;
          const isDisabled = isDateDisabled(visibleDaysList[index]);
          
          return (
            <button
              key={`${day.day}-${day.date}`}
              onClick={() => !isDisabled && handleSelect(index)}
              disabled={isDisabled}
              className={cn(
                'flex flex-col items-center justify-center gap-1',
                'min-w-[56px] px-3.5 py-2.5 rounded-lg',
                'border-none bg-transparent',
                'transition-all duration-200 ease-out',
                'text-stone-500 hover:bg-black/5',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-400',
                isActive && 'bg-stone-200 text-stone-800',
                isActive && classNames.daySelected,
                isDisabled && 'opacity-40 cursor-not-allowed text-stone-300 hover:bg-transparent',
                isDisabled && classNames.dayDisabled,
                classNames.day
              )}
            >
              <span className="text-xs font-medium uppercase tracking-wide">
                {day.day}
              </span>
              <span className="text-lg font-semibold">
                {day.date}
              </span>
            </button>
          );
        })}

        {/* Next Week Button (only shown when no month header) */}
        {!monthName && (
          <button
            onClick={() => isNextEnabled && onNavigate?.('next')}
            className={cn(
              'flex items-center justify-center',
              'w-10 h-14 rounded-lg',
              'border-none bg-transparent',
              'transition-all duration-200 ease-out',
              'text-stone-500',
              isNextEnabled 
                ? 'hover:bg-black/5 hover:text-stone-700 cursor-pointer' 
                : 'opacity-30 cursor-not-allowed',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-400',
              classNames.navButton
            )}
            disabled={!isNextEnabled}
            aria-label="Next week"
          >
            <ChevronRight />
          </button>
        )}
      </div>
    </div>
  );
};

export default DayPicker;
