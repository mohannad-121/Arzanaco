import type { ChangeEventHandler, ReactNode } from 'react';

type ArzanaCheckboxProps = {
  id: string;
  name: string;
  value: string;
  checked: boolean;
  onChange: ChangeEventHandler<HTMLInputElement>;
  disabled?: boolean;
  ariaLabel?: string;
  children: ReactNode;
};

/**
 * A native, controlled checkbox with the Arzana product-option presentation.
 * The input remains in the DOM so keyboard and assistive-technology behaviour
 * stays identical to a standard checkbox.
 */
export function ArzanaCheckbox({
  id,
  name,
  value,
  checked,
  onChange,
  disabled = false,
  ariaLabel,
  children,
}: ArzanaCheckboxProps) {
  return (
    <label className="arzana-checkbox-option" data-checked={checked} data-disabled={disabled}>
      <span className="arzana-checkbox-control">
        <input
          id={id}
          className="arzana-checkbox-input"
          type="checkbox"
          name={name}
          value={value}
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          aria-label={ariaLabel}
        />
        <span className="arzana-checkbox-frame" aria-hidden="true">
          <span className="arzana-checkbox-box">
            <span className="arzana-checkbox-bg" />
            <svg viewBox="0 0 24 24" className="arzana-checkbox-check">
              <path d="M3.25 12.5 9.5 18.75 20.75 5.5" />
            </svg>
            <span className="arzana-checkbox-particle arzana-checkbox-particle--1" />
            <span className="arzana-checkbox-particle arzana-checkbox-particle--2" />
            <span className="arzana-checkbox-particle arzana-checkbox-particle--3" />
            <span className="arzana-checkbox-particle arzana-checkbox-particle--4" />
            <span className="arzana-checkbox-particle arzana-checkbox-particle--5" />
            <span className="arzana-checkbox-particle arzana-checkbox-particle--6" />
            <span className="arzana-checkbox-ring arzana-checkbox-ring--1" />
            <span className="arzana-checkbox-ring arzana-checkbox-ring--2" />
            <span className="arzana-checkbox-ring arzana-checkbox-ring--3" />
            <span className="arzana-checkbox-spark arzana-checkbox-spark--1" />
            <span className="arzana-checkbox-spark arzana-checkbox-spark--2" />
            <span className="arzana-checkbox-spark arzana-checkbox-spark--3" />
            <span className="arzana-checkbox-spark arzana-checkbox-spark--4" />
            <span className="arzana-checkbox-spark arzana-checkbox-spark--5" />
            <span className="arzana-checkbox-spark arzana-checkbox-spark--6" />
            <span className="arzana-checkbox-spark arzana-checkbox-spark--7" />
            <span className="arzana-checkbox-spark arzana-checkbox-spark--8" />
          </span>
        </span>
      </span>
      <span className="arzana-checkbox-label">{children}</span>
    </label>
  );
}
