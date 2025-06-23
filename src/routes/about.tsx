import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "./_root";

export const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/about",
  component: function About() {
    return <div>This is about page</div>;
  },
});
