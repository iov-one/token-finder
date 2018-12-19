import { Amount } from "@iov/bcp-types";

import leftPad from "left-pad";

// Unicode NARROW NO-BREAK SPACE
// https://www.fileformat.info/info/unicode/char/202f/index.htm
const narrowNoBreakSpace = "\u202F";

export function printAmount(amount: Amount): string {
  const whole = amount.quantity.slice(0, -amount.fractionalDigits) || "0";
  const fractional = leftPad(
    amount.quantity.slice(-amount.fractionalDigits) || "0",
    amount.fractionalDigits,
    "0",
  );
  const trimmedFractional = fractional.replace(/0+$/, "") || "0";
  return `${whole}.${trimmedFractional}${narrowNoBreakSpace}${amount.tokenTicker}`;
}
