import { useState } from "react";
import { MapPin, Phone, Mail, Send, Loader2 } from "lucide-react";
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
import v4Image from "@/assets/m2.jpeg";

const Contact = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    customer_name: "",
    customer_email: "",
    customer_phone: "",
    complaint_type: "",
    description: "",
  });

  // ✅ FIXED SUBMIT FUNCTION
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting) return; // prevent double click
    setIsSubmitting(true);

    try {
      const response = await fetch(
        "http://localhost:5001/api/complaints",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...formData,
            complaint_type: formData.complaint_type || "Inquiry",
          }),
        }
      );

      // 🔥 Check response BEFORE parsing JSON
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to submit inquiry");
      }

      await response.json();

      toast({
        title: "Inquiry Submitted Successfully!",
        description:
          "Thank you for contacting us. We'll respond within 24 hours.",
      });

      // Reset form
      setFormData({
        customer_name: "",
        customer_email: "",
        customer_phone: "",
        complaint_type: "",
        description: "",
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
      // 🔥 ALWAYS stops spinner
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

      {/* Hero */}
      <section className="relative pt-24 pb-12">
        <div className="absolute inset-0">
          <img
            src={v4Image}
            alt="Contact background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 via-foreground/50 to-transparent" />
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <form
                onSubmit={handleSubmit}
                className="bg-card p-6 md:p-8 rounded-2xl shadow-lg"
              >
                <h2 className="text-2xl font-bold mb-6">
                  Send us a Message
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label>Your Name *</Label>
                    <Input
                      name="customer_name"
                      value={formData.customer_name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div>
                    <Label>Email Address *</Label>
                    <Input
                      type="email"
                      name="customer_email"
                      value={formData.customer_email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div>
                    <Label>Phone Number *</Label>
                    <Input
                      type="tel"
                      name="customer_phone"
                      value={formData.customer_phone}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div>
                    <Label>Complaint Type</Label>
                    <Select
                      value={formData.complaint_type}
                      onValueChange={(value) =>
                        setFormData({
                          ...formData,
                          complaint_type: value,
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Inquiry">
                          General Inquiry
                        </SelectItem>
                        <SelectItem value="Service">
                          Service
                        </SelectItem>
                        <SelectItem value="Food">
                          Food
                        </SelectItem>
                        <SelectItem value="Transport">
                          Transport
                        </SelectItem>
                        <SelectItem value="Accommodation">
                          Accommodation
                        </SelectItem>
                        <SelectItem value="Guide">
                          Guide
                        </SelectItem>
                        <SelectItem value="Other">
                          Other
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="md:col-span-2">
                    <Label>Description *</Label>
                    <Textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={6}
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="mt-6"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="space-y-6">
              <div className="bg-card p-5 rounded-xl shadow-sm border">
                <h3 className="font-semibold mb-2">Phone</h3>
                <p>+91 7231056715</p>
                <p>+91 8079013665</p>
              </div>

              <div className="bg-card p-5 rounded-xl shadow-sm border">
                <h3 className="font-semibold mb-2">Email</h3>
                <p>vrindavansaathi@gmail.com</p>
              </div>

              <div className="bg-card p-5 rounded-xl shadow-sm border">
                <h3 className="font-semibold mb-2">Address</h3>
                <p>Vrindavan, Mathura</p>
                <p>Uttar Pradesh - 281121</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;
