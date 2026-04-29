import { useState } from "react";
import { 
  useListItems, 
  getListItemsQueryKey,
  ListItemsCondition 
} from "@workspace/api-client-react";
import { ItemCard } from "@/components/item-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SearchIcon, FilterIcon, Loader2, TagIcon } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";

export function Essentials() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [condition, setCondition] = useState<ListItemsCondition | "all">("all");

  const queryParams = {
    ...(debouncedSearch ? { q: debouncedSearch } : {}),
    ...(condition !== "all" ? { condition: condition as ListItemsCondition } : {})
  };

  const { data: items, isLoading } = useListItems(queryParams, {
    query: { queryKey: getListItemsQueryKey(queryParams) }
  });

  return (
    <div className="container max-w-screen-2xl px-4 py-8 md:px-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8 border-b border-border/40 pb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-serif font-bold mb-2">Campus Essentials</h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Textbooks, electronics, and dorm supplies sold by fellow students.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative w-full sm:w-64">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search items..." 
              className="pl-9 bg-background shadow-sm border-border/60 focus-visible:ring-primary/20"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select 
            value={condition} 
            onValueChange={(val) => setCondition(val as any)}
          >
            <SelectTrigger className="w-full sm:w-[160px] bg-background shadow-sm border-border/60">
              <div className="flex items-center gap-2">
                <FilterIcon className="h-4 w-4 text-muted-foreground" />
                <SelectValue placeholder="Condition" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Conditions</SelectItem>
              <SelectItem value={ListItemsCondition.new}>New</SelectItem>
              <SelectItem value={ListItemsCondition.like_new}>Like New</SelectItem>
              <SelectItem value={ListItemsCondition.good}>Good</SelectItem>
              <SelectItem value={ListItemsCondition.fair}>Fair</SelectItem>
              <SelectItem value={ListItemsCondition.used}>Used</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-24 text-muted-foreground">
          <Loader2 className="h-10 w-10 animate-spin mb-4 text-primary" />
          <p className="text-lg font-medium">Scouring the noticeboards...</p>
        </div>
      ) : items && items.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.map(item => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 text-center border-2 border-dashed border-border/50 rounded-2xl bg-muted/10">
          <div className="bg-primary/10 p-4 rounded-full mb-4">
            <TagIcon className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-xl font-bold mb-2">No items found</h3>
          <p className="text-muted-foreground max-w-md mb-6">
            We couldn't find any items matching your current filters. Try searching for something else or clearing the condition filter.
          </p>
          <Button 
            variant="outline" 
            onClick={() => { setSearch(""); setCondition("all"); }}
          >
            Clear filters
          </Button>
        </div>
      )}
    </div>
  );
}
