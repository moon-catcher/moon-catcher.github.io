import type { NamedExoticComponent } from "react";

export type DPComponent<P> = NamedExoticComponent<P> & { defaultProps?: P };

export type IMemoCompoent<P> = NamedExoticComponent<P> & {
  Collapse: DPComponent<P>;
};
