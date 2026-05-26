import React from "react";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  maxLength?: number;
  isResizable?: boolean;
}

export function Textarea({
  label,
  error,
  helperText,
  required,
  maxLength,
  isResizable = true,
  id,
  className = "",
  ...rest
}: TextareaProps) {
  const textareaId = id ?? rest.name;
  const descriptionId = textareaId ? `${textareaId}-description` : undefined;
  const currentLength = typeof rest.value === "string" ? rest.value.length : undefined;

  return (
    <label className={`ui-field ${className}`} htmlFor={textareaId}>
      {label ? (
        <span className="ui-field__label">
          {label}
          {required ? <span aria-hidden="true"> *</span> : null}
        </span>
      ) : null}
      <textarea
        id={textareaId}
        className={`ui-textarea ${!isResizable ? "ui-textarea--fixed" : ""} ${error ? "ui-textarea--error" : ""}`}
        required={required}
        maxLength={maxLength}
        aria-invalid={Boolean(error)}
        aria-describedby={descriptionId}
        {...rest}
      />
      <span className="ui-field__meta">
        {error ? <span id={descriptionId} className="ui-field__error">{error}</span> : null}
        {!error && helperText ? <span id={descriptionId} className="ui-field__helper">{helperText}</span> : null}
        {maxLength ? <span>{currentLength ?? 0}/{maxLength}</span> : null}
      </span>
    </label>
  );
}
