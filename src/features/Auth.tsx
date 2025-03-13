import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button, Card, TextInput, Label, Spinner } from "flowbite-react";
import { useAuth } from "../contexts/AuthContext";
import {
  IllustrationAnalyticsTeam,
  IllustrationDataChart,
} from "../assets/Illustrations";

const Auth: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isAuthenticated, login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFrame((prev) => (prev + 1) % 3);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleLogin = () => {
    setIsLoading(true);
    setError("");

    // Simulating authentication
    setTimeout(() => {
      if (username === "admin" && password === "admin") {
        const mockUser = {
          id: "user123",
          name: "Demo User",
          email: "demo@example.com",
          photoURL: "https://randomuser.me/api/portraits/men/32.jpg",
        };
        login(mockUser);
        navigate("/dashboard");
      } else {
        setError("Invalid username or password");
      }
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex">
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-purple-100">
          {[
            {
              title: "Track Your App Performance",
              description:
                "Monitor installs, revenue, and user engagement in real-time",
              image: <IllustrationAnalyticsTeam scale={5} />,
            },
            {
              title: "Optimize Ad Campaigns",
              description:
                "Maximize ROI with data-driven insights and recommendations",
              image: <IllustrationDataChart scale={5} />,
            },
            {
              title: "Grow Your Revenue",
              description:
                "Identify opportunities and increase your app monetization",
              image: <IllustrationAnalyticsTeam scale={5} />,
            },
          ].map((frame, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 flex flex-col justify-center items-center text-white p-12 ${
                currentFrame === index ? "opacity-100" : "opacity-0"
              }`}
            >
              {frame.image}
              <h2 className="text-4xl font-bold mt-8 mb-4 text-center text-gray-900 dark:text-white">
                {frame.title}
              </h2>
              <p className="text-xl text-center max-w-md text-gray-700 dark:text-gray-300">
                {frame.description}
              </p>
            </div>
          ))}
        </div>

        <div className="w-full lg:w-1/2 flex items-center justify-center p-4 md:p-8 bg-gray-50">
          <Card className="w-full max-w-xl min-h-[500px] flex flex-col items-center justify-center">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {t("auth.login.title")}
              </h2>
              <p className="text-gray-600 mt-2">{t("auth.login.subtitle")}</p>
            </div>

            <div className="w-full space-y-4">
              <div>
                <Label htmlFor="username" value="Username" />
                <TextInput
                  color="indigo"
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="password" value="Password" />
                <TextInput
                  id="password"
                  color="indigo"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <Button
                color="indigo"
                className="w-full"
                onClick={handleLogin}
                disabled={isLoading}
              >
                <div className="flex items-center gap-2">
                  {isLoading && <Spinner color={"purple"} size={"sm"} />}
                  <p>{isLoading ? "Logging in..." : "Login"}</p>
                </div>
              </Button>
            </div>

            <div className="mt-6 text-center text-sm text-gray-600">
              <p>
                By signing in, you agree to our
                <a href="#" className="text-primary-600 hover:underline">
                  Terms of Service{" "}
                </a>
                and
                <a href="#" className="text-primary-600 hover:underline">
                  Privacy Policy{" "}
                </a>
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Auth;
