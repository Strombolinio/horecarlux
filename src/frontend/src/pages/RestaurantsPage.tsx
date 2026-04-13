import { UtensilsCrossed } from "lucide-react";
import { Layout } from "../components/Layout";

interface Restaurant {
  name: string;
  address: string;
  contact: string;
  telephone: string;
  email: string;
}

const RESTAURANTS: Restaurant[] = [
  {
    name: "La Maison Dorée",
    address: "14 Rue de la Paix, 75002 Paris, France",
    contact: "Chef Éric Beaumont",
    telephone: "+33 1 42 60 21 10",
    email: "reservations@lamaisondoree.fr",
  },
  {
    name: "The Grand Brasserie",
    address: "52 Strand, London WC2R 1AJ, United Kingdom",
    contact: "Manager: Oliver Hartley",
    telephone: "+44 20 7836 4751",
    email: "dining@grandbrasserie.co.uk",
  },
  {
    name: "Ristorante Bellavista",
    address: "Via Condotti 8, 00187 Rome, Italy",
    contact: "Host: Giovanna Ricci",
    telephone: "+39 06 679 1178",
    email: "info@bellavistaroma.it",
  },
  {
    name: "Azure Seafood & Grill",
    address: "2100 Ocean Drive, Miami Beach, FL 33139, USA",
    contact: "GM: Marcus Reynolds",
    telephone: "+1 305 672 4400",
    email: "reservations@azureseafood.com",
  },
  {
    name: "Sakura Garden",
    address: "3-7-12 Ginza, Chuo City, Tokyo 104-0061, Japan",
    contact: "Host: Yuki Tanaka",
    telephone: "+81 3 3571 9988",
    email: "info@sakuragarden-tokyo.jp",
  },
  {
    name: "El Patio Andaluz",
    address: "Calle Sierpes 44, 41004 Seville, Spain",
    contact: "Manager: Alejandro Vega",
    telephone: "+34 954 22 13 85",
    email: "reservas@elpatioanda luz.es",
  },
  {
    name: "The Rooftop Terrace",
    address: "Level 32, 1 Raffles Place, Singapore 048616",
    contact: "Events: Priya Lakshmanan",
    telephone: "+65 6438 8880",
    email: "dining@rooftopterrace.sg",
  },
];

export function RestaurantsPage() {
  return (
    <Layout>
      <section className="bg-muted/30 border-b border-border py-10">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-9 h-9 rounded-lg bg-accent/20 flex items-center justify-center">
              <UtensilsCrossed className="w-5 h-5 text-accent-foreground" />
            </div>
            <h1 className="font-display font-bold text-3xl text-foreground">
              Browse Restaurants
            </h1>
          </div>
          <p className="text-muted-foreground mt-2 ml-12">
            Discover exceptional dining near your stay — contact details listed
            below.
          </p>
        </div>
      </section>

      <section className="bg-background py-10">
        <div className="container mx-auto px-4 sm:px-6">
          {/* Desktop table */}
          <div className="hidden md:block rounded-xl border border-border overflow-hidden shadow-subtle">
            <table className="w-full text-sm" data-ocid="restaurants-table">
              <thead>
                <tr className="bg-card border-b border-border">
                  <th className="text-left px-5 py-3 font-semibold text-foreground">
                    Name
                  </th>
                  <th className="text-left px-5 py-3 font-semibold text-foreground">
                    Full Address
                  </th>
                  <th className="text-left px-5 py-3 font-semibold text-foreground">
                    Contact
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
                {RESTAURANTS.map((r, i) => (
                  <tr
                    key={r.name}
                    className={`border-b border-border last:border-0 transition-colors duration-150 hover:bg-muted/40 ${
                      i % 2 === 0 ? "bg-background" : "bg-card/50"
                    }`}
                    data-ocid={`restaurant-row-${i}`}
                  >
                    <td className="px-5 py-4 font-medium text-foreground whitespace-nowrap">
                      {r.name}
                    </td>
                    <td className="px-5 py-4 text-muted-foreground">
                      {r.address}
                    </td>
                    <td className="px-5 py-4 text-muted-foreground whitespace-nowrap">
                      {r.contact}
                    </td>
                    <td className="px-5 py-4 text-accent-foreground font-mono whitespace-nowrap">
                      {r.telephone}
                    </td>
                    <td className="px-5 py-4">
                      <a
                        href={`mailto:${r.email}`}
                        className="text-primary hover:underline"
                        data-ocid={`restaurant-email-${i}`}
                      >
                        {r.email}
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
            data-ocid="restaurants-list-mobile"
          >
            {RESTAURANTS.map((r, i) => (
              <div
                key={r.name}
                className="rounded-xl border border-border bg-card p-4 shadow-subtle"
                data-ocid={`restaurant-card-${i}`}
              >
                <p className="font-display font-semibold text-foreground mb-1">
                  {r.name}
                </p>
                <p className="text-xs text-muted-foreground mb-2">
                  {r.address}
                </p>
                <div className="flex flex-col gap-1 text-sm">
                  <span className="text-muted-foreground">
                    <span className="font-medium text-foreground">
                      Contact:{" "}
                    </span>
                    {r.contact}
                  </span>
                  <span className="text-accent-foreground font-mono">
                    <span className="font-medium text-foreground font-body">
                      Tel:{" "}
                    </span>
                    {r.telephone}
                  </span>
                  <span>
                    <span className="font-medium text-foreground">Email: </span>
                    <a
                      href={`mailto:${r.email}`}
                      className="text-primary hover:underline break-all"
                    >
                      {r.email}
                    </a>
                  </span>
                </div>
              </div>
            ))}
          </div>

          <p className="text-xs text-muted-foreground mt-6 text-right">
            {RESTAURANTS.length} restaurants listed
          </p>
        </div>
      </section>
    </Layout>
  );
}
