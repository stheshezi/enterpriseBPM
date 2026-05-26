import React from "react";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "destructive"
  | "success"
  | "warning"
  | "link";

export type ButtonSize = "sm" | "md" | "lg" | "icon";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  isLoading = false,
  disabled,
  leftIcon,
  rightIcon,
  children,
  className = "",
  type = "button",
  ...rest
}: ButtonProps) {
  const isDisabled = disabled || isLoading;

  return (
    <button
      className={`ui-button ui-button--${variant} ui-button--${size} ${className}`}
      disabled={isDisabled}
      type={type}
      aria-busy={isLoading}
      {...rest}
    >
      {isLoading ? <span className="ui-spinner" aria-hidden="true" /> : leftIcon}
      <span>{children}</span>
      {rightIcon}
    </button>
  );
}
