import {
  Account,
  AccountQuery,
  Address,
  Algorithm,
  BlockchainConnection,
  ChainId,
  PubkeyBundle,
  PubkeyBytes,
} from "@iov/bcp";
import { bnsCodec, BnsConnection, BnsUsernameNft } from "@iov/bns";
import { Bip39, EnglishMnemonic, Slip10RawIndex } from "@iov/crypto";
import { Derivation } from "@iov/dpos";
import { Bech32, Encoding } from "@iov/encoding";
import { toChecksummedAddress } from "@iov/ethereum";
import { Ed25519HdWallet, HdPaths, Secp256k1HdWallet } from "@iov/keycontrol";
import { LiskConnection, passphraseToKeypair } from "@iov/lisk";
import { RiseConnection } from "@iov/rise";
import React from "react";
import { Link } from "react-router-dom";

import { printAmount, printPath } from "./bcphelpers";
import { InteractiveDisplay, StaticDisplay } from "./inputprocessing";
import { HdCoin, iovChainIds, NetworkSettings } from "./settings";
import { addressLink, ellideMiddle, printEllideMiddle } from "./uielements";

const { fromHex, toHex } = Encoding;

const priorityEd25519PubkeyDisplay = 7;
const priorityEd25519PivkeyDisplay = 7;
const priorityHdAddressesDisplay = 7;
const priorityLiskLikePassphraseDisplay = 8;
const priorityBnsAddressDisplay = 9;
const priorityLiskAddressDisplay = 10;
const priorityRiseAddressDisplay = 10;
const priorityBech32Display = 10;
const priorityWeaveAddressDisplay = 10;
const priorityEthereumAddressDisplay = 10;
const priorityBip39MnemonicDisplay = 11;
const priorityBnsUsernameDisplay = 15;
const priorityHexDisplay = 20;

const bcpConnections = new Map<string, Promise<BlockchainConnection>>();
const bnsConnections = new Map<string, Promise<BnsConnection>>();

function makeBnsAccountDisplay(
  id: string,
  priority: number,
  interpretedAs: string,
  query: AccountQuery,
  network: NetworkSettings,
  deprecated: boolean = false,
): InteractiveDisplay {
  return {
    id: id,
    priority: priority,
    deprecated: deprecated,
    interpretedAs: interpretedAs,
    getData: async () => {
      if (!bnsConnections.has(network.url)) {
        bnsConnections.set(network.url, BnsConnection.establish(network.url));
      }
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const connection = await bnsConnections.get(network.url)!;
      const response = await connection.getAccount(query);
      return response;
    },
    renderData: (response: Account | undefined) => {
      let data: JSX.Element;
      if (response) {
        const { address, pubkey, balance } = response;
        const hexPubkey = pubkey ? toHex(pubkey.data) : undefined;
        data = (
          <table>
            <tbody>
              <tr>
                <td>Address</td>
                <td>{addressLink(address)}</td>
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
  const interpretedAs = `Address on ${network.name}`;
  return makeBnsAccountDisplay(
    id,
    priorityBnsAddressDisplay,
    interpretedAs,
    { address: input as Address },
    network,
  );
}

export function makeLiskAddressDisplay(input: string, network: NetworkSettings): InteractiveDisplay {
  const id = `${input}#${network.name}-lisk-address`;
  const interpretedAs = `Address on ${network.name}`;
  return {
    id: id,
    priority: priorityLiskAddressDisplay,
    interpretedAs: interpretedAs,
    getData: async () => {
      if (!bcpConnections.has(network.url)) {
        bcpConnections.set(network.url, LiskConnection.establish(network.url));
      }
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const connection = await bcpConnections.get(network.url)!;
      const response = await connection.getAccount({ address: input as Address });
      return response;
    },
    renderData: (response: Account | undefined) => {
      let data: JSX.Element;
      if (response) {
        const { address, pubkey, balance } = response;
        const hexPubkey = pubkey ? toHex(pubkey.data) : undefined;
        data = (
          <table>
            <tr>
              <td>Address</td>
              <td>{addressLink(address)}</td>
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
      return {
        id: id,
        interpretedAs: interpretedAs,
        priority: priorityLiskAddressDisplay,
        data: data,
      };
    },
  };
}

export function makeRiseAddressDisplay(input: string, network: NetworkSettings): InteractiveDisplay {
  const id = `${input}#${network.name}-rise-address`;
  const interpretedAs = `Address on ${network.name}`;
  return {
    id: id,
    priority: priorityRiseAddressDisplay,
    interpretedAs: interpretedAs,
    getData: async () => {
      if (!bcpConnections.has(network.url)) {
        bcpConnections.set(network.url, RiseConnection.establish(network.url));
      }
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const connection = await bcpConnections.get(network.url)!;
      const response = await connection.getAccount({ address: input as Address });
      return response;
    },
    renderData: (response: Account | undefined) => {
      let data: JSX.Element;
      if (response) {
        const { address, pubkey, balance } = response;
        const hexPubkey = pubkey ? toHex(pubkey.data) : undefined;
        data = (
          <table>
            <tr>
              <td>Address</td>
              <td>{addressLink(address)}</td>
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
      return {
        id: id,
        priority: priorityRiseAddressDisplay,
        interpretedAs: interpretedAs,
        data: data,
      };
    },
  };
}

export function makeBnsUsernameDisplay(input: string, network: NetworkSettings): InteractiveDisplay {
  const displayId = `${input}#${network.name}-username`;
  const interpretedAs = `Username on ${network.name}`;
  return {
    id: displayId,
    priority: priorityBnsUsernameDisplay,
    interpretedAs: interpretedAs,
    getData: async () => {
      if (!bnsConnections.has(network.url)) {
        bnsConnections.set(network.url, BnsConnection.establish(network.url));
      }
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const connection = await bnsConnections.get(network.url)!;
      const response = await connection.getUsernames({ username: input });
      return response;
    },
    renderData: (response: readonly BnsUsernameNft[]) => {
      let data: JSX.Element;
      if (response.length > 0) {
        const { id, owner, targets } = response[0];
        const addressElements = targets.map(pair => (
          <span key={pair.chainId}>
            {printEllideMiddle(pair.chainId, 12)}: {addressLink(pair.address)}
            <br />
          </span>
        ));
        data = (
          <table>
            <tbody>
              <tr>
                <td>Name</td>
                <td>
                  <Link to={"#" + id}>{id}</Link>
                </td>
              </tr>
              <tr>
                <td>Owner</td>
                <td>
                  <Link to={"#" + owner}>{owner}</Link>
                </td>
              </tr>
              <tr>
                <td>Addresses</td>
                <td>{addressElements}</td>
              </tr>
            </tbody>
          </table>
        );
      } else {
        data = <span className="inactive">Username not found</span>;
      }
      return {
        id: displayId,
        interpretedAs: interpretedAs,
        priority: priorityBnsUsernameDisplay,
        data: data,
      };
    },
  };
}

export function makeBech32Display(input: string): StaticDisplay {
  const parsed = Bech32.decode(input);
  return {
    id: `${input}#bech32`,
    interpretedAs: "Bech32 address",
    priority: priorityBech32Display,
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
    priority: priorityHexDisplay,
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
    priority: priorityWeaveAddressDisplay,
    data: (
      <div>
        IOV test: <Link to={"#" + tiovAddress}>{tiovAddress}</Link>
        <br />
        IOV main: <Link to={"#" + iovAddress}>{iovAddress}</Link>
      </div>
    ),
  };
}

export function makeEthereumAddressDisplay(input: string): StaticDisplay {
  const lower = input.toLowerCase();
  const checksummed = toChecksummedAddress(input);
  return {
    id: `${input}#ethereum-address`,
    interpretedAs: "Ethereum address",
    priority: priorityEthereumAddressDisplay,
    data: (
      <div>
        <div className="pair">
          <div className="pair-key">Lower:&nbsp;</div>
          <div className="pair-value data">{lower}</div>
        </div>
        <div className="pair">
          <div className="pair-key">Checksummed:&nbsp;</div>
          <div className="pair-value data">{checksummed}</div>
        </div>
        <div>
          View on Etherscan:&nbsp;
          <a className="external" href={"https://ropsten.etherscan.io/address/" + checksummed}>
            Ropsten
          </a>
          &nbsp;
          <a className="external" href={"https://rinkeby.etherscan.io/address/" + checksummed}>
            Rinkeby
          </a>
          &nbsp;
          <a className="external" href={"https://etherscan.io/address/" + checksummed}>
            Mainnet
          </a>
        </div>
      </div>
    ),
  };
}

export function makeEd25519PubkeyDisplay(input: string): StaticDisplay {
  const ed25519PubkeyBytes = Encoding.fromHex(input) as PubkeyBytes;

  const iovTestAddress = bnsCodec.identityToAddress({
    chainId: iovChainIds.testnet,
    pubkey: { algo: Algorithm.Ed25519, data: ed25519PubkeyBytes },
  });
  const iovMainAddress = bnsCodec.identityToAddress({
    chainId: iovChainIds.mainnet,
    pubkey: { algo: Algorithm.Ed25519, data: ed25519PubkeyBytes },
  });
  const liskAddress = Derivation.pubkeyToAddress(ed25519PubkeyBytes, "L");
  const riseAddress = Derivation.pubkeyToAddress(ed25519PubkeyBytes, "R");

  return {
    id: `${input}#ed25519-pubkey`,
    interpretedAs: "Ed25519 public key",
    priority: priorityEd25519PubkeyDisplay,
    data: (
      <div>
        IOV main: <Link to={"#" + iovMainAddress}>{iovMainAddress}</Link>
        <br />
        IOV test: <Link to={"#" + iovTestAddress}>{iovTestAddress}</Link>
        <br />
        Lisk: <Link to={"#" + liskAddress}>{liskAddress}</Link>
        <br />
        Rise: <Link to={"#" + riseAddress}>{riseAddress}</Link>
        <br />
      </div>
    ),
  };
}

export function makeEd25519PrivkeyDisplay(input: string): StaticDisplay {
  const seed = fromHex(input).slice(0, 32);
  const pubkey = fromHex(input).slice(32, 64) as PubkeyBytes;

  return {
    id: `${input}#ed25519-privkey`,
    interpretedAs: "Ed25519 private key (libsodium format)",
    priority: priorityEd25519PivkeyDisplay,
    data: (
      <div>
        <div className="pair">
          <div className="pair-key">Seed:&nbsp;</div>
          <div className="pair-value data">{toHex(seed)}</div>
        </div>
        <div>
          Pubkey: <Link to={"#" + toHex(pubkey)}>{printEllideMiddle(toHex(pubkey), 40)}</Link>
        </div>
      </div>
    ),
  };
}

function makeHdAddressesDisplay(
  id: string,
  interpretedAs: string,
  addresses: readonly {
    readonly path: string;
    readonly pubkey: PubkeyBundle;
    readonly address: Address;
  }[],
  addressLength: number,
  deprecated?: boolean,
): StaticDisplay {
  const rows = addresses.map(a => (
    <div key={a.path}>
      <span className="mono">{a.path}</span>:{" "}
      <Link to={"#" + a.address}>{ellideMiddle(a.address, addressLength)}</Link> ({a.pubkey.algo}/
      <Link to={"#" + toHex(a.pubkey.data)}>{ellideMiddle(toHex(a.pubkey.data), 5)}</Link>)
    </div>
  ));

  return {
    id: id,
    interpretedAs: interpretedAs,
    priority: priorityHdAddressesDisplay,
    deprecated: deprecated,
    data: <div>{rows}</div>,
  };
}

export async function makeSimpleAddressDisplay(input: string): Promise<StaticDisplay> {
  const wallet = Ed25519HdWallet.fromMnemonic(input);

  // any testnet leads to "tiov" prefixes
  const chainId = "some-testnet" as ChainId;

  // tslint:disable-next-line:readonly-array
  const addresses: {
    readonly path: string;
    readonly pubkey: PubkeyBundle;
    readonly address: Address;
  }[] = [];
  for (let index = 0; index < 5; ++index) {
    const path = HdPaths.simpleAddress(index);
    const identity = await wallet.createIdentity(chainId, path);
    const address = bnsCodec.identityToAddress(identity);
    addresses.push({
      path: `4804438'/${index}'`,
      pubkey: identity.pubkey,
      address: address,
    });
  }

  return makeHdAddressesDisplay(
    `${input}#hd-wallet-simple-address`,
    `Simple Address HD Wallet`,
    addresses,
    21,
    true,
  );
}

export async function makeEd25519HdWalletDisplay(input: string, coin: HdCoin): Promise<StaticDisplay> {
  const { number: coinNumber, name: coinName, chainId, codec } = coin;

  const wallet = Ed25519HdWallet.fromMnemonic(input);

  // tslint:disable-next-line:readonly-array
  const addresses: {
    readonly path: string;
    readonly pubkey: PubkeyBundle;
    readonly address: Address;
  }[] = [];
  for (let a = 0; a < 5; ++a) {
    const path: readonly Slip10RawIndex[] = [
      Slip10RawIndex.hardened(44),
      Slip10RawIndex.hardened(coinNumber),
      Slip10RawIndex.hardened(a),
    ];
    const identity = await wallet.createIdentity(chainId, path);
    const address = codec.identityToAddress(identity);
    addresses.push({
      path: printPath(path),
      pubkey: identity.pubkey,
      address: address,
    });
  }

  return makeHdAddressesDisplay(
    `${input}#hd-wallet-coin${coinNumber}`,
    `${coinName} HD Wallet`,
    addresses,
    21,
  );
}

export async function makeSecp256k1HdWalletDisplay(input: string, coin: HdCoin): Promise<StaticDisplay> {
  const { number: coinNumber, name: coinName, chainId, codec } = coin;

  const wallet = Secp256k1HdWallet.fromMnemonic(input);

  // tslint:disable-next-line:readonly-array
  const addresses: {
    readonly path: string;
    readonly pubkey: PubkeyBundle;
    readonly address: Address;
  }[] = [];
  for (let a = 0; a < 5; ++a) {
    const path: readonly Slip10RawIndex[] = [
      Slip10RawIndex.hardened(44),
      Slip10RawIndex.hardened(coinNumber),
      Slip10RawIndex.hardened(0),
      Slip10RawIndex.normal(0),
      Slip10RawIndex.normal(a),
    ];
    const identity = await wallet.createIdentity(chainId, path);
    const address = codec.identityToAddress(identity);
    addresses.push({
      path: printPath(path),
      pubkey: identity.pubkey,
      address: address,
    });
  }

  return makeHdAddressesDisplay(
    `${input}#hd-wallet-coin${coinNumber}`,
    `${coinName} HD Wallet`,
    addresses,
    16,
  );
}

export async function makeLiskLikePassphraseDisplay(input: string): Promise<StaticDisplay> {
  const liskAddress = Derivation.pubkeyToAddress((await passphraseToKeypair(input)).pubkey, "L");
  const riseAddress = Derivation.pubkeyToAddress((await passphraseToKeypair(input)).pubkey, "R");

  return {
    id: `${input}#lisk-like-passphrase`,
    interpretedAs: "Lisk-like passphrase",
    priority: priorityLiskLikePassphraseDisplay,
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
    priority: priorityBip39MnemonicDisplay,
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
