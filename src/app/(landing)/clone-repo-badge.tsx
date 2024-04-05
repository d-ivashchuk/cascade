"use client";
import React from "react";
import { toast } from "sonner";
import { useCopyToClipboard } from "usehooks-ts";
import { Badge } from "~/components/ui/badge";

const CloneRepoBadge = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, copy] = useCopyToClipboard();
  const cloneText = "git clone https://github.com/d-ivashchuk/cascade.git";
  return (
    <div className="hidden md:block">
      <Badge
        className="mx-auto mt-4 cursor-pointer px-4 py-2"
        style={{
          width: "fit-content",
        }}
        onClick={async () => {
          await copy(cloneText);
          toast.success("Copied to clipboard");
        }}
      >
        <pre>{cloneText}</pre>
      </Badge>
    </div>
  );
};

export default CloneRepoBadge;
