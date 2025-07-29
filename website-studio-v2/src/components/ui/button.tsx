import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8b5cf6] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 transform active:scale-95',
  {
    variants: {
      variant: {
        default: 'bg-[#8b5cf6] text-white shadow-lg hover:bg-[#7c3aed] hover:scale-105',
        destructive: 'bg-[#ef4444] text-white shadow-sm hover:bg-[#ef4444]/90',
        outline: 'border border-white/10 bg-transparent hover:bg-white/10 hover:border-white/20',
        secondary: 'bg-[#1a1a1a] text-white shadow-sm hover:bg-[#1a1a1a]/80',
        ghost: 'hover:bg-white/10 hover:text-white',
        glass: 'glass hover:glass-heavy',
        gradient:
          'bg-gradient-to-r from-[#8b5cf6] to-[#06b6d4] text-white shadow-lg hover:shadow-xl hover:scale-105',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-lg px-8',
        xl: 'h-14 rounded-lg px-10 text-base',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
