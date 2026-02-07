import { Link } from "react-router-dom";
import { MapPin, Clock, Bus, Car, ChevronRight } from "lucide-react";
import { Button } from "@/componants/ui/button";
import Navbar from "@/componants/Navbar";
import Footer from "@/componants/Footer";
import TourCard from "@/componants/TourCard";
import { useState, useEffect } from "react";
import kartiMandir from "@/assets/v6.jpeg";
import krishnaJanmabhoomi from "@/assets/shri-krishna-janmabhoomi-temple-mathura.webp";
import "@/assets/WhatsApp Image 2026-01-21 at 6.11.08 PM.jpeg"

const Plans = () => {
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowAnimation(true);
    }, 30000); // 30 seconds

    return () => clearTimeout(timer);
  }, []);

  const tourPackages = [
    // {
    //   title: "One Day Divine Tour",
    //   duration: "1 Day",
    //   price: 1999,
    //   image: bankeBihari,
    //   highlights: [
    //     "Krishna Janmabhoomi Temple",
    //     "Banke Bihari Temple darshan",
    //     "Prem Mandir light show",
    //     "Comfortable AC transport",
    //     "Lunch included",
    //   ],
    // },
    {
      title: "Two Days Spiritual Journey",
      duration: "2 Days / 2 Night",
      price: 6099,
      newPrice: 5499,
      image:kartiMandir,
      highlights: [
        "Krishna Janmabhoomi ",
        "Banke Bihari Temple darshan",
        "Govardhan Parikrama",
        "Radha Kund & Shyam Kund",
        "Hotel accommodation included",
        "All meals included",
      ],
      detailedInfo: {
        packageTitle: "Vrindavan Mathura Tour Package 2 Nights 2 Days | Divine Braj Darshan",
        subtitle: "Vrindavan–Mathura Spiritual Tour Package (2N/2D)",
        description: "Experience the divine land of Lord Krishna with our Vrindavan Mathura Tour Package for 2 Nights and 2 Days. This spiritually enriching journey covers the most sacred temples, kunds, and pilgrimage sites of Vrindavan, Mathura, Govardhan, Barsana, and Nandgaon. Designed for comfort and devotion, the package includes AC accommodation, daily meals, private sightseeing vehicle, and smooth temple darshan assistance. From Banke Bihari Ji's blessings to the peaceful aura of Prem Mandir and Govardhan Parikrama, this tour offers a perfect balance of spirituality, convenience, and value. Ideal for families, couples, and senior citizens seeking a hassle-free Braj Bhoomi yatra.",
        tourHighlights: [
          "Banke Bihari Temple darshan",
          "Radha Vallabh & Radha Raman Temples",
          "Nidhivan & Premanand Maharaj Ji Darshan",
          "Yamuna Ji Aarti & boating experience",
          "ISKCON Temple & Prem Mandir visit",
          "Govardhan Parikrama & Danghati Darshan",
          "Radha Kund, Shyam Kund & Kusum Sarovar",
          "Barsana, Nandgaon & Nand Mahal sightseeing"
        ],
        itinerary: [
          {
            day: "Day 1",
            title: "Vrindavan Temple Darshan",
            stops: [
              "Arrival at Mathura/Vrindavan and hotel check-in (subject to availability)",
              "Morning darshan at:",
              "Banke Bihari Temple",
              "Radha Vallabh Temple",
              "Nidhivan",
              "Radha Raman Temple",
              "Rangji Mandir",
              "Gopeshwar Mahadev",
              "Madan Mohan Temple",
              "Premanand Maharaj Ji Darshan",
              "Lunch",
              "Evening visits:",
              "Yamuna Ji Darshan & boating",
              "Char Dham",
              "ISKCON Temple",
              "Prem Mandir",
              "Dinner",
              "Free time for local shopping",
              "Overnight stay in Vrindavan"
            ]
          },
          {
            day: "Day 2",
            title: "Govardhan – Barsana – Nandgaon Tour",
            stops: [
              "Breakfast",
              "Visit:",
              "Radha Kund & Shyam Kund",
              "Kusum Sarovar",
              "Uddhav Kund",
              "Mansi Ganga",
              "Chandra Sarovar",
              "Danghati Darshan",
              "Travel to Barsana & Nandgaon:",
              "Peli Pokhar",
              "Barsana Parikrama (Mor Kuti, Gevar Van, Maan Mandir, Shyam Chudi Wala Mandir, Jaipur Mandir, Ladli Ji Mandir)",
              "Kirti Mandir",
              "Nand Mahal",
              "Dinner",
              "Drop at Mathura/Vrindavan (subject to availability)"
            ]
          }
        ],
        inclusions: [
          "AC hotel accommodation",
          "Breakfast, Lunch & Dinner",
          "Private AC vehicle for sightseeing",
          "Railway station / bus stand pickup & drop",
          "Toll, fuel & parking charges included",
          "E-rickshaw support in restricted temple zones",
          "WhatsApp trip support",
          "VIP darshan entry where available (subject to availability)"
        ],
        exclusions: [
          "Temple entry tickets",
          "Train or flight tickets",
          "Personal expenses",
          "Travel insurance",
          "Tips and gratuities",
          "Any service not mentioned above"
        ],
        pricing: {
          startingFrom: 5499,
          currency: "₹",
          note: "Prices are subject to availability and temple crowd conditions."
        },
        idealFor: [
          "Family pilgrimage tour",
          "Couple spiritual getaway",
          "Senior citizen yatra",
          "Friends group tour",
          "Solo devotional travelers"
        ],
        whyChoose: [
          "Cover all major Braj Bhoomi temples in 2 days",
          "Trusted local travel operator",
          "Comfortable stay and transport",
          "Transparent pricing with no hidden charges",
          "Well-planned itinerary with on-ground support",
          "Ideal for first-time and senior travelers"
        ],
        contactInfo: {
          phone1: "+91 7231056715",
          phone2: "+91 8079013665",
          whatsapp: "+91 7231056715",
          email: "vrindavansaathi@gmail.com"
        }
      }

    },
    {
      title: "Three Days Complete Darshan",
      duration: "3 Days / 3 Nights",
      price: 8099,
      newPrice: 7499,
      image: krishnaJanmabhoomi,
      highlights: [
        "Prem Mandir",
        "Complete Vrindavan-Mathura tour",
        "Krishna Janmabhoomi ",
        "Nidhi Van exploration",
        "Evening aarti at Yamuna Ghat",
        "Premium hotel stay",
        "All meals & snacks",
      ],
      popular: true,
      detailedInfo: {
        packageTitle: "3 Days Complete Brij Darshan Tour – Mathura, Vrindavan, Govardhan, Barsana & Nandgaon",
        subtitle: "Complete Brij Darshan Tour (3N/3D)",
        description: "Experience the divine essence of Brij Bhoomi with our thoughtfully curated 3 Days / 3 Nights Complete Brij Darshan Tour. This journey takes you through the sacred land where Lord Krishna spent his childhood, covering iconic temples, ghats, kunds, and spiritual sites across Vrindavan, Mathura, Gokul, Govardhan, Barsana, and Nandgaon. Designed for devotees seeking a peaceful yet well-managed pilgrimage, this package offers comfortable stay, delicious vegetarian meals, smooth AC transportation, and guided darshan planning. From the magical Yamuna Aarti to serene kunds and historic temples, every moment brings you closer to devotion, bhakti, and inner peace.",
        tourHighlights: [
          "Banke Bihari Ji, Prem Mandir & ISKCON Darshan",
          "Yamuna Ji Darshan, Boating & Evening Aarti",
          "Krishna Janmabhoomi & Dwarkadhish Temple",
          "Gokul, Raman Reti & Brahmand Ghat",
          "Govardhan Parikrama & Radha Kund–Shyam Kund",
          "Barsana Parikrama & Ladli Ji Mandir",
          "Nandgaon & Nand Bhavan Visit",
          "VIP Darshan support (where available)"
        ],
        itinerary: [
          {
            day: "Day 1",
            title: "Vrindavan Darshan",
            stops: [
              "Morning darshan of Banke Bihari Ji, Radha Vallabh, Nidhivan, Radha Raman, Rangji Mandir, Gopeshwar Mahadev, Madan Mohan & Bada Mandir, followed by Premanand Maharaj Ji Darshan.",
              "After lunch, enjoy Yamuna Darshan & Boating.",
              "Evening visits to Char Dham, ISKCON Temple & Prem Mandir.",
              "Dinner followed by free time for shopping."
            ]
          },
          {
            day: "Day 2",
            title: "Gokul & Mathura",
            stops: [
              "Morning visit to Dau Ji, Brahmand Ghat, Raman Reti, Raskhan Samadhi, 84 Khamba & Gokul.",
              "Evening darshan of Dwarkadhish Temple, Vishram Ghat, Krishna Janmabhoomi, Bhuteshwar Mahadev, Bhandirvan & Vansibat.",
              "Attend Yamuna Aarti followed by dinner."
            ]
          },
          {
            day: "Day 3",
            title: "Govardhan, Barsana & Nandgaon",
            stops: [
              "Morning darshan of Mansi Ganga, Chandra Sarovar, Danghati, Radha Kund, Shyam Kund, Kusum Sarovar & Uddhav Kund.",
              "Proceed to Barsana Parikrama covering Mor Kuti, Maan Mandir, Shyam Chudi Wala Mandir, Jaipur Mandir & Ladli Ji Mandir.",
              "Visit Kirti Mandir & Nand Mahal, followed by Nandgaon Darshan and dinner."
            ]
          }
        ],
        inclusions: [
          "Comfortable AC room accommodation",
          "3 vegetarian meals daily (Breakfast, Lunch, Dinner)",
          "Sightseeing in a private AC vehicle",
          "Railway station / bus stand pickup & drop (Mathura)",
          "All tolls, parking & fuel charges included",
          "WhatsApp group support during the trip",
          "VIP Darshan entry where available",
          "E-rickshaw transport in restricted temple zones"
        ],
        exclusions: [
          "Temple or monument entry fees",
          "Train or flight tickets",
          "Personal expenses (shopping, snacks, etc.)",
          "Travel insurance",
          "Tips for guides, drivers & hotel staff",
          "Any service not mentioned in inclusions"
        ],
        pricing: {
          startingFrom: 7499,
          currency: "₹",
          note: "(Price may vary based on group size and season)"
        },
        idealFor: [
          "Families",
          "Senior citizens",
          "Friends & group travellers",
          "Spiritual seekers & devotees",
          "First-time Brij visitors"
        ],
        whyChoose: [
          "Well-planned itinerary covering complete Brij region",
          "Stress-free darshan with local coordination",
          "Comfortable stay & hygienic meals",
          "Transparent pricing with no hidden charges",
          "Trusted local team based in Mathura–Vrindavan"
        ],
        contactInfo: {
          phone1: "+91 7231056715",
          phone2: "+91 8079013665",
          whatsapp: "+91 7231056715",
          email: "vrindavansaathi@gmail.com"
        }
      }
    },

  ];

  const itinerary = [
    {
      day: "Day 1",
      title: "Mathura Exploration",
      stops: [
        "Pickup from Delhi/Agra (6:00 AM)",
        "Krishna Janmabhoomi Temple",
        "Dwarkadhish Temple",
        "Vishram Ghat",
        "Lunch at local restaurant",
        "Transfer to Vrindavan",
      ],
    },
    {
      day: "Day 2",
      title: "Vrindavan Divine Darshan",
      stops: [
        "Early morning Banke Bihari darshan",
        "ISKCON Temple",
        "Radha Raman Temple",
        "Shahji Temple",
        "Prem Mandir light show",
        "Dinner & overnight stay",
      ],
    },
    {
      day: "Day 3",
      title: "Sacred Sites & Return",
      stops: [
        "Govardhan Parikrama",
        "Radha Kund & Shyam Kund",
        "Kusum Sarovar",
        "Barsana (Radha Rani birthplace)",
        "Return journey to origin",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="pt-24 pb-12 ">
        <div className="container mx-auto px-4">
          <p className="text-primary font-medium mb-3 tracking-wider uppercase text-sm">
            Tour Packages
          </p>
          <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Choose Your Spiritual Journey
          </h1>
          <p className="text-muted-foreground max-w-2xl">
            From quick day trips to extended pilgrimages, we have the perfect
            tour package for every devotee. All tours include expert guides and
            comfortable transportation.
          </p>
        </div>
      </section>

      {/* Tour Packages */}
      <section className="py-12  rounded-2xl mx-4 md:mx-8 lg:mx-16 mb-16 min-h-[00px]">
        <div className="container mx-auto px-3">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 items-stretch h-full">
            {tourPackages.map((tour, index) => (
              <TourCard key={index} {...tour} />
            ))}
          </div>
        </div>
      </section>

      

      {/* Map Section Placeholder */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4">
              Tour Route Map
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Our complete tour covers all major sacred sites in Mathura and
              Vrindavan region
            </p>
          </div>

          <div className="bg-orange-500 rounded-2xl overflow-hidden aspect-video max-w-6xl mx-auto relative">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d229959.0799096176!2d77.3377507!3d27.57448975!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39736ce47bffc039%3A0xfe5fc5c83d7d5c8a!2sBrajbhoomi!5e0!3m2!1sen!2sin!4v1704537600000!5m2!1sen!2sin&maptype=satellite"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0"
            />
            <Button
              variant="secondary"
              size="sm"
              className={`absolute top-4 right-4 bg-orange-600 hover:bg-orange-700 text-white shadow-lg z-10 transition-all duration-1000 ${
                showAnimation ? 'animate-bounce' : ''
              }`}
              onClick={() => window.open('https://www.google.com/maps/@27.57448975,77.3377507,10z/data=!3m1!1e3', '_blank')}
            >
              Use Map
            </Button>
          </div>

          <div className="flex flex-wrap justify-center gap-6 mt-8 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-primary" />
              <span className="text-muted-foreground">Mathura Temples</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-secondary" />
              <span className="text-muted-foreground">Vrindavan Temples</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-accent" />
              <span className="text-muted-foreground">Sacred Sites</span>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Plans;
