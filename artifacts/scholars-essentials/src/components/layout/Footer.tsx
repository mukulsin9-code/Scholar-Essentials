import { Link } from "wouter";
import { BookOpen, MapPin, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-muted/30">
      <div className="container max-w-screen-2xl px-4 py-8 md:py-12 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2 w-fit">
              <div className="bg-primary text-primary-foreground p-1 rounded-md transform -rotate-3">
                <BookOpen className="h-4 w-4" />
              </div>
              <span className="font-serif text-lg font-bold">
                Scholars Essentials
              </span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
              The digital noticeboard for your campus life. Find cheap textbooks, roomies, and local PGs without the hassle.
            </p>
            <div className="flex items-center text-sm text-muted-foreground pt-2">
              Built by students, for students.
            </div>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-sm font-semibold tracking-wide uppercase text-foreground">Explore</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/essentials" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Browse Essentials
                </Link>
              </li>
              <li>
                <Link href="/pgs" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Find Accommodations
                </Link>
              </li>
              <li>
                <Link href="/map" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Interactive Map
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-sm font-semibold tracking-wide uppercase text-foreground">Account</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Student Dashboard
                </Link>
              </li>
              <li>
                <Link href="/login" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Sign In
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 md:mt-12 pt-8 border-t border-border/40 text-center text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} Scholars Essentials. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
