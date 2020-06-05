import { Bip39, EnglishMnemonic } from "@iov/crypto";
import { Bech32, fromHex, Uint64 } from "@iov/encoding";
import { ethereumCodec } from "@iov/ethereum";
import { liskCodec } from "@iov/lisk";

export enum InputProperties {
  /* eslint-disable no-shadow */
  Hex,
  Bech32,
  ByteLength20,
  ByteLength32,
  ByteLength64,
  ByteLength65,
  EnglishMnemonic,
  EnglishMnemonic12Words,
  EthereumAddress,
  IovAddressMainnet,
  IovAddressTestnet,
  BnsUsername,
  LiskAddress,
  WeaveCondition,
  Uint64,
  NonZeroUint64,
  /* eslint-enable no-shadow */
}

export const weaveConditionRegex = /^cond:([a-zA-Z]+)\/([a-zA-Z]+)\/(([a-fA-F0-9]{2})+)$/;
export const bnsUsernameRegex = /^[a-z0-9.\-_]{3,64}\*iov$/;

export function interprete(input: string): ReadonlySet<InputProperties> {
  if (input.length === 0) {
    return new Set();
  }

  const out = new Set<InputProperties>();

  try {
    const value = Uint64.fromString(input);
    out.add(InputProperties.Uint64);
    if (value.toString() !== "0") {
      out.add(InputProperties.NonZeroUint64);
    }
  } catch {}

  try {
    const rawData = fromHex(input);
    out.add(InputProperties.Hex);
    if (rawData.length === 20) out.add(InputProperties.ByteLength20);
    if (rawData.length === 32) out.add(InputProperties.ByteLength32);
    if (rawData.length === 64) out.add(InputProperties.ByteLength64);
    if (rawData.length === 65) out.add(InputProperties.ByteLength65);
  } catch {}

  try {
    const data = Bech32.decode(input);
    out.add(InputProperties.Bech32);
    if (data.prefix === "iov") {
      out.add(InputProperties.IovAddressMainnet);
    }
    if (data.prefix === "tiov") {
      out.add(InputProperties.IovAddressTestnet);
    }
  } catch {}

  try {
    const mnemonic = new EnglishMnemonic(input);
    out.add(InputProperties.EnglishMnemonic);
    const entropy = Bip39.decode(mnemonic);
    if (entropy.length * 8 === 128) {
      out.add(InputProperties.EnglishMnemonic12Words);
    }
  } catch {}

  if (input.match(bnsUsernameRegex)) {
    out.add(InputProperties.BnsUsername);
  }

  if (liskCodec.isValidAddress(input)) {
    out.add(InputProperties.LiskAddress);
  }

  if (ethereumCodec.isValidAddress(input)) {
    out.add(InputProperties.EthereumAddress);
  }

  if (input.match(weaveConditionRegex)) {
    out.add(InputProperties.WeaveCondition);
  }

  return out;
}
