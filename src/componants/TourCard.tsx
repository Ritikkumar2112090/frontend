import { Clock, Users, MapPin, Check, X, Phone, MessageCircle, Star, Calendar, MapPin as MapPinIcon, Utensils, Car, Home, Shield } from "lucide-react";
import { Button } from "@/componants/ui/button";
import { Link } from "react-router-dom";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/componants/ui/dialog";

interface TourCardProps {
  title: string;
  duration: string;
  price: number;
  newPrice?: number;
  image: string;
  highlights: string[];
  popular?: boolean;
  detailedInfo?: {
    packageTitle: string;
    subtitle: string;
    description: string;
    tourHighlights: string[];
    itinerary: Array<{
      day: string;
      title: string;
      stops: string[];
    }>;
    inclusions: string[];
    exclusions: string[];
    pricing: {
      startingFrom: number;
      currency: string;
      note: string;
    };
    idealFor: string[];
    whyChoose: string[];
    contactInfo: {
      phone1: string;
      phone2: string;
      whatsapp: string;
      email: string;
    };
  };
}

const TourCard = ({
  title,
  duration,
  price,
  newPrice,
  image,
  highlights,
  popular,
  detailedInfo,
}: TourCardProps) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <>
      <div
        className={`relative rounded-2xl overflow-hidden bg-card shadow-lg hover:shadow-xl transition-all duration-300 group ${
          popular ? "ring-2 ring-primary" : ""
        }`}
      >
        {popular && (
          <div className="absolute top-4 right-4 z-10 bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
            Most Popular
          </div>
        )}

        {/* Image */}
        <div className="relative h-50 overflow-hidden">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4">
            <h3 className="font-display text-xl font-semibold text-primary-foreground">
              {title}
            </h3>
            <div className="flex items-center gap-4 mt-1">
              <span className="flex items-center gap-1 text-sm text-primary-foreground/90">
                <Clock className="w-4 h-4" />
                {duration}
              </span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          <ul className="space-y-2 mb-5">
            {highlights.slice(0, 4).map((highlight, index) => (
              <li key={index} className="flex items-start gap-2 text-sm">
                <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-muted-foreground">{highlight}</span>
              </li>
            ))}
          </ul>

          <div className="flex items-center justify-between pt-4 border-t border-border">
            <div>
              <p className="text-xs text-muted-foreground">Starting from</p>
              <div className="flex items-center gap-2">
                {newPrice && newPrice < price ? (
                  <>
                    <p className="text-lg font-display font-bold text-foreground line-through text-muted-foreground">
                      ₹{price}
                    </p>
                    <p className="text-2xl font-display font-bold text-orange-500">
                      ₹{newPrice}
                    </p>
                  </>
                ) : (
                  <p className="text-2xl font-display font-bold text-foreground">
                    ₹{price}
                  </p>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowDetails(true)}>View</Button>
              <Button asChild>
                <Link to="/booking">Book Now</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Modal */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-display text-center">
              {detailedInfo?.packageTitle || title}
            </DialogTitle>
            <p className="text-center text-muted-foreground">
              {detailedInfo?.subtitle}
            </p>
          </DialogHeader>

          {detailedInfo && (
            <div className="space-y-6">
              {/* Description */}
              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="text-sm leading-relaxed">{detailedInfo.description}</p>
              </div>

              {/* Tour Highlights */}
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Star className="w-5 h-5 text-primary" />
                  Tour Highlights
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {detailedInfo.tourHighlights.map((highlight, index) => (
                    <div key={index} className="flex items-start gap-2 text-sm">
                      <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Itinerary */}
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  Day-Wise Itinerary
                </h3>
                <div className="space-y-4">
                  {detailedInfo.itinerary.map((day, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <h4 className="font-semibold text-primary mb-2">{day.day}: {day.title}</h4>
                      <ul className="space-y-1">
                        {day.stops.map((stop, stopIndex) => (
                          <li key={stopIndex} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                            <span>{stop}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* Inclusions & Exclusions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <Check className="w-5 h-5 text-green-600" />
                    Inclusions
                  </h3>
                  <ul className="space-y-2">
                    {detailedInfo.inclusions.map((item, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <X className="w-5 h-5 text-red-600" />
                    Exclusions
                  </h3>
                  <ul className="space-y-2">
                    {detailedInfo.exclusions.map((item, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <X className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Pricing */}
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-2">Pricing</h3>
                <p className="text-2xl font-bold text-primary">
                  Starting from {detailedInfo.pricing.currency}{detailedInfo.pricing.startingFrom} per person
                </p>
                <p className="text-sm text-muted-foreground mt-1">{detailedInfo.pricing.note}</p>
              </div>

              {/* Ideal For */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Ideal For</h3>
                <div className="flex flex-wrap gap-2">
                  {detailedInfo.idealFor.map((item, index) => (
                    <span key={index} className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm">
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              {/* Why Choose */}
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" />
                  Why Choose This Package
                </h3>
                <ul className="space-y-2">
                  {detailedInfo.whyChoose.map((item, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Contact Info */}
              <div className="bg-muted p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-3">Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-primary" />
                      <span className="text-sm">{detailedInfo.contactInfo.phone1}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-primary" />
                      <span className="text-sm">{detailedInfo.contactInfo.phone2}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MessageCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm">WhatsApp: {detailedInfo.contactInfo.whatsapp}</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 mt-4">
                    <Button className="w-full" asChild>
                      <Link to="/booking">Book Now</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TourCard;
