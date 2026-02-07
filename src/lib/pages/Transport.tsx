import { Car, Bus, Train, Plane, CheckCircle, Clock, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/componants/ui/button";
import Navbar from "@/componants/Navbar";
import Footer from "@/componants/Footer";

const Transport = () => {
  const transportOptions = [
    {
      icon: Car,
      title: "Private Car",
      description: "Comfortable AC sedan or SUV for your group",
      features: [
        "AC Toyota Innova/Ertiga",
        "Professional driver",
        "Door-to-door service",
        "Flexible stops",
        "4-7 passengers",
      ],
      priceRange: "₹2,500 - ₹4,000 per day",
      bestFor: "Families & small groups",
    },
    {
      icon: Bus,
      title: "Tempo Traveller",
      description: "Spacious mini-bus for larger groups",
      features: [
        "12-17 seater AC vehicle",
        "Push-back seats",
        "Luggage space",
        "Music system",
        "Group tours",
      ],
      priceRange: "₹5,000 - ₹8,000 per day",
      bestFor: "Large groups & events",
    },
    {
      icon: Bus,
      title: "Volvo Bus",
      description: "Premium coach for comfortable travel",
      features: [
        "40+ seater luxury bus",
        "Reclining seats",
        "Entertainment system",
        "Onboard facilities",
        "Corporate groups",
      ],
      priceRange: "₹15,000 - ₹25,000 per day",
      bestFor: "Corporate tours & pilgrimages",
    },
  ];

  const pickupPoints = [
    {
      city: "Delhi",
      locations: [
        "IGI Airport Terminal 3",
        "New Delhi Railway Station",
        "Connaught Place",
        "Kashmere Gate ISBT",
      ],
      distance: "180 km",
      time: "3-4 hours",
    },
    {
      city: "Agra",
      locations: [
        "Agra Cantt Railway Station",
        "Agra Fort",
        "Taj Mahal East Gate",
        "ISBT Agra",
      ],
      distance: "60 km",
      time: "1-1.5 hours",
    },
    {
      city: "Jaipur",
      locations: [
        "Jaipur Railway Station",
        "Jaipur Airport",
        "Sindhi Camp Bus Stand",
      ],
      distance: "280 km",
      time: "5-6 hours",
    },
  ];

  const connectingTravel = [
    {
      icon: Train,
      title: "By Train",
      description:
        "Mathura Junction is well-connected to all major cities. Regular trains from Delhi, Mumbai, Kolkata, and other metros.",
      tip: "Book Shatabdi or Rajdhani for fastest travel from Delhi.",
    },
    {
      icon: Plane,
      title: "By Air",
      description:
        "Nearest airports are Agra (Kheria Airport - 60km) and Delhi IGI (180km). We provide pickup from both airports.",
      tip: "Delhi airport has more flight options and competitive prices.",
    },
    {
      icon: Bus,
      title: "By Bus",
      description:
        "Regular UPSRTC and private buses from Delhi ISBT, Agra, Jaipur, and nearby cities to Mathura and Vrindavan.",
      tip: "Volvo buses from Delhi take approximately 3 hours.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="pt-24 pb-12 bg-muted">
        <div className="container mx-auto px-4">
          <p className="text-primary font-medium mb-3 tracking-wider uppercase text-sm">
            Transportation
          </p>
          <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Comfortable Travel Options
          </h1>
          <p className="text-muted-foreground max-w-2xl">
            We offer various transport options to suit your group size and
            budget. All vehicles are AC-equipped with experienced drivers who
            know the local routes.
          </p>
        </div>
      </section>

      {/* Transport Options */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-8 text-center">
            Our Fleet
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {transportOptions.map((option, index) => (
              <div
                key={index}
                className="bg-card p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <option.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                  {option.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {option.description}
                </p>

                <ul className="space-y-2 mb-6">
                  {option.features.map((feature, featureIndex) => (
                    <li
                      key={featureIndex}
                      className="flex items-center gap-2 text-sm"
                    >
                      <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="pt-4 border-t border-border">
                  <p className="text-lg font-semibold text-foreground">
                    {option.priceRange}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Best for: {option.bestFor}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pickup Points */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4">
              Pickup Locations
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              We offer convenient pickup from major cities near Vrindavan and
              Mathura
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pickupPoints.map((point, index) => (
              <div key={index} className="bg-background p-6 rounded-2xl shadow-sm">
                <h3 className="font-display text-xl font-semibold text-foreground mb-4">
                  {point.city}
                </h3>

                <div className="flex items-center gap-4 mb-4 text-sm">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    {point.time}
                  </div>
                  <div className="text-muted-foreground">|</div>
                  <div className="text-muted-foreground">{point.distance}</div>
                </div>

                <ul className="space-y-2">
                  {point.locations.map((location, locationIndex) => (
                    <li
                      key={locationIndex}
                      className="flex items-center gap-2 text-sm text-muted-foreground"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                      {location}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How to Reach */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4">
              How to Reach Vrindavan
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Multiple travel options to reach the holy land
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {connectingTravel.map((option, index) => (
              <div
                key={index}
                className="bg-card p-6 rounded-2xl shadow-lg border border-border"
              >
                <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center mb-4">
                  <option.icon className="w-6 h-6 text-secondary" />
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                  {option.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {option.description}
                </p>
                <div className="bg-muted p-3 rounded-lg">
                  <p className="text-xs text-primary font-medium">💡 Tip</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {option.tip}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-secondary text-secondary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-display text-2xl md:text-3xl font-bold mb-4">
            Need Transport Assistance?
          </h2>
          <p className="opacity-80 max-w-xl mx-auto mb-8">
            Contact us for custom transport arrangements or any queries about
            reaching Vrindavan and Mathura.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-primary-foreground text-secondary hover:bg-primary-foreground/90"
              asChild
            >
              <Link to="/booking">Book Transport</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-secondary-foreground/30 text-secondary-foreground hover:bg-secondary-foreground/10"
              asChild
            >
              <Link to="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Transport;
