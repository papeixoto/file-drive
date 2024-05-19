"use client";

import { useOrganization, useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";

import UploadButton from "./upload-button";
import { FileCard } from "./file-card";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import { SearchBar } from "./search-bar";
import { useState } from "react";
import { DataTable } from "./file-table";
import { columns } from "./columns";

function Placeholder() {
  return (
    <div className="flex flex-col gap-8 w-full items-center mt-24">
      <Image
        alt="image of folder and files"
        width={300}
        height={300}
        src="/empty.svg"
      />
      <div className="text-2xl">
        You have no files, go ahead and upload one now
      </div>
      <UploadButton />
    </div>
  );
}

type Props = {
  title: string;
  favoritesOnly?: boolean;
  deletedOnly?: boolean;
};

export default function FileBrowser({
  title,
  favoritesOnly,
  deletedOnly,
}: Props) {
  const organization = useOrganization();
  const user = useUser();
  const [query, setQuery] = useState("");

  let orgId: string | undefined;
  if (organization.isLoaded && user.isLoaded) {
    orgId = organization.organization?.id ?? user.user?.id;
  }

  const files = useQuery(
    api.files.getFiles,
    orgId ? { orgId, query, favorites: favoritesOnly, deletedOnly } : "skip"
  );
  const isLoading = files === undefined;

  const favorites = useQuery(
    api.files.getAllFavorites,
    orgId ? { orgId } : "skip"
  );

  const modifiedFiles =
    files?.map((file) => {
      return {
        ...file,
        isFavorite: (favorites ?? [])?.some(
          (favorite) => favorite.fileId === file._id
        ),
      };
    }) ?? [];

  return (
    <div>
      {isLoading && (
        <div className="flex flex-col gap-8 w-full items-center mt-24 text-gray-500">
          <Loader2 className="h-32 w-32 animate-spin" />
          <div>Loading your files...</div>
        </div>
      )}

      {!isLoading && (
        <>
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold">{title}</h1>
            <SearchBar query={query} setQuery={setQuery} />

            <UploadButton />
          </div>

          {files.length === 0 && <Placeholder />}

          <DataTable columns={columns} data={modifiedFiles} />

          <div className="grid grid-cols-3 gap-4">
            {modifiedFiles?.map((file) => {
              return <FileCard key={file._id} file={file} />;
            })}
          </div>
        </>
      )}
    </div>
  );
}
