import { TxCodec } from "@iov/bcp-types";
import { bnsCodec } from "@iov/bns";
import { liskCodec } from "@iov/lisk";
import { riseCodec } from "@iov/rise";

import {
  makeBech32Display,
  makeBip39MnemonicDisplay,
  makeBnsAddressDisplay,
  makeBnsNameDisplay,
  makeEd25519PubkeyDisplay,
  makeHdWalletDisplay,
  makeHexDisplay,
  makeLiskAddressDisplay,
  makeLiskLikePassphraseDisplay,
  makeRiseAddressDisplay,
  makeSimpleAddressDisplay,
  makeWeaveAddressDisplay,
  NetworkSettings,
} from "./displays";
import { InputProperties, interprete } from "./interprete";

export interface StaticDisplay {
  readonly id: string;
  readonly priority: number;
  readonly interpretedAs: string;
  readonly data: JSX.Element;
}

export interface InteractiveDisplay {
  readonly id: string;
  readonly priority: number;
  readonly interpretedAs: string;
  readonly getData: () => Promise<object>;
  readonly renderData: (data: any) => StaticDisplay;
}

export type Display = StaticDisplay | InteractiveDisplay;

export function isInteractiveDisplay(display: Display): display is InteractiveDisplay {
  return (
    typeof (display as InteractiveDisplay).getData === "function" &&
    typeof (display as InteractiveDisplay).renderData === "function"
  );
}

const iovTestnets: ReadonlyArray<NetworkSettings> = [
  {
    name: "Yaknet (bnsd)",
    url: "https://bns.yaknet.iov.one",
  },
  {
    name: "Yaknet (bcpd)",
    url: "https://bov.yaknet.iov.one",
  },
];

const liskNetworks: ReadonlyArray<NetworkSettings> = [
  {
    name: "Lisk Testnet",
    url: "https://testnet.lisk.io",
  },
  {
    name: "Lisk Mainnet",
    url: "https://hub32.lisk.io",
  },
];

const riseNetworks: ReadonlyArray<NetworkSettings> = [
  {
    name: "RISE Testnet",
    url: "https://twallet.rise.vision",
  },
  {
    name: "RISE Mainnet",
    url: "https://wallet.rise.vision",
  },
];

const accountBasedSlip10HdCoins: ReadonlyArray<{
  readonly name: string;
  readonly number: number;
  readonly codec: TxCodec;
}> = [
  {
    name: "IOV",
    number: 234,
    codec: bnsCodec,
  },
  {
    name: "Lisk",
    number: 134,
    codec: liskCodec,
  },
  {
    name: "RISE",
    number: 1120,
    codec: riseCodec,
  },
];

export async function processInput(input: string): Promise<ReadonlyArray<Display>> {
  const normalizedInput = input.trim();

  const properties = interprete(normalizedInput);

  const out = new Array<Display>();

  if (properties.has(InputProperties.IovAddressTestnet)) {
    for (const network of iovTestnets) {
      out.push(makeBnsAddressDisplay(normalizedInput, network));
    }
  }

  if (properties.has(InputProperties.BnsUsername)) {
    for (const network of iovTestnets) {
      out.push(makeBnsNameDisplay(normalizedInput, network));
    }
  }

  if (properties.has(InputProperties.EnglishMnemonic)) {
    out.push(makeBip39MnemonicDisplay(normalizedInput));

    out.push(await makeSimpleAddressDisplay(normalizedInput));
    for (const hdCoin of accountBasedSlip10HdCoins) {
      out.push(await makeHdWalletDisplay(normalizedInput, hdCoin.number, hdCoin.name, hdCoin.codec));
    }

    if (properties.has(InputProperties.EnglishMnemonic12Words)) {
      out.push(await makeLiskLikePassphraseDisplay(normalizedInput));
    }
  }

  if (properties.has(InputProperties.Bech32)) {
    out.push(makeBech32Display(normalizedInput));
  }

  if (properties.has(InputProperties.Hex)) {
    if (properties.has(InputProperties.ByteLength20)) {
      out.push(makeWeaveAddressDisplay(normalizedInput));
    }
    if (properties.has(InputProperties.ByteLength32)) {
      out.push(makeEd25519PubkeyDisplay(normalizedInput));
    }
    out.push(makeHexDisplay(normalizedInput));
  }

  if (properties.has(InputProperties.LiskAddress)) {
    for (const network of liskNetworks) {
      out.push(makeLiskAddressDisplay(normalizedInput, network));
    }
  }

  if (properties.has(InputProperties.RiseAddress)) {
    for (const network of riseNetworks) {
      out.push(makeRiseAddressDisplay(normalizedInput, network));
    }
  }

  out.sort((a, b) => a.priority - b.priority);

  return out;
}
