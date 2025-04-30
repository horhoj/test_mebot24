import { useEffect, useMemo, useRef, useState } from 'react';
import styles from './App.module.scss';
import { CallCard } from '~/components/CallCard';
import { Call } from '~/api/call.api.type';
import { IconPlus } from '~/assets/icons';
import { addNewCall, callsValidate, getCalls, saveCalls } from '~/api/call.api';

export function App() {
  const [calls, setCalls] = useState(getCalls);
  const [addCounter, setAddCounter] = useState(0);
  const [isNew, setIsNew] = useState(false);

  const handleChange = (changedCall: Call) => {
    setCalls((prev) => {
      const result = prev.map((call) => {
        if (call.id === changedCall.id) {
          return changedCall;
        }
        return call;
      });
      saveCalls(result);
      return result;
    });
  };

  const handleDelete = (id: number) => {
    setCalls((prev) => {
      const result = prev.filter((call) => call.id !== id);
      saveCalls(result);
      return result;
    });
  };

  const handleOnAdd = () => {
    const call = addNewCall();
    setCalls((prev) => {
      const result = [...prev, call];
      saveCalls(result);

      return result;
    });
    setAddCounter((prev) => prev + 1);
  };

  const errors = useMemo(() => callsValidate(calls), [calls]);

  const actualCalls = useMemo(() => calls.slice().reverse(), [calls]);

  const callCardListRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    let timerId: any = null;
    if (addCounter > 0) {
      callCardListRef.current?.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      setIsNew(true);
      timerId = setTimeout(() => {
        setIsNew(false);
      }, 1000);
    }
    return () => {
      if (timerId) {
        clearTimeout(timerId);
      }
    };
  }, [addCounter]);

  return (
    <>
      <div className={styles.App}>
        <div className={styles.header}>
          <div>Дата и время</div>
          <div>Ответственные</div>
          <div>Тип звонка</div>
          <div>Важность</div>
        </div>
        <div className={styles.content}>
          <button className={styles.addBtn} onClick={handleOnAdd}>
            <IconPlus /> <span>Добавить событие</span>
          </button>
          <ul className={styles.CallCardList} ref={callCardListRef}>
            {actualCalls.map((call, i) => (
              <CallCard
                key={call.id}
                errors={errors[call.id]}
                onChange={handleChange}
                call={call}
                onDelete={handleDelete}
                isNew={i === 0 && isNew}
              />
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
