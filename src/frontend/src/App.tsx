import {
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { BookingPage } from "./pages/BookingPage";
import { CarRentalsPage } from "./pages/CarRentalsPage";
import { ConfirmationPage } from "./pages/ConfirmationPage";
import { RestaurantsPage } from "./pages/RestaurantsPage";
import { RoomDetailPage } from "./pages/RoomDetailPage";
import { RoomsPage } from "./pages/RoomsPage";
import { StaffDashboardPage } from "./pages/StaffDashboardPage";

const rootRoute = createRootRoute();

const roomsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: RoomsPage,
});

const roomDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/rooms/$roomId",
  component: RoomDetailPage,
});

const bookingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/book/$roomId",
  component: BookingPage,
});

const confirmationRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/confirmation/$reservationId",
  component: ConfirmationPage,
});

const staffRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/staff",
  component: StaffDashboardPage,
});

const restaurantsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/restaurants",
  component: RestaurantsPage,
});

const carRentalsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/car-rentals",
  component: CarRentalsPage,
});

const routeTree = rootRoute.addChildren([
  roomsRoute,
  roomDetailRoute,
  bookingRoute,
  confirmationRoute,
  staffRoute,
  restaurantsRoute,
  carRentalsRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
