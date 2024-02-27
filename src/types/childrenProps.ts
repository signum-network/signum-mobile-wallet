import type { ReactNode } from "react";

export interface ChildrenProps<T = ReactNode> {
  children?: T;
}
