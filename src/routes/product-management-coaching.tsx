import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/product-management-coaching")({
  beforeLoad: () => {
    throw redirect({ to: "/product-management-mentoring", replace: true });
  },
});
