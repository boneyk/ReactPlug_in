import { FC, useEffect, useState } from 'react';

import styles from './BurgerMenu.module.scss';

interface BurgerMenuProps {
  items: Record<string, () => void>;
}

const BurgerMenu: FC<BurgerMenuProps> = ({ items }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleItemClick = (action: () => void) => {
    action();
    setIsOpen(false);
  };

  return (
    <>
      <div className={styles.burger}>
        <label className={styles.label}>
          <input type="checkbox" checked={isOpen} onChange={handleToggle} className={styles.input} />

          <svg className={styles.svg} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <path className={styles.line1} d="M10 25h80" />
            <path className={styles.line2} d="M10 50h80" />
            <path className={styles.line3} d="M10 75h80" />
          </svg>
        </label>
      </div>

      {isOpen && (
        <div className={styles.overlay} onClick={() => setIsOpen(false)}>
          <nav className={styles.menu} onClick={(e) => e.stopPropagation()}>
            {Object.entries(items).map(([label, action]) => (
              <button key={label} className={styles.menuItem} onClick={() => handleItemClick(action)}>
                {label}
              </button>
            ))}
          </nav>
        </div>
      )}
    </>
  );
};

export default BurgerMenu;
