import { useState, useId, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Form } from 'react-bootstrap';
import type { Exercise } from '../../types';

interface Props {
  exercises: Exercise[];
  value: number;
  onChange: (id: number) => void;
  placeholder?: string;
  disabled?: boolean;
}

export default function SearchableExerciseSelect({
  exercises,
  value,
  onChange,
  placeholder = 'Search exercises…',
  disabled = false,
}: Props) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});
  const listboxId = useId();
  const inputRef = useRef<HTMLInputElement>(null);

  // When closed: show the selected exercise name. When open: show the search query.
  const selectedName = exercises.find((ex) => ex.id === value)?.name ?? '';
  const inputValue = isOpen ? query : selectedName;

  const filtered = query.trim()
    ? exercises.filter((ex) => {
        const q = query.toLowerCase();
        return (
          ex.name.toLowerCase().includes(q) ||
          (ex.muscle_group ?? '').toLowerCase().includes(q) ||
          (ex.equipment ?? '').toLowerCase().includes(q)
        );
      })
    : exercises;

  const showDropdown = isOpen && (filtered.length > 0 || query.trim() !== '');

  function updatePosition() {
    if (!inputRef.current) return;
    const rect = inputRef.current.getBoundingClientRect();
    setDropdownStyle({
      position: 'fixed',
      top: rect.bottom,
      left: rect.left,
      width: rect.width,
      zIndex: 1055,
    });
  }

  // Recalculate position when dropdown opens; track scroll and resize while open.
  useEffect(() => {
    if (!showDropdown) return;
    updatePosition();
    window.addEventListener('scroll', updatePosition, true); // capture = catches nested scrollers
    window.addEventListener('resize', updatePosition);
    return () => {
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
    };
  }, [showDropdown]);

  function handleFocus() {
    setQuery('');
    setIsOpen(true);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setQuery(e.target.value);
    setIsOpen(true);
    // Typing into an empty field clears the selection
    if (e.target.value === '' && value !== 0) {
      onChange(0);
    }
  }

  function handleSelect(id: number) {
    onChange(id);
    setQuery('');
    setIsOpen(false);
  }

  function handleBlur() {
    setIsOpen(false);
    setQuery('');
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Escape') {
      setIsOpen(false);
      setQuery('');
    } else if (e.key === 'Enter' && isOpen && filtered.length > 0) {
      e.preventDefault();
      handleSelect(filtered[0].id);
    }
  }

  return (
    <div>
      <Form.Control
        ref={inputRef}
        size="sm"
        type="text"
        value={inputValue}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        autoComplete="off"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={listboxId}
      />

      {showDropdown && createPortal(
        <ul
          id={listboxId}
          role="listbox"
          className="dropdown-menu show mb-0 p-0"
          style={{ ...dropdownStyle, maxHeight: 240, overflowY: 'auto' }}
        >
          {filtered.length === 0 ? (
            <li className="px-3 py-2 text-muted small" style={{ cursor: 'default' }}>
              No exercises match your search
            </li>
          ) : (
            filtered.map((ex) => (
              <li key={ex.id} role="option" aria-selected={ex.id === value}>
                <button
                  type="button"
                  className={`dropdown-item d-flex justify-content-between align-items-center${ex.id === value ? ' active' : ''}`}
                  onMouseDown={(e) => e.preventDefault()} // prevent blur before click fires
                  onClick={() => handleSelect(ex.id)}
                >
                  <span>{ex.name}</span>
                  {(ex.muscle_group || ex.equipment) && (
                    <small className={`ms-2 ${ex.id === value ? 'text-white-50' : 'text-muted'}`}>
                      {[ex.muscle_group, ex.equipment].filter(Boolean).join(' · ')}
                    </small>
                  )}
                </button>
              </li>
            ))
          )}
        </ul>,
        document.body,
      )}
    </div>
  );
}
