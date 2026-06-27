import type { InputHTMLAttributes, ReactElement } from 'react';

export type InputSize = 'sm' | 'md' | 'lg';

export interface TextInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  size?: InputSize;
  fullWidth?: boolean;
  iconStart?: ReactElement | null;
  iconEnd?: ReactElement | null;
  showPasswordToggle?: boolean;
  error?: string;
}
