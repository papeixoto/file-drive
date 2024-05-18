import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Search } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

const formSchema = z.object({
  query: z.string().min(0).max(200),
});

type Props = {
  query: string;
  setQuery: Dispatch<SetStateAction<string>>;
};

export function SearchBar({ query, setQuery }: Props) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      query,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log("onsugmit", values.query);
    setQuery(values.query);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex gap-2 items-center"
      >
        <FormField
          control={form.control}
          name="query"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input {...field} placeholder="Your file names" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button size="sm" type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          <Search />
          Search
        </Button>
      </form>
    </Form>
  );
}
