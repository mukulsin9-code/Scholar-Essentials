import { useRoute } from "wouter";
import { useGetItem, getGetItemQueryKey } from "@workspace/api-client-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from "date-fns";
import { 
  ArrowLeft, 
  CalendarIcon, 
  MailIcon, 
  MessageSquareIcon, 
  TagIcon, 
  UserIcon,
  ShieldCheckIcon
} from "lucide-react";
import { Link } from "wouter";

export function ItemDetail() {
  const [, params] = useRoute("/essentials/:id");
  const id = params?.id ? parseInt(params.id) : 0;

  const { data: item, isLoading, isError } = useGetItem(id, {
    query: { 
      enabled: !!id, 
      queryKey: getGetItemQueryKey(id) 
    }
  });

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case "new": return "bg-green-100 text-green-800 border-green-200";
      case "like_new": return "bg-blue-100 text-blue-800 border-blue-200";
      case "good": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "fair": return "bg-orange-100 text-orange-800 border-orange-200";
      case "used": return "bg-slate-100 text-slate-800 border-slate-200";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const formatCondition = (condition: string) => {
    return condition.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase());
  };

  if (isLoading) {
    return (
      <div className="container max-w-screen-xl px-4 py-8 md:px-8">
        <Skeleton className="h-6 w-24 mb-8" />
        <div className="grid md:grid-cols-2 gap-10">
          <Skeleton className="aspect-square rounded-2xl w-full" />
          <div className="space-y-6">
            <div>
              <Skeleton className="h-10 w-3/4 mb-4" />
              <Skeleton className="h-8 w-32" />
            </div>
            <Skeleton className="h-32 w-full" />
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !item) {
    return (
      <div className="container px-4 py-24 text-center">
        <h2 className="text-2xl font-bold mb-4">Item not found</h2>
        <p className="text-muted-foreground mb-8">This item may have been sold or removed by the seller.</p>
        <Button asChild>
          <Link href="/essentials">Browse all items</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container max-w-screen-xl px-4 py-8 md:px-8">
      <Link href="/essentials" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary mb-8 transition-colors">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to essentials
      </Link>

      <div className="grid md:grid-cols-12 gap-10 lg:gap-16">
        <div className="md:col-span-6 lg:col-span-7">
          <div className="aspect-square sm:aspect-[4/3] md:aspect-square w-full bg-muted rounded-2xl border border-border/50 overflow-hidden relative shadow-sm">
            {item.imageUrl ? (
              <img
                src={item.imageUrl}
                alt={item.title}
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-secondary/5 text-muted-foreground">
                <TagIcon className="h-20 w-20 opacity-20 mb-4" />
                <p className="text-sm font-medium opacity-50">No image provided</p>
              </div>
            )}
            {item.category && (
              <div className="absolute top-4 left-4">
                <Badge className="bg-background/80 backdrop-blur text-foreground border-border shadow-sm">
                  {item.category}
                </Badge>
              </div>
            )}
          </div>
        </div>

        <div className="md:col-span-6 lg:col-span-5 flex flex-col">
          <div className="mb-6">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <Badge variant="outline" className={`font-semibold ${getConditionColor(item.condition)}`}>
                {formatCondition(item.condition)}
              </Badge>
              <div className="flex items-center text-sm text-muted-foreground">
                <CalendarIcon className="mr-1.5 h-3.5 w-3.5" />
                Posted {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
              </div>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-serif font-bold mb-4 leading-tight">{item.title}</h1>
            <p className="text-4xl font-bold text-primary mb-6">${item.price.toFixed(2)}</p>
            
            <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground mb-8 bg-muted/20 p-6 rounded-xl border border-border/40">
              <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-3">Description</h3>
              <p className="whitespace-pre-wrap">{item.description}</p>
            </div>
          </div>

          <div className="mt-auto space-y-6">
            <div className="bg-card rounded-xl border border-border p-5 shadow-sm">
              <h3 className="text-sm font-semibold uppercase tracking-wider mb-4 flex items-center">
                <UserIcon className="mr-2 h-4 w-4" /> 
                Seller Information
              </h3>
              <div className="flex items-center gap-4 mb-5">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xl font-bold">
                  {item.sellerName?.charAt(0) || "U"}
                </div>
                <div>
                  <p className="font-bold text-lg">{item.sellerName || "Anonymous Student"}</p>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <ShieldCheckIcon className="h-3.5 w-3.5 text-green-500" />
                    Verified Student
                  </p>
                </div>
              </div>
              
              {item.sellerEmail ? (
                <Button className="w-full h-12 text-base hover-elevate" size="lg" asChild>
                  <a href={`mailto:${item.sellerEmail}?subject=Interested in: ${item.title}`}>
                    <MailIcon className="mr-2 h-5 w-5" />
                    Contact Seller
                  </a>
                </Button>
              ) : (
                <Button className="w-full h-12 text-base hover-elevate" size="lg">
                  <MessageSquareIcon className="mr-2 h-5 w-5" />
                  Message on Platform
                </Button>
              )}
            </div>
            
            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground text-center">
              <ShieldCheckIcon className="h-4 w-4" />
              <span>Meet in a public campus area for exchanges.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
