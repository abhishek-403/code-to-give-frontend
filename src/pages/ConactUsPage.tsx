import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram } from "lucide-react";

const ContactUsPage: React.FC = () => {
  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      {/* Page Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
        <p className="text-gray-600">
          Have questions or want to get in touch? We'd love to hear from you!
        </p>
      </div>

      {/* Main Content Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Centers Section */}
        {/* <div className="bg-gray-50 p-6 rounded-lg shadow-md"> */}
         
            <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md mx-auto">
            {/* Centers in India */}
            <h3 className="text-lg font-bold text-red-600 text-center mb-2">
                CENTERS ACROSS INDIA
            </h3>
            <div className="grid grid-cols-2 gap-x-6">
                <ul className="list-disc list-inside text-gray-800">
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
                <ul className="list-disc list-inside text-gray-800">
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
            <h3 className="text-lg font-bold text-red-600 text-center mt-4 mb-2">
                CENTERS OUTSIDE INDIA
            </h3>
            <ul className="grid grid-cols-2 list-disc list-inside text-gray-800 ">
                <li>USA</li>
                <li>UK</li>
            </ul>
            </div>

                  
          
        {/* </div> */}

        {/* Contact Form Section */}
        <div className="bg-gray-50 p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">Send Us a Message</h2>
          <form className="space-y-4">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium">
                Full Name
              </label>
              <Input
                type="text"
                id="name"
                placeholder="Enter your full name"
                className="mt-1"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium">
                Email Address
              </label>
              <Input
                type="email"
                id="email"
                placeholder="Enter your email address"
                className="mt-1"
              />
            </div>

            {/* Message */}
            <div>
              <label htmlFor="message" className="block text-sm font-medium">
                Message
              </label>
              <Textarea
                id="message"
                placeholder="Write your message here"
                className="mt-1"
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
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
            href="https://www.facebook.com/samarthanaminfo/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
            className="text-red-500 hover:text-red-600"
          >
            <Facebook size={32} />
          </a>
          <a
            href="https://x.com/SamarthanamTFTD?ref_src=twsrc%5Egoogle%7Ctwcamp%5Eserp%7Ctwgr%5Eauthor"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Twitter"
            className="text-red-500 hover:text-red-600"
          >
            <Twitter size={32} />
          </a>
          <a
            href="https://www.instagram.com/samarthanamtrustforthedisabled/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="text-red-500 hover:text-red-600"
          >
            <Instagram size={32} />
          </a>
        </div>
      </div>
    </div>
  );
};

export default ContactUsPage;