"use client";

import { createContext, useContext } from "react";
import { setNamespace } from "./store";
import { LUX, type Biz } from "./types";

const Ctx = createContext<Biz>(LUX);

export function BizProvider({ biz, children }: { biz: Biz; children: React.ReactNode }) {
  setNamespace(biz.ns);
  return <Ctx.Provider value={biz}>{children}</Ctx.Provider>;
}

export const useBiz = () => useContext(Ctx);
