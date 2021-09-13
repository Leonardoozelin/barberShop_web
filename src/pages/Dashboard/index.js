import React, { useState, useMemo, useEffect } from 'react';
import { format, subDays, addDays, setHours, setMinutes, setSeconds, setMilliseconds, isBefore, isEqual, parseISO } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz'
import pt from 'date-fns/locale/pt';
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';

import api from '~/services/api';

import { Container, Time } from './styles';

const range = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19];

export default function Dashboard() {
  const [schedule, setSchedule] = useState([]);
  const [date, setDate] = useState(new Date());

  const dateFormatted = useMemo(
    () => format(date, "dd 'de' MMMM", { locale: pt }),
    [date]
  );

  useEffect(() => {
    async function loadSchedule() {
      const response = await api.get('schedule', {
        params: { date },
      });

      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

      const data = range.map(hour => {
        const checkDate = setMilliseconds(setSeconds(setMinutes(setHours(date, hour), 0), 0), 0);
        const compareDate = utcToZonedTime(checkDate, timezone);

        return {
          time: `${hour}:00`,
          past: isBefore(compareDate, new Date()),
          appointments: response.data.find(a =>
            isEqual(parseISO(a.date), compareDate),
          ),
        };
      });
      setSchedule(data);
    }

    loadSchedule();
  }, [date]);

  function handlePrevDay() {
    setDate(subDays(date, 1));
  }

  function handleNextDay() {
    setDate(addDays(date, 1));
  }

  function handleToday() {
    setDate(new Date());
  }

  return (
    <Container>
      <header>
        <button type="button" onClick={handlePrevDay}>
          <MdChevronLeft size={36} color="#7129af" />
        </button>
        <strong onClick={handleToday}>{dateFormatted}</strong>
        <button type="button" onClick={handleNextDay}>
          <MdChevronRight size={36} color="#fff" />
        </button>
      </header>

      <ul>
        {schedule.map(time => (
          <Time key={time.time} past={time.past} available={!time.appointments}>
            <strong>{time.time}</strong>
            <span>{time.appointments ? time.appointments.user.name : 'Em aberto'}</span>
          </Time>
        ))}
        <br />
      </ul>
    </Container>
  );
}
