import type { NamedExoticComponent } from "react";

export type IMemoCompoent<P> = NamedExoticComponent<P> & {
  Collapse: NamedExoticComponent<P>;
};
