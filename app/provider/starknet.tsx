"use client";

import CartridgeConnector from "@cartridge/connector";
import {
  Connector,
  StarknetProvider as StarknetProviderRaw,
} from "@starknet-react/core";
import { PropsWithChildren, useMemo } from "react";
import { RpcProvider } from "starknet";

export function StarknetProvider({ children }: PropsWithChildren) {
  const connectors = useMemo(() => [new CartridgeConnector()], []);
  const provider = useMemo(
    () =>
      new RpcProvider({
        nodeUrl:
          "https://starknet-goerli.g.alchemy.com/v2/FS0Fge2Rq1dlf2IsAIC_Ecy0UBp9uq51",
      }),
    []
  );

  return (
    <StarknetProviderRaw
      connectors={connectors as unknown as Connector[]}
      defaultProvider={provider}
    >
      {children}
    </StarknetProviderRaw>
  );
}
