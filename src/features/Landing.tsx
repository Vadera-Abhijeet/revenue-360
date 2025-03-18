import {
  ChartBar,
  ChartPie,
  Clock,
  CurrencyDollar,
  Globe,
  Lightning,
  TrendUp,
} from "@phosphor-icons/react";
import { Button, Navbar } from "flowbite-react";
import { LayoutDashboard } from "lucide-react";
import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
  IllustrationAnalyticsTeam,
  IllustrationDataChart,
} from "../assets/Illustrations";
import brandLogo from "../assets/images/brand.png";

const Landing: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <Navbar fluid className="border-b border-gray-200 bg-white">
        <Navbar.Brand href="/" className="flex items-center">
          <img src={brandLogo} alt="brand-logo" className="h-9" />
        </Navbar.Brand>
        <div className="flex md:order-2 gap-2">
          <Button color="light" onClick={() => navigate("/sign-up")}>
            {t("landing.hero.login")}
          </Button>
          <Button color="indigo" onClick={() => navigate("/sign-up")}>
            {t("landing.hero.cta")}
          </Button>
          <Navbar.Toggle />
        </div>
        <Navbar.Collapse>
          <Navbar.Link color="indigo" href="#features">
            Features
          </Navbar.Link>
          <Navbar.Link color="indigo" href="#pricing">
            Pricing
          </Navbar.Link>
          <Navbar.Link color="indigo" href="#testimonials">
            Testimonials
          </Navbar.Link>
          <Navbar.Link color="indigo" href="#faq">
            FAQ
          </Navbar.Link>
        </Navbar.Collapse>
      </Navbar>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-white to-primary-50 py-16 md:py-24">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {t("landing.hero.title")}
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-lg">
              {t("landing.hero.subtitle")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                color="indigo"
                onClick={() => navigate("/sign-up")}
              >
                {t("landing.hero.cta")}
              </Button>
              <Button
                size="lg"
                color="light"
                onClick={() => navigate("/sign-up")}
              >
                {t("landing.hero.login")}
              </Button>
            </div>
          </div>
          <div className="md:w-1/2">
            <IllustrationAnalyticsTeam scale={8} />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {t("landing.features.title")}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Powerful tools to help you understand and optimize your app's
              performance
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="bg-primary-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <ChartBar className="text-primary-600" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                {t("landing.features.feature1.title")}
              </h3>
              <p className="text-gray-600">
                {t("landing.features.feature1.description")}
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="bg-primary-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <TrendUp className="text-primary-600" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                {t("landing.features.feature2.title")}
              </h3>
              <p className="text-gray-600">
                {t("landing.features.feature2.description")}
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="bg-primary-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <Lightning className="text-primary-600" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                {t("landing.features.feature3.title")}
              </h3>
              <p className="text-gray-600">
                {t("landing.features.feature3.description")}
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-4 gap-6 mt-12">
            <div className="bg-gray-50 p-5 rounded-lg text-center">
              <Globe className="mx-auto text-primary-600 mb-2" size={28} />
              <h4 className="font-semibold">Multi-Language</h4>
              <p className="text-sm text-gray-600">Support for 5+ languages</p>
            </div>
            <div className="bg-gray-50 p-5 rounded-lg text-center">
              <CurrencyDollar
                className="mx-auto text-primary-600 mb-2"
                size={28}
              />
              <h4 className="font-semibold">Multi-Currency</h4>
              <p className="text-sm text-gray-600">
                Track revenue in 8+ currencies
              </p>
            </div>
            <div className="bg-gray-50 p-5 rounded-lg text-center">
              <Clock className="mx-auto text-primary-600 mb-2" size={28} />
              <h4 className="font-semibold">Real-Time Data</h4>
              <p className="text-sm text-gray-600">Live updates and alerts</p>
            </div>
            <div className="bg-gray-50 p-5 rounded-lg text-center">
              <ChartPie className="mx-auto text-primary-600 mb-2" size={28} />
              <h4 className="font-semibold">Custom Dashboards</h4>
              <p className="text-sm text-gray-600">
                Personalized analytics views
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-600 py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto flex flex-col items-center">
            <IllustrationDataChart scale={2} className="mb-8" />
            <h2 className="text-3xl font-bold text-white mb-4">
              {t("landing.cta.title")}
            </h2>
            <p className="text-xl text-primary-100 mb-8">
              {t("landing.cta.description")}
            </p>
            <Button
              size="lg"
              color="light"
              onClick={() => navigate("/sign-up")}
            >
              {t("landing.cta.button")}
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <LayoutDashboard className="mr-2" size={20} />
                Revenue-360
              </h3>
              <p className="text-gray-400">
                The complete analytics solution for app developers and
                marketers.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Product</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Integrations
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Changelog
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Resources</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    API Reference
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Support
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Terms
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400">
              © 2025 Revenue-360. All rights reserved.
            </p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
