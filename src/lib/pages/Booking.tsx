import { useState } from "react";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      const bookingData = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        tour_package: formData.tourPackage,
        travel_date: formData.travelDate,
        travelers: Number(formData.travelers) || 1,
        pickup_location: formData.pickupLocation.trim(),
        special_requests: formData.specialRequests.trim() || null,
      };

      const controller = new AbortController();

      const timeout = setTimeout(() => {
        controller.abort();
      }, 20000);

      const response = await fetch(
        "https://backend-p40q.onrender.com/api/bookings",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(bookingData),
          signal: controller.signal,
        }
      );

      clearTimeout(timeout);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Booking failed");
      }

      toast({
        title: "Booking Request Submitted!",
        description:
          "Your booking has been received. We'll contact you within 24 hours.",
      });

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
    } catch (error: any) {
      console.error(error);

      toast({
        title: "Error",
        description:
          error?.message || "Server may be waking up. Try again in a few seconds.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
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

      <section className="relative pt-24 pb-12">
        <div className="absolute inset-0">
          <img
            src={v3Image}
            alt="Booking background"
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4 max-w-3xl">

          <form
            onSubmit={handleSubmit}
            className="bg-card p-6 md:p-8 rounded-2xl shadow-lg"
          >
            <h2 className="text-2xl font-bold mb-6">Booking Details</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              <div>
                <Label>Full Name *</Label>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

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

              <div>
                <Label>Phone *</Label>
                <Input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>

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
                      <SelectItem key={pkg.value} value={pkg.value}>
                        {pkg.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

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

              <div className="md:col-span-2">
                <Label>Pickup Location *</Label>
                <Input
                  name="pickupLocation"
                  value={formData.pickupLocation}
                  onChange={handleChange}
                  required
                />
              </div>

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
      </section>

      <Footer />
    </div>
  );
};

export default Booking;
