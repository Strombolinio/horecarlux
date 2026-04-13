import { Car } from "lucide-react";
import { Layout } from "../components/Layout";

interface CarRental {
  name: string;
  address: string;
  contact: string;
  telephone: string;
  email: string;
}

const CAR_RENTALS: CarRental[] = [
  {
    name: "LuxeDrive Rentals",
    address: "18 Boulevard Haussmann, 75009 Paris, France",
    contact: "Manager: Cécile Fontaine",
    telephone: "+33 1 53 43 22 00",
    email: "booking@luxedrive.fr",
  },
  {
    name: "Prestige Auto Hire",
    address: "120 Piccadilly, London W1J 7JA, United Kingdom",
    contact: "Fleet Manager: James Cartwright",
    telephone: "+44 20 7499 3030",
    email: "hire@prestigeauto.co.uk",
  },
  {
    name: "Roma Car Noleggio",
    address: "Piazza della Repubblica 22, 00185 Rome, Italy",
    contact: "Coordinator: Luca Ferretti",
    telephone: "+39 06 488 1561",
    email: "noleggio@romacar.it",
  },
  {
    name: "SunCoast Vehicle Rentals",
    address: "800 Brickell Ave, Miami, FL 33131, USA",
    contact: "Sales: Daniela Cruz",
    telephone: "+1 305 374 6800",
    email: "rentals@suncoastvehicles.com",
  },
  {
    name: "Nippon Drive Japan",
    address: "1-9-1 Marunouchi, Chiyoda City, Tokyo 100-0005, Japan",
    contact: "Agent: Kenji Morishita",
    telephone: "+81 3 3201 4411",
    email: "reserve@nippond rive.jp",
  },
  {
    name: "Iberia Car Hire",
    address: "Calle Gran Vía 32, 28013 Madrid, Spain",
    contact: "Manager: Sofia Montero",
    telephone: "+34 915 22 07 17",
    email: "alquiler@iberiacarhire.es",
  },
  {
    name: "SingaDrive Premium Cars",
    address: "8 Marina Boulevard, Marina Bay, Singapore 018981",
    contact: "Director: Aaron Teo",
    telephone: "+65 6509 8800",
    email: "reservations@singadrive.sg",
  },
];

export function CarRentalsPage() {
  return (
    <Layout>
      <section className="bg-muted/30 border-b border-border py-10">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-9 h-9 rounded-lg bg-primary/15 flex items-center justify-center">
              <Car className="w-5 h-5 text-primary" />
            </div>
            <h1 className="font-display font-bold text-3xl text-foreground">
              Browse Car Rentals
            </h1>
          </div>
          <p className="text-muted-foreground mt-2 ml-12">
            Find premium car hire services near your destination — full contact
            details below.
          </p>
        </div>
      </section>

      <section className="bg-background py-10">
        <div className="container mx-auto px-4 sm:px-6">
          {/* Desktop table */}
          <div className="hidden md:block rounded-xl border border-border overflow-hidden shadow-subtle">
            <table className="w-full text-sm" data-ocid="car-rentals-table">
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
                {CAR_RENTALS.map((c, i) => (
                  <tr
                    key={c.name}
                    className={`border-b border-border last:border-0 transition-colors duration-150 hover:bg-muted/40 ${
                      i % 2 === 0 ? "bg-background" : "bg-card/50"
                    }`}
                    data-ocid={`car-rental-row-${i}`}
                  >
                    <td className="px-5 py-4 font-medium text-foreground whitespace-nowrap">
                      {c.name}
                    </td>
                    <td className="px-5 py-4 text-muted-foreground">
                      {c.address}
                    </td>
                    <td className="px-5 py-4 text-muted-foreground whitespace-nowrap">
                      {c.contact}
                    </td>
                    <td className="px-5 py-4 text-primary font-mono whitespace-nowrap">
                      {c.telephone}
                    </td>
                    <td className="px-5 py-4">
                      <a
                        href={`mailto:${c.email}`}
                        className="text-primary hover:underline"
                        data-ocid={`car-rental-email-${i}`}
                      >
                        {c.email}
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
            data-ocid="car-rentals-list-mobile"
          >
            {CAR_RENTALS.map((c, i) => (
              <div
                key={c.name}
                className="rounded-xl border border-border bg-card p-4 shadow-subtle"
                data-ocid={`car-rental-card-${i}`}
              >
                <p className="font-display font-semibold text-foreground mb-1">
                  {c.name}
                </p>
                <p className="text-xs text-muted-foreground mb-2">
                  {c.address}
                </p>
                <div className="flex flex-col gap-1 text-sm">
                  <span className="text-muted-foreground">
                    <span className="font-medium text-foreground">
                      Contact:{" "}
                    </span>
                    {c.contact}
                  </span>
                  <span className="text-primary font-mono">
                    <span className="font-medium text-foreground font-body">
                      Tel:{" "}
                    </span>
                    {c.telephone}
                  </span>
                  <span>
                    <span className="font-medium text-foreground">Email: </span>
                    <a
                      href={`mailto:${c.email}`}
                      className="text-primary hover:underline break-all"
                    >
                      {c.email}
                    </a>
                  </span>
                </div>
              </div>
            ))}
          </div>

          <p className="text-xs text-muted-foreground mt-6 text-right">
            {CAR_RENTALS.length} car rental providers listed
          </p>
        </div>
      </section>
    </Layout>
  );
}
