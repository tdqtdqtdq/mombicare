"use client";

import type { InputHTMLAttributes } from "react";

type CurrencyInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type" | "value" | "onChange"
> & {
  value: number;
  onValueChange: (value: number) => void;
  allowNegative?: boolean;
};

const moneyFormatter = new Intl.NumberFormat("vi-VN", {
  maximumFractionDigits: 0,
});

export function CurrencyInput({
  value,
  onValueChange,
  allowNegative = false,
  onFocus,
  ...props
}: CurrencyInputProps) {
  const normalizedValue = Number.isFinite(value)
    ? allowNegative
      ? value
      : Math.max(0, value)
    : 0;

  return (
    <input
      {...props}
      type="text"
      inputMode="numeric"
      value={moneyFormatter.format(normalizedValue)}
      onFocus={(event) => {
        onFocus?.(event);
        if (normalizedValue === 0) event.currentTarget.select();
      }}
      onChange={(event) => {
        const isNegative = allowNegative && event.target.value.includes("-");
        const digits = event.target.value.replace(/\D/g, "");
        const nextValue = digits ? Number(digits) : 0;
        onValueChange(isNegative ? -nextValue : nextValue);
      }}
    />
  );
}
