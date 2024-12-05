import { Input } from "./input";
import { Label } from "./label";
import React from "react";
import { cn } from "@/lib/utils";

export const InputWithLabel: React.FC<{
  label?: string;
  labelProps?: React.ComponentProps<typeof Label>;
  inputProps: React.ComponentProps<typeof Input>;
  Icon?: React.FC;
}> = ({ label, labelProps, inputProps, Icon }) => {
  const { className: inputClassName, ...inputPropsRest } = inputProps;
  const InputCmp = (
    <Input
      className={cn("peer", Icon && "ps-9", inputClassName)}
      id={inputProps.name}
      {...inputPropsRest}
    />
  );
  return (
    <div className="flex flex-col gap-2">
      {label ? (
        <Label htmlFor={inputProps.name} {...labelProps}>
          {label}
        </Label>
      ) : null}
      {Icon ? (
        <div className="relative">
          {InputCmp}
          <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80 peer-disabled:opacity-50">
            <Icon />
          </div>
        </div>
      ) : (
        InputCmp
      )}
    </div>
  );
};
