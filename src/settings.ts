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

export const iovTestnets: ReadonlyArray<NetworkSettings> = [
  {
    name: "Lovenet (bnsd)",
    url: "https://rpc.lovenet.iov.one",
    bnsUsernameSupported: true,
  },
];

export const liskNetworks: ReadonlyArray<NetworkSettings> = [
  {
    name: "Lisk Testnet",
    url: "https://testnet.lisk.io",
  },
  {
    name: "Lisk Mainnet",
    url: "https://hub32.lisk.io",
  },
];

export const riseNetworks: ReadonlyArray<NetworkSettings> = [
  {
    name: "RISE Testnet",
    url: "https://twallet.rise.vision",
  },
  {
    name: "RISE Mainnet",
    url: "https://wallet.rise.vision",
  },
];

export const accountBasedSlip10HdCoins: ReadonlyArray<HdCoin> = [
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

export const secp256k1Slip10HdCoins: ReadonlyArray<HdCoin> = [
  {
    name: "Ethereum",
    number: 60,
    // all Ethereum networks use the same addresses
    chainId: "ethereum-eip155-0" as ChainId,
    codec: ethereumCodec,
  },
];
