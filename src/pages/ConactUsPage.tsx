import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Facebook, Twitter, Instagram, Youtube, Linkedin, Mail } from "lucide-react";
import useLanguage from "@/lib/hooks/useLang";

const ContactUsPage: React.FC = () => {
  const { t } = useLanguage()

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8 dark:bg-#282828 dark:text-white">
      {/* Page Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">{t("contact_us")}</h1>
        <p className="text-gray-600 dark:text-gray-300">{t("have_questions_or_want_to_get_in_touch_we_d_love_to_hear_from_you_")}</p>
      </div>
      {/* Main Content Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Centers Section */}
        <div className="bg-white dark:bg-black p-6 rounded-lg shadow-md dark:shadow-white/10 w-full max-w-md mx-auto border dark:border-white/20">
          {/* Centers in India */}
          <h3 className="text-lg font-bold text-red-600 text-center mb-2">{t("centers_across_india")}</h3>
          <div className="grid grid-cols-2 gap-x-6">
            <ul className="list-disc list-inside text-gray-800 dark:text-white">
              <li>{t("bengaluru")}</li>
              <li>{t("mysuru")}</li>
              <li>{t("belagavi")}</li>
              <li>{t("dharwad")}</li>
              <li>{t("bellari")}</li>
              <li>{t("kodikonda")}</li>
              <li>{t("guntur")}</li>
              <li>{t("coimbatore")}</li>
              <li>{t("delhi")}</li>
            </ul>
            <ul className="list-disc list-inside text-gray-800 dark:text-white">
              <li>{t("bhopal")}</li>
              <li>{t("mumbai")}</li>
              <li>{t("hyderabad")}</li>
              <li>{t("chennai")}</li>
              <li>{t("kochi")}</li>
              <li>{t("pune")}</li>
              <li>{t("kolkata")}</li>
              <li>{t("gurugram")}</li>
              <li>{t("bhubaneswar")}</li>
            </ul>
          </div>

          {/* Centers Outside India */}
          <h3 className="text-lg font-bold text-red-600 text-center mt-4 mb-2">{t("centers_outside_india")}</h3>
          <ul className="grid grid-cols-2 list-disc list-inside text-gray-800 dark:text-white">
            <li>{t("usa")}</li>
            <li>{t("uk")}</li>
          </ul>
        </div>

        {/* Contact Form Section */}
        <div className="bg-gray-50 dark:bg-black p-6 rounded-lg shadow-md dark:shadow-white/10 border dark:border-white/20">
          <h2 className="text-2xl font-bold mb-4">{t("send_us_a_message")}</h2>
          <form className="space-y-4">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium dark:text-white">{t("full_name")}</label>
              <Input
                type="text"
                id="name"
                placeholder="Enter your full name"
                className="mt-1 dark:bg-black dark:border-white/30 dark:text-white dark:placeholder-gray-400"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium dark:text-white">{t("email_address")}</label>
              <Input
                type="email"
                id="email"
                placeholder="Enter your email address"
                className="mt-1 dark:bg-black dark:border-white/30 dark:text-white dark:placeholder-gray-400"
              />
            </div>

            {/* Message */}
            <div>
              <label htmlFor="message" className="block text-sm font-medium dark:text-white">{t("message")}</label>
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
            >{t("send_message")}</Button>
          </form>
        </div>
      </div>
      {/* Social Media Section */}
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">{t("follow_us")}</h2>
        <div className="flex justify-center space-x-6">
          <a
            href="mailto:info@samarthanam.org"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Email"
            className="text-red-500 hover:text-red-600 dark:hover:text-yellow-300"
          >
            <Mail size={32} />
          </a>

          <a
            href="https://www.facebook.com/samarthanaminfo"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
            className="text-red-500 hover:text-red-600 dark:hover:text-yellow-300"
          >
            <Facebook size={32} />
          </a>

          <a
            href="https://x.com/SamarthanamTFTD"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="X"
            className="text-red-500 hover:text-red-600 dark:hover:text-yellow-300"
          >
            <Twitter size={32} />
          </a>

          <a
            href="https://www.instagram.com/samarthanamtrustforthedisabled/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="text-red-500 hover:text-red-600 dark:hover:text-yellow-300"
          >
            <Instagram size={32} />
          </a>

          <a
            href="https://www.youtube.com/@samarthanamtrustforthedisabled"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="YouTube"
            className="text-red-500 hover:text-red-600 dark:hover:text-yellow-300"
          >
            <Youtube size={32} />
          </a>

          <a
            href="https://www.linkedin.com/company/samarthanam-trust/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="text-red-500 hover:text-red-600 dark:hover:text-yellow-300"
          >
            <Linkedin size={32} />
          </a>

        </div>
      </div>
    </div>
  );
};

export default ContactUsPage;