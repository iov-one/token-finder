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
  makeWeaveAddressDisplay,
} from "./rest";
export { makeWeaveConditionDisplay } from "./weaveCondition";

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

export const priorityWeaveConditionDisplay = 10;
