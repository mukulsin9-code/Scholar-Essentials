import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accommodation } from "@workspace/api-client-react";
import { Link } from "wouter";
import { MapPinIcon, HomeIcon, UsersIcon, CheckCircle2Icon } from "lucide-react";

export function PgCard({ pg }: { pg: Accommodation }) {
  const getGenderPreferenceText = (pref?: string | null) => {
    switch (pref) {
      case "male": return "Boys Only";
      case "female": return "Girls Only";
      case "any": return "Anyone";
      default: return "Any Gender";
    }
  };

  return (
    <Link href={`/pgs/${pg.id}`} className="block h-full hover-elevate">
      <Card className="h-full flex flex-col overflow-hidden transition-all hover:shadow-md border-border/50 group">
        <div className="aspect-video w-full bg-muted relative overflow-hidden">
          {pg.imageUrl ? (
            <img
              src={pg.imageUrl}
              alt={pg.name}
              className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-primary/5 text-muted-foreground">
              <HomeIcon className="h-12 w-12 opacity-20 text-primary" />
            </div>
          )}
          <div className="absolute top-3 right-3 bg-background/95 backdrop-blur-sm px-3 py-1.5 rounded-lg font-bold text-foreground shadow-sm border border-border/50 flex flex-col items-center leading-tight">
            <span className="text-primary text-lg">${pg.monthlyRent}</span>
            <span className="text-[10px] text-muted-foreground uppercase font-semibold tracking-wider">/ month</span>
          </div>
        </div>
        <CardHeader className="p-4 pb-2">
          <CardTitle className="line-clamp-1 text-xl group-hover:text-primary transition-colors">
            {pg.name}
          </CardTitle>
          <div className="flex items-start gap-1.5 mt-2 text-sm text-muted-foreground">
            <MapPinIcon className="h-4 w-4 mt-0.5 flex-shrink-0 text-primary/70" />
            <span className="line-clamp-2 leading-tight">{pg.address}</span>
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-2 flex-grow">
          {pg.genderPreference && (
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="outline" className="bg-secondary/10 text-secondary-foreground border-secondary/20 font-medium">
                <UsersIcon className="h-3 w-3 mr-1" />
                {getGenderPreferenceText(pg.genderPreference)}
              </Badge>
            </div>
          )}
          
          {pg.amenities && pg.amenities.length > 0 && (
            <div className="mt-3 space-y-2">
              <p className="text-xs font-semibold text-foreground/70 uppercase tracking-wider">Amenities</p>
              <div className="flex flex-wrap gap-1.5">
                {pg.amenities.slice(0, 3).map((amenity, i) => (
                  <Badge key={i} variant="secondary" className="text-xs font-normal bg-muted">
                    {amenity}
                  </Badge>
                ))}
                {pg.amenities.length > 3 && (
                  <Badge variant="secondary" className="text-xs font-normal bg-muted/50">
                    +{pg.amenities.length - 3} more
                  </Badge>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
