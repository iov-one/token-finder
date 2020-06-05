import { Bech32, fromHex } from "@iov/encoding";
import React from "react";
import { Link } from "react-router-dom";

import { priorities, StaticDisplay } from ".";

export function makeWeaveAddressDisplay(input: string): StaticDisplay {
  const inputData = fromHex(input);
  const tiovAddress = Bech32.encode("tiov", inputData);
  const iovAddress = Bech32.encode("iov", inputData);
  return {
    id: `${input}#weave-address`,
    interpretedAs: "Weave address",
    priority: priorities.weaveAddress,
    data: (
      <div>
        IOV test: <Link to={"#" + tiovAddress}>{tiovAddress}</Link>
        <br />
        IOV main: <Link to={"#" + iovAddress}>{iovAddress}</Link>
      </div>
    ),
  };
}
