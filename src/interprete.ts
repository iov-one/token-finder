import { Bip39, EnglishMnemonic } from "@iov/crypto";
import { Bech32, Encoding } from "@iov/encoding";
import { ethereumCodec } from "@iov/ethereum";
import { liskCodec } from "@iov/lisk";
import { riseCodec } from "@iov/rise";

export enum InputProperties {
  Hex,
  Bech32,
  ByteLength20,
  ByteLength32,
  EnglishMnemonic,
  EnglishMnemonic12Words,
  EthereumAddress,
  IovAddressMainnet,
  IovAddressTestnet,
  BnsUsernameNft,
  LiskAddress,
  RiseAddress,
}

export function interprete(input: string): ReadonlySet<InputProperties> {
  if (input.length === 0) {
    return new Set();
  }

  const out = new Set();

  try {
    const rawData = Encoding.fromHex(input);
    out.add(InputProperties.Hex);
    if (rawData.length === 20) {
      out.add(InputProperties.ByteLength20);
    }
    if (rawData.length === 32) {
      out.add(InputProperties.ByteLength32);
    }
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

  // https://github.com/iov-one/weave/blob/v0.9.3/x/nft/username/msg.go#L19
  if (input.match(/^[a-z0-9\.,\+\-_@]{4,64}$/)) {
    out.add(InputProperties.BnsUsernameNft);
  }

  if (liskCodec.isValidAddress(input)) {
    out.add(InputProperties.LiskAddress);
  }

  if (riseCodec.isValidAddress(input)) {
    out.add(InputProperties.RiseAddress);
  }

  if (ethereumCodec.isValidAddress(input)) {
    out.add(InputProperties.EthereumAddress);
  }

  return out;
}
