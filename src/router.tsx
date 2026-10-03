import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export const getRouter = () => {
  const queryClient = new QueryClient();

  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
    // Start loading a screen as soon as the finger touches a link, so taps feel instant.
    defaultPreload: "intent",
    defaultPreloadDelay: 0,
    defaultViewTransition: true,
  });

  return router;
};
