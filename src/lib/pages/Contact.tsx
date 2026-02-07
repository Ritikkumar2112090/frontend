import { useState } from "react";
import { MapPin, Phone, Mail, Clock, Send, Loader2 } from "lucide-react";
import { Button } from "@/componants/ui/button";
import { Input } from "@/componants/ui/input";
import { Label } from "@/componants/ui/label";
import { Textarea } from "@/componants/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/componants/ui/select";
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Submit to complaints API
      const complaintResponse = await fetch('http://localhost:5001/api/complaints', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          complaint_type: formData.complaint_type || 'Inquiry',
        }),
      });

      const complaintData = await complaintResponse.json();

      if (complaintData.success) {
        toast({
          title: "Inquiry Submitted Successfully!",
          description: "Thank you for contacting us. Your inquiry has been recorded and we'll respond within 24 hours.",
        });
        setFormData({
          customer_name: "",
          customer_email: "",
          customer_phone: "",
          complaint_type: "",
          description: "",
        });
      } else {
        toast({
          title: "Error",
          description: complaintData.message || "Failed to submit inquiry. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error submitting inquiry:', error);
      toast({
        title: "Error",
        description: "Failed to submit inquiry. Please check your connection and try again.",
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

  const contactInfo = [
    {
      icon: MapPin,
      title: "Office Address",
      details: [
        "Vrindavan, Mathura",
        "Uttar Pradesh - 281121",
      ],
    },
    {
      icon: Phone,
      title: "Phone Numbers",
      details: ["+91 7231056715", "+91 8079013665"],
    },
    {
      icon: Mail,
      title: "Email Addresses",
      details: [
        "vrindavansaathi@gmail.com",
      ],
    },
  ];

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
        <div className="relative container mx-auto px-4">
          <p className="text-primary font-medium mb-3 tracking-wider uppercase text-sm">
            Contact Us
          </p>
          <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-4">
            Get in Touch
          </h1>
          <p className="text-primary-foreground/80 max-w-2xl">
            Have questions about our tours? Want to customize a package? We're
            here to help you plan your perfect spiritual journey.
          </p>
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
                <h2 className="font-display text-2xl font-bold text-foreground mb-6">
                  Send us a Message
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="customer_name">Your Name *</Label>
                    <Input
                      id="customer_name"
                      name="customer_name"
                      value={formData.customer_name}
                      onChange={handleChange}
                      placeholder="Enter your name"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="customer_email">Email Address *</Label>
                    <Input
                      id="customer_email"
                      name="customer_email"
                      type="email"
                      value={formData.customer_email}
                      onChange={handleChange}
                      placeholder="your@email.com"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="customer_phone">Phone Number *</Label>
                    <Input
                      id="customer_phone"
                      name="customer_phone"
                      type="tel"
                      value={formData.customer_phone}
                      onChange={handleChange}
                      placeholder="+91 9876543210"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="complaint_type">Complaint Type</Label>
                    <Select
                      value={formData.complaint_type}
                      onValueChange={(value) => setFormData({ ...formData, complaint_type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select complaint type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Inquiry">General Inquiry</SelectItem>
                        <SelectItem value="Service">Service</SelectItem>
                        <SelectItem value="Food">Food</SelectItem>
                        <SelectItem value="Transport">Transport</SelectItem>
                        <SelectItem value="Accommodation">Accommodation</SelectItem>
                        <SelectItem value="Guide">Guide</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Please describe your complaint or inquiry in detail..."
                      rows={6}
                      required
                    />
                  </div>
                </div>

                <Button type="submit" size="lg" className="mt-6" disabled={isSubmitting}>
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
              {contactInfo.map((info, index) => (
                <div
                  key={index}
                  className="bg-card p-5 rounded-xl shadow-sm border border-border"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <info.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">
                        {info.title}
                      </h3>
                      <ul className="space-y-1">
                        {info.details.map((detail, detailIndex) => (
                          <li
                            key={detailIndex}
                            className="text-sm text-muted-foreground"
                          >
                            {detail}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      

      <Footer />
    </div>
  );
};

export default Contact;
