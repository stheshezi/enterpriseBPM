import React from "react";

export type SelectOption = {
  label: string;
  value: string;
};

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  placeholder?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
}

export function Select({
  label,
  options,
  placeholder,
  error,
  helperText,
  required,
  id,
  className = "",
  ...rest
}: SelectProps) {
  const selectId = id ?? rest.name;
  const descriptionId = selectId ? `${selectId}-description` : undefined;

  return (
    <label className={`ui-field ${className}`} htmlFor={selectId}>
      {label ? (
        <span className="ui-field__label">
          {label}
          {required ? <span aria-hidden="true"> *</span> : null}
        </span>
      ) : null}
      <span className={`ui-field__control ${error ? "ui-field__control--error" : ""}`}>
        <select id={selectId} required={required} aria-invalid={Boolean(error)} aria-describedby={descriptionId} {...rest}>
          {placeholder ? <option value="">{placeholder}</option> : null}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </span>
      {error ? <span id={descriptionId} className="ui-field__error">{error}</span> : null}
      {!error && helperText ? <span id={descriptionId} className="ui-field__helper">{helperText}</span> : null}
    </label>
  );
}
