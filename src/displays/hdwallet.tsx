import { Address, PubkeyBundle } from "@iov/bcp";
import { pathToString, Slip10RawIndex } from "@iov/crypto";
import { toHex } from "@iov/encoding";
import { Ed25519HdWallet, Secp256k1HdWallet } from "@iov/keycontrol";
import React from "react";
import { Link } from "react-router-dom";

import { HdCoin } from "../settings";
import { ellideMiddle } from "../uielements";
import { priorities, StaticDisplay } from ".";

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
    priority: priorities.hdAddresses,
    deprecated: deprecated,
    data: <div>{rows}</div>,
  };
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
      path: pathToString(path),
      pubkey: identity.pubkey,
      address: address,
    });
  }

  return makeHdAddressesDisplay(
    `${input}#hd-wallet-ed25519-coin${coinNumber}`,
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
      path: pathToString(path),
      pubkey: identity.pubkey,
      address: address,
    });
  }

  return makeHdAddressesDisplay(
    `${input}#hd-wallet-secp256k1-coin${coinNumber}`,
    `${coinName} HD Wallet`,
    addresses,
    16,
  );
}
