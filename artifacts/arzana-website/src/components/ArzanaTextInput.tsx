import * as React from 'react';
import { cn } from '../lib/utils';

export const ArzanaTextInput = React.forwardRef<
  HTMLInputElement,
  React.ComponentPropsWithoutRef<'input'>
>(({ className, type = 'text', ...props }, ref) => (
  <input
    ref={ref}
    type={type}
    className={cn('quote-dark-input', className)}
    {...props}
  />
));

ArzanaTextInput.displayName = 'ArzanaTextInput';
