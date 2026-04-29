import { useRoute } from "wouter";
import { useGetAccommodation, getGetAccommodationQueryKey } from "@workspace/api-client-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from "date-fns";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { 
  ArrowLeft, 
  CalendarIcon, 
  MapPinIcon, 
  MailIcon,
  HomeIcon,
  UsersIcon,
  CheckCircleIcon
} from "lucide-react";
import { Link } from "wouter";

export function PgDetail() {
  const [, params] = useRoute("/pgs/:id");
  const id = params?.id ? parseInt(params.id) : 0;

  const { data: pg, isLoading, isError } = useGetAccommodation(id, {
    query: { 
      enabled: !!id, 
      queryKey: getGetAccommodationQueryKey(id) 
    }
  });

  const getGenderPreferenceText = (pref?: string | null) => {
    switch (pref) {
      case "male": return "Boys Only";
      case "female": return "Girls Only";
      case "any": return "Anyone";
      default: return "Any Gender";
    }
  };

  if (isLoading) {
    return (
      <div className="container max-w-screen-xl px-4 py-8 md:px-8">
        <Skeleton className="h-6 w-24 mb-8" />
        <div className="grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="aspect-video rounded-2xl w-full" />
            <Skeleton className="h-10 w-3/4 mb-4" />
            <Skeleton className="h-6 w-1/2" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-48 w-full rounded-xl" />
            <Skeleton className="h-64 w-full rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !pg) {
    return (
      <div className="container px-4 py-24 text-center">
        <h2 className="text-2xl font-bold mb-4">Accommodation not found</h2>
        <p className="text-muted-foreground mb-8">This listing may have been removed.</p>
        <Button asChild variant="secondary">
          <Link href="/pgs">Browse all accommodations</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container max-w-screen-xl px-4 py-8 md:px-8">
      <Link href="/pgs" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-secondary mb-8 transition-colors">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to accommodations
      </Link>

      <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
        <div className="lg:col-span-2 space-y-8">
          {/* Header */}
          <div>
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
              <Badge variant="outline" className="bg-secondary/10 text-secondary-foreground border-secondary/20 font-medium px-3 py-1 text-sm">
                <UsersIcon className="h-4 w-4 mr-2" />
                {getGenderPreferenceText(pg.genderPreference)}
              </Badge>
              <div className="flex items-center text-sm text-muted-foreground">
                <CalendarIcon className="mr-1.5 h-4 w-4" />
                Listed {formatDistanceToNow(new Date(pg.createdAt), { addSuffix: true })}
              </div>
            </div>
            
            <h1 className="text-3xl md:text-5xl font-serif font-bold mb-4 leading-tight">{pg.name}</h1>
            <div className="flex items-start text-muted-foreground text-lg">
              <MapPinIcon className="mr-2 h-5 w-5 mt-1 flex-shrink-0 text-secondary" />
              <p>{pg.address}</p>
            </div>
          </div>

          {/* Image Gallery (Just one main image for now) */}
          <div className="aspect-video w-full bg-muted rounded-2xl border border-border/50 overflow-hidden relative shadow-sm">
            {pg.imageUrl ? (
              <img
                src={pg.imageUrl}
                alt={pg.name}
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-secondary/5 text-muted-foreground">
                <HomeIcon className="h-24 w-24 opacity-20 mb-4" />
                <p className="text-lg font-medium opacity-50">No photos available</p>
              </div>
            )}
          </div>

          {/* Description */}
          {pg.description && (
            <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none text-foreground bg-muted/20 p-6 md:p-8 rounded-2xl border border-border/40">
              <h3 className="text-sm font-semibold uppercase tracking-wider mb-4 text-muted-foreground">About this place</h3>
              <p className="whitespace-pre-wrap leading-relaxed">{pg.description}</p>
            </div>
          )}

          {/* Amenities */}
          {pg.amenities && pg.amenities.length > 0 && (
            <div>
              <h3 className="text-xl font-bold mb-6 font-serif">Amenities</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-6">
                {pg.amenities.map((amenity, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="bg-secondary/10 rounded-full p-1 text-secondary">
                      <CheckCircleIcon className="h-4 w-4" />
                    </div>
                    <span className="font-medium">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-card rounded-2xl border border-border p-6 shadow-sm sticky top-24">
            <div className="mb-6 pb-6 border-b border-border/40">
              <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-1">Monthly Rent</p>
              <div className="flex items-end gap-2">
                <span className="text-5xl font-bold text-primary">${pg.monthlyRent}</span>
                <span className="text-muted-foreground mb-2">/mo</span>
              </div>
            </div>
            
            <div className="mb-8">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Owner</h3>
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-secondary/10 flex items-center justify-center text-secondary text-xl font-bold">
                  {pg.ownerName?.charAt(0) || "O"}
                </div>
                <div>
                  <p className="font-bold text-lg">{pg.ownerName || "Property Owner"}</p>
                </div>
              </div>
            </div>

            {pg.ownerEmail && (
              <Button className="w-full h-14 text-base hover-elevate mb-4 bg-secondary text-secondary-foreground hover:bg-secondary/90" size="lg" asChild>
                <a href={`mailto:${pg.ownerEmail}?subject=Inquiry regarding accommodation: ${pg.name}`}>
                  <MailIcon className="mr-2 h-5 w-5" />
                  Contact Owner
                </a>
              </Button>
            )}
            
            {/* Embedded Map */}
            <div className="mt-8 rounded-xl overflow-hidden border border-border/50 h-[250px] z-0 relative">
              <MapContainer 
                center={[pg.latitude, pg.longitude]} 
                zoom={15} 
                style={{ height: '100%', width: '100%' }}
                scrollWheelZoom={false}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[pg.latitude, pg.longitude]}>
                  <Popup>
                    <strong>{pg.name}</strong><br/>
                    {pg.address}
                  </Popup>
                </Marker>
              </MapContainer>
            </div>
            <div className="mt-3 text-center">
              <Button variant="link" asChild className="text-sm text-secondary">
                <Link href="/map">View on larger map &rarr;</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
