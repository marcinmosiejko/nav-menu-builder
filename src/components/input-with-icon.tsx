import { Input, InputProps } from "./input";

import React from "react";
import { cn } from "@/lib/utils";

export const InputWithIcon: React.FC<
  InputProps & {
    Icon: React.FC;
  }
> = ({ Icon, ...props }) => {
  const { className: inputClassName, ...inputPropsRest } = props;

  return (
    <div className="relative">
      <Input
        className={cn("peer ps-9", inputClassName)}
        id={inputPropsRest.name}
        {...inputPropsRest}
      />
      <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
        <Icon />
      </div>
    </div>
  );
};
