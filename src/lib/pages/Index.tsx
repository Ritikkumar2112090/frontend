import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Star, Users, Clock, Shield } from "lucide-react";
import { Button } from "@/componants/ui/button";
import { toast, useToast } from "@/hooks/use-toast";
import Navbar from "@/componants/Navbar";
import Footer from "@/componants/Footer";
import TempleCard from "@/componants/TempleCard";
import premMandirHero from "@/assets/prem-mandir-hero2.jpeg";
import KrishnaJanmabhoomi from "@/assets/krishna-janmabhumi.webp";
import bankeBihari from "@/assets/banke-bh.jpeg";


const Index = () => {
  const features = [
    {
      icon: Star,
      title: "Expert Guides",
      description: "Knowledgeable local guides with deep spiritual understanding",
    },
    {
      icon: Users,
      title: "Small Groups",
      description: "Personalized experience with limited group sizes",
    },
    {
      icon: Clock,
      title: "Flexible Timing",
      description: "Tours designed around temple darshan timings",
    },
    {
      icon: Shield,
      title: "Safe Travel",
      description: "Comfortable and secure transportation throughout",
    },
  ];

  const temples = [
    {
      name: "Prem Mandir",
      location: "Vrindavan",
      image: premMandirHero,
      description:
        "A magnificent white marble temple dedicated to Radha Krishna and Sita Ram, featuring beautiful light shows in the evening.",
    },
    {
      name: "Krishna Janmabhoomi",
      location: "Mathura",
      image: KrishnaJanmabhoomi,
      description:
        "The sacred birthplace of Lord Krishna, one of the holiest sites in Hinduism with ancient historical significance.",
    },
    {
      name: "Banke Bihari Temple",
      location: "Vrindavan",
      image: bankeBihari,
      description:
        "One of the most revered temples in Vrindavan, known for its unique darshan where curtains are drawn every few minutes.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-screen min-h-[600px]">
        <div className="absolute inset-0">
          <img
            src={premMandirHero}
            alt="Prem Mandir at sunset"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 via-foreground/50 to-transparent" />
        </div>

        <div className="relative container mx-auto px-4 h-full flex items-center">
          <div className="max-w-2xl animate-fade-up">
            <p className="text-primary font-medium mb-3 tracking-wider uppercase text-sm">
              Sacred Pilgrimage Tours
            </p>
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-4 sm:mb-6 leading-tight">
              Discover the Divine Land of{" "}
              <span className="text-gradient">Lord Krishna</span>
            </h1>
            <p className="text-base sm:text-lg text-primary-foreground/80 mb-6 sm:mb-8 leading-relaxed">
              Experience the spiritual essence of Vrindavan and Mathura with our
              expertly guided tours. Walk the sacred paths where Krishna played
              and discover centuries of devotion.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Button size="default" className="sm:size-lg" asChild>
                <Link to="/plans">Explore Tours</Link>
              </Button>
              <Button
                size="default"
                variant="outline"
                className="bg-primary-foreground/10 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/20 sm:size-lg"
                asChild
              >
                <Link to="/contact">Contact Us</Link>
              </Button>
              <Button
                size="default"
                variant="secondary"
                className="bg-secondary-foreground/10 border-secondary-foreground/30 text-secondary-foreground hover:bg-secondary-foreground/20 sm:size-lg"
                asChild
                onClick={() => toast({ title: "Photos Page", description: "Navigate to the Photos page to view your uploads." })}
              >
                <Link to="/photos">Photos</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex items-start gap-4 p-6 rounded-xl bg-background shadow-sm"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-display font-semibold text-foreground mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <p className="text-primary font-medium mb-3 tracking-wider uppercase text-sm">
              About Us
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
              Your Gateway to Spiritual Journeys
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              We are dedicated to providing authentic and enriching pilgrimage
              experiences to the holy cities of Vrindavan and Mathura. Our team
              of experienced guides ensures that every devotee experiences the
              divine presence of Lord Krishna through carefully planned tours
              that cover all major temples and sacred sites.
            </p>
          </div>

          {/* Temples Grid */}
          <h3 className="font-display text-2xl font-semibold text-foreground text-center mb-8">
            Featured Sacred Sites
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {temples.map((temple, index) => (
              <TempleCard key={index} {...temple} />
            ))}
          </div>

          <div className="text-center mt-10">
            <Button size="lg" asChild>
              <Link to="/plans">View All Tour Packages</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Contact CTA Section */}
      <section className="py-16 bg-yellow-50 text-orange-700">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div>
              <h2 className="font-display text-2xl md:text-3xl font-bold mb-4">
                Ready to Begin Your Spiritual Journey?
              </h2>
              <p className="opacity-80 max-w-xl">
                Contact us today to plan your perfect pilgrimage tour. We're here
                to help you every step of the way.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 text-sm">
              <div className="flex items-center gap-3 bg-secondary-foreground/10 px-5 py-3 rounded-lg">
                <Phone className="w-5 h-5" />
                <a href="tel:+91 7231056715">+91 7231056715</a>
                <span> & </span>
                <a href="tel:+91 8079013665">+91 8079013665</a>
              </div>
              <div className="flex items-center gap-3 bg-secondary-foreground/10 px-5 py-3 rounded-lg">
                <Mail className="w-5 h-5" />
                <a href="mailto:vrindavansaathi@gmail.com">vrindavansaathi@gmail.com</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
