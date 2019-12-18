export {
  makeBech32Display,
  makeBip39MnemonicDisplay,
  makeIovAccountDisplay,
  makeIovUsernameDisplay,
  makeEd25519HdWalletDisplay,
  makeEd25519PrivkeyDisplay,
  makeEd25519PubkeyDisplay,
  makeEthereumAddressDisplay,
  makeHexDisplay,
  makeLiskAccountDisplay,
  makeLiskLikePassphraseDisplay,
  makeSecp256k1HdWalletDisplay,
  makeSecp256k1PubkeyDisplay,
} from "./rest";
export { makeWeaveConditionDisplay } from "./weaveCondition";
export { makeWeaveAddressDisplay } from "./weaveAddress";
export { makeWeaveEscrowId, makeWeaveGovernanceRuleId, makeWeaveMultisigId } from "./weaveId";

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

export const priorities = {
  ed25519Pubkey: 7,
  secp256k1Pubkey: 7,
  ed25519Pivkey: 7,
  hdAddresses: 7,
  liskLikePassphrase: 8,
  bnsAddress: 9,
  liskAddress: 10,
  bech32: 10,
  weaveAddress: 10,
  weaveCondition: 10,
  weaveEscrowId: 10,
  weaveGovernanceRuleId: 10,
  weaveMutltisigId: 10,
  ethereumAddress: 10,
  bip39Mnemonic: 11,
  bnsUsername: 15,
  hex: 20,
};
