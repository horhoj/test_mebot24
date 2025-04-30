import { useMemo, useRef } from 'react';
import classNames from 'classnames';
import styles from './CallCard.module.scss';
import { Select, SelectItem } from '~/components/Select';
import { Call, CallPriority, CallType } from '~/api/call.api.type';
import { IconTrash } from '~/assets/icons';
import { getUUID } from '~/utils/getUUID';

const callTypeSelectItems: SelectItem[] = [
  {
    id: 1,
    value: CallType.In,
    title: 'Входящий',
    class: styles.callTypeInSelectItemClass,
  },
  {
    id: 2,
    value: CallType.Out,
    title: 'Исходящий',
    class: styles.callTypeOutSelectItemClass,
  },
];

const callPrioritySelectItems: SelectItem[] = [
  {
    id: 1,
    value: CallPriority.Ordinary,
    title: 'Обычный',
    class: styles.callPriorityOrdinarySelectItemClass,
  },
  {
    id: 2,
    value: CallPriority.Express,
    title: 'Срочный',
    class: styles.callPriorityExpressInSelectItemClass,
  },
];

interface CallItemProps {
  errors?: string[];
  call: Call;
  onChange: (value: Call) => void;
  onDelete: (id: number) => void;
  isNew: boolean;
}

export function CallCard({ errors, call, onChange, onDelete, isNew }: CallItemProps) {
  const dateTimeRef = useRef<HTMLInputElement>(null);

  const actualErrors = useMemo(() => {
    if (!errors) {
      return null;
    }
    return errors.map((error) => ({ id: getUUID(), error }));
  }, [errors]);

  const handleChangeDateTime = (value: string) => {
    if (!value.trim()) {
      return;
    }
    const dateTimeArr = value.split('T');
    onChange({ ...call, date: dateTimeArr[0], time: dateTimeArr[1] });
  };

  const handleChangeResponsible = (value: string) => {
    onChange({ ...call, responsible: value });
  };

  const handleChangeType = (value: string) => {
    onChange({ ...call, type: value as CallType });
  };

  const handleChangePriority = (value: string) => {
    onChange({ ...call, priority: value as CallPriority });
  };

  return (
    <li
      className={classNames(
        styles.CallItem,
        call.type === CallType.In && styles.typeIn,
        call.type === CallType.Out && styles.typeOut,
        isNew && styles.isNew,
      )}
    >
      <div className={styles.fields}>
        <button className={styles.deleteBtn} onClick={() => onDelete(call.id)}>
          <IconTrash />
        </button>
        <div className={classNames(styles.field)}>
          <button className={styles.dateTime} onClick={() => dateTimeRef.current?.showPicker()}>
            <div className={styles.time}>{call.time}</div>
            <div className={styles.date}>
              {new Date(call.date).toLocaleDateString('ru-RU', { day: '2-digit', month: 'short', year: 'numeric' })}
            </div>
          </button>
          <input
            type={'datetime-local'}
            ref={dateTimeRef}
            className={styles.dateTimeInput}
            onChange={(e) => handleChangeDateTime(e.target.value)}
          />
        </div>
        <div className={styles.field}>
          <input
            type="text"
            placeholder={'Фамилия Имя участника'}
            className={styles.responsible}
            value={call.responsible}
            onChange={(e) => handleChangeResponsible(e.target.value)}
          />
        </div>
        <div className={styles.field}>
          <Select
            items={callTypeSelectItems}
            placeholder={'Выберите тип звонка'}
            value={call.type}
            onChange={(value) => handleChangeType(value)}
          />
        </div>
        <div className={styles.field}>
          <Select
            items={callPrioritySelectItems}
            placeholder={'Выберите тип звонка'}
            value={call.priority}
            variant={'dark'}
            onChange={(value) => handleChangePriority(value)}
          />
        </div>
      </div>

      {actualErrors && (
        <div className={styles.errors}>
          {actualErrors.map(({ error, id }) => (
            <div key={id}>{error}</div>
          ))}
        </div>
      )}
    </li>
  );
}
