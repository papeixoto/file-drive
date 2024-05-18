import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileIcon, StarIcon } from "lucide-react";

// export const metadata: Metadata = {
//   title: "Create Next App",
//   description: "Generated by create next app",
// };

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="container mx-auto pt-12">
      <div className="flex gap-8">
        <div className="w-40 flex flex-col gap-4">
          <Link href="/dashboard/files">
            <Button variant="link" className="flex gap-2">
              <FileIcon />
              All Files
            </Button>
          </Link>
          <Link href="/dashboard/favorites">
            <Button variant="link" className="flex gap-2">
              <StarIcon />
              Favorites
            </Button>
          </Link>
        </div>
        <div className="w-full">{children}</div>
      </div>
    </main>
  );
}
