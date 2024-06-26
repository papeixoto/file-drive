import { useState } from "react";
import { Doc } from "../../../../convex/_generated/dataModel";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  FileIcon,
  MoreVertical,
  StarIcon,
  TrashIcon,
  UndoIcon,
} from "lucide-react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useToast } from "@/components/ui/use-toast";
import { Protect } from "@clerk/nextjs";
import clsx from "clsx";

type Props = {
  file: Doc<"files"> & { url: string | null };
  isFavorite: boolean;
};

export function FileCardActions({ file, isFavorite }: Props) {
  const { toast } = useToast();
  const deleteFile = useMutation(api.files.deleteFile);
  const restoreFile = useMutation(api.files.restoreFile);
  const toggleFavorite = useMutation(api.files.toggleFavorite);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const me = useQuery(api.users.getMe);

  return (
    <>
      <AlertDialog
        open={isConfirmDeleteOpen}
        onOpenChange={setIsConfirmDeleteOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will mark the file for our deletion process. Files are
              deleted periodically.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                await deleteFile({
                  fileId: file._id,
                });
                toast({
                  title: "File marked for deletion",
                  description: "Your file will be deleted soon.",
                });
              }}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <MoreVertical />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            className="flex gap-1 items-center cursor-pointer"
            onClick={() => {
              if (!file.url) return;
              window.open(file.url, "_blank");
            }}
          >
            <FileIcon className="w-4 h-4" />
            Download
          </DropdownMenuItem>
          <DropdownMenuItem
            className="flex gap-1 items-center cursor-pointer"
            onClick={() => toggleFavorite({ fileId: file._id })}
          >
            <StarIcon
              className="w-4 h-4"
              fill={isFavorite ? "currentColor" : "transparent"}
            />
            {isFavorite ? "Unfavorite" : "Favorite"}
          </DropdownMenuItem>
          <Protect
            condition={(check) => {
              return (
                check({
                  role: "org:admin",
                }) || file.userId === me?._id
              );
            }}
          >
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className={clsx("flex gap-1   items-center cursor-pointer", {
                "text-green-600": file.shouldDelete,
                "text-red-600": !file.shouldDelete,
              })}
              onClick={() => {
                if (file.shouldDelete) {
                  restoreFile({ fileId: file._id });
                } else {
                  setIsConfirmDeleteOpen(true);
                }
              }}
            >
              {file.shouldDelete ? (
                <>
                  <UndoIcon className="w-4 h-4" /> Restore
                </>
              ) : (
                <>
                  <TrashIcon className="w-4 h-4" /> Delete
                </>
              )}
            </DropdownMenuItem>
          </Protect>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
