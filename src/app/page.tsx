"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useOrganization, useUser } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "convex/react";
import { useForm } from "react-hook-form";
import { api } from "../../convex/_generated/api";

import { z } from "zod";
import { useState } from "react";

const formSchema = z.object({
  title: z.string().min(1).max(200),
  file: z
    .custom<FileList>((val) => val instanceof FileList, "Required")
    .refine((files) => files.length > 0, "Required"),
});

export default function Home() {
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const organization = useOrganization();
  const user = useUser();

  const [isFileDialogOpen, setIsFileDialogOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      file: undefined,
    },
  });
  const fileRef = form.register("file");

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!orgId) return;

    // Step 1: Get a short-lived upload URL
    const postUrl = await generateUploadUrl();

    const result = await fetch(postUrl, {
      method: "POST",
      headers: { "Content-Type": values.file[0].type },
      body: values.file[0],
    });

    const { storageId } = await result.json();
    await createFile({ name: values.title, fileId: storageId, orgId });

    form.reset();

    setIsFileDialogOpen(false);
  };

  let orgId: string | undefined;
  if (organization.isLoaded && user.isLoaded) {
    orgId = organization.organization?.id ?? user.user?.id;
  }

  const files = useQuery(api.files.getFiles, orgId ? { orgId } : "skip");
  const createFile = useMutation(api.files.createFile);

  return (
    <main className="container mx-auto pt-12">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold">Your Files</h1>

        <Dialog open={isFileDialogOpen} onOpenChange={setIsFileDialogOpen}>
          <DialogTrigger asChild>
            <Button>Upload File</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="mb-8">Upload your file here</DialogTitle>
              <DialogDescription>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-8"
                  >
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="file"
                      render={() => (
                        <FormItem>
                          <FormLabel>File</FormLabel>
                          <FormControl>
                            <Input type="file" {...fileRef} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit">Submit</Button>
                  </form>
                </Form>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
      <div className=""></div>
      {files?.map((file) => {
        return <div key={file._id}>{file.name}</div>;
      })}
    </main>
  );
}
