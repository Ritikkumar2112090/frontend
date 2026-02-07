import { MapPin } from "lucide-react";

interface TempleCardProps {
  name: string;
  location: string;
  image: string;
  description: string;
}

const TempleCard = ({ name, location, image, description }: TempleCardProps) => {
  return (
    <div className="group rounded-2xl overflow-hidden bg-card shadow-md hover:shadow-xl transition-all duration-300">
      <div className="relative h-56 overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-transparent to-transparent" />
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="font-display text-xl font-semibold text-primary-foreground mb-1">
            {name}
          </h3>
          <div className="flex items-center gap-1 text-sm text-primary-foreground/80">
            <MapPin className="w-3.5 h-3.5" />
            {location}
          </div>
        </div>
      </div>
      <div className="p-4">
        <p className="text-sm text-muted-foreground leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
};

export default TempleCard;
