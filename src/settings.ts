import { ChainId, TxCodec } from "@iov/bcp";
import { bnsCodec } from "@iov/bns";
import { ethereumCodec } from "@iov/ethereum";
import { liskCodec } from "@iov/lisk";
import { riseCodec } from "@iov/rise";

export interface NetworkSettings {
  readonly name: string;
  readonly url: string;
  readonly bnsUsernameSupported?: boolean;
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
          bnsUsernameSupported: true,
        },
      ]
    : [];

export const iovTestnets: readonly NetworkSettings[] = [
  {
    name: "Catnet 🐈",
    url: "https://rpc-private-a-vip-catnet.iov.one",
    bnsUsernameSupported: true,
  },
  {
    name: "Boarnet 🐗",
    url: "https://rpc.boarnet.iov.one",
    bnsUsernameSupported: true,
  },
  {
    name: "Lovenet 😍",
    url: "https://rpc.lovenet.iov.one",
    bnsUsernameSupported: true,
  },
  ...iovDevnets,
];

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

export const riseNetworks: readonly NetworkSettings[] = [
  {
    name: "RISE Testnet",
    url: "https://twallet.rise.vision",
  },
  {
    name: "RISE Mainnet",
    url: "https://wallet.rise.vision",
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
  {
    name: "RISE",
    number: 1120,
    // https://github.com/RiseVision/rise-node/blob/master/etc/mainnet/config.json
    chainId: "cd8171332c012514864edd8eb6f68fc3ea6cb2afbaf21c56e12751022684cea5" as ChainId,
    codec: riseCodec,
  },
];

export const secp256k1Slip10HdCoins: readonly HdCoin[] = [
  {
    name: "Ethereum",
    number: 60,
    // all Ethereum networks use the same addresses
    chainId: "ethereum-eip155-0" as ChainId,
    codec: ethereumCodec,
  },
];
