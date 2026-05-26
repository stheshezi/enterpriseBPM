import React from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export function Input({
  label,
  error,
  helperText,
  required,
  leftIcon,
  rightIcon,
  id,
  className = "",
  ...rest
}: InputProps) {
  const inputId = id ?? rest.name;
  const descriptionId = inputId ? `${inputId}-description` : undefined;

  return (
    <label className={`ui-field ${className}`} htmlFor={inputId}>
      {label ? (
        <span className="ui-field__label">
          {label}
          {required ? <span aria-hidden="true"> *</span> : null}
        </span>
      ) : null}
      <span className={`ui-field__control ${error ? "ui-field__control--error" : ""}`}>
        {leftIcon}
        <input id={inputId} required={required} aria-invalid={Boolean(error)} aria-describedby={descriptionId} {...rest} />
        {rightIcon}
      </span>
      {error ? <span id={descriptionId} className="ui-field__error">{error}</span> : null}
      {!error && helperText ? <span id={descriptionId} className="ui-field__helper">{helperText}</span> : null}
    </label>
  );
}
