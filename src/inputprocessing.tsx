import {
  Display,
  makeBech32Display,
  makeBip39MnemonicDisplay,
  makeEd25519HdWalletDisplay,
  makeEd25519PrivkeyDisplay,
  makeEd25519PubkeyDisplay,
  makeEthereumAddressDisplay,
  makeHexDisplay,
  makeIovAccountDisplay,
  makeIovUsernameDisplay,
  makeLiskAccountDisplay,
  makeLiskLikePassphraseDisplay,
  makeRiseAccountDisplay,
  makeSecp256k1HdWalletDisplay,
  makeSecp256k1PubkeyDisplay,
  makeWeaveAddressDisplay,
  makeWeaveConditionDisplay,
  makeWeaveEscrowId,
  makeWeaveGovernanceRuleId,
  makeWeaveMultisigId,
} from "./displays";
import { InputProperties, interprete } from "./interprete";
import {
  accountBasedSlip10HdCoins,
  iovMainnet,
  iovTestnets,
  liskNetworks,
  riseNetworks,
  secp256k1Slip10HdCoins,
} from "./settings";

function compareByPriority(a: Display, b: Display): number {
  return a.priority - b.priority;
}

export async function processInput(input: string): Promise<readonly Display[]> {
  const normalizedInput = input.trim();

  const properties = interprete(normalizedInput);

  const out = new Array<Display>();

  if (properties.has(InputProperties.IovAddressTestnet)) {
    for (const network of iovTestnets) {
      out.push(makeIovAccountDisplay(normalizedInput, network));
    }
  }

  if (properties.has(InputProperties.IovAddressMainnet)) {
    out.push(makeIovAccountDisplay(normalizedInput, iovMainnet));
  }

  if (properties.has(InputProperties.BnsUsername)) {
    out.push(makeIovUsernameDisplay(normalizedInput, iovMainnet));
    for (const network of iovTestnets) {
      out.push(makeIovUsernameDisplay(normalizedInput, network));
    }
  }

  if (properties.has(InputProperties.EnglishMnemonic)) {
    out.push(makeBip39MnemonicDisplay(normalizedInput));

    for (const hdCoin of accountBasedSlip10HdCoins) {
      out.push(await makeEd25519HdWalletDisplay(normalizedInput, hdCoin));
    }
    for (const hdCoin of secp256k1Slip10HdCoins) {
      out.push(await makeSecp256k1HdWalletDisplay(normalizedInput, hdCoin));
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
    if (properties.has(InputProperties.ByteLength64)) {
      out.push(makeEd25519PrivkeyDisplay(normalizedInput));
    }
    if (properties.has(InputProperties.ByteLength65) && normalizedInput.startsWith("04")) {
      out.push(makeSecp256k1PubkeyDisplay(normalizedInput));
    }
    out.push(makeHexDisplay(normalizedInput));
  }

  if (properties.has(InputProperties.LiskAddress)) {
    for (const network of liskNetworks) {
      out.push(makeLiskAccountDisplay(normalizedInput, network));
    }
  }

  if (properties.has(InputProperties.RiseAddress)) {
    for (const network of riseNetworks) {
      out.push(makeRiseAccountDisplay(normalizedInput, network));
    }
  }

  if (properties.has(InputProperties.EthereumAddress)) {
    out.push(makeEthereumAddressDisplay(normalizedInput));
  }

  if (properties.has(InputProperties.WeaveCondition)) {
    out.push(makeWeaveConditionDisplay(normalizedInput));
  }

  if (properties.has(InputProperties.NonZeroUint64)) {
    out.push(makeWeaveEscrowId(normalizedInput));
    out.push(makeWeaveGovernanceRuleId(normalizedInput));
    out.push(makeWeaveMultisigId(normalizedInput));
  }

  out.sort(compareByPriority);

  return out;
}
