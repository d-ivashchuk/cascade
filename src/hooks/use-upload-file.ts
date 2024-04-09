import * as React from "react";
import { type ClientUploadedFileData } from "uploadthing/types";
import { toast } from "sonner";
import type { UploadFilesOptions } from "uploadthing/types";
type UploadedFile<T = unknown> = ClientUploadedFileData<T>;

import { uploadFiles, getErrorMessage } from "~/lib/uploadthing";
import { type OurFileRouter } from "~/app/api/uploadthing/core";

interface UseUploadFileProps
  extends Pick<
    UploadFilesOptions<OurFileRouter, keyof OurFileRouter>,
    "headers" | "onUploadBegin" | "onUploadProgress" | "skipPolling"
  > {
  defaultUploadedFiles?: UploadedFile[];
}

export function useUploadFile(
  endpoint: keyof OurFileRouter,
  { defaultUploadedFiles = [], ...props }: UseUploadFileProps = {},
) {
  const [uploadedFiles, setUploadedFiles] =
    React.useState<UploadedFile[]>(defaultUploadedFiles);
  const [progresses, setProgresses] = React.useState<Record<string, number>>(
    {},
  );
  const [isUploading, setIsUploading] = React.useState(false);

  async function uploadThings(files: File[]) {
    setIsUploading(true);
    try {
      const res = await uploadFiles(endpoint, {
        ...props,
        files,
        onUploadProgress: ({ file, progress }) => {
          setProgresses((prev) => {
            return {
              ...prev,
              [file]: progress,
            };
          });
        },
      });

      setUploadedFiles((prev) => (prev ? [...prev, ...res] : res));
      return res;
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setProgresses({});
      setIsUploading(false);
    }
  }

  return {
    uploadedFiles,
    progresses,
    uploadFiles: uploadThings,
    isUploading,
  };
}
