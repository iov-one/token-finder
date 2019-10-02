export {
  makeBech32Display,
  makeBip39MnemonicDisplay,
  makeBnsAccountDisplay,
  makeBnsUsernameDisplay,
  makeEd25519HdWalletDisplay,
  makeEd25519PrivkeyDisplay,
  makeEd25519PubkeyDisplay,
  makeEthereumAddressDisplay,
  makeHexDisplay,
  makeLiskAccountDisplay,
  makeLiskLikePassphraseDisplay,
  makeRiseAccountDisplay,
  makeSecp256k1HdWalletDisplay,
  makeSecp256k1PubkeyDisplay,
} from "./rest";
export { makeWeaveConditionDisplay } from "./weaveCondition";
export { makeWeaveAddressDisplay } from "./weaveAddress";

export interface StaticDisplay {
  readonly id: string;
  readonly priority: number;
  readonly deprecated?: boolean;
  readonly interpretedAs: string;
  readonly data: JSX.Element;
}

export interface InteractiveDisplay {
  readonly id: string;
  readonly priority: number;
  readonly deprecated?: boolean;
  readonly interpretedAs: string;
  readonly getData: () => Promise<any>;
  readonly renderData: (data: any) => StaticDisplay;
}

export type Display = StaticDisplay | InteractiveDisplay;

export function isInteractiveDisplay(display: Display): display is InteractiveDisplay {
  return (
    typeof (display as InteractiveDisplay).getData === "function" &&
    typeof (display as InteractiveDisplay).renderData === "function"
  );
}

export const proirities = {
  ed25519PubkeyDisplay: 7,
  secp256k1PubkeyDisplay: 7,
  ed25519PivkeyDisplay: 7,
  hdAddressesDisplay: 7,
  liskLikePassphraseDisplay: 8,
  bnsAddressDisplay: 9,
  liskAddressDisplay: 10,
  riseAddressDisplay: 10,
  bech32Display: 10,
  weaveAddressDisplay: 10,
  weaveConditionDisplay: 10,
  ethereumAddressDisplay: 10,
  bip39MnemonicDisplay: 11,
  bnsUsernameDisplay: 15,
  hexDisplay: 20,
};
