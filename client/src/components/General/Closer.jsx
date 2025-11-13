import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLocationDot,
  faPhone,
  faEnvelope,
} from "@fortawesome/free-solid-svg-icons";
import { faInstagram } from "@fortawesome/free-brands-svg-icons";

const Closer = () => {
  return (
    <footer className="bg-[#3c5d4e] text-white w-full py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-0 md:justify-between ">
          <div className="flex flex-col items-center">
            <img
              src="/logowhitehq.png"
              alt="North Shore Bike Shop Logo"
              className="w-48 sm:w-56 md:w-64 h-auto mb-3"
            />
            <p className="text-xs text-white/70 text-center">
              © 2025 All rights reserved
            </p>
          </div>

          <div className="flex flex-col items-center md:items-start">
            <nav className="grid grid-cols-2 gap-4 md:grid-cols-1">
              <Link
                to="/shop"
                className="text-sm text-white/90 hover:text-white transition-colors duration-200"
              >
                Shop
              </Link>
              <Link
                to="/service"
                className="text-sm text-white/90 hover:text-white transition-colors duration-200"
              >
                Service
              </Link>
              <Link
                to="/contact"
                className="text-sm text-white/90 hover:text-white transition-colors duration-200"
              >
                Contact
              </Link>
              <Link
                to="/return-policy"
                className="text-sm text-white/90 hover:text-white transition-colors duration-200"
              >
                Return Policy
              </Link>
            </nav>
          </div>

          {/* Contact Information */}
          <div className="flex flex-col items-center md:items-start">
            <div className="flex flex-col space-y-3">
              <div className="flex items-start space-x-3">
                <FontAwesomeIcon
                  icon={faLocationDot}
                  className="text-white/90 text-lg mt-0.5"
                />
                <div className="text-sm text-white/95 leading-relaxed">
                  1831 Lonsdale Avenue
                  <br />
                  North Vancouver, BC
                  <br />
                  V7M 2J8
                </div>
              </div>

              <a
                href="tel:16049296727"
                className="flex items-center space-x-3 text-sm text-white/95 hover:text-white transition-colors duration-200"
              >
                <FontAwesomeIcon
                  icon={faPhone}
                  className="text-white/90 text-lg"
                />
                <span>(604) 929-6727</span>
              </a>

              <a
                href="mailto:northshorebikeshop@gmail.com"
                className="flex items-center space-x-3 text-sm text-white/95 hover:text-white transition-colors duration-200 break-words"
              >
                <FontAwesomeIcon
                  icon={faEnvelope}
                  className="text-white/90 text-lg flex-shrink-0"
                />
                <span>northshorebikeshop@gmail.com</span>
              </a>
            </div>
          </div>

          {/* Social Media */}
          <div className="flex flex-col items-center md:items-start">
            <div className="flex space-x-3 md:flex-col md:space-x-0 md:space-y-3">
              <a
                href="https://www.instagram.com/north_shore_bike_shop/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-11 h-11 rounded-full bg-white/10 text-white hover:bg-white/20 hover:-translate-y-0.5 transition-all duration-300"
                aria-label="Instagram"
              >
                <FontAwesomeIcon icon={faInstagram} className="text-xl" />
              </a>
              <a
                href="https://www.pinkbike.com/u/north-shore-bike-shop/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 hover:-translate-y-0.5 transition-all duration-300"
                aria-label="Pinkbike"
              >
                <img
                  src="/pinkbike.png"
                  alt="Pinkbike"
                  className="w-6 h-6 brightness-0 invert"
                />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Closer;
