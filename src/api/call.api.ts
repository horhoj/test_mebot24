import calls from './calls.json';
import { Call, CallPriority, CallType, Errors } from '~/api/call.api.type';

const CALLS_LS_KEY = 'CALLS_LS_KEY';

let maxId = 0;

export const getCalls = () => {
  const callsStrFromLS = localStorage.getItem(CALLS_LS_KEY);

  let actualCalls = calls as Call[];

  if (callsStrFromLS !== null) {
    actualCalls = JSON.parse(callsStrFromLS) as Call[];
  }

  actualCalls.forEach((call) => {
    maxId = Math.max(maxId, call.id);
  });

  return actualCalls;
};

export const addNewCall = (): Call => {
  const currentDateTime = new Date();
  const year = currentDateTime.getFullYear();
  const month = (currentDateTime.getMonth() + 1).toString().padStart(2, '0');
  const day = currentDateTime.getDate().toString().padStart(2, '0');
  const date = `${year}-${month}-${day}`;
  const hours = currentDateTime.getHours().toString().padStart(2, '0');
  const minutes = currentDateTime.getMinutes().toString().padStart(2, '0');
  const time = `${hours}:${minutes}`;

  maxId++;

  return { date, id: maxId, priority: CallPriority.Ordinary, responsible: '', time, type: CallType.Out };
};

export const saveCalls = (calls: Call[]) => localStorage.setItem(CALLS_LS_KEY, JSON.stringify(calls));

export const callsValidate = (calls: Call[]): Errors => {
  const getISODate = (date: string, time: string) => `${date}T${time}`;

  const errors: Record<number, string[]> = {};

  const responsibleCallCountHashMap: Record<string, number> = {};

  const makeResponsibleHash = (responsible: string, date: string) => `${responsible}___${date}`;

  calls.forEach((call) => {
    const responsibleHash = makeResponsibleHash(call.responsible.trim(), call.date);
    if (!responsibleCallCountHashMap[responsibleHash]) {
      responsibleCallCountHashMap[responsibleHash] = 1;
    } else {
      responsibleCallCountHashMap[responsibleHash]++;
    }
  });

  calls.forEach((call) => {
    const itemErrors = [];

    if (!call.responsible.trim()) {
      itemErrors.push('Нужно заполнить ФИО');
    }

    const startDateTime = new Date(getISODate(call.date, '12:00')).getTime();
    const endDateTime = new Date(getISODate(call.date, '14:00')).getTime();
    const currentDateTime = new Date(getISODate(call.date, call.time)).getTime();

    if (startDateTime <= currentDateTime && currentDateTime <= endDateTime) {
      itemErrors.push('Нельзя назначать звонки в 12:00, 13:00, 14:00 — это обеденное время.');
    }

    if (itemErrors.length > 0) {
      errors[call.id] = itemErrors;
    }
  });
  return errors;
};
