import { Link } from "react-router-dom";
import { MapPin, Phone, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-yellow-50 text-red-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
        {/* Vrindavan Saathi Branding */}
        <div>
          <h2 className="text-2xl font-bold text-orange-700 mb-4">Vrindavan Saathi</h2>
          <p className="text-sm leading-relaxed text-red-900">
            Your trusted guide to the sacred lands of Lord Krishna. Experience divine spirituality with our carefully curated tours.
          </p>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-xl font-semibold text-orange-700 mb-4">Contact Us</h3>
          <ul className="space-y-4 text-sm">
            <li className="flex items-start gap-3">
              <MapPin className="w-5 h-5  text-orange-700 mt-1" />
              <span>Vrindavan, Mathura, Uttar Pradesh, India - 281121</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-red-900" />
              <div className="flex flex-col">
                <a href="tel:+917231056715" className="hover:text-red-900 transition">+91 7231056715</a>
                <a href="tel:+918079013665" className="hover:text-red-900 transition">+91 8079013665</a>
              </div>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-red-900" />
              <a href="mailto:vrindavansaathi@gmail.com" className="hover:text-red-900 transition">vrindavansaathi@gmail.com</a>
            </li>
          </ul>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-xl font-semibold text-red-900 mb-4">Quick Links</h3>
          <ul className="space-y-3 text-sm">
            {[
              { name: "Home", path: "/" },
              { name: "Tour Plans", path: "/plans" },
              { name: "Photos", path: "/photos" },
              { name: "Booking", path: "/booking" },
              { name: "Contact", path: "/contact" },
            ].map((link) => (
              <li key={link.name}>
                <Link
                  to={link.path}
                  className="hover:text-red-900 transition"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700 py-6 text-center text-sm text-gray-600">
        <p>
          © {new Date().getFullYear()} Vrindavan Mathura Tour Guide. All rights reserved.
        </p>
        <div className="mt-2 space-x-4">
          <Link to="/admin" className="hover:text-red-900 transition">Admin Panel</Link>
          <span>|</span>
          <Link to="/contact" className="hover:text-red-900 transition">Contact Us</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;