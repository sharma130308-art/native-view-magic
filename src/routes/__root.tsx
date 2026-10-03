import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import { RegisterServiceWorker } from "@/components/zyra/RegisterServiceWorker";
import { hideSplash } from "@/lib/splash";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { Toaster } from "@/components/ui/sonner";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "ZyraFit" },
      { name: "description", content: "Track your nutrition journey with ZyraFit." },
      { name: "author", content: "ZyraFit" },
      { property: "og:title", content: "ZyraFit" },
      { property: "og:description", content: "Track your nutrition journey with ZyraFit." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "theme-color", content: "#0a0e27" },
      { name: "mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-status-bar-style", content: "black-translucent" },
      { name: "apple-mobile-web-app-title", content: "ZyraFit" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", href: "/favicon.png", type: "image/png" },
      { rel: "manifest", href: "/manifest.webmanifest" },
      { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {/* Launch splash: plain HTML/CSS so it paints instantly, before any JavaScript. Only visible in the installed app. */}
        <style dangerouslySetInnerHTML={{ __html: SPLASH_CSS }} />
        <div id="app-splash" aria-hidden="true">
          <img src="/icon-192.png" alt="" width={156} height={156} />
        </div>
        <script dangerouslySetInnerHTML={{ __html: SPLASH_FAILSAFE }} />
        {children}
        <Scripts />
      </body>
    </html>
  );
}

const SPLASH_CSS = `
#app-splash{display:none}
@media (display-mode: standalone), (display-mode: fullscreen){
  #app-splash{display:flex;position:fixed;inset:0;z-index:2147483647;align-items:center;justify-content:center;
    background:#0a0e27;transition:opacity 220ms ease-out,visibility 0s linear 220ms}
  #app-splash img{width:156px;height:156px;clip-path:inset(19% round 15%);animation:zf-splash 900ms ease-in-out infinite alternate}
  html[data-app-ready] #app-splash{opacity:0;visibility:hidden;pointer-events:none}
}
@keyframes zf-splash{from{transform:scale(1)}to{transform:scale(1.06)}}
@media (prefers-reduced-motion: reduce){#app-splash img{animation:none}}
`;

// Never let the splash stay up if something goes wrong.
const SPLASH_FAILSAFE = "setTimeout(function(){document.documentElement.setAttribute('data-app-ready','')},4000)";

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  useEffect(() => {
    // The welcome screen hides the splash itself, after it has checked whether the person is signed in.
    if (window.location.pathname !== "/") hideSplash();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
      <Toaster position="top-center" />
      <RegisterServiceWorker />
    </QueryClientProvider>
  );
}
