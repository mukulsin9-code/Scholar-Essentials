import { useState } from "react";
import { useListAccommodations, getListAccommodationsQueryKey } from "@workspace/api-client-react";
import { PgCard } from "@/components/pg-card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { SearchIcon, Loader2, HomeIcon, MapIcon } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";
import { Link } from "wouter";

export function Pgs() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [maxRent, setMaxRent] = useState<number[]>([1500]);
  const debouncedRent = useDebounce(maxRent[0], 500);

  const queryParams = {
    ...(debouncedSearch ? { q: debouncedSearch } : {}),
    ...(debouncedRent < 1500 ? { maxRent: debouncedRent } : {})
  };

  const { data: pgs, isLoading } = useListAccommodations(queryParams, {
    query: { queryKey: getListAccommodationsQueryKey(queryParams) }
  });

  return (
    <div className="container max-w-screen-2xl px-4 py-8 md:px-8">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mb-8 border-b border-border/40 pb-8">
        <div className="max-w-2xl">
          <h1 className="text-3xl md:text-4xl font-serif font-bold mb-2">Student Accommodations</h1>
          <p className="text-muted-foreground text-lg">
            Verified paying guest rooms and apartments near the campus.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
          <Button asChild variant="outline" className="w-full sm:w-auto shrink-0 bg-primary/5 border-primary/20 text-primary hover:bg-primary/10">
            <Link href="/map">
              <MapIcon className="mr-2 h-4 w-4" />
              View on Map
            </Link>
          </Button>
          
          <div className="w-full h-px sm:h-8 sm:w-px bg-border/60 mx-2"></div>
          
          <div className="relative w-full sm:w-64">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search locations..." 
              className="pl-9 bg-background shadow-sm border-border/60"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          <div className="w-full sm:w-48 space-y-3 bg-muted/30 p-3 rounded-lg border border-border/50">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-semibold uppercase tracking-wider">Max Rent</Label>
              <span className="text-xs font-bold text-primary">${maxRent[0]}{maxRent[0] === 1500 ? '+' : ''}</span>
            </div>
            <Slider
              defaultValue={[1500]}
              max={1500}
              min={100}
              step={50}
              value={maxRent}
              onValueChange={setMaxRent}
              className="w-full"
            />
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-24 text-muted-foreground">
          <Loader2 className="h-10 w-10 animate-spin mb-4 text-secondary" />
          <p className="text-lg font-medium">Finding the best rooms...</p>
        </div>
      ) : pgs && pgs.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {pgs.map(pg => (
            <PgCard key={pg.id} pg={pg} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 text-center border-2 border-dashed border-border/50 rounded-2xl bg-muted/10">
          <div className="bg-secondary/10 p-4 rounded-full mb-4">
            <HomeIcon className="h-8 w-8 text-secondary" />
          </div>
          <h3 className="text-xl font-bold mb-2">No accommodations found</h3>
          <p className="text-muted-foreground max-w-md mb-6">
            We couldn't find any rooms matching your search and budget. Try increasing your max rent or changing your search terms.
          </p>
          <Button 
            variant="outline" 
            onClick={() => { setSearch(""); setMaxRent([1500]); }}
          >
            Clear filters
          </Button>
        </div>
      )}
    </div>
  );
}
