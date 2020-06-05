import { Bech32, toHex } from "@iov/encoding";
import React from "react";
import { Link } from "react-router-dom";

import { priorities, StaticDisplay } from ".";

export function makeBech32Display(input: string): StaticDisplay {
  const parsed = Bech32.decode(input);
  return {
    id: `${input}#bech32`,
    interpretedAs: "Bech32 address",
    priority: priorities.bech32,
    data: (
      <div>
        Prefix: {parsed.prefix}
        <br />
        Data: <Link to={"#" + toHex(parsed.data)}>{toHex(parsed.data)}</Link>
      </div>
    ),
  };
}
