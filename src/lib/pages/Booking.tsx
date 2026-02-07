import { useState, useEffect } from "react";
import { Calendar, Users, MapPin, Phone, Mail, User, Loader2, CheckCircle, Info, Sparkles, Heart } from "lucide-react";
import { Button } from "@/componants/ui/button";
import { Input } from "@/componants/ui/input";
import { Label } from "@/componants/ui/label";
import { Textarea } from "@/componants/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/componants/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/componants/ui/popover";
import Navbar from "@/componants/Navbar";
import Footer from "@/componants/Footer";
import { useToast } from "@/hooks/use-toast";
// Removed Supabase import - now using backend API
import v3Image from "@/assets/v3.jpeg";

const Booking = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailSuggestions, setEmailSuggestions] = useState<string[]>([]);
  const [showEmailSuggestions, setShowEmailSuggestions] = useState(false);
  const [formProgress, setFormProgress] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    tourPackage: "",
    travelDate: "",
    travelers: "",
    pickupLocation: "",
    specialRequests: "",
  });

  const emailDomains = [
    "gmail.com",
    "yahoo.com",
    "outlook.com",
    "hotmail.com",
    "icloud.com",
    "aol.com",
    "protonmail.com",
    "zoho.com"
  ];

  const packages = [

    { value: "2-day/2-night", label: "Two Days Spiritual Journey - ₹5,499" },
    { value: "3-day/3-night", label: "Three Days Complete Darshan - ₹7,499" },

  ];

//   const WHATSAPP_NUMBER = "917231056715"; // Replace with your WhatsApp number in international format

//   const sendWhatsAppMessage = () => {
//     const packageLabel = packages.find(p => p.value === formData.tourPackage)?.label || formData.tourPackage;
//     const message = `🙏 *New Booking Request*

// *Name:* ${formData.name}
// *Email:* ${formData.email}
// *Phone:* ${formData.phone}
// *Package:* ${packageLabel}
// *Travel Date:* ${formData.travelDate}
// *Travelers:* ${formData.travelers}
// *Pickup:* ${formData.pickupLocation}
// *Special Requests:* ${formData.specialRequests || "None"}`;

//     const encodedMessage = encodeURIComponent(message);
//     window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`, "_blank");
//   };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Convert form data to match backend API expectations
      const bookingData = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        tour_package: formData.tourPackage, // Backend expects snake_case
        travel_date: formData.travelDate,
        travelers: parseInt(formData.travelers),
        pickup_location: formData.pickupLocation.trim(),
        special_requests: formData.specialRequests.trim() || null
      };

      // Send booking data to backend API
      const response = await fetch('http://localhost:5001/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to submit booking');
      }

      console.log("Booking submitted successfully:", result);

      toast({
        title: "Booking Request Submitted!",
        description: "Your booking has been received. We'll send a confirmation email and contact you within 24 hours.",
      });

      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        tourPackage: "",
        travelDate: "",
        travelers: "",
        pickupLocation: "",
        specialRequests: "",
      });
    } catch (error) {
      console.error("Submission error:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "There was an error submitting your booking. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate form progress
  useEffect(() => {
    const requiredFields = ['name', 'email', 'phone', 'tourPackage', 'travelDate', 'travelers', 'pickupLocation'];
    const filledFields = requiredFields.filter(field => formData[field as keyof typeof formData]?.toString().trim());
    setFormProgress((filledFields.length / requiredFields.length) * 100);
  }, [formData]);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData({ ...formData, email: value });

    // Show email suggestions when typing
    if (value.includes('@')) {
      const [localPart, domainPart] = value.split('@');
      if (domainPart) {
        const suggestions = emailDomains
          .filter(domain => domain.toLowerCase().startsWith(domainPart.toLowerCase()))
          .map(domain => `${localPart}@${domain}`);
        setEmailSuggestions(suggestions);
        setShowEmailSuggestions(suggestions.length > 0);
      } else {
        setShowEmailSuggestions(false);
      }
    } else {
      setShowEmailSuggestions(false);
    }
  };

  const selectEmailSuggestion = (suggestion: string) => {
    setFormData({ ...formData, email: suggestion });
    setShowEmailSuggestions(false);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-24 pb-12">
        <div className="absolute inset-0">
          <img
            src={v3Image}
            alt="Booking background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 via-foreground/50 to-transparent" />
        </div>
        <div className="relative container mx-auto px-4">
          <p className="text-primary font-medium mb-3 tracking-wider uppercase text-sm">
            Book Your Tour
          </p>
          <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-4">
            Start Your Pilgrimage Today
          </h1>
          <p className="text-primary-foreground/80 max-w-2xl">
            Fill out the form below to book your spiritual journey to Vrindavan
            and Mathura. We'll get back to you within 24 hours with confirmation
            details.
          </p>
        </div>
      </section>

      {/* Booking Form */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-2">
              <form
                onSubmit={handleSubmit}
                className="bg-card p-6 md:p-8 rounded-2xl shadow-lg"
              >
                <h2 className="font-display text-2xl font-bold text-foreground mb-6">
                  Booking Details
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter your full name"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="your@email.com"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Phone number with country code"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  {/* Tour Package */}
                  <div className="space-y-2">
                    <Label>Tour Package *</Label>
                    <Select
                      value={formData.tourPackage}
                      onValueChange={(value) =>
                        setFormData({ ...formData, tourPackage: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a package" />
                      </SelectTrigger>
                      <SelectContent>
                        {packages.map((pkg) => (
                          <SelectItem key={pkg.value} value={pkg.value}>
                            {pkg.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Travel Date */}
                  <div className="space-y-2">
                    <Label htmlFor="travelDate">Travel Date *</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="travelDate"
                        name="travelDate"
                        type="date"
                        placeholder="Date of your journey"
                        value={formData.travelDate}
                        onChange={handleChange}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  {/* Number of Travelers */}
                  <div className="space-y-2">
                    <Label htmlFor="travelers">Number of members *</Label>
                    <div className="relative">
                      <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="travelers"
                        name="travelers"
                        type="number"
                        min="1"
                        max="50"
                        value={formData.travelers}
                        onChange={handleChange}
                        placeholder="Number of members traveling"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  {/* Pickup Location */}
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="pickupLocation">Pickup Location *</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="pickupLocation"
                        name="pickupLocation"
                        value={formData.pickupLocation}
                        onChange={handleChange}
                        placeholder="Pickup Location (Mathura, Vrindavan, Bus stop , railway station ,etc.)"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  {/* Special Requests */}
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="specialRequests">
                      Special Requests (Optional)
                    </Label>
                    <Textarea
                      id="specialRequests"
                      name="specialRequests"
                      value={formData.specialRequests}
                      onChange={handleChange}
                      placeholder="Any special requirements, dietary restrictions, accessibility needs, etc."
                      rows={4}
                    />
                  </div>
                </div>

                <Button type="submit" size="lg" className="w-full mt-8" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Booking Request"
                  )}
                </Button>
              </form>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Package Summary */}
              <div className="bg-card p-6 rounded-2xl shadow-lg">
                <h3 className="font-display text-lg font-semibold text-foreground mb-4">
                  What's Included
                </h3>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary">✓</span>
                    Professional spiritual guide
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">✓</span>
                    AC transportation
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">✓</span>
                    Temple entry assistance
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">✓</span>
                    Meals as per package
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">✓</span>
                    Hotel accommodation
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">✓</span>
                    24/7 support during tour
                  </li>
                </ul>
              </div>

              {/* Contact Info */}
              <div className="bg-mute text-gray-foreground p-6 rounded-2xl">
                <h3 className="font-display text-lg font-semibold mb-4">
                  Need Help?
                </h3>
                <p className="text-sm opacity-80 mb-4">
                  Our team is available to assist you with your booking.
                </p>
                <div className="space-y-3">
                  
                    <Phone className="w-4 h-4" />
                    <a href="tel:+917231056715" className="flex items-center gap-3 text-sm hover:opacity-80 transition-opacity">+91 7231056715</a>
                <a href="tel:+918079013665" className="flex items-center gap-3 text-sm hover:opacity-80 transition-opacity">+91 8079013665</a>
                  
                  
                    <Mail className="w-4 h-4" />
                      <a href="mailto:vrindavansaathi@gmail.com" className="flex items-center gap-3 text-sm hover:opacity-80 transition-opacity">vrindavansaathi@gmail.com</a>
                  
                </div>
              </div>

              {/* Cancellation Policy */}
              <div className="bg-muted p-6 rounded-2xl">
                <h3 className="font-display text-lg font-semibold text-foreground mb-3">
                  Cancellation Policy
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Free cancellation up to 7 days before</li>
                  <li>• 50% refund for 3-7 days notice</li>
                  <li>• No refund for less than 3 days</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Booking;
