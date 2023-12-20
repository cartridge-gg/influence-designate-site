"use client";

import { CartridgeUIProvider } from "@cartridge/ui";
import { PropsWithChildren } from "react";
import { StarknetProvider } from "./starknet";

export function Provider({ children }: PropsWithChildren) {
  return (
    <CartridgeUIProvider>
      <StarknetProvider>{children}</StarknetProvider>
    </CartridgeUIProvider>
  );
}
