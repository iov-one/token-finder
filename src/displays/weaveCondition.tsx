import { buildCondition, conditionToAddress } from "@iov/bns";
import { Encoding } from "@iov/encoding";
import React from "react";
import { Link } from "react-router-dom";

import { weaveConditionRegex } from "../interprete";
import { iovChainIds } from "../settings";
import { priorityWeaveConditionDisplay, StaticDisplay } from ".";

const { fromHex, toHex } = Encoding;

export function makeWeaveConditionDisplay(input: string): StaticDisplay {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const match = input.match(weaveConditionRegex)!;
  const [, extension, type, hexData] = match;
  const data = fromHex(hexData);

  const condition = buildCondition(extension, type, data);

  const tiovAddress = conditionToAddress(iovChainIds.testnet, condition);
  const iovAddress = conditionToAddress(iovChainIds.mainnet, condition);
  return {
    id: `${input}#weave-condition`,
    interpretedAs: "Weave condition",
    priority: priorityWeaveConditionDisplay,
    data: (
      <div>
        Extension: {extension}
        <br />
        Type: {type}
        <br />
        Data: <Link to={"#" + toHex(data)}>{toHex(data)}</Link>
        <br />
        IOV test: <Link to={"#" + tiovAddress}>{tiovAddress}</Link>
        <br />
        IOV main: <Link to={"#" + iovAddress}>{iovAddress}</Link>
      </div>
    ),
  };
}
