
import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-white border-t border-border pt-12 pb-8">
      <div className="civic-container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <div className="h-8 w-8 rounded-full bg-civic-blue flex items-center justify-center">
                <span className="text-white font-bold text-xl">C</span>
              </div>
              <span className="text-xl font-display font-bold text-civic-blue">CivicNow</span>
            </Link>
            <p className="text-civic-gray-dark text-sm mb-6">
              Empowering citizens to engage with local democracy and make a difference in their communities.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-civic-gray hover:text-civic-blue transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-civic-gray hover:text-civic-blue transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-civic-gray hover:text-civic-blue transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-civic-gray hover:text-civic-blue transition-colors">
                <Mail size={20} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Platform</h3>
            <ul className="space-y-2">
              <li><Link to="/legislation" className="text-civic-gray-dark hover:text-civic-blue transition-colors">Legislation</Link></li>
              <li><Link to="/voting" className="text-civic-gray-dark hover:text-civic-blue transition-colors">Community Voting</Link></li>
              <li><Link to="/initiatives" className="text-civic-gray-dark hover:text-civic-blue transition-colors">Neighborhood Initiatives</Link></li>
              <li><Link to="/impact" className="text-civic-gray-dark hover:text-civic-blue transition-colors">Impact Visualization</Link></li>
              <li><Link to="/budget" className="text-civic-gray-dark hover:text-civic-blue transition-colors">Budget Tracking</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Resources</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-civic-gray-dark hover:text-civic-blue transition-colors">About Us</Link></li>
              <li><Link to="/faq" className="text-civic-gray-dark hover:text-civic-blue transition-colors">FAQs</Link></li>
              <li><Link to="/contact" className="text-civic-gray-dark hover:text-civic-blue transition-colors">Contact Us</Link></li>
              <li><Link to="/feedback" className="text-civic-gray-dark hover:text-civic-blue transition-colors">Provide Feedback</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><Link to="/privacy" className="text-civic-gray-dark hover:text-civic-blue transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-civic-gray-dark hover:text-civic-blue transition-colors">Terms of Service</Link></li>
              <li><Link to="/accessibility" className="text-civic-gray-dark hover:text-civic-blue transition-colors">Accessibility</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-12 pt-8 text-center text-sm text-civic-gray-dark">
          <p>&copy; {new Date().getFullYear()} CivicNow. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
