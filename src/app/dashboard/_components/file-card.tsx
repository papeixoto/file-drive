import { ReactNode } from "react";
import { formatRelative } from "date-fns";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Doc, Id } from "../../../../convex/_generated/dataModel";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { FileTextIcon, GanttChartIcon, ImageIcon } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import Image from "next/image";
import { FileCardActions } from "./file-actions";

type Props = {
  file: Doc<"files"> & { isFavorite: boolean; url: string | null };
};

const typeIcons = {
  image: <ImageIcon />,
  pdf: <FileTextIcon />,
  csv: <GanttChartIcon />,
} as Record<Doc<"files">["type"], ReactNode>;

export function FileCard({ file }: Props) {
  const userProfile = useQuery(api.users.getUserProfile, {
    userId: file.userId,
  });

  return (
    <Card>
      <CardHeader className="relative">
        <CardTitle className="flex gap-2 text-base font-normal">
          {typeIcons[file.type]}
          {file.name}
        </CardTitle>

        <div className="absolute top-2 right-2">
          <FileCardActions file={file} isFavorite={file.isFavorite} />
        </div>
        {/* <CardDescription>Card Description</CardDescription> */}
      </CardHeader>
      <CardContent className="h-[200px] flex justify-center items-center">
        {file.type === "image" && file.url && (
          <Image alt={file.name} width="200" height="100" src={file.url} />
        )}
        {file.type === "csv" && <GanttChartIcon className="w-20 h-20" />}
        {file.type === "pdf" && <FileTextIcon className="w-20 h-20" />}
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <div className="flex gap-2 text-xs text-gray-700 w-40 items-center">
          <Avatar className="h-8 w-8 text-sx">
            <AvatarImage src={userProfile?.image} />
          </Avatar>
          {userProfile?.name}
        </div>
        <div className="text-xs text-gray-700">
          Uploaded {formatRelative(new Date(file._creationTime), new Date())}
        </div>
      </CardFooter>
    </Card>
  );
}
