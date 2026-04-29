import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Item } from "@workspace/api-client-react";
import { Link } from "wouter";
import { CalendarIcon, UserIcon, TagIcon } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export function ItemCard({ item }: { item: Item }) {
  const getConditionColor = (condition: string) => {
    switch (condition) {
      case "new":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800";
      case "like_new":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800";
      case "good":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800";
      case "fair":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400 border-orange-200 dark:border-orange-800";
      case "used":
        return "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-400 border-slate-200 dark:border-slate-700";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const formatCondition = (condition: string) => {
    return condition.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase());
  };

  return (
    <Link href={`/essentials/${item.id}`} className="block h-full hover-elevate">
      <Card className="h-full flex flex-col overflow-hidden transition-all hover:shadow-md border-border/50 group">
        <div className="aspect-[4/3] w-full bg-muted relative overflow-hidden">
          {item.imageUrl ? (
            <img
              src={item.imageUrl}
              alt={item.title}
              className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-secondary/10 text-muted-foreground pattern-cross opacity-80">
              <TagIcon className="h-12 w-12 opacity-20" />
            </div>
          )}
          <div className="absolute top-2 right-2">
            <Badge variant="outline" className={`font-semibold capitalize shadow-sm ${getConditionColor(item.condition)}`}>
              {formatCondition(item.condition)}
            </Badge>
          </div>
          <div className="absolute bottom-2 right-2 bg-background/90 backdrop-blur-sm px-2.5 py-1 rounded-md font-bold text-primary shadow-sm border border-border/50">
            ${item.price.toFixed(2)}
          </div>
        </div>
        <CardHeader className="p-4 pb-2">
          <CardTitle className="line-clamp-1 text-lg group-hover:text-primary transition-colors">
            {item.title}
          </CardTitle>
          <CardDescription className="line-clamp-2 text-sm mt-1 h-10">
            {item.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 pt-0 flex-grow">
          {item.category && (
            <Badge variant="secondary" className="mt-2 text-xs font-normal">
              {item.category}
            </Badge>
          )}
        </CardContent>
        <CardFooter className="p-4 pt-0 text-xs text-muted-foreground flex justify-between items-center border-t border-border/40 mt-auto bg-muted/10 h-12">
          <div className="flex items-center gap-1.5 truncate pr-2">
            <UserIcon className="h-3.5 w-3.5 flex-shrink-0" />
            <span className="truncate">{item.sellerName || "Anonymous"}</span>
          </div>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <CalendarIcon className="h-3.5 w-3.5" />
            <span>{formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}</span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
