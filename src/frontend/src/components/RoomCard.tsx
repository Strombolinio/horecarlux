import { Link, useNavigate } from "@tanstack/react-router";
import { Bed, Star, Users, Wifi } from "lucide-react";
import type { Room } from "../types";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";

interface RoomCardProps {
  room: Room;
  onClick?: () => void;
}

const AMENITY_ICONS: Record<string, React.ReactNode> = {
  "Free Wi-Fi": <Wifi className="w-3.5 h-3.5" />,
  WiFi: <Wifi className="w-3.5 h-3.5" />,
};

export function RoomCard({ room, onClick }: RoomCardProps) {
  const heroImage =
    room.imageUrls?.[0] ?? "/assets/generated/room-placeholder.jpg";
  const nightlyRate = Number(room.nightlyRate);
  const capacity = Number(room.capacity);

  return (
    <Card
      className="overflow-hidden group transition-smooth hover:-translate-y-1 hover:shadow-elevated border-border cursor-pointer"
      data-ocid="room-card"
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(e) => {
        if (onClick && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          onClick();
        }
      }}
    >
      {/* Image */}
      <div className="relative overflow-hidden aspect-[4/3] bg-muted">
        <img
          src={heroImage}
          alt={room.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        {!room.isAvailable && (
          <div className="absolute inset-0 bg-foreground/40 flex items-center justify-center">
            <span className="bg-card text-foreground font-medium text-sm px-3 py-1 rounded-full">
              Unavailable
            </span>
          </div>
        )}
        <div className="absolute top-3 right-3">
          <Badge
            variant="secondary"
            className="text-xs font-medium shadow-subtle"
          >
            {room.bedType}
          </Badge>
        </div>
      </div>

      <CardContent className="p-5">
        {/* Title + Rating */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-display font-semibold text-foreground text-lg leading-tight line-clamp-2">
            {room.name}
          </h3>
          <div className="flex items-center gap-1 shrink-0 text-sm text-muted-foreground">
            <Star className="w-4 h-4 fill-primary text-primary" />
            <span>4.8</span>
          </div>
        </div>

        {/* Capacity */}
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-3">
          <Users className="w-4 h-4" />
          <span>Up to {capacity} guests</span>
          <span className="mx-1">·</span>
          <Bed className="w-4 h-4" />
          <span>{room.bedType}</span>
        </div>

        {/* Amenities */}
        {room.amenities.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {room.amenities.slice(0, 3).map((amenity) => (
              <span
                key={amenity}
                className="inline-flex items-center gap-1 text-xs text-muted-foreground bg-muted px-2 py-1 rounded-md"
              >
                {AMENITY_ICONS[amenity] ?? null}
                {amenity}
              </span>
            ))}
            {room.amenities.length > 3 && (
              <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-md">
                +{room.amenities.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Price + CTA */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-display font-bold text-foreground">
              ${nightlyRate}
            </span>
            <span className="text-sm text-muted-foreground"> / night</span>
          </div>
          {onClick ? (
            <Button
              variant="default"
              size="sm"
              disabled={!room.isAvailable}
              onClick={(e) => {
                e.stopPropagation();
                onClick();
              }}
              data-ocid="room-book-btn"
            >
              View Room
            </Button>
          ) : (
            <Link to="/rooms/$roomId" params={{ roomId: String(room.id) }}>
              <Button
                variant="default"
                size="sm"
                disabled={!room.isAvailable}
                data-ocid="room-book-btn"
              >
                Book Now
              </Button>
            </Link>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
