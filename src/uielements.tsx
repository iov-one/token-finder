import React from "react";
import { Link } from "react-router-dom";

import { Address } from "@iov/bcp-types";

export function ellideMiddle(str: string, maxOutLen: number): string {
  if (str.length <= maxOutLen) {
    return str;
  }
  const ellide = "…";
  const frontLen = Math.ceil((maxOutLen - ellide.length) / 2);
  const tailLen = Math.floor((maxOutLen - ellide.length) / 2);
  return str.slice(0, frontLen) + ellide + str.slice(-tailLen);
}

export function addressLink(address: Address): JSX.Element {
  return <Link to={"#" + address}>{ellideMiddle(address, 25)}</Link>;
}

export function printEllideMiddle(str: string, maxOutLen: number): JSX.Element {
  return <span title={str}>{ellideMiddle(str, maxOutLen)}</span>;
}
