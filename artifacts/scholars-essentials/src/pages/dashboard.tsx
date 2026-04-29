import { useAuth } from "@workspace/replit-auth-web";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { 
  useGetProfile, 
  useUpdateProfile, 
  useListMyItems,
  useListMyAccommodations,
  useGetDashboardSummary,
  useGetConditionBreakdown,
  useGetRentStats,
  getGetProfileQueryKey,
  getListMyItemsQueryKey,
  getListMyAccommodationsQueryKey,
  getGetDashboardSummaryQueryKey,
  getGetConditionBreakdownQueryKey,
  getGetRentStatsQueryKey
} from "@workspace/api-client-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { UserIcon, MapPinIcon, LayoutDashboardIcon, TagIcon, HomeIcon, Loader2, NavigationIcon } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { useQueryClient } from "@tanstack/react-query";

export function Dashboard() {
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      setLocation("/login");
    }
  }, [isAuthLoading, isAuthenticated, setLocation]);

  if (isAuthLoading || !isAuthenticated) {
    return <div className="p-12 text-center text-muted-foreground">Checking authentication...</div>;
  }

  return <DashboardContent />;
}

function DashboardContent() {
  const { data: profile, isLoading: isProfileLoading } = useGetProfile({
    query: { queryKey: getGetProfileQueryKey() }
  });

  return (
    <div className="container max-w-screen-xl px-4 py-8 md:px-8">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-serif font-bold mb-2">My Dashboard</h1>
        <p className="text-muted-foreground text-lg">Manage your listings and profile settings.</p>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="w-full md:w-auto flex overflow-x-auto justify-start mb-8 bg-muted/50 p-1">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <LayoutDashboardIcon className="h-4 w-4" /> <span className="hidden sm:inline">Overview</span>
          </TabsTrigger>
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <UserIcon className="h-4 w-4" /> <span className="hidden sm:inline">Profile</span>
          </TabsTrigger>
          <TabsTrigger value="items" className="flex items-center gap-2">
            <TagIcon className="h-4 w-4" /> <span className="hidden sm:inline">My Items</span>
          </TabsTrigger>
          <TabsTrigger value="accommodations" className="flex items-center gap-2">
            <HomeIcon className="h-4 w-4" /> <span className="hidden sm:inline">My PGs</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <OverviewTab />
        </TabsContent>
        
        <TabsContent value="profile">
          {isProfileLoading ? <Skeleton className="h-[400px] w-full rounded-xl" /> : 
            <ProfileTab profile={profile!} />
          }
        </TabsContent>

        <TabsContent value="items">
          <MyItemsTab />
        </TabsContent>
        
        <TabsContent value="accommodations">
          <MyPgsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function OverviewTab() {
  const { data: summary, isLoading: isSummaryLoading } = useGetDashboardSummary({ query: { queryKey: getGetDashboardSummaryQueryKey() } });
  const { data: conditions, isLoading: isConditionsLoading } = useGetConditionBreakdown({ query: { queryKey: getGetConditionBreakdownQueryKey() } });
  const { data: rentStats, isLoading: isRentLoading } = useGetRentStats({ query: { queryKey: getGetRentStatsQueryKey() } });

  if (isSummaryLoading || isConditionsLoading || isRentLoading) {
    return <Skeleton className="h-[500px] w-full rounded-xl" />;
  }

  const chartColors = ['#e76f51', '#2a9d8f', '#e9c46a', '#f4a261', '#264653'];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Total Listings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{summary?.totalItems}</div>
          </CardContent>
        </Card>
        <Card className="bg-secondary/5 border-secondary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Total PGs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-secondary">{summary?.totalAccommodations}</div>
          </CardContent>
        </Card>
        <Card className="bg-accent/10 border-accent/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Avg Item Price</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-accent-foreground">${summary?.averageItemPrice.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card className="bg-green-500/5 border-green-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Avg Rent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-700 dark:text-green-400">${summary?.averageMonthlyRent.toFixed(0)}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-sm border-border/50">
          <CardHeader>
            <CardTitle className="font-serif">Item Conditions</CardTitle>
            <CardDescription>Breakdown of items currently for sale</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={conditions || []} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="condition" 
                  tickFormatter={(val) => val.replace('_', ' ')}
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis 
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip 
                  cursor={{ fill: 'hsl(var(--muted)/0.5)' }}
                  contentStyle={{ borderRadius: '8px', border: '1px solid hsl(var(--border))' }}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {conditions?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-border/50">
          <CardHeader>
            <CardTitle className="font-serif">Rent Market Stats</CardTitle>
            <CardDescription>Current local accommodation pricing</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col justify-center h-[300px]">
            {rentStats && rentStats.count > 0 ? (
              <div className="space-y-8 max-w-md mx-auto w-full">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-muted-foreground">Lowest Rent</span>
                    <span className="font-bold text-foreground">${rentStats.min}/mo</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-3">
                    <div className="bg-green-500 h-3 rounded-full" style={{ width: '20%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-muted-foreground">Average Rent</span>
                    <span className="font-bold text-primary">${Math.round(rentStats.avg)}/mo</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-3">
                    <div className="bg-primary h-3 rounded-full" style={{ width: '50%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-muted-foreground">Highest Rent</span>
                    <span className="font-bold text-destructive">${rentStats.max}/mo</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-3">
                    <div className="bg-destructive h-3 rounded-full" style={{ width: '100%' }}></div>
                  </div>
                </div>
                <div className="pt-4 text-center">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Based on {rentStats.count} active listings</p>
                </div>
              </div>
            ) : (
              <div className="text-center text-muted-foreground">No rent data available yet.</div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function ProfileTab({ profile }: { profile: any }) {
  const [city, setCity] = useState(profile?.city || "");
  const [userType, setUserType] = useState(profile?.userType || "student");
  const [lat, setLat] = useState(profile?.latitude?.toString() || "");
  const [lng, setLng] = useState(profile?.longitude?.toString() || "");
  const [isLocating, setIsLocating] = useState(false);
  const queryClient = useQueryClient();

  const updateProfile = useUpdateProfile();

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile.mutate({
      data: {
        city: city || null,
        userType: userType as "student" | "owner",
        latitude: lat ? parseFloat(lat) : null,
        longitude: lng ? parseFloat(lng) : null,
      }
    }, {
      onSuccess: () => {
        toast.success("Profile updated successfully");
        queryClient.invalidateQueries({ queryKey: getGetProfileQueryKey() });
      },
      onError: () => toast.error("Failed to update profile")
    });
  };

  const getLocation = () => {
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLat(pos.coords.latitude.toFixed(6));
        setLng(pos.coords.longitude.toFixed(6));
        setIsLocating(false);
        toast.success("Location acquired");
      },
      (err) => {
        setIsLocating(false);
        toast.error("Could not get location. Please allow access.");
      }
    );
  };

  return (
    <Card className="max-w-2xl shadow-sm border-border/50">
      <CardHeader>
        <CardTitle className="font-serif">Profile Settings</CardTitle>
        <CardDescription>Update your personal information and location preferences.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSave} className="space-y-6">
          <div className="space-y-3">
            <Label>I am primarily a...</Label>
            <RadioGroup value={userType} onValueChange={setUserType} className="flex flex-col sm:flex-row gap-4">
              <div className="flex items-center space-x-2 border border-border/60 p-4 rounded-xl flex-1 bg-muted/10">
                <RadioGroupItem value="student" id="r1" />
                <Label htmlFor="r1" className="cursor-pointer font-medium">Student (Buyer/Renter)</Label>
              </div>
              <div className="flex items-center space-x-2 border border-border/60 p-4 rounded-xl flex-1 bg-muted/10">
                <RadioGroupItem value="owner" id="r2" />
                <Label htmlFor="r2" className="cursor-pointer font-medium">Property Owner / Seller</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-3">
            <Label htmlFor="city">Campus City</Label>
            <Input id="city" value={city} onChange={(e) => setCity(e.target.value)} placeholder="e.g. Bangalore, Boston, etc." />
          </div>

          <div className="space-y-3 border border-border/40 p-4 rounded-xl bg-muted/20">
            <div className="flex items-center justify-between">
              <Label>Default Location (for map)</Label>
              <Button type="button" variant="outline" size="sm" onClick={getLocation} disabled={isLocating} className="h-8">
                {isLocating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <NavigationIcon className="h-4 w-4 mr-2 text-primary" />}
                Use Browser Location
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="lat" className="text-xs text-muted-foreground">Latitude</Label>
                <Input id="lat" value={lat} onChange={(e) => setLat(e.target.value)} placeholder="12.9716" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lng" className="text-xs text-muted-foreground">Longitude</Label>
                <Input id="lng" value={lng} onChange={(e) => setLng(e.target.value)} placeholder="77.5946" />
              </div>
            </div>
          </div>

          <Button type="submit" disabled={updateProfile.isPending} className="w-full hover-elevate">
            {updateProfile.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Save Profile
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

function MyItemsTab() {
  const { data: items, isLoading } = useListMyItems({ query: { queryKey: getListMyItemsQueryKey() } });

  if (isLoading) return <Skeleton className="h-[400px] w-full rounded-xl" />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-muted/20 p-4 rounded-xl border border-border/50">
        <div>
          <h2 className="text-lg font-bold">Manage Items</h2>
          <p className="text-sm text-muted-foreground">You have {items?.length || 0} active listings.</p>
        </div>
        <Button className="hover-elevate">List New Item</Button>
      </div>

      {items && items.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map(item => (
            <Card key={item.id} className="flex flex-col">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-base line-clamp-1">{item.title}</CardTitle>
                  <span className="font-bold text-primary text-sm">${item.price}</span>
                </div>
              </CardHeader>
              <CardContent className="flex-1 pb-4">
                <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
              </CardContent>
              <div className="p-4 border-t border-border/40 flex justify-end gap-2 bg-muted/10 mt-auto rounded-b-xl">
                <Button variant="outline" size="sm">Edit</Button>
                <Button variant="destructive" size="sm">Delete</Button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border-2 border-dashed border-border/50 rounded-2xl">
          <TagIcon className="h-10 w-10 text-muted-foreground mx-auto mb-3 opacity-20" />
          <p className="text-muted-foreground mb-4">You haven't listed any items for sale yet.</p>
          <Button variant="outline">Create your first listing</Button>
        </div>
      )}
    </div>
  );
}

function MyPgsTab() {
  const { data: pgs, isLoading } = useListMyAccommodations({ query: { queryKey: getListMyAccommodationsQueryKey() } });

  if (isLoading) return <Skeleton className="h-[400px] w-full rounded-xl" />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-muted/20 p-4 rounded-xl border border-border/50">
        <div>
          <h2 className="text-lg font-bold">Manage PGs</h2>
          <p className="text-sm text-muted-foreground">You have {pgs?.length || 0} accommodation listings.</p>
        </div>
        <Button className="hover-elevate bg-secondary text-secondary-foreground hover:bg-secondary/90">Add Accommodation</Button>
      </div>

      {pgs && pgs.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {pgs.map(pg => (
            <Card key={pg.id} className="flex flex-col sm:flex-row overflow-hidden">
              <div className="w-full sm:w-1/3 bg-muted aspect-video sm:aspect-auto">
                {pg.imageUrl ? (
                  <img src={pg.imageUrl} alt={pg.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center"><HomeIcon className="h-8 w-8 opacity-20" /></div>
                )}
              </div>
              <div className="flex-1 flex flex-col p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold line-clamp-1">{pg.name}</h3>
                  <span className="font-bold text-secondary text-sm">${pg.monthlyRent}/mo</span>
                </div>
                <p className="text-xs text-muted-foreground mb-4 line-clamp-1 flex items-center"><MapPinIcon className="h-3 w-3 mr-1" />{pg.address}</p>
                <div className="mt-auto flex justify-end gap-2 pt-2 border-t border-border/40">
                  <Button variant="outline" size="sm">Edit</Button>
                  <Button variant="destructive" size="sm">Delete</Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border-2 border-dashed border-border/50 rounded-2xl">
          <HomeIcon className="h-10 w-10 text-muted-foreground mx-auto mb-3 opacity-20" />
          <p className="text-muted-foreground mb-4">You haven't listed any accommodations yet.</p>
          <Button variant="outline">List a property</Button>
        </div>
      )}
    </div>
  );
}
