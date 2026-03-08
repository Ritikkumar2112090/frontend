import { useState, useEffect } from "react";
import {
  Calendar,
  Users,
  MapPin,
  Phone,
  Mail,
  User,
  Loader2,
} from "lucide-react";
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
import Navbar from "@/componants/Navbar";
import Footer from "@/componants/Footer";
import { useToast } from "@/hooks/use-toast";
import v3Image from "@/assets/v3.jpeg";

const Booking = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const packages = [
    { value: "2-day/2-night", label: "Two Days Spiritual Journey - ₹5,499" },
    { value: "3-day/3-night", label: "Three Days Complete Darshan - ₹7,499" },
  ];

  // ✅ FIXED SUBMIT FUNCTION
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting) return; // prevent double click

    setIsSubmitting(true);

    try {
      const bookingData = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        tour_package: formData.tourPackage,
        travel_date: formData.travelDate,
        travelers: parseInt(formData.travelers),
        pickup_location: formData.pickupLocation.trim(),
        special_requests: formData.specialRequests.trim() || null,
      };

      const response = await fetch(
        "https://backend-p40q.onrender.com/api/bookings",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(bookingData),
        }
      );

      // 🔥 check status before parsing
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to submit booking");
      }

      await response.json();

      toast({
        title: "Booking Request Submitted!",
        description:
          "Your booking has been received. We'll contact you within 24 hours.",
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

      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error: any) {
      console.error("Submission error:", error);

      toast({
        title: "Error",
        description:
          error?.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false); // 🔥 always stops loading
    }
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
      </section>

      {/* Booking Form */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <form
                onSubmit={handleSubmit}
                className="bg-card p-6 md:p-8 rounded-2xl shadow-lg"
              >
                <h2 className="text-2xl font-bold mb-6">
                  Booking Details
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div>
                    <Label>Full Name *</Label>
                    <Input
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <Label>Email *</Label>
                    <Input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <Label>Phone *</Label>
                    <Input
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {/* Package */}
                  <div>
                    <Label>Tour Package *</Label>
                    <Select
                      value={formData.tourPackage}
                      onValueChange={(value) =>
                        setFormData({ ...formData, tourPackage: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select package" />
                      </SelectTrigger>
                      <SelectContent>
                        {packages.map((pkg) => (
                          <SelectItem
                            key={pkg.value}
                            value={pkg.value}
                          >
                            {pkg.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Travel Date */}
                  <div>
                    <Label>Travel Date *</Label>
                    <Input
                      type="date"
                      name="travelDate"
                      value={formData.travelDate}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {/* Travelers */}
                  <div>
                    <Label>Number of Members *</Label>
                    <Input
                      type="number"
                      min="1"
                      name="travelers"
                      value={formData.travelers}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {/* Pickup */}
                  <div className="md:col-span-2">
                    <Label>Pickup Location *</Label>
                    <Input
                      name="pickupLocation"
                      value={formData.pickupLocation}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {/* Special Requests */}
                  <div className="md:col-span-2">
                    <Label>Special Requests</Label>
                    <Textarea
                      name="specialRequests"
                      value={formData.specialRequests}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full mt-8"
                  disabled={isSubmitting}
                >
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
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Booking;

