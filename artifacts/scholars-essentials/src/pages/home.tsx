import { Link } from "wouter";
import { 
  useGetDashboardSummary, 
  useGetRecentActivity,
  getGetDashboardSummaryQueryKey,
  getGetRecentActivityQueryKey
} from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Home as HomeIcon, MapPin, TagIcon, ClockIcon } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export function Home() {
  const { data: summary, isLoading: isLoadingSummary } = useGetDashboardSummary({
    query: { queryKey: getGetDashboardSummaryQueryKey() }
  });
  
  const { data: recentActivity, isLoading: isLoadingActivity } = useGetRecentActivity({
    query: { queryKey: getGetRecentActivityQueryKey() }
  });

  return (
    <div className="w-full flex flex-col">
      {/* Hero Section */}
      <section className="relative w-full py-16 md:py-24 lg:py-32 overflow-hidden bg-muted/30">
        <div className="container px-4 md:px-8 max-w-screen-2xl relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            <div className="flex flex-col justify-center space-y-8 max-w-2xl">
              <div className="space-y-4">
                <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                  <span className="flex h-2 w-2 rounded-full bg-primary mr-2"></span>
                  The campus noticeboard, digitized.
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold tracking-tight text-foreground leading-[1.1]">
                  Everything you need for <span className="text-primary italic">college life</span>, in one place.
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-[600px]">
                  Buy and sell textbooks, find the perfect PG accommodation near campus, and connect with fellow scholars. No middleman, no hassle.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="h-12 px-8 text-base shadow-md hover-elevate">
                  <Link href="/essentials">
                    Browse Essentials
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="h-12 px-8 text-base bg-background/50 backdrop-blur hover:bg-background shadow-sm hover-elevate">
                  <Link href="/pgs">
                    Find Accommodations
                  </Link>
                </Button>
              </div>
              
              {!isLoadingSummary && summary && (
                <div className="grid grid-cols-3 gap-4 pt-6 border-t border-border/40">
                  <div>
                    <p className="text-3xl font-bold text-foreground">{summary.totalItems}</p>
                    <p className="text-sm font-medium text-muted-foreground mt-1">Items for Sale</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-foreground">{summary.totalAccommodations}</p>
                    <p className="text-sm font-medium text-muted-foreground mt-1">Local PGs</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-foreground">{summary.totalUsers}</p>
                    <p className="text-sm font-medium text-muted-foreground mt-1">Active Students</p>
                  </div>
                </div>
              )}
            </div>
            
            <div className="relative mx-auto w-full max-w-[500px] lg:max-w-none aspect-square lg:aspect-[4/3] rounded-2xl overflow-hidden border-8 border-background shadow-2xl rotate-2 hover:rotate-0 transition-all duration-500">
              <img 
                src="/hero-noticeboard.png" 
                alt="College noticeboard with pinned notes" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?q=80&w=1000&auto=format&fit=crop";
                }}
              />
              <div className="absolute inset-0 ring-1 ring-inset ring-black/10 rounded-xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container px-4 md:px-8 max-w-screen-2xl">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-serif font-bold mb-4">How it works</h2>
            <p className="text-muted-foreground text-lg">We've built tools specifically designed for student needs.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="group relative overflow-hidden rounded-2xl bg-muted/40 border border-border/50 p-8 transition-all hover:bg-muted/80 hover:shadow-md hover:-translate-y-1">
              <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                <BookOpen className="h-6 w-6" />
              </div>
              <h3 className="mb-3 text-xl font-bold">Student Marketplace</h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Sell your old textbooks, lab coats, and dorm essentials. Buy what you need for the new semester at student-friendly prices.
              </p>
              <Link href="/essentials" className="inline-flex items-center text-sm font-semibold text-primary group-hover:underline">
                Explore items <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
            
            <div className="group relative overflow-hidden rounded-2xl bg-muted/40 border border-border/50 p-8 transition-all hover:bg-muted/80 hover:shadow-md hover:-translate-y-1">
              <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-secondary/10 text-secondary group-hover:scale-110 transition-transform">
                <HomeIcon className="h-6 w-6" />
              </div>
              <h3 className="mb-3 text-xl font-bold">PG Listings</h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Find verified paying guest accommodations near campus. Filter by rent, amenities, and gender preferences to find your perfect spot.
              </p>
              <Link href="/pgs" className="inline-flex items-center text-sm font-semibold text-secondary group-hover:underline">
                Find a room <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
            
            <div className="group relative overflow-hidden rounded-2xl bg-muted/40 border border-border/50 p-8 transition-all hover:bg-muted/80 hover:shadow-md hover:-translate-y-1">
              <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-accent/20 text-accent-foreground group-hover:scale-110 transition-transform">
                <MapPin className="h-6 w-6" />
              </div>
              <h3 className="mb-3 text-xl font-bold">Interactive Map</h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Visualize all available accommodations on a map. See exactly how far you'll be walking to your 8 AM classes.
              </p>
              <Link href="/map" className="inline-flex items-center text-sm font-semibold text-accent-foreground group-hover:underline">
                Open map <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Activity Section */}
      {!isLoadingActivity && recentActivity && recentActivity.length > 0 && (
        <section className="py-16 md:py-24 bg-muted/20 border-t border-border/40">
          <div className="container px-4 md:px-8 max-w-screen-2xl">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
              <div>
                <h2 className="text-3xl font-serif font-bold mb-2">Fresh on the Board</h2>
                <p className="text-muted-foreground">The latest postings from your campus community.</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {recentActivity.slice(0, 4).map((activity) => (
                <Link 
                  key={activity.id} 
                  href={activity.kind === 'item' ? `/essentials/${activity.id.split('-')[1]}` : `/pgs/${activity.id.split('-')[1]}`}
                  className="flex flex-col bg-background rounded-xl p-4 border border-border/50 hover:border-primary/50 hover:shadow-sm transition-all group"
                >
                  <div className="flex items-start gap-4 mb-3">
                    <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center flex-shrink-0 overflow-hidden">
                      {activity.imageUrl ? (
                        <img src={activity.imageUrl} alt="" className="h-full w-full object-cover" />
                      ) : (
                        activity.kind === 'item' ? <TagIcon className="h-5 w-5 text-muted-foreground" /> : <HomeIcon className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-muted-foreground mb-1 flex items-center gap-1.5 uppercase tracking-wider">
                        {activity.kind === 'item' ? <TagIcon className="h-3 w-3" /> : <HomeIcon className="h-3 w-3" />}
                        {activity.kind}
                      </p>
                      <h4 className="font-bold text-foreground line-clamp-1 group-hover:text-primary transition-colors">{activity.title}</h4>
                    </div>
                  </div>
                  <div className="mt-auto flex items-center justify-between text-xs text-muted-foreground pt-3 border-t border-border/40">
                    <span className="font-medium text-foreground">{activity.subtitle}</span>
                    <span className="flex items-center gap-1">
                      <ClockIcon className="h-3 w-3" />
                      {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
