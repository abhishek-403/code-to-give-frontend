import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Facebook, Twitter, Instagram, Youtube, Linkedin, Mail } from "lucide-react";

const ContactUsPage: React.FC = () => {
  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8 dark:bg-#282828 dark:text-white">
      {/* Page Header */}
      <div className="text-center">
        <h1 className="text-4xl dark:text-yellow-300 font-bold mb-4">Contact Us</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Have questions or want to get in touch? We'd love to hear from you!
        </p>
      </div>

      {/* Main Content Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Centers Section */}
        <div className="bg-white dark:bg-black p-6 rounded-lg shadow-md dark:shadow-white/10 w-full max-w-md mx-auto border dark:border-white/20">
          {/* Centers in India */}
          <h3 className="text-lg font-bold text-red-600 dark:text-yellow-300 text-center mb-2">
            CENTERS ACROSS INDIA
          </h3>
          <div className="grid grid-cols-2 gap-x-6">
            <ul className="list-disc list-inside text-gray-800 dark:text-white">
              <li>Bengaluru</li>
              <li>Mysuru</li>
              <li>Belagavi</li>
              <li>Dharwad</li>
              <li>Bellari</li>
              <li>Kodikonda</li>
              <li>Guntur</li>
              <li>Coimbatore</li>
              <li>Delhi</li>
            </ul>
            <ul className="list-disc list-inside text-gray-800 dark:text-white">
              <li>Bhopal</li>
              <li>Mumbai</li>
              <li>Hyderabad</li>
              <li>Chennai</li>
              <li>Kochi</li>
              <li>Pune</li>
              <li>Kolkata</li>
              <li>Gurugram</li>
              <li>Bhubaneswar</li>
            </ul>
          </div>

          {/* Centers Outside India */}
          <h3 className="text-lg font-bold text-red-600 dark:text-yellow-300 text-center mt-4 mb-2">
            CENTERS OUTSIDE INDIA
          </h3>
          <ul className="grid grid-cols-2 list-disc list-inside text-gray-800 dark:text-white">
            <li>USA</li>
            <li>UK</li>
          </ul>
        </div>

        {/* Contact Form Section */}
        <div className="bg-gray-50 dark:bg-black p-6 rounded-lg shadow-md dark:shadow-white/10 border dark:border-white/20">
          <h2 className="text-2xl font-bold mb-4">Send Us a Message</h2>
          <form className="space-y-4">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium dark:text-white">
                Full Name
              </label>
              <Input
                type="text"
                id="name"
                placeholder="Enter your full name"
                className="mt-1 dark:bg-black dark:border-white/30 dark:text-white dark:placeholder-gray-400"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium dark:text-white">
                Email Address
              </label>
              <Input
                type="email"
                id="email"
                placeholder="Enter your email address"
                className="mt-1 dark:bg-black dark:border-white/30 dark:text-white dark:placeholder-gray-400"
              />
            </div>

            {/* Message */}
            <div>
              <label htmlFor="message" className="block text-sm font-medium dark:text-white">
                Message
              </label>
              <Textarea
                id="message"
                placeholder="Write your message here"
                className="mt-1 dark:bg-black dark:border-white/30 dark:text-white dark:placeholder-gray-400"
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-red-500 hover:bg-red-600 dark:hover:bg-yellow-500 dark:text-black font-bold py-2 px-4 rounded"
            >
              Send Message
            </Button>
          </form>
        </div>
      </div>

      {/* Social Media Section */}
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Follow Us</h2>
        <div className="flex justify-center space-x-6">
          <a
            href="mailto:info@samarthanam.org"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Email"
            className="text-red-500 dark:text-yellow-300"
          >
            <Mail size={32} />
          </a>

          <a
            href="https://www.facebook.com/samarthanaminfo"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
            className="text-red-500 dark:text-yellow-300"
          >
            <Facebook size={32} />
          </a>

          <a
            href="https://x.com/SamarthanamTFTD"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="X"
            className="text-red-500 dark:text-yellow-300"
          >
            <Twitter size={32} />
          </a>

          <a
            href="https://www.instagram.com/samarthanamtrustforthedisabled/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="text-red-500 dark:text-yellow-300"
          >
            <Instagram size={32} />
          </a>

          <a
            href="https://www.youtube.com/@samarthanamtrustforthedisabled"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="YouTube"
            className="text-red-500 dark:text-yellow-300"
          >
            <Youtube size={32} />
          </a>

          <a
            href="https://www.linkedin.com/company/samarthanam-trust/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="text-red-500 dark:text-yellow-300"
          >
            <Linkedin size={32} />
          </a>
          
        </div>
      </div>
    </div>
  );
};

export default ContactUsPage;