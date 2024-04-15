import Link from "next/link";
import { Menu } from "lucide-react";

import { Button } from "~/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "~/components/ui/sheet";
import LoginLogoutButton from "./login-logout-button";
import UserButton from "./user-button";
import { ColorModeSwitch } from "./color-mode-switch";
import Image from "next/image";
import { usePathname } from "next/navigation";

export async function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isInApplicationRoute = pathname.includes("/app");
  const isInOnboardingRoute = pathname.includes("/app/onboarding");

  return isInOnboardingRoute ? (
    <main>{children}</main>
  ) : (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <Link href="/" passHref>
          <Image
            src="/cd.svg"
            width={40}
            height={40}
            alt="cascade logo"
            className=" hidden md:block"
          />
        </Link>
        <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
          {isInApplicationRoute ? (
            <>
              <Link
                href="/app/onboarding/user"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                Onboarding
              </Link>
              <Link
                href="/app/subscriptions"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                Subscriptions
              </Link>
              <Link
                href="/app/billing"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                Billing
              </Link>
              <Link
                href="/app/usage"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                Usage
              </Link>
              <Link
                href="/app/examples"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                Examples
              </Link>
              <Link
                href="/app/user-management"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                Management
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/blog"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                Blog
              </Link>
            </>
          )}
        </nav>
        <Sheet>
          <SheetTrigger asChild>
            {isInApplicationRoute ? (
              <Image
                src="/cd.svg"
                width={40}
                height={40}
                alt="cascade logo"
                className="shrink-0 md:hidden"
              />
            ) : (
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            )}
          </SheetTrigger>
          <SheetContent side="left">
            <nav className="grid gap-6 text-lg font-medium">
              {isInApplicationRoute ? (
                <>
                  <Link
                    href="/app/subscriptions"
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Subscriptions
                  </Link>
                  <Link
                    href="/app/billing"
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Billing
                  </Link>
                  <Link
                    href="/app/usage"
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Usage
                  </Link>
                  <Link
                    href="/app/user-management"
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Management
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/"
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Home
                  </Link>
                  <Link
                    href="/blog"
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Blog
                  </Link>
                </>
              )}
            </nav>
          </SheetContent>
        </Sheet>
        <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
          <div className="ml-auto">
            <ColorModeSwitch />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                <UserButton />
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Support</DropdownMenuItem>
              <LoginLogoutButton />
              <DropdownMenuSeparator />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        {children}
      </main>
    </div>
  );
}
