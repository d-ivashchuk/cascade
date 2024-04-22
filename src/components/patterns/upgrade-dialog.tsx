import React from "react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import Link from "next/link";

export function UpgradeDialog({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Upgrade Your Plan</DialogTitle>
          <DialogDescription>
            You reached your limit! Upgrade your plan to get more credits and
            features.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <p>Upgrade to enjoy unlimited features and credits.</p>
        </div>
        <DialogFooter>
          <Button onClick={() => setOpen(false)}>Cancel</Button>

          <Link href="/app/subscriptions">
            <Button>Upgrade Now</Button>
          </Link>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
