import { Amount } from "@iov/bcp-types";

import leftPad from "left-pad";

export function printAmount(amount: Amount): string {
  const whole = amount.quantity.slice(0, -amount.fractionalDigits) || "0";
  const fractional = leftPad(
    amount.quantity.slice(-amount.fractionalDigits) || "0",
    amount.fractionalDigits,
    "0"
  );
  const trimmedFractional = fractional.replace(/0+$/, '') || "0";
  return `${whole}.${trimmedFractional} ${amount.tokenTicker}`;
}
