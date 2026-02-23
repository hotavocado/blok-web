import React, { useState } from 'react';
import { Box, IconButton, Typography, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  addWeeks,
  format,
  isSameMonth,
  isSameDay,
  isToday,
  startOfDay,
} from 'date-fns';
import './Calendar.css';

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState('month'); // 'week' or 'month'

  const handleViewChange = (event, newView) => {
    if (newView !== null) {
      setView(newView);
    }
  };

  const handlePrevious = () => {
    if (view === 'month') {
      setCurrentDate(addMonths(currentDate, -1));
    } else {
      setCurrentDate(addWeeks(currentDate, -1));
    }
  };

  const handleNext = () => {
    if (view === 'month') {
      setCurrentDate(addMonths(currentDate, 1));
    } else {
      setCurrentDate(addWeeks(currentDate, 1));
    }
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const renderMonthView = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const dateFormat = 'd';
    const rows = [];
    let days = [];
    let day = startDate;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const formattedDate = format(day, dateFormat);
        const cloneDay = day;
        days.push(
          <Box
            key={day.toString()}
            className={`calendar-day ${
              !isSameMonth(day, monthStart)
                ? 'disabled'
                : isToday(day)
                ? 'today'
                : ''
            }`}
            onClick={() => console.log('Selected:', cloneDay)}
          >
            <Box className="day-number">{formattedDate}</Box>
            <Box className="day-events">
              {/* Events will go here */}
            </Box>
          </Box>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <Box key={day.toString()} className="calendar-week">
          {days}
        </Box>
      );
      days = [];
    }
    return <Box className="calendar-body">{rows}</Box>;
  };

  const renderWeekView = () => {
    const weekStart = startOfWeek(currentDate);
    const days = [];
    const hours = Array.from({ length: 24 }, (_, i) => i);

    for (let i = 0; i < 7; i++) {
      const day = addDays(weekStart, i);
      days.push(day);
    }

    return (
      <Box className="week-view">
        <Box className="week-header">
          <Box className="time-column-header"></Box>
          {days.map((day) => (
            <Box
              key={day.toString()}
              className={`week-day-header ${isToday(day) ? 'today' : ''}`}
            >
              <Typography className="day-name">
                {format(day, 'EEE')}
              </Typography>
              <Typography className="day-date">
                {format(day, 'd')}
              </Typography>
            </Box>
          ))}
        </Box>
        <Box className="week-body">
          <Box className="time-column">
            {hours.map((hour) => (
              <Box key={hour} className="time-slot">
                <Typography className="time-label">
                  {format(new Date().setHours(hour, 0), 'ha')}
                </Typography>
              </Box>
            ))}
          </Box>
          {days.map((day) => (
            <Box key={day.toString()} className="week-day-column">
              {hours.map((hour) => (
                <Box
                  key={`${day}-${hour}`}
                  className="hour-slot"
                  onClick={() => console.log('Clicked:', day, hour)}
                >
                  {/* Events will go here */}
                </Box>
              ))}
            </Box>
          ))}
        </Box>
      </Box>
    );
  };

  const getHeaderTitle = () => {
    if (view === 'month') {
      return format(currentDate, 'MMMM yyyy');
    } else {
      const weekStart = startOfWeek(currentDate);
      const weekEnd = endOfWeek(currentDate);
      if (isSameMonth(weekStart, weekEnd)) {
        return format(weekStart, 'MMMM yyyy');
      }
      return `${format(weekStart, 'MMM d')} - ${format(weekEnd, 'MMM d, yyyy')}`;
    }
  };

  return (
    <Box className="calendar-container">
      <Box className="calendar-header">
        <Box className="calendar-nav">
          <IconButton onClick={handlePrevious} size="small" sx={{ color: 'var(--color-on-surface)' }}>
            <ChevronLeft />
          </IconButton>
          <IconButton onClick={handleNext} size="small" sx={{ color: 'var(--color-on-surface)' }}>
            <ChevronRight />
          </IconButton>
          <Typography
            className="calendar-title"
            onClick={handleToday}
            sx={{ cursor: 'pointer', ml: 2 }}
          >
            {getHeaderTitle()}
          </Typography>
        </Box>
        <ToggleButtonGroup
          value={view}
          exclusive
          onChange={handleViewChange}
          size="small"
          sx={{
            '& .MuiToggleButton-root': {
              color: 'var(--color-on-surface)',
              backgroundColor: 'var(--color-surface)',
              borderColor: 'var(--color-surface-variant)',
              textTransform: 'none',
              '&.Mui-selected': {
                backgroundColor: 'var(--color-secondary-container)',
                color: 'var(--color-on-secondary-container)',
                borderColor: 'var(--color-surface-variant)',
                '&:hover': {
                  backgroundColor: 'var(--color-secondary-container)',
                },
              },
              '&:hover': {
                backgroundColor: 'var(--color-surface-container-highest)',
              },
            },
          }}
        >
          <ToggleButton value="week">Week</ToggleButton>
          <ToggleButton value="month">Month</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {view === 'month' && (
        <>
          <Box className="calendar-weekdays">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <Box key={day} className="weekday-name">
                <Typography>{day}</Typography>
              </Box>
            ))}
          </Box>
          {renderMonthView()}
        </>
      )}

      {view === 'week' && renderWeekView()}
    </Box>
  );
};

export default Calendar;
