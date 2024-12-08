import { type Directive } from "vue";

export type PluginOptions = {
    componentName: string;
};

export type TooltipValue =
    | {
          text: string;
          hotkey?:
              | string
              | {
                    [key: string]: string;
                };
          delay?: number;
          offset?: [number, number];
          quadrant?: "top-left" | "top-right" | "bot-left" | "bot-right";
      }
    | string;

export const Tooltip: Directive<HTMLElement, TooltipValue> = (
    el,
    { value }
) => {
    if (!value) return;
    // Just add the data as dataobject
    el.dataset.__TOOLTIP__ = JSON.stringify(value);
};

export const tt = (tooltip: TooltipValue) => {
    return tooltip;
};
