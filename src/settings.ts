import { CosmWasmCodec } from "@cosmwasm/bcp";
import { ChainId, TxCodec } from "@iov/bcp";
import { bnsCodec } from "@iov/bns";
import { ethereumCodec } from "@iov/ethereum";
import { liskCodec } from "@iov/lisk";

// Cannot make readonly array because type is missing (see https://github.com/CosmWasm/cosmwasm-js/pull/180)
// tslint:disable-next-line: readonly-array
const bankTokens = [
  {
    fractionalDigits: 9,
    name: "Internet Of Value Token",
    ticker: "IOV",
    denom: "niov",
  },
];
const iovMainnet2Codec = new CosmWasmCodec("star", bankTokens);

export interface NetworkSettings {
  readonly name: string;
  readonly url: string;
}

export interface HdCoin {
  readonly name: string;
  readonly number: number;
  readonly chainId: ChainId;
  readonly codec: TxCodec;
}

export const iovChainIds = {
  testnet: "iov-lovenet" as ChainId, // Any testnet is okay here. Used for address calculation only
  mainnet: "iov-mainnet" as ChainId,
};

const iovDevnets: readonly NetworkSettings[] =
  process.env.NODE_ENV === "development"
    ? [
        {
          name: "Devnet",
          url: "http://localhost:23456/",
        },
      ]
    : [];

export const iovTestnets: readonly NetworkSettings[] = [
  {
    name: "Exchangenet 📈",
    url: "https://rpc-private-a-x-exchangenet.iov.one/",
  },
  ...iovDevnets,
];

export const iovMainnet: NetworkSettings = {
  name: "Mainnet",
  url: "https://rpc-private-a-vip-mainnet.iov.one",
};

export const liskNetworks: readonly NetworkSettings[] = [
  {
    name: "Lisk Testnet",
    url: "https://testnet.lisk.io",
  },
  {
    name: "Lisk Mainnet",
    url: "https://hub32.lisk.io",
  },
];

export const accountBasedSlip10HdCoins: readonly HdCoin[] = [
  {
    name: "IOV",
    number: 234,
    // any testnet leads to "tiov" prefixes
    chainId: "some-testnet" as ChainId,
    codec: bnsCodec,
  },
  {
    name: "Lisk",
    number: 134,
    // https://github.com/prolina-foundation/lisk-wiki/blob/master/Networks.md#mainnet
    chainId: "ed14889723f24ecc54871d058d98ce91ff2f973192075c0155ba2b7b70ad2511" as ChainId,
    codec: liskCodec,
  },
];

export const secp256k1Slip10HdCoins: readonly HdCoin[] = [
  {
    name: "IOV (Cosmos SDK based)",
    number: 234,
    chainId: "iov-mainnet-2" as ChainId,
    codec: iovMainnet2Codec,
  },
  {
    name: "Ethereum",
    number: 60,
    // all Ethereum networks use the same addresses
    chainId: "ethereum-eip155-0" as ChainId,
    codec: ethereumCodec,
  },
];
