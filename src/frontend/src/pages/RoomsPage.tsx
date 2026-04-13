import { Building2, ChevronDown, ChevronUp } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { BrandName } from "../components/BrandName";
import { DateRangePicker } from "../components/DateRangePicker";
import { ErrorMessage } from "../components/ErrorMessage";
import { GuestCountInput } from "../components/GuestCountInput";
import { Layout } from "../components/Layout";
import { RoomCard } from "../components/RoomCard";
import { Skeleton } from "../components/ui/skeleton";
import { useRooms } from "../hooks/useRooms";
import type { Room } from "../types";

interface Hotel {
  name: string;
  address: string;
  telephone: string;
  email: string;
}

const LUXEMBOURG_HOTELS: Hotel[] = [
  {
    name: "Hotel Le Royal Luxembourg",
    address: "12 Boulevard Royal, L-2449 Luxembourg City",
    telephone: "+352 24 16 16-1",
    email: "reservations@leroyalluxembourg.com",
  },
  {
    name: "Sofitel Luxembourg Le Grand Ducal",
    address: "40 Boulevard d'Avranches, L-1160 Luxembourg City",
    telephone: "+352 24 87 71",
    email: "H5555@sofitel.com",
  },
  {
    name: "Sofitel Luxembourg Europe",
    address:
      "4 Rue du Fort Niedergrünewald, Plateau de Kirchberg, L-2226 Luxembourg City",
    telephone: "+352 43 77 61",
    email: "H1314@sofitel.com",
  },
  {
    name: "Hotel Le Place d'Armes",
    address: "18 Place d'Armes, L-1136 Luxembourg City",
    telephone: "+352 27 47 37",
    email: "info@hotelleplacendarmes.com",
  },
  {
    name: "Luxembourg Marriott Hotel Alfa",
    address: "16 Place de la Gare, L-1616 Luxembourg City",
    telephone: "+352 28 25 31",
    email: "info@marriottluxembourg.lu",
  },
  {
    name: "DoubleTree by Hilton Luxembourg",
    address: "12 Rue Jean Engling, L-1466 Luxembourg City",
    telephone: "+352 43 78 1",
    email: "hilton.luxembourg@hilton.com",
  },
  {
    name: "Meliá Luxembourg",
    address: "1 Park Drai Eechelen, L-1499 Clausen, Luxembourg City",
    telephone: "+352 27 33 41",
    email: "melia.luxembourg@melia.com",
  },
  {
    name: "INNSiDE by Meliá Luxembourg",
    address: "12 Rue Henri M. Schnadt, L-2530 Gasperich, Luxembourg City",
    telephone: "+352 26 29 11",
    email: "innside.luxembourg@melia.com",
  },
  {
    name: "Parc Hotel Alvisse",
    address: "120 Route d'Echternach, L-1453 Luxembourg City",
    telephone: "+352 43 56 43",
    email: "info@alvisse.com",
  },
  {
    name: "Grand Hotel Cravat",
    address: "29 Boulevard Roosevelt, L-2450 Luxembourg City",
    telephone: "+352 22 19 75",
    email: "info@hotelcravat.lu",
  },
  {
    name: "Novotel Luxembourg Centre",
    address: "35 Rue du Laboratoire, L-1911 Luxembourg City",
    telephone: "+352 40 19 91",
    email: "h3289@accor.com",
  },
  {
    name: "Novotel Luxembourg Kirchberg",
    address:
      "6 Rue Fort Niedergrünewald, Quartier Européen Nord, L-2015 Luxembourg City",
    telephone: "+352 42 98 48 1",
    email: "h1616@accor.com",
  },
  {
    name: "Novotel Suites Luxembourg",
    address:
      "13 Avenue John F. Kennedy, Quartier Européen, L-1855 Luxembourg City",
    telephone: "+352 26 20 91",
    email: "h5380@accor.com",
  },
  {
    name: "Mercure Luxembourg Off Kirchberg",
    address: "271 Rue de Neudorf, L-2221 Luxembourg City",
    telephone: "+352 26 48 48",
    email: "h1623@accor.com",
  },
  {
    name: "Park Inn by Radisson Luxembourg City",
    address: "45-47 Avenue de la Gare, L-1611 Luxembourg City",
    telephone: "+352 27 85 51",
    email: "info.luxembourg@parkinn.com",
  },
  {
    name: "Mama Shelter Luxembourg",
    address: "2 Rue du Fort Niedergrünewald, L-2226 Luxembourg City",
    telephone: "+352 20 60 60",
    email: "luxembourg@mamashelter.com",
  },
  {
    name: "Ibis Styles Luxembourg Centre Gare",
    address: "30 Rue Joseph Junck, L-1839 Luxembourg City",
    telephone: "+352 40 84 01",
    email: "h7196@accor.com",
  },
  {
    name: "Ibis Luxembourg Airport",
    address: "Route de Trèves, L-2632 Findel, Luxembourg City",
    telephone: "+352 43 88 01",
    email: "h1565@accor.com",
  },
  {
    name: "Ibis Budget Luxembourg Aéroport",
    address: "Route de Trèves, L-2632 Findel, Luxembourg City",
    telephone: "+352 26 53 19 10",
    email: "h8882@accor.com",
  },
  {
    name: "Hotel Parc Belair",
    address: "111 Avenue du Dix Septembre, L-2551 Luxembourg City",
    telephone: "+352 44 23 23",
    email: "info@hotelbelair.lu",
  },
  {
    name: "Hotel Parc Belle-Vue",
    address: "5 Avenue Marie-Thérèse, L-2132 Luxembourg City",
    telephone: "+352 45 83 28",
    email: "info@hotel-parcbellevue.lu",
  },
  {
    name: "Hotel Parc Plaza",
    address: "5 Avenue Marie-Thérèse, L-2132 Luxembourg City",
    telephone: "+352 22 11 12",
    email: "info@parcplaza.lu",
  },
  {
    name: "Hotel Vauban",
    address: "10 Place Guillaume II, L-1648 Luxembourg City",
    telephone: "+352 26 20 82",
    email: "info@hotelvauban.lu",
  },
  {
    name: "Hotel Français",
    address: "14 Place d'Armes, L-1136 Luxembourg City",
    telephone: "+352 47 45 34",
    email: "info@hotelfrancais.lu",
  },
  {
    name: "Hotel Empire",
    address: "34 Place de la Gare, L-1616 Luxembourg City",
    telephone: "+352 48 82 52",
    email: "info@hotelempire.lu",
  },
  {
    name: "Hotel Bristol",
    address: "11 Rue de Strasbourg, L-2561 Luxembourg City",
    telephone: "+352 48 58 80",
    email: "info@hotelbristol.lu",
  },
  {
    name: "Hotel Christophe Colomb",
    address: "10 Rue d'Anvers, L-1130 Luxembourg City",
    telephone: "+352 40 14 14",
    email: "info@christophecolomb.lu",
  },
  {
    name: "Hotel Perrin (former Carlton)",
    address: "7-9 Rue de Strasbourg, L-2561 Luxembourg City",
    telephone: "+352 29 96 60",
    email: "info@hotelperrin.lu",
  },
  {
    name: "Hotel Simoncini",
    address: "6 Rue Notre-Dame, L-2240 Luxembourg City",
    telephone: "+352 22 28 44",
    email: "info@hotelsimoncini.lu",
  },
  {
    name: "Hotel Pax",
    address: "121 Route de Thionville, L-2611 Bonnevoie, Luxembourg City",
    telephone: "+352 48 65 85",
    email: "info@hotelpax.lu",
  },
  {
    name: "Hostellerie du Grünewald",
    address: "10-14 Route d'Echternach, L-1453 Dommeldange, Luxembourg City",
    telephone: "+352 43 18 82",
    email: "info@hostellerie-grunewald.lu",
  },
  {
    name: "City Hotel",
    address: "1 Rue de Strasbourg, L-2561 Luxembourg City",
    telephone: "+352 29 11 22",
    email: "info@cityhotel.lu",
  },
  {
    name: "Best Western Plus Grand Hotel Victor Hugo",
    address: "3-5 Avenue Victor Hugo, L-1750 Luxembourg City",
    telephone: "+352 44 19 84",
    email: "info@bwvictor.lu",
  },
  {
    name: "Domus Hotel",
    address: "37 Avenue Monterey, L-2163 Luxembourg City",
    telephone: "+352 26 38 44",
    email: "info@domushotel.lu",
  },
  {
    name: "Hotel Kazakiwi",
    address: "13 Rue de Strasbourg, L-2561 Luxembourg City",
    telephone: "+352 26 19 55",
    email: "info@kazakiwi.lu",
  },
  {
    name: "Hotel Central Molitor",
    address: "28 Avenue de la Liberté, L-1930 Luxembourg City",
    telephone: "+352 48 99 11",
    email: "info@centralmolitor.lu",
  },
  {
    name: "Hotel Sieweburen",
    address: "36 Rue des Septfontaines, L-2534 Luxembourg City",
    telephone: "+352 44 23 08",
    email: "info@sieweburen.lu",
  },
  {
    name: "Il Piccolo Mondo",
    address: "216 Rue de Hamm, L-1713 Luxembourg City",
    telephone: "+352 43 44 45",
    email: "info@ilpiccolumondo.lu",
  },
  {
    name: "Appart-Hôtel Marco Polo",
    address: "27 Rue du Fort Neipperg, L-2230 Luxembourg City",
    telephone: "+352 40 50 60",
    email: "info@marcopolo.lu",
  },
  {
    name: "La Pipistrelle Hotel",
    address: "10 Rue du Palais de Justice, L-1841 Luxembourg City",
    telephone: "+352 26 20 84",
    email: "info@lapipistrelle.lu",
  },
  {
    name: "Hotel Grey",
    address: "4, rue Joseph Junck, L-1839 Luxembourg",
    telephone: "+352 274 99 31",
    email: "info@hotelgrey.lu",
  },
];

const SKELETON_KEYS = ["sk-1", "sk-2", "sk-3", "sk-4", "sk-5", "sk-6"];

function RoomCardSkeleton() {
  return (
    <div className="rounded-xl overflow-hidden border border-border bg-card">
      <Skeleton className="aspect-[4/3] w-full" />
      <div className="p-5 space-y-3">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <div className="flex gap-2">
          <Skeleton className="h-6 w-20 rounded-md" />
          <Skeleton className="h-6 w-20 rounded-md" />
          <Skeleton className="h-6 w-20 rounded-md" />
        </div>
        <div className="flex justify-between items-center pt-1">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-9 w-28 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

export function RoomsPage() {
  const [checkIn, setCheckIn] = useState<Date | undefined>();
  const [checkOut, setCheckOut] = useState<Date | undefined>();
  const [guests, setGuests] = useState(2);
  const [filteredRooms, setFilteredRooms] = useState<Room[] | null>(null);
  const [bookingOpen, setBookingOpen] = useState(false);

  const { data: rooms, isLoading, error, refetch } = useRooms();

  useEffect(() => {
    if (!rooms) return;
    if (!checkIn || !checkOut) {
      setFilteredRooms(null);
      return;
    }
    const capacityFiltered = rooms.filter((r) => Number(r.capacity) >= guests);
    setFilteredRooms(capacityFiltered);
  }, [rooms, checkIn, checkOut, guests]);

  const displayRooms = filteredRooms ?? rooms ?? [];

  return (
    <Layout>
      {/* Page Header */}
      <section
        className="bg-card border-b border-border"
        data-ocid="rooms-hero"
      >
        <div className="container mx-auto px-4 sm:px-6 pt-10 pb-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex items-center gap-3 mb-2"
          >
            <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
              <Building2 className="w-5 h-5 text-accent-foreground" />
            </div>
            <div>
              <p className="text-xs font-medium text-primary uppercase tracking-widest">
                <BrandName /> · Browse Rooms
              </p>
              <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground leading-tight">
                Hotels in Luxembourg
              </h1>
            </div>
          </motion.div>
          <p className="text-muted-foreground mt-1 ml-13 pl-1">
            {LUXEMBOURG_HOTELS.length} hotels — name, address, telephone &amp;
            email listed below.
          </p>
        </div>
      </section>

      {/* Hotels Ledger — PRIMARY content, immediately visible */}
      <section className="bg-background py-10" data-ocid="hotels-luxembourg">
        <div className="container mx-auto px-4 sm:px-6">
          {/* Desktop table */}
          <div className="hidden md:block rounded-xl border border-border overflow-hidden shadow-subtle">
            <table className="w-full text-sm" data-ocid="hotels-table">
              <thead>
                <tr className="bg-card border-b border-border">
                  <th className="text-left px-5 py-3 font-semibold text-foreground">
                    Hotel Name
                  </th>
                  <th className="text-left px-5 py-3 font-semibold text-foreground">
                    Full Address
                  </th>
                  <th className="text-left px-5 py-3 font-semibold text-foreground">
                    Telephone
                  </th>
                  <th className="text-left px-5 py-3 font-semibold text-foreground">
                    Email
                  </th>
                </tr>
              </thead>
              <tbody>
                {LUXEMBOURG_HOTELS.map((h, i) => (
                  <tr
                    key={h.name}
                    className={`border-b border-border last:border-0 transition-colors duration-150 hover:bg-muted/40 ${
                      i % 2 === 0 ? "bg-background" : "bg-card/50"
                    }`}
                    data-ocid={`hotel-row-${i}`}
                  >
                    <td className="px-5 py-4 font-medium text-foreground whitespace-nowrap">
                      {h.name}
                    </td>
                    <td className="px-5 py-4 text-muted-foreground">
                      {h.address}
                    </td>
                    <td className="px-5 py-4 text-accent-foreground font-mono whitespace-nowrap">
                      <a
                        href={`tel:${h.telephone.replace(/\s/g, "")}`}
                        className="hover:underline"
                        data-ocid={`hotel-tel-${i}`}
                      >
                        {h.telephone}
                      </a>
                    </td>
                    <td className="px-5 py-4">
                      <a
                        href={`mailto:${h.email}`}
                        className="text-primary hover:underline"
                        data-ocid={`hotel-email-${i}`}
                      >
                        {h.email}
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile card list */}
          <div
            className="md:hidden flex flex-col gap-4"
            data-ocid="hotels-list-mobile"
          >
            {LUXEMBOURG_HOTELS.map((h, i) => (
              <div
                key={h.name}
                className="rounded-xl border border-border bg-card p-4 shadow-subtle"
                data-ocid={`hotel-card-${i}`}
              >
                <p className="font-display font-semibold text-foreground mb-1">
                  {h.name}
                </p>
                <p className="text-xs text-muted-foreground mb-3">
                  {h.address}
                </p>
                <div className="flex flex-col gap-1 text-sm">
                  <span className="text-accent-foreground font-mono">
                    <span className="font-medium text-foreground font-body">
                      Tel:{" "}
                    </span>
                    <a
                      href={`tel:${h.telephone.replace(/\s/g, "")}`}
                      className="hover:underline"
                    >
                      {h.telephone}
                    </a>
                  </span>
                  <span>
                    <span className="font-medium text-foreground">Email: </span>
                    <a
                      href={`mailto:${h.email}`}
                      className="text-primary hover:underline break-all"
                    >
                      {h.email}
                    </a>
                  </span>
                </div>
              </div>
            ))}
          </div>

          <p className="text-xs text-muted-foreground mt-6 text-right">
            {LUXEMBOURG_HOTELS.length} hotels listed
          </p>
        </div>
      </section>

      {/* Book a Room — collapsible secondary section */}
      <section
        className="bg-muted/30 border-t border-border"
        data-ocid="booking-section"
      >
        <div className="container mx-auto px-4 sm:px-6">
          <button
            type="button"
            onClick={() => setBookingOpen((v) => !v)}
            className="w-full flex items-center justify-between py-5 text-left"
            data-ocid="booking-toggle"
            aria-expanded={bookingOpen}
          >
            <span className="font-display font-semibold text-lg text-foreground">
              Book a Room
            </span>
            {bookingOpen ? (
              <ChevronUp className="w-5 h-5 text-muted-foreground" />
            ) : (
              <ChevronDown className="w-5 h-5 text-muted-foreground" />
            )}
          </button>

          {bookingOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="pb-10"
            >
              {/* Filter Bar */}
              <div
                className="bg-background rounded-2xl border border-border shadow-elevated p-5 mb-8"
                data-ocid="filter-bar"
              >
                <div className="flex flex-col md:flex-row gap-4 items-end">
                  <div className="flex-1">
                    <DateRangePicker
                      checkIn={checkIn}
                      checkOut={checkOut}
                      onCheckInChange={setCheckIn}
                      onCheckOutChange={setCheckOut}
                    />
                  </div>
                  <div className="w-full md:w-52 border border-border rounded-lg px-4 py-2.5 bg-card">
                    <GuestCountInput
                      value={guests}
                      onChange={setGuests}
                      min={1}
                      max={10}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (!checkIn || !checkOut) return;
                      const capacityFiltered = (rooms ?? []).filter(
                        (r) => Number(r.capacity) >= guests,
                      );
                      setFilteredRooms(capacityFiltered);
                    }}
                    className="w-full md:w-auto px-8 py-3 bg-primary text-primary-foreground font-display font-semibold rounded-xl transition-smooth hover:opacity-90 active:scale-[0.98] shadow-subtle"
                    data-ocid="search-btn"
                  >
                    Search Rooms
                  </button>
                </div>
                {checkIn && checkOut && filteredRooms !== null && (
                  <p className="mt-3 text-sm text-muted-foreground">
                    Showing {filteredRooms.length} room
                    {filteredRooms.length !== 1 ? "s" : ""} for {guests} guest
                    {guests !== 1 ? "s" : ""}
                  </p>
                )}
              </div>

              {/* Room Grid */}
              <div data-ocid="rooms-page">
                {error ? (
                  <ErrorMessage
                    title="Couldn't load rooms"
                    message="We had trouble fetching available rooms. Please try again."
                    onRetry={() => refetch()}
                  />
                ) : isLoading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {SKELETON_KEYS.map((k) => (
                      <RoomCardSkeleton key={k} />
                    ))}
                  </div>
                ) : displayRooms.length === 0 ? (
                  <div
                    className="flex flex-col items-center justify-center py-24 text-center"
                    data-ocid="rooms-empty"
                  >
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                      <span className="text-3xl">🏨</span>
                    </div>
                    <h3 className="font-display font-semibold text-xl text-foreground mb-2">
                      No rooms found
                    </h3>
                    <p className="text-muted-foreground mb-6 max-w-sm">
                      No rooms match your current filters. Try adjusting your
                      dates or guest count.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setCheckIn(undefined);
                        setCheckOut(undefined);
                        setGuests(2);
                        setFilteredRooms(null);
                      }}
                      className="px-5 py-2.5 bg-primary text-primary-foreground font-medium rounded-lg transition-smooth hover:opacity-90"
                    >
                      Clear Filters
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {displayRooms.map((room, index) => (
                      <motion.div
                        key={room.id.toString()}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{
                          duration: 0.4,
                          delay: Math.min(index * 0.07, 0.42),
                        }}
                      >
                        <RoomCard room={room} />
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </section>
    </Layout>
  );
}
