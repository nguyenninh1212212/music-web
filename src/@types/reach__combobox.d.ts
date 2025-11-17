declare module "@reach/combobox" {
  import * as React from "react";
  export const Combobox: React.FC<{
    onSelect?: (value: string) => void;
    children: React.ReactNode;
  }>;
  export const ComboboxInput: React.FC<
    React.InputHTMLAttributes<HTMLInputElement>
  >;
  export const ComboboxPopover: React.FC<{ children: React.ReactNode }>;
  export const ComboboxOption: React.FC<{ value: string }>;
}
