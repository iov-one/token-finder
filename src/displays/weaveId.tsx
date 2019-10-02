import { Encoding, Uint64 } from "@iov/encoding";
import React from "react";
import { Link } from "react-router-dom";

import { proirities, StaticDisplay } from ".";

const { toHex } = Encoding;

function makeWeaveIdDisplay(
  idSuffix: string,
  interpretedAs: string,
  priority: number,
  extension: string,
  type: string,
  input: string,
): StaticDisplay {
  const data = Uint64.fromString(input).toBytesBigEndian();
  const conditionString = `cond:${extension}/${type}/${toHex(data).toUpperCase()}`;
  return {
    id: `${input}#${idSuffix}`,
    interpretedAs: interpretedAs,
    priority: priority,
    data: (
      <div>
        Condition: <Link to={"#" + conditionString}>{conditionString}</Link>
      </div>
    ),
  };
}

export function makeWeaveEscrowId(input: string): StaticDisplay {
  return makeWeaveIdDisplay(
    "weave-escrow-id",
    "Weave escrow ID",
    proirities.weaveEscrowIdDisplay,
    "escrow",
    "seq",
    input,
  );
}

export function makeWeaveGovernanceRuleId(input: string): StaticDisplay {
  return makeWeaveIdDisplay(
    "weave-governance-rule-id",
    "Weave governance rule ID",
    proirities.weaveGovernanceRuleIdDisplay,
    "gov",
    "rule",
    input,
  );
}

export function makeWeaveMultisigId(input: string): StaticDisplay {
  return makeWeaveIdDisplay(
    "weave-multisig-id",
    "Weave multisignature ID",
    proirities.weaveMutltisigIdDisplay,
    "multisig",
    "usage",
    input,
  );
}
