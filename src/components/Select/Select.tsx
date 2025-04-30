import { useEffect, useMemo, useRef, useState } from 'react';
import classNames from 'classnames';
import styles from './Select.module.scss';
import { IconChevronDown } from '~/assets/icons';
import { useOutsideClick } from '~/hooks/useOutsideClk';

export interface SelectItem {
  id: number;
  value: string;
  title: string;
  class: string;
}

interface SelectProps {
  items: SelectItem[];
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
  variant?: 'white' | 'dark';
}

export function Select({ items, value, placeholder, onChange, variant }: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const actualValueItem = useMemo(() => items.find((item) => item.value === value), [items, value]);

  useOutsideClick(dropdownRef, () => setIsOpen(false));

  useEffect(() => {
    dropdownRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
  }, [isOpen]);

  return (
    <div className={styles.Select}>
      <button className={classNames(styles.btn, actualValueItem?.class)} onClick={() => setIsOpen((prev) => !prev)}>
        <span>{actualValueItem?.title}</span>
        <IconChevronDown variant={variant} />
      </button>
      {isOpen && (
        <div className={styles.dropdown} ref={dropdownRef}>
          <div className={styles.dropdownPlaceholder}>{placeholder}</div>
          {items.map((item) => (
            <button
              key={item.id}
              className={styles.dropdownItem}
              onClick={() => {
                setIsOpen(false);
                onChange(item.value);
              }}
            >
              <span className={classNames(styles.btn, item.class)}>{item.title}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
