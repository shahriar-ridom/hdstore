"use client";

import { createDownloadLink } from "@/app/actions/download";
import { Button } from "./ui/button";
import { useTransition } from "react";
import { toast } from "sonner";

export function DownloadButton({ orderId }: { orderId: string }) {
  const [isPending, startTransition] = useTransition();

  const handleDownload = () => {
    startTransition(async () => {
      try {
        const result = await createDownloadLink(orderId);
        if (result && result.error) {
          toast.error(result.error);
        }
      } catch (error) {
        if (
          !(error instanceof Error) ||
          !error.message.includes("NEXT_REDIRECT")
        ) {
          console.error(error);
        }
      }
    });
  };

  return (
    <Button
      onClick={handleDownload}
      disabled={isPending}
      variant="outline"
      size="sm"
    >
      {isPending ? "Generating..." : "Download Asset"}
    </Button>
  );
}
