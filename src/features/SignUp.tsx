import { yupResolver } from "@hookform/resolvers/yup";
import {
  Button,
  Card,
  Label,
  Spinner,
  TextInput
} from "flowbite-react";
import { Check } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from 'react-hot-toast';
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';
import * as yup from "yup";
import brandLogo from "../assets/images/Logo.png";
import { useAuth } from "../hooks/useAuth";
import { IUser } from "../interfaces";
import { DEFAULT_AVATAR } from "../shared/constants";

interface SignUpFormData {
  // username: string;
  email: string;
  // company?: string;
  password: string;
  confirmPassword: string;
}



const SignUp: React.FC<{ handleSwap: () => void }> = ({ handleSwap }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [profilePic, setProfilePic] = useState<string>(DEFAULT_AVATAR);

  const validationSchema = yup.object().shape({
    // username: yup
    //   .string()
    //   .required(t("auth.signup.errors.usernameRequired"))
    //   .min(3, t("auth.signup.errors.usernameMin")),
    email: yup
      .string()
      .required(t("auth.signup.errors.emailRequired"))
      .email(t("auth.signup.errors.emailInvalid")),
    // company: yup.string(),
    password: yup
      .string()
      .required(t("auth.signup.errors.passwordRequired"))
      .min(8, t("auth.signup.errors.passwordMin"))
      .matches(/[A-Z]/, t("auth.signup.errors.passwordUppercase"))
      .matches(/[a-z]/, t("auth.signup.errors.passwordLowercase"))
      .matches(/[0-9]/, t("auth.signup.errors.passwordNumber"))
      .matches(/[^A-Za-z0-9]/, t("auth.signup.errors.passwordSpecial")),
    confirmPassword: yup
      .string()
      .required(t("auth.signup.errors.confirmPasswordRequired"))
      .oneOf([yup.ref("password")], t("auth.signup.errors.passwordMatch")),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<SignUpFormData>({
    resolver: yupResolver(validationSchema),
    mode: "onChange",
  });


  // Function to convert file to Base64
  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  // Function to validate image dimensions and size
  const validateImage = (file: File): Promise<boolean> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        URL.revokeObjectURL(img.src);
        const maxDimension = 1000; // Max width/height in pixels
        const maxSize = 5 * 1024 * 1024; // 5MB in bytes

        if (file.size > maxSize) {
          alert(t("auth.signup.errors.imageTooLarge", "Image size should be less than 5MB"));
          resolve(false);
        } else if (img.width > maxDimension || img.height > maxDimension) {
          alert(t("auth.signup.errors.imageDimensionsTooLarge", "Image dimensions should be less than 1000x1000 pixels"));
          resolve(false);
        } else {
          resolve(true);
        }
      };
      img.onerror = () => {
        URL.revokeObjectURL(img.src);
        resolve(false);
      };
    });
  };

  // Modified profile picture handling
  const handleProfilePicChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        // Validate file type
        if (!file.type.startsWith('image/')) {
          alert(t("auth.signup.errors.invalidImageType", "Please upload a valid image file"));
          return;
        }

        // Validate image dimensions and size
        const isValid = await validateImage(file);
        if (!isValid) return;

        // Convert to Base64
        const base64String = await convertToBase64(file);

        // Compress if needed (you might want to add a compression step here)
        setProfilePic(base64String);

        // Store in localStorage as a backup
        localStorage.setItem('tempProfilePic', base64String);
      } catch (error) {
        console.error('Error processing image:', error);
        alert(t("auth.signup.errors.imageProcessingError", "Error processing image. Please try again."));
      }
    }
  };

  // Load profile pic from localStorage on component mount
  useEffect(() => {
    const savedProfilePic = localStorage.getItem('tempProfilePic');
    if (savedProfilePic) {
      setProfilePic(savedProfilePic);
    }
  }, []);

  const onSubmit = async (data: SignUpFormData) => {
    setIsLoading(true);
    try {
      // Check if user already exists
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const existingUser = users.find((user: IUser) => user.email === data.email);

      if (existingUser) {
        setIsLoading(false);
        toast.error(t("auth.signup.errors.emailExists"));
        return;
      }

      const mockUser: IUser = {
        id: uuidv4(),
        // name: data.username,
        email: data.email,
        password: data.password,
        photoURL: profilePic,
        // company: data.company,
      };

      // Add user to localStorage
      localStorage.setItem("users", JSON.stringify([...users, mockUser]));

      toast.promise(
        new Promise((resolve) => {
          setTimeout(() => {
            signup(mockUser);
            localStorage.removeItem('tempProfilePic');
            navigate("/dashboard");
            resolve(true);
          }, 1500);
        }),
        {
          loading: t("auth.signup.signingUp"),
          success: t("auth.signup.success"),
          error: t("auth.signup.error"),
        }
      );

    } catch (error) {
      console.error("Signup error:", error);
      toast.error(t("auth.signup.error"));
    }
  };


  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex">
        <div className="w-full flex flex-col items-center justify-center p-4 md:p-8 bg-gray-50 relative">
          <Card
            className="w-full max-w-xl min-h-[500px] flex flex-col items-center justify-center"
            theme={{
              root: {
                children: "flex h-full flex-col justify-between gap-4 p-12",
              },
            }}
          >
            <div className="flex w-full justify-center items-center z-20">
              <img src={brandLogo} alt="Logo" className="w-1/2 object-contain cursor-pointer" onClick={() => navigate("/")} />
            </div>
            <div className="text-center max-w-1000">
              {/* <h2 className="text-2xl font-bold text-gray-900">
                {t("auth.signup.title")}
              </h2> */}
              <p className="text-gray-600 ">{t("auth.signup.subtitle")}</p>
            </div>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="w-full"
              name="signup"
              autoComplete="on"
            >
              {/* Profile Picture Upload */}
              {/* <div className="flex justify-center">
                <label
                  htmlFor="profilePicInput"
                  className="relative cursor-pointer group"
                >
                  <img
                    src={profilePic}
                    alt="Profile"
                    className="w-24 h-24 rounded-full border-4 border-gray-300 object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="w-8 h-8 text-white" />
                  </div>
                  <input
                    id="profilePicInput"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleProfilePicChange}
                  />
                </label>
              </div> */}

              {/* <div>
                <Label htmlFor="username" value={t("auth.signup.username")} />
                <TextInput
                  id="username"
                  type="text"
                  autoComplete="name"
                  helperText=""
                  color={errors.username ? "failure" : "indigo"}
                  placeholder={t("auth.signup.usernamePlaceholder")}
                  {...register("username")}
                />
                <p className="text-red-500 text-xs mt-1 min-h-4">{errors.username?.message || ""}</p>
              </div> */}

              <div>
                <Label htmlFor="email" value={t("auth.signup.email")} />
                <TextInput
                  id="email"
                  type="email"
                  autoComplete="email"
                  color={errors.email ? "failure" : "indigo"}
                  placeholder={t("auth.signup.emailPlaceholder")}
                  {...register("email")}
                />
                <p className="text-red-500 text-xs mt-1 min-h-4">{errors.email?.message || ""}</p>
              </div>
              {/* 
              <div>
                <Label htmlFor="company" value={t("auth.signup.company")} />
                <TextInput
                  id="company"
                  type="text"
                  autoComplete="organization"
                  color={errors.company ? "failure" : "indigo"}
                  placeholder={t("auth.signup.companyPlaceholder")}
                  {...register("company")}
                />
                <p className="text-red-500 text-xs mt-1 min-h-4">{errors.company?.message || ""}</p>
              </div> */}

              <div>
                <Label htmlFor="password" value={t("auth.signup.password")} />
                <TextInput
                  id="password"
                  type="password"
                  autoComplete="new-password"
                  color={errors.password ? "failure" : "indigo"}
                  placeholder={t("auth.signup.passwordPlaceholder")}
                  {...register("password")}
                />
                <p className="text-red-500 text-xs mt-1 min-h-4">{errors.password?.message || ""}</p>
              </div>

              <div>
                <Label htmlFor="confirmPassword" value={t("auth.signup.confirmPassword")} />
                <TextInput
                  id="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  color={errors.confirmPassword ? "failure" : "indigo"}
                  placeholder={t("auth.signup.confirmPasswordPlaceholder")}
                  rightIcon={(watch("password") && watch("password") === watch("confirmPassword")) ? Check : undefined}
                  {...register("confirmPassword")}
                  theme={{
                    field: {
                      rightIcon: {
                        svg: "h-5 w-5 text-green-500 dark:text-green-400",
                      },
                    },
                  }}
                />
                <p className="text-red-500 text-xs mt-1 min-h-4">{errors.confirmPassword?.message || ""}</p>
              </div>

              <Button
                type="submit"
                color="indigo"
                className="w-full mt-2"
                disabled={isLoading}
              >
                <div className="flex items-center gap-2">
                  {isLoading && <Spinner color={"purple"} size={"sm"} />}
                  <p>
                    {isLoading
                      ? t("auth.signup.signingUp")
                      : t("auth.signup.signupButton")}
                  </p>
                </div>
              </Button>
            </form>

            <div className=" text-center text-sm text-gray-600">
              <p>
                {t("auth.signup.terms")}{" "}
                <a href="#" className="text-primary-600 hover:underline">
                  {t("auth.signup.termsOfService")}
                </a>{" "}
                {t("auth.signup.and")}{" "}
                <a href="#" className="text-primary-600 hover:underline">
                  {t("auth.signup.privacyPolicy")}
                </a>
              </p>
            </div>
            <div className="text-center text-sm text-gray-600">
              <p>
                {t("auth.signup.alreadyHaveAccountTitle")}{" "}
                <span
                  onClick={handleSwap}
                  className="text-primary-600 hover:underline cursor-pointer"
                >
                  {t("auth.signup.alreadyHaveAccountSubtitle")}
                </span>
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
