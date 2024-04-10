"use client";

import * as React from "react";

import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { FileUploader } from "~/components/patterns/file-upload/file-uploader";
import { useUploadFile } from "~/hooks/use-upload-file";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "~/components/ui/form";
import { api } from "~/trpc/react";
import { useSession } from "next-auth/react";
import useGuardedSpendCredits from "~/hooks/use-guard-usage";

const schema = z.object({
  images: z.array(z.instanceof(File)),
});

type Schema = z.infer<typeof schema>;

export function UploadWithDialog({}) {
  const { update } = useSession();
  const [loading, setLoading] = React.useState(false);
  const updateUserMutation = api.user.updateUser.useMutation({
    onSuccess: async () => {
      await update();
    },
  });
  const { uploadFiles, progresses, isUploading } = useUploadFile(
    "imageUploader",
    { defaultUploadedFiles: [] },
  );
  const form = useForm<Schema>({
    resolver: zodResolver(schema),
    defaultValues: {
      images: [],
    },
  });

  const guardedUsage = useGuardedSpendCredits("fileUploads");

  async function onSubmit(input: Schema) {
    const result = await guardedUsage.guardAndSpendCredits(1);
    if (result?.hasRunOutOfCredits) {
      toast.error("You ran out of credits");
      setLoading(false);
      return;
    }
    setLoading(true);
    const toastId = toast.loading("Uploading files...");
    const res = await uploadFiles(input.images);
    toast.dismiss(toastId);

    if (res && res?.length > 0 && res[0]?.url) {
      toast.success("File uploaded successfully");
      updateUserMutation.mutate({
        image: res[0]?.url,
      });
      form.reset();
    }
    if (res?.length === 0) {
      toast.error("Something went wrong during upload");
    }

    setLoading(false);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button disabled={guardedUsage.hasRunOutOfCredits} variant="outline">
          {guardedUsage.hasRunOutOfCredits ? "Ran out of credits" : "Upload"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Upload image</DialogTitle>
          <DialogDescription>
            Drag and drop your image here or click browse filesystem.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex w-full flex-col gap-6"
          >
            <FormField
              control={form.control}
              name="images"
              render={({ field }) => (
                <div className="space-y-6">
                  <FormItem className="w-full">
                    <FormLabel>Images</FormLabel>
                    <FormControl>
                      <FileUploader
                        value={field.value}
                        onValueChange={field.onChange}
                        maxFiles={1}
                        maxSize={1 * 1024 * 1024}
                        progresses={progresses}
                        disabled={isUploading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </div>
              )}
            />
            <Button className="w-fit" disabled={loading}>
              Save
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
