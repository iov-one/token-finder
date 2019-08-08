import { Amount } from "@iov/bcp";
import { Slip10RawIndex } from "@iov/crypto";

// Unicode NARROW NO-BREAK SPACE
// https://www.fileformat.info/info/unicode/char/202f/index.htm
const narrowNoBreakSpace = "\u202F";

export function printAmount(amount: Amount): string {
  const whole = amount.quantity.slice(0, -amount.fractionalDigits) || "0";
  const fractional = (amount.quantity.slice(-amount.fractionalDigits) || "0").padStart(
    amount.fractionalDigits,
    "0",
  );
  const trimmedFractional = fractional.replace(/0+$/, "") || "0";
  return `${whole}.${trimmedFractional}${narrowNoBreakSpace}${amount.tokenTicker}`;
}

export function printPath(path: readonly Slip10RawIndex[]): string {
  const components = path.map(ri => (ri.isHardened() ? `${ri.toNumber() - 2 ** 31}'` : `${ri.toNumber()}`));
  return `m/${components.join("/")}`;
}
