import { useState, useEffect, useRef } from "react";
import { Lock, RefreshCw, Calendar, Users, MapPin, Phone, Mail, Clock, Plus, Edit, Trash2, FileText, Send, MessageSquare, Receipt, User, LogOut, Search, Filter, Download, ChevronLeft, ChevronRight, Eye, AlertTriangle, BarChart3, TrendingUp, DollarSign, CheckCircle, XCircle, AlertCircle, MoreHorizontal, Settings, Bell } from "lucide-react";
import { Button } from "@/componants/ui/button";
import { Input } from "@/componants/ui/input";
import { Label } from "@/componants/ui/label";
import { Badge } from "@/componants/ui/badge";
import { Textarea } from "@/componants/ui/textarea";
import { createRoot } from "react-dom/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/componants/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/componants/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/componants/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/componants/ui/alert-dialog";
import Navbar from "@/componants/Navbar";
import Footer from "@/componants/Footer";
import { useToast } from "@/hooks/use-toast";
// JWT-based authentication for admin functionality

const API_BASE_URL = 'http://localhost:5001/api';

// JWT token management
const TOKEN_KEY = 'admin_token';
const REFRESH_TOKEN_KEY = 'admin_refresh_token';

const getStoredToken = () => localStorage.getItem(TOKEN_KEY);
const setStoredToken = (token: string) => localStorage.setItem(TOKEN_KEY, token);
const removeStoredToken = () => localStorage.removeItem(TOKEN_KEY);
const getStoredRefreshToken = () => localStorage.getItem(REFRESH_TOKEN_KEY);
const setStoredRefreshToken = (token: string) => localStorage.setItem(REFRESH_TOKEN_KEY, token);
const removeStoredRefreshToken = () => localStorage.removeItem(REFRESH_TOKEN_KEY);

// API helper functions
const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const token = getStoredToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // Handle token expiration
  if (response.status === 401) {
    const refreshToken = getStoredRefreshToken();
    if (refreshToken) {
      try {
        const refreshResponse = await fetch(`${API_BASE_URL}/auth/refresh`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken }),
        });

        if (refreshResponse.ok) {
          const refreshData = await refreshResponse.json();
          setStoredToken(refreshData.data.tokens.accessToken);
          setStoredRefreshToken(refreshData.data.tokens.refreshToken);

          // Retry the original request with new token
          headers.Authorization = `Bearer ${refreshData.data.tokens.accessToken}`;
          return fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers,
          });
        }
      } catch (error) {
        console.error('Token refresh failed:', error);
      }
    }
    // If refresh fails, clear tokens and redirect to login
    removeStoredToken();
    removeStoredRefreshToken();
    window.location.reload();
  }

  return response;
};

interface Booking {
  id: string;
  name: string;
  email: string;
  phone: string;
  tour_package: string;
  travel_date: string;
  travelers: number;
  pickup_location: string;
  special_requests: string | null;
  status: string;
  created_at: string;
}

interface Complaint {
  id: string;
  booking_id: string | null;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  complaint_type: string;
  description: string;
  status: string;
  priority: string;
  created_at: string;
  updated_at: string;
  resolved_at: string | null;
}

interface Bill {
  id: string;
  booking_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  tour_package: string;
  travelers: number;
  total_amount: number;
  currency: string;
  status: string;
  base_amount: number;
  taxes: number;
  sent_at: string | null;
  created_at: string;
  due_date: string | null;
}

const Admin = () => {
  const { toast } = useToast();
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [tokens, setTokens] = useState<{ accessToken: string; refreshToken: string } | null>(null);

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [bills, setBills] = useState<Bill[]>([]);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [showCreateBooking, setShowCreateBooking] = useState(false);
  const [showBillModal, setShowBillModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [billAmount, setBillAmount] = useState("");
  const [newBooking, setNewBooking] = useState({
    name: "",
    email: "",
    phone: "",
    tour_package: "",
    travel_date: "",
    travelers: 1,
    pickup_location: "",
    special_requests: ""
  });
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showDashboard, setShowDashboard] = useState(true);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [showComplaintDetails, setShowComplaintDetails] = useState(false);
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  const [showBillDetails, setShowBillDetails] = useState(false);
  const [showCreateBill, setShowCreateBill] = useState(false);
  const [bookingBills, setBookingBills] = useState<Bill[]>([]);
  const [showBookingBills, setShowBookingBills] = useState(false);
  const [billSearchTerm, setBillSearchTerm] = useState("");
  const [billStatusFilter, setBillStatusFilter] = useState<string>("all");
  const [newBill, setNewBill] = useState({
    customer_name: "",
    customer_email: "",
    customer_phone: "",
    tour_package: "",
    travelers: 1,
    total_amount: "",
    currency: "₹",
  });
  const [hiddenBill, setHiddenBill] = useState<Bill | null>(null);

  // Clear stored tokens on component mount to ensure password is always required
  useEffect(() => {
    removeStoredToken();
    removeStoredRefreshToken();
    setIsAuthenticated(false);
  }, []);

  // JWT-based login function
  const login = async (password: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

    const { tokens: newTokens } = data.data;
    setTokens(newTokens);
    setStoredToken(newTokens.accessToken);
    setStoredRefreshToken(newTokens.refreshToken);
      setIsAuthenticated(true);

      return true;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const packageLabels: Record<string, string> = {
    "2-day/2-night": "Two Days Spiritual Journey - ₹5,499",
    "3-day/3-night": "Three Days Complete Darshan - ₹7,499",
  };

  // Calculate dashboard statistics
  const totalRevenue = bills.reduce((sum, bill) => sum + bill.total_amount, 0);
  const pendingPayments = bills.filter(bill => bill.status === 'pending').length;
  const resolvedComplaints = complaints.filter(c => c.status === 'resolved').length;
  const recentBookings = bookings.filter(b => {
    const bookingDate = new Date(b.created_at);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return bookingDate >= weekAgo;
  }).length;

  // Filter bookings based on search and status (exclude inquiries)
  const filteredBookings = bookings.filter(booking => {
    // Exclude inquiries from booking display
    if (booking.status === 'inquiry') return false;

    const matchesSearch = searchTerm === "" ||
      booking.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.phone.includes(searchTerm);

    const matchesStatus = statusFilter === "all" || booking.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Filter bills based on search and status
  const filteredBills = bills.filter(bill => {
    const matchesSearch = billSearchTerm === "" ||
      bill.customer_name.toLowerCase().includes(billSearchTerm.toLowerCase()) ||
      bill.customer_email.toLowerCase().includes(billSearchTerm.toLowerCase()) ||
      bill.customer_phone.includes(billSearchTerm);

    const matchesStatus = billStatusFilter === "all" || bill.status === billStatusFilter;

    return matchesSearch && matchesStatus;
  });

  // Fetch data when section changes
  useEffect(() => {
    if (isAuthenticated) {
      if (activeSection === "complaints" && complaints.length === 0) {
        fetchComplaints();
      } else if (activeSection === "billing" && bills.length === 0) {
        fetchBills();
      }
    }
  }, [activeSection, isAuthenticated]);

  const fetchBookings = async () => {
    setIsLoading(true);
    try {
      const response = await apiRequest('/bookings/admin');

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to fetch bookings');
      }

      const fetchedBookings = (result.data?.bookings || []).map(booking => ({
        ...booking,
        id: booking._id || booking.id
      }));

      setBookings(fetchedBookings);

      // Auto-generate bills for all bookings that don't have bills yet
      const bookingsWithoutBills = fetchedBookings.filter(booking =>
        !bills.some(bill => bill.booking_id === booking.id)
      );

      if (bookingsWithoutBills.length > 0) {
        // Calculate amount based on package (you can customize this logic)
        const getPackageAmount = (tourPackage: string) => {
          const packageAmounts: Record<string, number> = {
            "2-day/2-night": 5499,
            "3-day/3-night": 7499,
          };
          return packageAmounts[tourPackage] || 5000; // Default amount
        };

        // Generate bills for bookings without bills
        const newBills: Bill[] = bookingsWithoutBills.map(booking => {
          const packageAmount = getPackageAmount(booking.tour_package);
          const totalAmount = packageAmount * booking.travelers;
          return {
            id: `bill_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            booking_id: booking.id,
            customer_name: booking.name,
            customer_email: booking.email,
            customer_phone: booking.phone,
            tour_package: booking.tour_package,
            travelers: booking.travelers,
            total_amount: totalAmount,
            currency: "₹",
            status: "draft",
            base_amount: totalAmount,
            taxes: 0, // As per previous requirement to remove taxes
            sent_at: null,
            created_at: new Date().toISOString(),
            due_date: null,
          };
        });

        // Add new bills to state
        setBills(prev => [...prev, ...newBills]);
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to fetch bookings",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchComplaints = async () => {
    setIsLoading(true);
    try {
      const response = await apiRequest('/complaints/admin');

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to fetch complaints');
      }

      setComplaints((result.data?.complaints || []).map(complaint => ({
        ...complaint,
        id: complaint._id || complaint.id
      })));
    } catch (error) {
      console.error("Error fetching complaints:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to fetch complaints",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchBills = async () => {
    setIsLoading(true);
    try {
      const response = await apiRequest('/bills/admin');

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to fetch bills');
      }

      setBills(result.data?.bills || []);
    } catch (error) {
      console.error("Error fetching bills:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to fetch bills",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPassword("");
    setRememberMe(false);
    localStorage.removeItem("adminRemembered");
    setBookings([]);
    setComplaints([]);
    setBills([]);
    setActiveSection("bookings");
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
  };

  const updateStatus = async (bookingId: string, status: string) => {
    try {
      const response = await apiRequest(`/bookings/${bookingId}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to update status');
      }

      // Update local state
      setBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? { ...b, status } : b))
      );

      toast({
        title: "Status Updated",
        description: `Booking status changed to ${status}`,
      });
    } catch (error) {
      console.error("Error updating status:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update status",
        variant: "destructive",
      });
    }
  };

  const updateBillStatus = async (billId: string, status: string) => {
    try {
      // Update local state
      setBills((prev) =>
        prev.map((b) => (b.id === billId ? { ...b, status } : b))
      );

      toast({
        title: "Bill Status Updated",
        description: `Bill status changed to ${status}`,
      });
    } catch (error) {
      console.error("Error updating bill status:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update bill status",
        variant: "destructive",
      });
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const success = await login(password);
      if (success) {
        setLoginAttempts(0);
        if (rememberMe) {
          localStorage.setItem("adminRemembered", "true");
        }
        fetchBookings();
        toast({
          title: "Login Successful",
          description: "Welcome to the admin dashboard.",
        });
      } else {
        const newAttempts = loginAttempts + 1;
        setLoginAttempts(newAttempts);
        toast({
          title: "Invalid Password",
          description: `Please enter the correct admin password. ${3 - newAttempts} attempts remaining.`,
          variant: "destructive",
        });
      }
    } catch (error) {
      const newAttempts = loginAttempts + 1;
      setLoginAttempts(newAttempts);
      toast({
        title: "Login Failed",
        description: error instanceof Error ? error.message : "Authentication failed",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // CRUD Operations for Bookings
  const createBooking = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newBooking.name,
          email: newBooking.email,
          phone: newBooking.phone,
          tour_package: newBooking.tour_package,
          travel_date: newBooking.travel_date,
          travelers: newBooking.travelers,
          pickup_location: newBooking.pickup_location,
          special_requests: newBooking.special_requests || null
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to create booking');
      }

      // Refresh bookings list
      await fetchBookings();

      setShowCreateBooking(false);
      setNewBooking({
        name: "",
        email: "",
        phone: "",
        tour_package: "",
        travel_date: "",
        travelers: 1,
        pickup_location: "",
        special_requests: ""
      });

      toast({
        title: "Booking Created",
        description: "New booking has been added successfully.",
      });
    } catch (error) {
      console.error("Error creating booking:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create booking",
        variant: "destructive",
      });
    }
  };

  const deleteBooking = async (bookingId: string) => {
    try {
      const response = await apiRequest(`/bookings/${bookingId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || 'Failed to delete booking');
      }

      // Update local state
      setBookings(prev => prev.filter(b => b.id !== bookingId));
      toast({
        title: "Booking Deleted",
        description: "Booking has been removed successfully.",
      });
    } catch (error) {
      console.error("Error deleting booking:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete booking",
        variant: "destructive",
      });
    }
  };

  const deleteComplaint = async (complaintId: string) => {
    try {
      const response = await apiRequest(`/complaints/${complaintId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || 'Failed to delete complaint');
      }

      // Update local state
      setComplaints(prev => prev.filter(c => c.id !== complaintId));
      toast({
        title: "Complaint Deleted",
        description: "Complaint has been removed successfully.",
      });
    } catch (error) {
      console.error("Error deleting complaint:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete complaint",
        variant: "destructive",
      });
    }
  };

  const generateBill = async (booking: Booking) => {
    setSelectedBooking(booking);
    setBillAmount("");
    setShowBillModal(true);
  };

  const sendBill = async () => {
    if (!selectedBooking || !billAmount) return;

    try {
      const amount = parseFloat(billAmount) || 0;

      // Mock create and send bill
      const newBill: Bill = {
        id: Date.now().toString(),
        booking_id: selectedBooking.id,
        customer_name: selectedBooking.name,
        customer_email: selectedBooking.email,
        customer_phone: selectedBooking.phone,
        tour_package: selectedBooking.tour_package,
        travelers: selectedBooking.travelers,
        total_amount: amount,
        currency: "₹",
        status: "pending",
        base_amount: amount,
        taxes: 0,
        sent_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        due_date: null,
      };

      setBills(prev => [...prev, newBill]);

      setShowBillModal(false);
      setSelectedBooking(null);
      setBillAmount("");

      toast({
        title: "Bill Sent Successfully",
        description: "Bill has been created and sent to the customer.",
      });
    } catch (error) {
      console.error("Error sending bill:", error);
      toast({
        title: "Error",
        description: "Failed to send bill",
        variant: "destructive",
      });
    }
  };

  const sendBookingEmail = async (booking: Booking) => {
    try {
      const response = await apiRequest(`/bookings/${booking.id}/send-email`, {
        method: 'POST',
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || 'Failed to send booking email');
      }

      toast({
        title: "Email Sent Successfully",
        description: `Booking confirmation email sent to ${booking.name}`,
      });
    } catch (error) {
      console.error("Error sending booking email:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to send booking email",
        variant: "destructive",
      });
    }
  };

  const deleteBill = async (billId: string) => {
    try {
      // Mock delete - just remove from local state
      setBills(prev => prev.filter(b => b.id !== billId));
      toast({
        title: "Bill Deleted",
        description: "Bill has been removed successfully.",
      });
    } catch (error) {
      console.error("Error deleting bill:", error);
      toast({
        title: "Error",
        description: "Failed to delete bill",
        variant: "destructive",
      });
    }
  };

  const sendBillEmail = async (bill: Bill) => {
    try {
      const response = await apiRequest(`/bills/${bill.id}/send`, {
        method: 'POST',
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to send bill email');
      }

      // Update bill status to sent
      setBills(prev => prev.map(b =>
        b.id === bill.id ? { ...b, status: 'sent', sent_at: new Date().toISOString() } : b
      ));

      toast({
        title: "Bill Email Sent Successfully",
        description: `Bill sent to ${bill.customer_name} at ${bill.customer_email}`,
      });
    } catch (error) {
      console.error("Error sending bill email:", error);
      toast({
        title: "Email Failed",
        description: error instanceof Error ? error.message : "Failed to send bill email. Please check email configuration.",
        variant: "destructive",
      });
    }
  };

  const viewBookingBills = (booking: Booking) => {
    // Filter bills that belong to this booking
    const bookingBills = bills.filter(bill => bill.booking_id === booking.id);
    setSelectedBooking(booking);
    setBookingBills(bookingBills);
    setShowBookingBills(true);
  };

  const autoGenerateBillsForAllBookings = async () => {
    try {
      setIsLoading(true);

      // Get all bookings that don't have bills yet
      const bookingsWithoutBills = bookings.filter(booking =>
        !bills.some(bill => bill.booking_id === booking.id)
      );

      if (bookingsWithoutBills.length === 0) {
        toast({
          title: "No New Bills to Generate",
          description: "All bookings already have bills generated.",
        });
        return;
      }

      // Calculate amount based on package (you can customize this logic)
      const getPackageAmount = (tourPackage: string) => {
        const packageAmounts: Record<string, number> = {
          "2-day/2-night": 5499,
          "3-day/3-night": 7499,
        };
        return packageAmounts[tourPackage] || 5000; // Default amount
      };

      // Generate bills for bookings without bills
      const newBills: Bill[] = bookingsWithoutBills.map(booking => {
        const amount = getPackageAmount(booking.tour_package);
        return {
          id: `bill_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          booking_id: booking.id,
          customer_name: booking.name,
          customer_email: booking.email,
          customer_phone: booking.phone,
          tour_package: booking.tour_package,
          travelers: booking.travelers,
          total_amount: amount,
          currency: "₹",
          status: "draft",
          base_amount: amount,
          taxes: 0, // As per previous requirement to remove taxes
          sent_at: null,
          created_at: new Date().toISOString(),
          due_date: null,
        };
      });

      // Add new bills to state
      setBills(prev => [...prev, ...newBills]);

      toast({
        title: "Bills Generated Successfully",
        description: `Generated ${newBills.length} bills for bookings without existing bills.`,
      });

      // Refresh bills section
      setActiveSection("billing");

    } catch (error) {
      console.error("Error generating bills:", error);
      toast({
        title: "Error",
        description: "Failed to generate bills automatically",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const downloadBookingPhoto = async (bill: Bill) => {
    try {
      // Get photos related to the tour package
      const response = await apiRequest('/photos/admin');

      if (!response.ok) {
        throw new Error('Failed to fetch photos');
      }

      const result = await response.json();
      const photos: any[] = result.data?.photos || [];

      // Find photos related to the tour package or general tour photos
      const tourPhotos = photos.filter((photo: any) =>
        photo.category === 'tour' ||
        photo.category === 'temple' ||
        (photo.tags && photo.tags.some((tag: string) =>
          tag.toLowerCase().includes(bill.tour_package.toLowerCase()) ||
          tag.toLowerCase().includes('vrindavan') ||
          tag.toLowerCase().includes('temple')
        ))
      );

      if (tourPhotos.length === 0) {
        toast({
          title: "No Photos Available",
          description: "No official photos found for this booking.",
          variant: "destructive",
        });
        return;
      }

      // Use the first available photo or a featured one
      const selectedPhoto = tourPhotos.find((photo: any) => photo.is_featured) || tourPhotos[0];

      // Download the photo
      const imageResponse = await fetch(`http://localhost:5001${selectedPhoto.url}`);
      if (!imageResponse.ok) {
        throw new Error('Failed to download photo');
      }

      const blob = await imageResponse.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `booking-${bill.customer_name.replace(/\s+/g, '_')}-official.jpg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Photo Downloaded",
        description: `Official booking photo for ${bill.customer_name} has been downloaded successfully.`,
      });
    } catch (error) {
      console.error("Error downloading booking photo:", error);
      toast({
        title: "Error",
        description: "Failed to download booking photo",
        variant: "destructive",
      });
    }
  };

  const downloadBillForBooking = async (booking: Booking) => {
    try {
      // Find existing bill for this booking
      const existingBill = bills.find(bill => bill.booking_id === booking.id);

      if (!existingBill) {
        toast({
          title: "No Bill Found",
          description: "No bill exists for this booking. Please generate bills first.",
          variant: "destructive",
        });
        return;
      }

      // Create a temporary container for the bill
      const tempContainer = document.createElement('div');
      tempContainer.style.position = 'absolute';
      tempContainer.style.left = '-9999px';
      tempContainer.style.top = '-9999px';
      tempContainer.style.width = '800px';
      tempContainer.style.backgroundColor = '#ffffff';
      document.body.appendChild(tempContainer);

      // Create the bill JSX element
      const billElement = (
        <div id={`temp-bill-${existingBill.id}`} className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-8 shadow-xl" style={{ width: '800px', backgroundColor: '#ffffff' }}>
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Receipt className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Vrindavan Saathi</h2>
            <p className="text-gray-600">Spiritual Journey Tours</p>
            <div className="border-t-2 border-blue-300 mt-4 pt-4">
              <h3 className="text-xl font-semibold text-blue-800">OFFICIAL BILL</h3>
            </div>
          </div>

          {/* Bill Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-700 mb-2">Bill Information</h4>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Bill ID:</span>
                    <span className="font-mono font-semibold text-blue-600">{existingBill.id.slice(-8).toUpperCase()}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Date:</span>
                    <span className="font-medium">{formatDateTime(existingBill.created_at)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Status:</span>
                    <Badge variant={existingBill.status === "paid" ? "default" : existingBill.status === "sent" ? "secondary" : "outline"} className="font-medium">
                      {existingBill.status.toUpperCase()}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-700 mb-2">Customer Details</h4>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Name:</span>
                    <span className="font-medium">{existingBill.customer_name}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Email:</span>
                    <span className="font-medium text-sm">{existingBill.customer_email}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Phone:</span>
                    <span className="font-medium">{existingBill.customer_phone}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tour Details */}
          <div className="mb-8">
            <h4 className="font-semibold text-gray-700 mb-4">Tour Details</h4>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Users className="w-6 h-6 text-green-600" />
                  </div>
                  <p className="text-sm text-gray-600">Travelers</p>
                  <p className="text-xl font-bold text-gray-800">{existingBill.travelers}</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <MapPin className="w-6 h-6 text-purple-600" />
                  </div>
                  <p className="text-sm text-gray-600">Package</p>
                  <p className="text-sm font-bold text-gray-800">{packageLabels[existingBill.tour_package] || existingBill.tour_package}</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <DollarSign className="w-6 h-6 text-orange-600" />
                  </div>
                  <p className="text-sm text-gray-600">Total Amount</p>
                  <p className="text-2xl font-bold text-green-600">{existingBill.currency} {existingBill.total_amount.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Information */}
          <div className="mb-8">
            <h4 className="font-semibold text-gray-700 mb-4">Payment Information</h4>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Due Date</p>
                  <p className="font-medium">{existingBill.due_date ? formatDate(existingBill.due_date) : 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Payment Methods</p>
                  <p className="font-medium">Cash, UPI, Card, Bank Transfer</p>
                </div>
              </div>
              <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <p className="text-sm text-yellow-800">
                  <strong>Note:</strong> Please make payment before the due date to avoid any inconvenience.
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center border-t-2 border-blue-300 pt-6">
            <p className="text-gray-600 mb-2">Thank you for choosing Vrindavan Saathi!</p>
            <p className="text-sm text-gray-500">For any queries, contact us at vrindavansaathi@gmail.com or +91 7231056715</p>
            <p className="text-xs text-gray-400 mt-2">© {new Date().getFullYear()} Vrindavan Saathi. All rights reserved.</p>
          </div>
        </div>
      );

      // Render the bill element using React
      const root = createRoot(tempContainer);
      root.render(billElement);

      // Wait for rendering to complete
      await new Promise(resolve => setTimeout(resolve, 100));

      // Import html2canvas dynamically
      const html2canvas = (await import('html2canvas')).default;

      // Configure html2canvas options for better quality
      const canvas = await html2canvas(tempContainer, {
        scale: 2, // Higher resolution
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: 800,
        height: tempContainer.offsetHeight,
      });

      // Convert canvas to blob
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `bill-${existingBill.customer_name.replace(/\s+/g, '_')}-${existingBill.id.slice(-8)}.png`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);

          toast({
            title: "Bill Downloaded",
            description: `Bill for ${existingBill.customer_name} has been downloaded as an image.`,
          });
        } else {
          toast({
            title: "Error",
            description: "Failed to generate bill image",
            variant: "destructive",
          });
        }
      }, 'image/png', 1.0);

      // Clean up
      root.unmount();
      document.body.removeChild(tempContainer);

    } catch (error) {
      console.error("Error downloading bill for booking:", error);
      toast({
        title: "Error",
        description: "Failed to download bill as image",
        variant: "destructive",
      });
    }
  };

  const downloadBillAsImage = async (billId: string) => {
    try {
      const billElement = document.getElementById(`bill-card-${billId}`);
      if (!billElement) {
        toast({
          title: "Error",
          description: "Bill element not found",
          variant: "destructive",
        });
        return;
      }

      // Import html2canvas dynamically
      const html2canvas = (await import('html2canvas')).default;

      // Configure html2canvas options for better quality
      const canvas = await html2canvas(billElement, {
        scale: 2, // Higher resolution
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: billElement.offsetWidth,
        height: billElement.offsetHeight,
      });

      // Convert canvas to blob
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `bill-${billId}.png`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);

          toast({
            title: "Image Downloaded",
            description: "Bill has been downloaded as an image successfully.",
          });
        } else {
          toast({
            title: "Error",
            description: "Failed to generate image",
            variant: "destructive",
          });
        }
      }, 'image/png', 1.0);
    } catch (error) {
      console.error("Error downloading bill as image:", error);
      toast({
        title: "Error",
        description: "Failed to download bill as image",
        variant: "destructive",
      });
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 pb-16">
          <div className="container mx-auto px-4 max-w-md">
            <div className="bg-card p-8 rounded-2xl shadow-lg">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Lock className="w-8 h-8 text-primary" />
                </div>
                <h1 className="font-display text-2xl font-bold text-foreground">
                  Admin Dashboard
                </h1>
                <p className="text-muted-foreground mt-2">
                  Enter the admin password to view bookings
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter admin password"
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Authenticating..." : "Access Dashboard"}
                </Button>
              </form>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="pt-24 pb-12 bg-muted">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="text-primary font-medium mb-2 tracking-wider uppercase text-sm">
                Admin Dashboard
              </p>
              <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">
                Booking Management
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={fetchBookings} disabled={isLoading} variant="outline">
                <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
                Refresh
              </Button>
              <Button onClick={handleLogout} variant="destructive">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-8">
        <div className="container mx-auto px-4">
          {/* Navigation Bar */}
          <div className="flex flex-wrap gap-2 mb-6">
            <Button
              key="dashboard-nav"
              variant={activeSection === "dashboard" ? "default" : "outline"}
              onClick={() => setActiveSection("dashboard")}
              className="flex items-center gap-2"
            >
              <BarChart3 className="w-4 h-4" />
              Dashboard
            </Button>
            <Button
              key="bookings-nav"
              variant={activeSection === "bookings" ? "default" : "outline"}
              onClick={() => setActiveSection("bookings")}
              className="flex items-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              Bookings
            </Button>
            <Button
              key="complaints-nav"
              variant={activeSection === "complaints" ? "default" : "outline"}
              onClick={() => setActiveSection("complaints")}
              className="flex items-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              Complaints
            </Button>
            <Button
              key="billing-nav"
              variant={activeSection === "billing" ? "default" : "outline"}
              onClick={() => setActiveSection("billing")}
              className="flex items-center gap-2"
            >
              <Receipt className="w-4 h-4" />
              Billing
            </Button>
          </div>

          {/* Dashboard Section */}
          {activeSection === "dashboard" && (
            <div key="dashboard-section" className="space-y-6">
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-card p-6 rounded-xl shadow-lg border">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-muted-foreground text-sm font-medium">Total Revenue</p>
                      <p className="text-3xl font-bold text-foreground">₹{totalRevenue.toLocaleString()}</p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <DollarSign className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center text-sm">
                    <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                    <span className="text-green-600">+12% from last month</span>
                  </div>
                </div>

                <div className="bg-card p-6 rounded-xl shadow-lg border">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-muted-foreground text-sm font-medium">Total Bookings</p>
                      <p className="text-3xl font-bold text-foreground">{bookings.length}</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center text-sm">
                    <span className="text-blue-600">{recentBookings} new this week</span>
                  </div>
                </div>

                <div className="bg-card p-6 rounded-xl shadow-lg border">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-muted-foreground text-sm font-medium">Pending Payments</p>
                      <p className="text-3xl font-bold text-foreground">{pendingPayments}</p>
                    </div>
                    <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                      <AlertCircle className="w-6 h-6 text-yellow-600" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center text-sm">
                    <span className="text-yellow-600">Requires attention</span>
                  </div>
                </div>

                <div className="bg-card p-6 rounded-xl shadow-lg border">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-muted-foreground text-sm font-medium">Resolved Complaints</p>
                      <p className="text-3xl font-bold text-foreground">{resolvedComplaints}</p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center text-sm">
                    <span className="text-green-600">{((resolvedComplaints / Math.max(complaints.length, 1)) * 100).toFixed(1)}% resolution rate</span>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Bookings */}
                <div className="bg-card p-6 rounded-xl shadow-lg border">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Recent Bookings
                  </h3>
                  <div className="space-y-3">
                    {bookings.slice(0, 5).map((booking) => (
                      <div key={booking.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div>
                          <p className="font-medium text-sm">{booking.name}</p>
                          <p className="text-xs text-muted-foreground">{formatDate(booking.travel_date)}</p>
                        </div>
                        <Badge variant={booking.status === "confirmed" ? "default" : "secondary"}>
                          {booking.status}
                        </Badge>
                      </div>
                    ))}
                    {bookings.length === 0 && (
                      <p className="text-center text-muted-foreground py-4">No recent bookings</p>
                    )}
                  </div>
                </div>

                {/* Recent Complaints */}
                <div className="bg-card p-6 rounded-xl shadow-lg border">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    Recent Complaints
                  </h3>
                  <div className="space-y-3">
                    {complaints.slice(0, 5).map((complaint) => (
                      <div key={complaint.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div>
                          <p className="font-medium text-sm">{complaint.customer_name}</p>
                          <p className="text-xs text-muted-foreground">{complaint.complaint_type}</p>
                        </div>
                        <Badge variant={complaint.priority === "high" ? "destructive" : "secondary"}>
                          {complaint.priority}
                        </Badge>
                      </div>
                    ))}
                    {complaints.length === 0 && (
                      <p className="text-center text-muted-foreground py-4">No recent complaints</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-card p-6 rounded-xl shadow-lg border">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Quick Actions
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button
                    onClick={() => setActiveSection("bookings")}
                    className="h-20 flex flex-col items-center gap-2"
                    variant="outline"
                  >
                    <Plus className="w-6 h-6" />
                    <span>Add Booking</span>
                  </Button>
                  <Button
                    onClick={() => setActiveSection("billing")}
                    className="h-20 flex flex-col items-center gap-2"
                    variant="outline"
                  >
                    <Receipt className="w-6 h-6" />
                    <span>Generate Bill</span>
                  </Button>
                  <Button
                    onClick={fetchBookings}
                    disabled={isLoading}
                    className="h-20 flex flex-col items-center gap-2"
                    variant="outline"
                  >
                    <RefreshCw className={`w-6 h-6 ${isLoading ? "animate-spin" : ""}`} />
                    <span>Refresh Data</span>
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Bookings Section */}
          {activeSection === "bookings" && (
            <div key="bookings-section" className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-card p-4 rounded-xl shadow">
                  <p className="text-muted-foreground text-sm">Total Bookings</p>
                  <p className="text-2xl font-bold text-foreground">{bookings.length}</p>
                </div>
                <div className="bg-card p-4 rounded-xl shadow">
                  <p className="text-muted-foreground text-sm">Pending</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {bookings.filter((b) => b.status === "pending").length}
                  </p>
                </div>
                <div className="bg-card p-4 rounded-xl shadow">
                  <p className="text-muted-foreground text-sm">Confirmed</p>
                  <p className="text-2xl font-bold text-green-600">
                    {bookings.filter((b) => b.status === "confirmed").length}
                  </p>
                </div>
                <div className="bg-card p-4 rounded-xl shadow">
                  <p className="text-muted-foreground text-sm">Completed</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {bookings.filter((b) => b.status === "completed").length}
                  </p>
                </div>
              </div>

              <div className="bg-card rounded-2xl shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Customer</TableHead>
                        <TableHead>Package</TableHead>
                        <TableHead>Travel Date</TableHead>
                        <TableHead>Travelers</TableHead>
                        <TableHead>Pickup</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Booked On</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {bookings.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                            No bookings found
                          </TableCell>
                        </TableRow>
                      ) : (
                        bookings.map((booking) => (
                          <TableRow key={booking.id}>
                            <TableCell>
                              <div>
                                <p className="font-medium text-foreground">{booking.name}</p>
                                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                  <Mail className="w-3 h-3" />
                                  {booking.email}
                                </div>
                                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                  <Phone className="w-3 h-3" />
                                  {booking.phone}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="secondary">
                                {packageLabels[booking.tour_package] || booking.tour_package}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4 text-muted-foreground" />
                                {formatDate(booking.travel_date)}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <Users className="w-4 h-4 text-muted-foreground" />
                                {booking.travelers}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <MapPin className="w-4 h-4 text-muted-foreground" />
                                {booking.pickup_location}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Select
                                value={booking.status}
                                onValueChange={(value) => updateStatus(booking.id, value)}
                                disabled={booking.status === "completed" || booking.status === "cancelled"}
                              >
                                <SelectTrigger className="w-32">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="pending">Pending</SelectItem>
                                  <SelectItem value="confirmed">Confirmed</SelectItem>
                                  <SelectItem value="completed">Completed</SelectItem>
                                  <SelectItem value="cancelled">Cancelled</SelectItem>
                                </SelectContent>
                              </Select>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <Clock className="w-3 h-3" />
                                {formatDateTime(booking.created_at)}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => sendBookingEmail(booking)}
                                  className="flex items-center gap-1"
                                >
                                  <Send className="w-3 h-3" />
                                  Email
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => downloadBillForBooking(booking)}
                                  className="flex items-center gap-1"
                                >
                                  <Download className="w-3 h-3" />
                                  Download Bill
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => viewBookingBills(booking)}
                                  className="flex items-center gap-1"
                                >
                                  <Receipt className="w-3 h-3" />
                                  Bills
                                </Button>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button
                                      size="sm"
                                      variant="destructive"
                                      className="flex items-center gap-1"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                      Delete
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Delete Booking</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Are you sure you want to delete the booking for {booking.name}?
                                        This action cannot be undone.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => deleteBooking(booking.id)}
                                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                      >
                                        Delete
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          )}

          {/* Complaints Section */}
          {activeSection === "complaints" && (
            <div key="complaints-section" className="space-y-6">
              <div className="bg-card rounded-2xl shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Customer</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {complaints.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                            No complaints found
                          </TableCell>
                        </TableRow>
                      ) : (
                        complaints.map((complaint) => (
                          <TableRow key={complaint.id}>
                            <TableCell>
                              <div>
                                <p className="font-medium text-foreground">{complaint.customer_name}</p>
                                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                  <Mail className="w-3 h-3" />
                                  {complaint.customer_email}
                                </div>
                                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                  <Phone className="w-3 h-3" />
                                  {complaint.customer_phone}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">{complaint.complaint_type}</Badge>
                            </TableCell>
                            <TableCell className="max-w-xs">
                              <Button
                                variant="link"
                                className="p-0 h-auto text-left justify-start"
                                onClick={() => {
                                  setSelectedComplaint(complaint);
                                  setShowComplaintDetails(true);
                                }}
                              >
                                <p className="text-sm truncate hover:text-primary transition-colors">
                                  {complaint.description}
                                </p>
                              </Button>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <Clock className="w-3 h-3" />
                                {formatDateTime(complaint.created_at)}
                              </div>
                            </TableCell>
                            <TableCell>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    className="flex items-center gap-1"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                    Delete
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Delete Complaint</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to delete the complaint from {complaint.customer_name}?
                                      This action cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => deleteComplaint(complaint.id)}
                                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                    >
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          )}

          {/* Complaint Details Dialog */}
          <Dialog open={showComplaintDetails} onOpenChange={setShowComplaintDetails}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Complaint Details
                </DialogTitle>
                <DialogDescription>
                  Full details of the customer complaint
                </DialogDescription>
              </DialogHeader>

              {selectedComplaint && (
                <div className="space-y-6">
                  {/* Customer Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Customer Name</Label>
                      <p className="text-sm text-muted-foreground">{selectedComplaint.customer_name}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Complaint Type</Label>
                      <Badge variant="outline">{selectedComplaint.complaint_type}</Badge>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Email</Label>
                      <p className="text-sm text-muted-foreground">{selectedComplaint.customer_email}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Phone</Label>
                      <p className="text-sm text-muted-foreground">{selectedComplaint.customer_phone}</p>
                    </div>
                  </div>

                  {/* Complaint Description */}
                  <div>
                    <Label className="text-sm font-medium">Description</Label>
                    <div className="mt-2 p-4 bg-muted rounded-lg">
                      <p className="text-sm leading-relaxed">{selectedComplaint.description}</p>
                    </div>
                  </div>

                  {/* Additional Information */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Priority</Label>
                      <Badge
                        variant={
                          selectedComplaint.priority === "high"
                            ? "destructive"
                            : selectedComplaint.priority === "medium"
                            ? "default"
                            : "secondary"
                        }
                        className="mt-1"
                      >
                        {selectedComplaint.priority}
                      </Badge>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Status</Label>
                      <Badge
                        variant={selectedComplaint.status === "resolved" ? "default" : "secondary"}
                        className="mt-1"
                      >
                        {selectedComplaint.status}
                      </Badge>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Created</Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        {formatDateTime(selectedComplaint.created_at)}
                      </p>
                    </div>
                  </div>

                  {/* Booking ID if available */}
                  {selectedComplaint.booking_id && (
                    <div>
                      <Label className="text-sm font-medium">Related Booking ID</Label>
                      <p className="text-sm text-muted-foreground mt-1 font-mono">
                        {selectedComplaint.booking_id}
                      </p>
                    </div>
                  )}
                </div>
              )}

              <DialogFooter>
                <Button onClick={() => setShowComplaintDetails(false)}>
                  Close
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Booking Bills Dialog */}
          <Dialog open={showBookingBills} onOpenChange={setShowBookingBills}>
            <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Receipt className="w-5 h-5" />
                  Official Bill - {selectedBooking?.name}
                </DialogTitle>
                <DialogDescription>
                  Complete bill details for this booking
                </DialogDescription>
              </DialogHeader>

              {bookingBills.length > 0 ? (
                <div className="space-y-6">
                  {bookingBills.map((bill, index) => (
                    <div key={bill.id} id={`bill-card-${bill.id}`} className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-8 shadow-xl">
                      {/* Header */}
                      <div className="text-center mb-8">
                        <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Receipt className="w-10 h-10 text-white" />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-800 mb-2">Vrindavan Saathi</h2>
                        <p className="text-gray-600">Spiritual Journey Tours</p>
                        <div className="border-t-2 border-blue-300 mt-4 pt-4">
                          <h3 className="text-xl font-semibold text-blue-800">OFFICIAL BILL</h3>
                        </div>
                      </div>

                      {/* Bill Details Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-semibold text-gray-700 mb-2">Bill Information</h4>
                            <div className="bg-white rounded-lg p-4 shadow-sm">
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-gray-600">Bill ID:</span>
                                <span className="font-mono font-semibold text-blue-600">{bill.id.slice(-8).toUpperCase()}</span>
                              </div>
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-gray-600">Date:</span>
                                <span className="font-medium">{formatDateTime(bill.created_at)}</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-gray-600">Status:</span>
                                <Badge variant={bill.status === "paid" ? "default" : bill.status === "sent" ? "secondary" : "outline"} className="font-medium">
                                  {bill.status.toUpperCase()}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <h4 className="font-semibold text-gray-700 mb-2">Customer Details</h4>
                            <div className="bg-white rounded-lg p-4 shadow-sm">
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-gray-600">Name:</span>
                                <span className="font-medium">{bill.customer_name}</span>
                              </div>
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-gray-600">Email:</span>
                                <span className="font-medium text-sm">{bill.customer_email}</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-gray-600">Phone:</span>
                                <span className="font-medium">{bill.customer_phone}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Tour Details */}
                      <div className="mb-8">
                        <h4 className="font-semibold text-gray-700 mb-4">Tour Details</h4>
                        <div className="bg-white rounded-lg p-6 shadow-sm">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="text-center">
                              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                                <Users className="w-6 h-6 text-green-600" />
                              </div>
                              <p className="text-sm text-gray-600">Travelers</p>
                              <p className="text-xl font-bold text-gray-800">{bill.travelers}</p>
                            </div>
                            <div className="text-center">
                              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                                <MapPin className="w-6 h-6 text-purple-600" />
                              </div>
                              <p className="text-sm text-gray-600">Package</p>
                              <p className="text-sm font-bold text-gray-800">{packageLabels[bill.tour_package] || bill.tour_package}</p>
                            </div>
                            <div className="text-center">
                              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
                                <DollarSign className="w-6 h-6 text-orange-600" />
                              </div>
                              <p className="text-sm text-gray-600">Total Amount</p>
                              <p className="text-2xl font-bold text-green-600">{bill.currency} {bill.total_amount.toLocaleString()}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Payment Information */}
                      <div className="mb-8">
                        <h4 className="font-semibold text-gray-700 mb-4">Payment Information</h4>
                        <div className="bg-white rounded-lg p-6 shadow-sm">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <p className="text-sm text-gray-600 mb-1">Due Date</p>
                              <p className="font-medium">{bill.due_date ? formatDate(bill.due_date) : 'N/A'}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600 mb-1">Payment Methods</p>
                              <p className="font-medium">Cash, UPI, Card, Bank Transfer</p>
                            </div>
                          </div>
                          <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                            <p className="text-sm text-yellow-800">
                              <strong>Note:</strong> Please make payment before the due date to avoid any inconvenience.
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="text-center border-t-2 border-blue-300 pt-6">
                        <p className="text-gray-600 mb-2">Thank you for choosing Vrindavan Saathi!</p>
                        <p className="text-sm text-gray-500">For any queries, contact us at vrindavansaathi@gmail.com or +91 7231056715
+91 8079013665</p>
                        <p className="text-xs text-gray-400 mt-2">© {new Date().getFullYear()} Vrindavan Saathi. All rights reserved.</p>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex justify-center gap-4 mt-6">
                        <Button
                          onClick={() => downloadBillAsImage(bill.id)}
                          variant="outline"
                          className="flex items-center gap-2"
                        >
                          <Download className="w-4 h-4" />
                          Download as Image
                        </Button>
                        <Button
                          onClick={() => sendBillEmail(bill)}
                          variant="outline"
                          className="flex items-center gap-2"
                        >
                          <Send className="w-4 h-4" />
                          Send Email
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Receipt className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground text-lg">No bills found for this booking</p>
                  <p className="text-sm text-muted-foreground mt-2">Bills will be automatically generated when available</p>
                </div>
              )}

              <DialogFooter>
                <Button onClick={() => setShowBookingBills(false)}>
                  Close
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Billing Section */}
          {activeSection === "billing" && (
            <div className="space-y-6">
              {/* Billing Statistics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-card p-4 rounded-xl shadow">
                  <p className="text-muted-foreground text-sm">Total Bills</p>
                  <p className="text-2xl font-bold text-foreground">{bills.length}</p>
                </div>
                <div className="bg-card p-4 rounded-xl shadow">
                  <p className="text-muted-foreground text-sm">Paid Bills</p>
                  <p className="text-2xl font-bold text-green-600">
                    {bills.filter((b) => b.status === "paid").length}
                  </p>
                </div>
                <div className="bg-card p-4 rounded-xl shadow">
                  <p className="text-muted-foreground text-sm">Pending Bills</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {bills.filter((b) => b.status === "pending").length}
                  </p>
                </div>
                <div className="bg-card p-4 rounded-xl shadow">
                  <p className="text-muted-foreground text-sm">Total Revenue</p>
                  <p className="text-2xl font-bold text-blue-600">₹{totalRevenue.toLocaleString()}</p>
                </div>
              </div>

              {/* Search and Filters */}
              <div className="bg-card p-6 rounded-xl shadow-lg">
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <div className="flex-1">
                    <Input
                      placeholder="Search bills by customer name, email, or phone..."
                      value={billSearchTerm}
                      onChange={(e) => setBillSearchTerm(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <Select value={billStatusFilter} onValueChange={setBillStatusFilter}>
                    <SelectTrigger className="w-full md:w-48">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="sent">Sent</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="overdue">Overdue</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="bg-card rounded-2xl shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Customer</TableHead>
                        <TableHead>Package</TableHead>
                        <TableHead>Travelers</TableHead>
                        <TableHead>Total Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Sent On</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredBills.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                            No bills found
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredBills.map((bill) => (
                          <TableRow key={bill.id}>
                            <TableCell>
                              <div>
                                <p className="font-medium text-foreground">{bill.customer_name}</p>
                                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                  <Mail className="w-3 h-3" />
                                  {bill.customer_email}
                                </div>
                                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                  <Phone className="w-3 h-3" />
                                  {bill.customer_phone}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="secondary">
                                {packageLabels[bill.tour_package] || bill.tour_package}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <Users className="w-4 h-4 text-muted-foreground" />
                                {bill.travelers}
                              </div>
                            </TableCell>
                            <TableCell className="font-semibold">{bill.currency} {bill.total_amount}</TableCell>
                            <TableCell>
                              <Select
                                value={bill.status}
                                onValueChange={(value) => updateBillStatus(bill.id, value)}
                              >
                                <SelectTrigger className="w-32">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="draft">Draft</SelectItem>
                                  <SelectItem value="sent">Sent</SelectItem>
                                  <SelectItem value="paid">Paid</SelectItem>
                                  <SelectItem value="overdue">Overdue</SelectItem>
                                  <SelectItem value="cancelled">Cancelled</SelectItem>
                                </SelectContent>
                              </Select>
                            </TableCell>
                            <TableCell>
                              {bill.sent_at ? (
                                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                  <Clock className="w-3 h-3" />
                                  {formatDateTime(bill.sent_at)}
                                </div>
                              ) : (
                                <span className="text-muted-foreground">Not sent</span>
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    setSelectedBill(bill);
                                    setShowBillDetails(true);
                                  }}
                                  className="flex items-center gap-1"
                                >
                                  <Eye className="w-3 h-3" />
                                  View
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => downloadBookingPhoto(bill)}
                                  className="flex items-center gap-1"
                                >
                                  <Download className="w-3 h-3" />
                                  Download Photo
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => sendBillEmail(bill)}
                                  className="flex items-center gap-1"
                                >
                                  <Send className="w-3 h-3" />
                                  Email
                                </Button>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button
                                      size="sm"
                                      variant="destructive"
                                      className="flex items-center gap-1"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                      Delete
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Delete Bill</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Are you sure you want to delete the bill for {bill.customer_name}?
                                        This action cannot be undone.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => deleteBill(bill.id)}
                                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                      >
                                        Delete
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Admin;
