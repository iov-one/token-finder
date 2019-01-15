import React from "react";
import { Link } from "react-router-dom";

import { Algorithm, PublicKeyBundle, PublicKeyBytes } from "@iov/base-types";
import {
  Address,
  BcpAccount,
  BcpAccountQuery,
  BcpConnection,
  BcpQueryEnvelope,
  TxCodec,
} from "@iov/bcp-types";
import { bnsCodec, BnsConnection } from "@iov/bns";
import { Bip39, EnglishMnemonic, Slip10RawIndex } from "@iov/crypto";
import { Bech32, Encoding } from "@iov/encoding";
import { Ed25519HdWallet, HdPaths } from "@iov/keycontrol";
import { liskCodec, LiskConnection, passphraseToKeypair } from "@iov/lisk";
import { riseCodec, RiseConnection } from "@iov/rise";

import { printAmount } from "./bcphelpers";
import { InteractiveDisplay, StaticDisplay } from "./inputprocessing";

const { toHex } = Encoding;

export interface NetworkSettings {
  readonly name: string;
  readonly url: string;
}

const bcpConnections = new Map<string, Promise<BcpConnection>>();

function ellideMiddle(str: string, maxOutLen: number): string {
  if (str.length <= maxOutLen) {
    return str;
  }
  const ellide = "…";
  const frontLen = Math.ceil((maxOutLen - ellide.length) / 2);
  const tailLen = Math.floor((maxOutLen - ellide.length) / 2);
  return str.slice(0, frontLen) + ellide + str.slice(-tailLen);
}

function makeBnsAccountDisplay(
  id: string,
  priority: number,
  interpretedAs: string,
  query: BcpAccountQuery,
  network: NetworkSettings,
  deprecated: boolean = false,
): InteractiveDisplay {
  return {
    id: id,
    priority: priority,
    deprecated: deprecated,
    interpretedAs: interpretedAs,
    getData: async () => {
      if (!bcpConnections.has(network.url)) {
        bcpConnections.set(network.url, BnsConnection.establish(network.url));
      }
      const connection = await bcpConnections.get(network.url)!;
      const response = await connection.getAccount(query);
      return response;
    },
    renderData: (response: BcpQueryEnvelope<BcpAccount>) => {
      let data: JSX.Element;
      if (response.data.length > 0) {
        const { address, pubkey, balance, name } = response.data[0];
        const hexPubkey = pubkey ? toHex(pubkey.data) : undefined;
        data = (
          <table>
            <tbody>
              <tr>
                <td>Address</td>
                <td>
                  <Link to={"#" + address}>{address}</Link>
                </td>
              </tr>
              <tr>
                <td>Pubkey</td>
                <td className="breakall">
                  {hexPubkey ? (
                    <Link to={"#" + hexPubkey}>{hexPubkey}</Link>
                  ) : (
                    <span className="inactive">not available</span>
                  )}
                </td>
              </tr>
              <tr>
                <td>Name</td>
                <td>{name ? <Link to={"#" + name}>{name}</Link> : "<none>"}</td>
              </tr>
              <tr>
                <td>Balance</td>
                <td>{balance.map(printAmount).join(", ")}</td>
              </tr>
            </tbody>
          </table>
        );
      } else {
        data = <span className="inactive">Account not found</span>;
      }
      return { id, interpretedAs, priority, deprecated, data };
    },
  };
}

export function makeBnsAddressDisplay(input: string, network: NetworkSettings): InteractiveDisplay {
  const id = `${input}#${network.name}-bns-address`;
  const priority = 9;
  const interpretedAs = `Address on ${network.name}`;
  return makeBnsAccountDisplay(id, priority, interpretedAs, { address: input as Address }, network);
}

export function makeBnsNicknameDisplay(input: string, network: NetworkSettings): InteractiveDisplay {
  const id = `${input}#${network.name}-bns-nickname`;
  const priority = 1011;
  const interpretedAs = `Nickname on ${network.name}`;
  return makeBnsAccountDisplay(id, priority, interpretedAs, { name: input }, network, true);
}

export function makeLiskAddressDisplay(input: string, network: NetworkSettings): InteractiveDisplay {
  const id = `${input}#${network.name}-lisk-address`;
  const priority = 10;
  const interpretedAs = `Address on ${network.name}`;
  return {
    id: id,
    priority: priority,
    interpretedAs: interpretedAs,
    getData: async () => {
      if (!bcpConnections.has(network.url)) {
        bcpConnections.set(network.url, LiskConnection.establish(network.url));
      }
      const connection = await bcpConnections.get(network.url)!;
      const response = await connection.getAccount({ address: input as Address });
      return response;
    },
    renderData: (response: BcpQueryEnvelope<BcpAccount>) => {
      let data: JSX.Element;
      if (response.data.length > 0) {
        const { address, pubkey, balance, name } = response.data[0];
        const hexPubkey = pubkey ? toHex(pubkey.data) : undefined;
        data = (
          <table>
            <tr>
              <td>Address</td>
              <td>
                <Link to={"#" + address}>{address}</Link>
              </td>
            </tr>
            <tr>
              <td>Pubkey</td>
              <td className="breakall">
                {hexPubkey ? (
                  <Link to={"#" + hexPubkey}>{hexPubkey}</Link>
                ) : (
                  <span className="inactive">not available</span>
                )}
              </td>
            </tr>
            <tr>
              <td>Balance</td>
              <td>{balance.map(printAmount).join(", ")}</td>
            </tr>
          </table>
        );
      } else {
        data = <span className="inactive">Account not found</span>;
      }
      return { id, interpretedAs, priority, data };
    },
  };
}

export function makeRiseAddressDisplay(input: string, network: NetworkSettings): InteractiveDisplay {
  const id = `${input}#${network.name}-rise-address`;
  const priority = 10;
  const interpretedAs = `Address on ${network.name}`;
  return {
    id: id,
    priority: priority,
    interpretedAs: interpretedAs,
    getData: async () => {
      if (!bcpConnections.has(network.url)) {
        bcpConnections.set(network.url, RiseConnection.establish(network.url));
      }
      const connection = await bcpConnections.get(network.url)!;
      const response = await connection.getAccount({ address: input as Address });
      return response;
    },
    renderData: (response: BcpQueryEnvelope<BcpAccount>) => {
      let data: JSX.Element;
      if (response.data.length > 0) {
        const { address, pubkey, balance, name } = response.data[0];
        const hexPubkey = pubkey ? toHex(pubkey.data) : undefined;
        data = (
          <table>
            <tr>
              <td>Address</td>
              <td>
                <Link to={"#" + address}>{address}</Link>
              </td>
            </tr>
            <tr>
              <td>Pubkey</td>
              <td className="breakall">
                {hexPubkey ? (
                  <Link to={"#" + hexPubkey}>{hexPubkey}</Link>
                ) : (
                  <span className="inactive">not available</span>
                )}
              </td>
            </tr>
            <tr>
              <td>Balance</td>
              <td>{balance.map(printAmount).join(", ")}</td>
            </tr>
          </table>
        );
      } else {
        data = <span className="inactive">Account not found</span>;
      }
      return { id, interpretedAs, priority, data };
    },
  };
}

export function makeBech32Display(input: string): StaticDisplay {
  const parsed = Bech32.decode(input);
  return {
    id: `${input}#bech32`,
    interpretedAs: "Bech32 address",
    priority: 10,
    data: (
      <div>
        Prefix: {parsed.prefix}
        <br />
        Data: <Link to={"#" + toHex(parsed.data)}>{toHex(parsed.data)}</Link>
      </div>
    ),
  };
}

export function makeHexDisplay(input: string): StaticDisplay {
  const inputData = Encoding.fromHex(input);
  return {
    id: `${input}#hex-summary`,
    interpretedAs: "Hex data summary",
    priority: 20,
    data: (
      <div>
        Length: {inputData.length} bytes
        <br />
        <div className="pair">
          <div className="pair-key">Lower:&nbsp;</div>
          <div className="pair-value data">{input.toLowerCase()}</div>
        </div>
        <div className="pair">
          <div className="pair-key">Upper:&nbsp;</div>
          <div className="pair-value data">{input.toUpperCase()}</div>
        </div>
      </div>
    ),
  };
}

export function makeWeaveAddressDisplay(input: string): StaticDisplay {
  const inputData = Encoding.fromHex(input);
  const tiovAddress = Bech32.encode("tiov", inputData);
  const iovAddress = Bech32.encode("iov", inputData);
  return {
    id: `${input}#weave-address`,
    interpretedAs: "Weave address",
    priority: 10,
    data: (
      <div>
        IOV test: <Link to={"#" + tiovAddress}>{tiovAddress}</Link>
        <br />
        IOV main: <Link to={"#" + iovAddress}>{iovAddress}</Link>
      </div>
    ),
  };
}

export function makeEd25519PubkeyDisplay(input: string): StaticDisplay {
  const pubkey: PublicKeyBundle = {
    algo: Algorithm.Ed25519,
    data: Encoding.fromHex(input) as PublicKeyBytes,
  };

  const bnsAddress = bnsCodec.keyToAddress(pubkey);
  const liskAddress = liskCodec.keyToAddress(pubkey);
  const riseAddress = riseCodec.keyToAddress(pubkey);

  return {
    id: `${input}#weave-address`,
    interpretedAs: "Ed25519 public key",
    priority: 7,
    data: (
      <div>
        BNS: <Link to={"#" + bnsAddress}>{bnsAddress}</Link>
        <br />
        Lisk: <Link to={"#" + liskAddress}>{liskAddress}</Link>
        <br />
        Rise: <Link to={"#" + riseAddress}>{riseAddress}</Link>
        <br />
      </div>
    ),
  };
}

function makeAddressesDisplay(
  id: string,
  interpretedAs: string,
  addresses: ReadonlyArray<{
    readonly path: string;
    readonly pubkey: PublicKeyBundle;
    readonly address: Address;
  }>,
): StaticDisplay {
  const rows = addresses.map(a => (
    <div key={a.path}>
      <span className="mono">{a.path}</span>: <Link to={"#" + a.address}>{ellideMiddle(a.address, 21)}</Link>{" "}
      ({a.pubkey.algo}/<Link to={"#" + toHex(a.pubkey.data)}>{ellideMiddle(toHex(a.pubkey.data), 5)}</Link>)
    </div>
  ));

  return {
    id: id,
    interpretedAs: interpretedAs,
    priority: 8,
    data: <div>{rows}</div>,
  };
}

export async function makeSimpleAddressDisplay(input: string): Promise<StaticDisplay> {
  const wallet = Ed25519HdWallet.fromMnemonic(input);

  // tslint:disable-next-line:readonly-array
  const addresses: Array<{
    readonly path: string;
    readonly pubkey: PublicKeyBundle;
    readonly address: Address;
  }> = [];
  for (let index = 0; index < 5; ++index) {
    const path = HdPaths.simpleAddress(index);
    const pubkey = (await wallet.createIdentity(path)).pubkey;
    const address = bnsCodec.keyToAddress(pubkey);
    addresses.push({
      path: `4804438'/${index}'`,
      pubkey: pubkey,
      address: address,
    });
  }

  return makeAddressesDisplay(`${input}#hd-wallet-simple-address`, `Simple Address HD Wallet`, addresses);
}

export async function makeHdWalletDisplay(
  input: string,
  coinNumber: number,
  coinName: string,
  codec: TxCodec,
): Promise<StaticDisplay> {
  const wallet = Ed25519HdWallet.fromMnemonic(input);

  // tslint:disable-next-line:readonly-array
  const addresses: Array<{
    readonly path: string;
    readonly pubkey: PublicKeyBundle;
    readonly address: Address;
  }> = [];
  for (let a = 0; a < 5; ++a) {
    const path: ReadonlyArray<Slip10RawIndex> = [
      Slip10RawIndex.hardened(44),
      Slip10RawIndex.hardened(coinNumber),
      Slip10RawIndex.hardened(a),
    ];
    const pubkey = (await wallet.createIdentity(path)).pubkey;
    const address = codec.keyToAddress(pubkey);
    addresses.push({
      path: `44'/${coinNumber}'/${a}'`,
      pubkey: pubkey,
      address: address,
    });
  }

  return makeAddressesDisplay(`${input}#hd-wallet-coin${coinNumber}`, `${coinName} HD Wallet`, addresses);
}

export async function makeLiskLikePassphraseDisplay(input: string): Promise<StaticDisplay> {
  const pubkey: PublicKeyBundle = {
    algo: Algorithm.Ed25519,
    data: (await passphraseToKeypair(input)).pubkey as PublicKeyBytes,
  };

  const liskAddress = liskCodec.keyToAddress(pubkey);
  const riseAddress = riseCodec.keyToAddress(pubkey);

  return {
    id: `${input}#lisk-like-passphrase`,
    interpretedAs: "Lisk-like passphrase",
    priority: 7,
    data: (
      <div>
        Lisk: <Link to={"#" + liskAddress}>{liskAddress}</Link>
        <br />
        Rise: <Link to={"#" + riseAddress}>{riseAddress}</Link>
        <br />
      </div>
    ),
  };
}

export function makeBip39MnemonicDisplay(input: string): StaticDisplay {
  const mnemonic = new EnglishMnemonic(input);
  const entropy = Bip39.decode(mnemonic);

  let wordCount: number;
  switch (entropy.length * 8) {
    case 128:
      wordCount = 12;
      break;
    case 160:
      wordCount = 15;
      break;
    case 192:
      wordCount = 18;
      break;
    case 224:
      wordCount = 21;
      break;
    case 256:
      wordCount = 24;
      break;
    default:
      throw new Error("Unsupported entropy length");
  }

  return {
    id: `${input}#bip39-english-mnemonic`,
    interpretedAs: "Bip39 english mnemonic",
    priority: 11,
    data: (
      <div>
        Words: {wordCount}
        <br />
        ENT: {entropy.length * 8}
        <br />
        <div className="pair">
          <div className="pair-key">Entropy:&nbsp;</div>
          <div className="pair-value data">{toHex(entropy)}</div>
        </div>
      </div>
    ),
  };
}
