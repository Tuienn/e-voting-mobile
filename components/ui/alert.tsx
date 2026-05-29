import { Icon } from '@/components/ui/icon';
import { Text, TextClassContext } from '@/components/ui/text';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react-native';
import * as React from 'react';
import { View } from 'react-native';

type AlertVariant = 'default' | 'destructive' | 'warning' | 'success' | 'info';

const ALERT_VARIANTS: Record<
  AlertVariant,
  {
    container: string;
    icon: string;
    text: string;
  }
> = {
  default: {
    container: 'bg-card border-border',
    icon: 'text-foreground',
    text: 'text-foreground',
  },
  destructive: {
    container:
      'border-destructive/50 bg-destructive/10 dark:bg-destructive/20',
    icon: 'text-destructive',
    text: 'text-destructive',
  },
  warning: {
    container:
      'border-yellow-300 bg-yellow-50 dark:border-yellow-700 dark:bg-yellow-900/20',
    icon: 'text-yellow-600 dark:text-yellow-400',
    text: 'text-yellow-600 dark:text-yellow-400',
  },
  success: {
    container:
      'border-green-300 bg-green-50 dark:border-green-700 dark:bg-green-900/20',
    icon: 'text-green-600 dark:text-green-400',
    text: 'text-green-600 dark:text-green-400',
  },
  info: {
    container:
      'border-blue-300 bg-blue-50 dark:border-blue-700 dark:bg-blue-900/20',
    icon: 'text-blue-600 dark:text-blue-400',
    text: 'text-blue-600 dark:text-blue-400',
  },
};

function Alert({
  className,
  variant = 'default',
  children,
  icon,
  iconClassName,
  ...props
}: React.ComponentProps<typeof View> &
  React.RefAttributes<View> & {
    icon: LucideIcon;
    variant?: AlertVariant;
    iconClassName?: string;
  }) {
  const styles = ALERT_VARIANTS[variant];

  return (
    <TextClassContext.Provider
      value={cn('text-sm', styles.text)}>
      <View
        role="alert"
        className={cn(
          'relative w-full rounded-lg border px-4 pb-2 pt-2.5',
          styles.container,
          className
        )}
        {...props}>
        <View className="absolute left-3.5 top-3">
          <Icon
            as={icon}
            className={cn('size-4', styles.icon, iconClassName)}
          />
        </View>

        {children}
      </View>
    </TextClassContext.Provider>
  );
}

function AlertTitle({
  className,
  ...props
}: React.ComponentProps<typeof Text>) {
  const textClass = React.useContext(TextClassContext);

  return (
    <Text
      className={cn(
        'mb-1 ml-0.5 min-h-4 pl-6 font-medium leading-none tracking-tight',
        textClass,
        className
      )}
      {...props}
    />
  );
}

function AlertDescription({
  className,
  ...props
}: React.ComponentProps<typeof Text>) {
  const textClass = React.useContext(TextClassContext);

  return (
    <Text
      className={cn(
        'ml-0.5 pb-1.5 pl-6 text-sm leading-relaxed opacity-90',
        textClass,
        className
      )}
      {...props}
    />
  );
}

export { Alert, AlertDescription, AlertTitle };