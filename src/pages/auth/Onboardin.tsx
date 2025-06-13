"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa";
import { FiCheckCircle } from "react-icons/fi";
import Button from "../../components/ui/Button";
import Footer from "../../components/Fotter";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import OtpVerificationModal from "../../components/otpModal";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../store/userSlice";
import Cookies from "js-cookie";

// Define types for form data
type FormData = {
  // Basic Information
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  countryCode: string;
  nationality: string;
  password: string;
  confirmPassword: string;
  city: string;
  dob: string;
  website: string;
  typeOfContent: string;

  // Social Media Handles (all optional)
  instagram: string;
  tiktok: string;
  youtube: string;
  facebook: string;
  twitter: string;
  linkedin: string;
  otherSocial: string;

  // Creator Type
  currentFollowers: string;
  brandsWorkedWith: string;

  // Profile Information
  platform: string; // Optional
  reachLast30Days: string; // Optional
  followerCount: string; // Optional
  postsLast30Days: string; // Optional
  averageEngagementRate: string; // Optional
  majorityViewersCountry: string; // Optional
  contentTypes: string[]; // Optional

  // Collaboration Preferences
  timeTakenToCreate: string;
  collaborationPreference: string;
  priceRange: string[]; // Optional
  preferredCollaboration: string;
  previousBrands: string; // Optional
  portfolioLinks: string; // Optional
};

const Onboarding = () => {
  const [step, setStep] = useState(1);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    trigger,
  } = useForm<FormData>();

  // For tracking selected content types
  const [selectedContentTypes, setSelectedContentTypes] = useState<string[]>(
    []
  );
  // For tracking selected price ranges
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<string[]>([]);

  // OTP Modal states
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [signupUserId, setSignupUserId] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const dispatch = useDispatch();

 

  const password = watch("password");

  const validateAndProceed = async () => {
    let fieldsToValidate: string[] = [];

    // Define fields to validate based on current step
    if (step === 1) {
      fieldsToValidate = [
        "firstName",
        "lastName",
        "email",
        "password",
        "confirmPassword",
      ];
    } else if (step === 2) {
      fieldsToValidate = ["phone", "nationality", "city", "dob"];
    } else if (step === 4) {
      fieldsToValidate = ["currentFollowers"];
    } else if (step === 5) {
      fieldsToValidate = ["timeTakenToCreate", "collaborationPreference"];
    } else if (step === 6) {
      fieldsToValidate = ["preferredCollaboration"];
    }

    const result = await trigger(fieldsToValidate as any);
    if (result) {
      setStep((prev) => prev + 1);
    }
  };

  const onPrevious = () => setStep((prev) => prev - 1);

  const onSubmit = async (data: FormData) => {
    data.contentTypes = selectedContentTypes;
    data.priceRange = selectedPriceRanges;

    try {
      const response = await fetch("https://api.taseer.app/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...data, type: "creator", step: "signup" }),
      });

      const result = await response.json();
      console.log(result);

      if (result?.success && result?.nextStep === "verify-otp") {
        setSignupUserId(result.userId);
        setSignupEmail(data.email);
        setShowOtpModal(true);
        toast.success("Account created! Please verify your email.");
      } else if (result?.message === "Internal server error") {
        toast.error("🔥 Internal server error from server side - Contact dev");
      } else if (result?.message === "User already exists.") {
        toast.info(" Please login with your previous credentials.");
        setTimeout(() => {
          window.location.href = "/login";
        }, 3000);
      } else if (result?.status === 400) {
        toast.warn(" You already have an account, so please login.");
      } else if (result?.message === "Missing required fields.") {
        toast.warn(" Please fill all the required fields.");
      } else {
        toast.warn("The Phone Number is already exist");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error(" An error occurred. Please try again.");
    }
  };

  const handleOtpSuccess = (token: string, user: any) => {
    Cookies.set("jwt", token, { expires: 14 });
    dispatch(loginSuccess(user));

    toast.success("Welcome! Redirecting to your dashboard...");

    setTimeout(() => {
      if (user.type === "brand") {
        window.location.href = "/brand/home";
      } else {
        window.location.href = "/home";
      }
    }, 1000);
  };

  const handleContentTypeChange = (type: string) => {
    if (selectedContentTypes.includes(type)) {
      setSelectedContentTypes(
        selectedContentTypes.filter((item) => item !== type)
      );
    } else {
      setSelectedContentTypes([...selectedContentTypes, type]);
    }
  };

  const handlePriceRangeChange = (range: string) => {
    // Maximum 2 options can be chosen
    if (selectedPriceRanges.includes(range)) {
      setSelectedPriceRanges(
        selectedPriceRanges.filter((item) => item !== range)
      );
    } else {
      if (selectedPriceRanges.length < 2) {
        setSelectedPriceRanges([...selectedPriceRanges, range]);
      }
    }
  };

  // Helper function for required field label with asterisk
  const RequiredLabel = ({ text }: { text: string }) => (
    <label className="font-medium text-gray-700">
      {text} <span className="text-red-500">*</span>
    </label>
  );


  return (
    <>
      <ToastContainer />
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4 py-8">
        {/* Logo & Step Tracker */}
        <div className="w-full max-w-md text-center mb-6">
          <img src="/logo.svg" alt="Logo" className="w-24 mx-auto mb-4" />
          <div className="flex justify-between items-center">
            {[1, 2, 3, 4, 5, 6].map((num) => (
              <div
                key={num}
                className={`w-10 h-10 flex items-center justify-center rounded-full text-white font-semibold transition ${
                  step >= num ? "bg-purple-600" : "bg-gray-300"
                }`}
              >
                {step > num ? <FiCheckCircle size={20} /> : num}
              </div>
            ))}
          </div>
        </div>

        {/* Form Card */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8 space-y-6"
        >
          {/* Step 1: Basic Information - First Page */}
          {step === 1 && (
            <div className="space-y-5">
              <h2 className="text-2xl font-bold text-gray-800 text-center">
                Basic Information
              </h2>
              <div className="space-y-4">
                <div>
                  <RequiredLabel text="First Name" />
                  <input
                    {...register("firstName", {
                      required: "First name is required",
                    })}
                    placeholder="First Name"
                    className={`w-full border-2 ${
                      errors.firstName ? "border-red-500" : ""
                    } placeholder-gray-500 text-gray-800 rounded-md p-2 mt-1`}
                  />
                  {errors.firstName && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.firstName.message}
                    </p>
                  )}
                </div>

                <div>
                  <RequiredLabel text="Last Name" />
                  <input
                    {...register("lastName", {
                      required: "Last name is required",
                    })}
                    placeholder="Last Name"
                    className={`w-full border-2 ${
                      errors.lastName ? "border-red-500" : ""
                    } placeholder-gray-500 text-gray-800 rounded-md p-2 mt-1`}
                  />
                  {errors.lastName && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.lastName.message}
                    </p>
                  )}
                </div>

                <div>
                  <RequiredLabel text="Email" />
                  <input
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address",
                      },
                    })}
                    type="email"
                    placeholder="Email"
                    className={`w-full border-2 ${
                      errors.email ? "border-red-500" : ""
                    } placeholder-gray-500 text-gray-800 rounded-md p-2 mt-1`}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <RequiredLabel text="Create Password" />
                  <input
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters",
                      },
                    })}
                    type="password"
                    placeholder="Create Password"
                    className={`w-full border-2 ${
                      errors.password ? "border-red-500" : ""
                    } placeholder-gray-500 text-gray-800 rounded-md p-2 mt-1`}
                  />
                  {errors.password && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                <div>
                  <RequiredLabel text="Re-enter Password" />
                  <input
                    {...register("confirmPassword", {
                      required: "Please confirm your password",
                      validate: (value) =>
                        value === password || "Passwords do not match",
                    })}
                    type="password"
                    placeholder="Re-enter Password"
                    className={`w-full border-2 ${
                      errors.confirmPassword ? "border-red-500" : ""
                    } placeholder-gray-500 text-gray-800 rounded-md p-2 mt-1`}
                  />
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>
              </div>
              <Button
                className="flex items-center mx-auto gap-x-3 btn"
                onClick={validateAndProceed}
              >
                Next <FaArrowRight />
              </Button>
              <center className="py-3 w-full mx-auto font-medium">
                Already have an account?{" "}
                <a className="underline text-purple-600" href="/login">
                  Log in
                </a>{" "}
              </center>
            </div>
          )}

          {/* Step 2: Basic Information - Second Page */}
          {step === 2 && (
            <div className="space-y-5">
              <h2 className="text-2xl font-bold text-gray-800 text-center">
                Personal Details
              </h2>
              <div className="space-y-4">
                <div>
                  <select
                    className="bg-transparent border-2 mb-1 w-full  placeholder-gray-500 text-gray-800 rounded-md p-2 "
                    id=""
                    {...register("countryCode")}
                  >
                    <option data-countryCode="nan" value="nan">
                      Select Country Code{" "}
                    </option>
                    <option data-countryCode="DZ" value="213">
                      Algeria (+213)
                    </option>
                    <option data-countryCode="AD" value="376">
                      Andorra (+376)
                    </option>
                    <option data-countryCode="AO" value="244">
                      Angola (+244)
                    </option>
                    <option data-countryCode="AI" value="1264">
                      Anguilla (+1264)
                    </option>
                    <option data-countryCode="AG" value="1268">
                      Antigua &amp; Barbuda (+1268)
                    </option>
                    <option data-countryCode="AR" value="54">
                      Argentina (+54)
                    </option>
                    <option data-countryCode="AM" value="374">
                      Armenia (+374)
                    </option>
                    <option data-countryCode="AW" value="297">
                      Aruba (+297)
                    </option>
                    <option data-countryCode="AU" value="61">
                      Australia (+61)
                    </option>
                    <option data-countryCode="AT" value="43">
                      Austria (+43)
                    </option>
                    <option data-countryCode="AZ" value="994">
                      Azerbaijan (+994)
                    </option>
                    <option data-countryCode="BS" value="1242">
                      Bahamas (+1242)
                    </option>
                    <option data-countryCode="BH" value="973">
                      Bahrain (+973)
                    </option>
                    <option data-countryCode="BD" value="880">
                      Bangladesh (+880)
                    </option>
                    <option data-countryCode="BB" value="1246">
                      Barbados (+1246)
                    </option>
                    <option data-countryCode="BY" value="375">
                      Belarus (+375)
                    </option>
                    <option data-countryCode="BE" value="32">
                      Belgium (+32)
                    </option>
                    <option data-countryCode="BZ" value="501">
                      Belize (+501)
                    </option>
                    <option data-countryCode="BJ" value="229">
                      Benin (+229)
                    </option>
                    <option data-countryCode="BM" value="1441">
                      Bermuda (+1441)
                    </option>
                    <option data-countryCode="BT" value="975">
                      Bhutan (+975)
                    </option>
                    <option data-countryCode="BO" value="591">
                      Bolivia (+591)
                    </option>
                    <option data-countryCode="BA" value="387">
                      Bosnia Herzegovina (+387)
                    </option>
                    <option data-countryCode="BW" value="267">
                      Botswana (+267)
                    </option>
                    <option data-countryCode="BR" value="55">
                      Brazil (+55)
                    </option>
                    <option data-countryCode="BN" value="673">
                      Brunei (+673)
                    </option>
                    <option data-countryCode="BG" value="359">
                      Bulgaria (+359)
                    </option>
                    <option data-countryCode="BF" value="226">
                      Burkina Faso (+226)
                    </option>
                    <option data-countryCode="BI" value="257">
                      Burundi (+257)
                    </option>
                    <option data-countryCode="KH" value="855">
                      Cambodia (+855)
                    </option>
                    <option data-countryCode="CM" value="237">
                      Cameroon (+237)
                    </option>
                    <option data-countryCode="CA" value="1">
                      Canada (+1)
                    </option>
                    <option data-countryCode="CV" value="238">
                      Cape Verde Islands (+238)
                    </option>
                    <option data-countryCode="KY" value="1345">
                      Cayman Islands (+1345)
                    </option>
                    <option data-countryCode="CF" value="236">
                      Central African Republic (+236)
                    </option>
                    <option data-countryCode="CL" value="56">
                      Chile (+56)
                    </option>
                    <option data-countryCode="CN" value="86">
                      China (+86)
                    </option>
                    <option data-countryCode="CO" value="57">
                      Colombia (+57)
                    </option>
                    <option data-countryCode="KM" value="269">
                      Comoros (+269)
                    </option>
                    <option data-countryCode="CG" value="242">
                      Congo (+242)
                    </option>
                    <option data-countryCode="CK" value="682">
                      Cook Islands (+682)
                    </option>
                    <option data-countryCode="CR" value="506">
                      Costa Rica (+506)
                    </option>
                    <option data-countryCode="HR" value="385">
                      Croatia (+385)
                    </option>
                    <option data-countryCode="CU" value="53">
                      Cuba (+53)
                    </option>
                    <option data-countryCode="CY" value="90392">
                      Cyprus North (+90392)
                    </option>
                    <option data-countryCode="CY" value="357">
                      Cyprus South (+357)
                    </option>
                    <option data-countryCode="CZ" value="42">
                      Czech Republic (+42)
                    </option>
                    <option data-countryCode="DK" value="45">
                      Denmark (+45)
                    </option>
                    <option data-countryCode="DJ" value="253">
                      Djibouti (+253)
                    </option>
                    <option data-countryCode="DM" value="1809">
                      Dominica (+1809)
                    </option>
                    <option data-countryCode="DO" value="1809">
                      Dominican Republic (+1809)
                    </option>
                    <option data-countryCode="EC" value="593">
                      Ecuador (+593)
                    </option>
                    <option data-countryCode="EG" value="20">
                      Egypt (+20)
                    </option>
                    <option data-countryCode="SV" value="503">
                      El Salvador (+503)
                    </option>
                    <option data-countryCode="GQ" value="240">
                      Equatorial Guinea (+240)
                    </option>
                    <option data-countryCode="ER" value="291">
                      Eritrea (+291)
                    </option>
                    <option data-countryCode="EE" value="372">
                      Estonia (+372)
                    </option>
                    <option data-countryCode="ET" value="251">
                      Ethiopia (+251)
                    </option>
                    <option data-countryCode="FK" value="500">
                      Falkland Islands (+500)
                    </option>
                    <option data-countryCode="FO" value="298">
                      Faroe Islands (+298)
                    </option>
                    <option data-countryCode="FJ" value="679">
                      Fiji (+679)
                    </option>
                    <option data-countryCode="FI" value="358">
                      Finland (+358)
                    </option>
                    <option data-countryCode="FR" value="33">
                      France (+33)
                    </option>
                    <option data-countryCode="GF" value="594">
                      French Guiana (+594)
                    </option>
                    <option data-countryCode="PF" value="689">
                      French Polynesia (+689)
                    </option>
                    <option data-countryCode="GA" value="241">
                      Gabon (+241)
                    </option>
                    <option data-countryCode="GM" value="220">
                      Gambia (+220)
                    </option>
                    <option data-countryCode="GE" value="7880">
                      Georgia (+7880)
                    </option>
                    <option data-countryCode="DE" value="49">
                      Germany (+49)
                    </option>
                    <option data-countryCode="GH" value="233">
                      Ghana (+233)
                    </option>
                    <option data-countryCode="GI" value="350">
                      Gibraltar (+350)
                    </option>
                    <option data-countryCode="GR" value="30">
                      Greece (+30)
                    </option>
                    <option data-countryCode="GL" value="299">
                      Greenland (+299)
                    </option>
                    <option data-countryCode="GD" value="1473">
                      Grenada (+1473)
                    </option>
                    <option data-countryCode="GP" value="590">
                      Guadeloupe (+590)
                    </option>
                    <option data-countryCode="GU" value="671">
                      Guam (+671)
                    </option>
                    <option data-countryCode="GT" value="502">
                      Guatemala (+502)
                    </option>
                    <option data-countryCode="GN" value="224">
                      Guinea (+224)
                    </option>
                    <option data-countryCode="GW" value="245">
                      Guinea - Bissau (+245)
                    </option>
                    <option data-countryCode="GY" value="592">
                      Guyana (+592)
                    </option>
                    <option data-countryCode="HT" value="509">
                      Haiti (+509)
                    </option>
                    <option data-countryCode="HN" value="504">
                      Honduras (+504)
                    </option>
                    <option data-countryCode="HK" value="852">
                      Hong Kong (+852)
                    </option>
                    <option data-countryCode="HU" value="36">
                      Hungary (+36)
                    </option>
                    <option data-countryCode="IS" value="354">
                      Iceland (+354)
                    </option>
                    <option data-countryCode="IN" value="91">
                      India (+91)
                    </option>
                    <option data-countryCode="ID" value="62">
                      Indonesia (+62)
                    </option>
                    <option data-countryCode="IR" value="98">
                      Iran (+98)
                    </option>
                    <option data-countryCode="IQ" value="964">
                      Iraq (+964)
                    </option>
                    <option data-countryCode="IE" value="353">
                      Ireland (+353)
                    </option>
                    <option data-countryCode="IL" value="972">
                      Israel (+972)
                    </option>
                    <option data-countryCode="IT" value="39">
                      Italy (+39)
                    </option>
                    <option data-countryCode="JM" value="1876">
                      Jamaica (+1876)
                    </option>
                    <option data-countryCode="JP" value="81">
                      Japan (+81)
                    </option>
                    <option data-countryCode="JO" value="962">
                      Jordan (+962)
                    </option>
                    <option data-countryCode="KZ" value="7">
                      Kazakhstan (+7)
                    </option>
                    <option data-countryCode="KE" value="254">
                      Kenya (+254)
                    </option>
                    <option data-countryCode="KI" value="686">
                      Kiribati (+686)
                    </option>
                    <option data-countryCode="KP" value="850">
                      Korea North (+850)
                    </option>
                    <option data-countryCode="KR" value="82">
                      Korea South (+82)
                    </option>
                    <option data-countryCode="KW" value="965">
                      Kuwait (+965)
                    </option>
                    <option data-countryCode="KG" value="996">
                      Kyrgyzstan (+996)
                    </option>
                    <option data-countryCode="LA" value="856">
                      Laos (+856)
                    </option>
                    <option data-countryCode="LV" value="371">
                      Latvia (+371)
                    </option>
                    <option data-countryCode="LB" value="961">
                      Lebanon (+961)
                    </option>
                    <option data-countryCode="LS" value="266">
                      Lesotho (+266)
                    </option>
                    <option data-countryCode="LR" value="231">
                      Liberia (+231)
                    </option>
                    <option data-countryCode="LY" value="218">
                      Libya (+218)
                    </option>
                    <option data-countryCode="LI" value="417">
                      Liechtenstein (+417)
                    </option>
                    <option data-countryCode="LT" value="370">
                      Lithuania (+370)
                    </option>
                    <option data-countryCode="LU" value="352">
                      Luxembourg (+352)
                    </option>
                    <option data-countryCode="MO" value="853">
                      Macao (+853)
                    </option>
                    <option data-countryCode="MK" value="389">
                      Macedonia (+389)
                    </option>
                    <option data-countryCode="MG" value="261">
                      Madagascar (+261)
                    </option>
                    <option data-countryCode="MW" value="265">
                      Malawi (+265)
                    </option>
                    <option data-countryCode="MY" value="60">
                      Malaysia (+60)
                    </option>
                    <option data-countryCode="MV" value="960">
                      Maldives (+960)
                    </option>
                    <option data-countryCode="ML" value="223">
                      Mali (+223)
                    </option>
                    <option data-countryCode="MT" value="356">
                      Malta (+356)
                    </option>
                    <option data-countryCode="MH" value="692">
                      Marshall Islands (+692)
                    </option>
                    <option data-countryCode="MQ" value="596">
                      Martinique (+596)
                    </option>
                    <option data-countryCode="MR" value="222">
                      Mauritania (+222)
                    </option>
                    <option data-countryCode="YT" value="269">
                      Mayotte (+269)
                    </option>
                    <option data-countryCode="MX" value="52">
                      Mexico (+52)
                    </option>
                    <option data-countryCode="FM" value="691">
                      Micronesia (+691)
                    </option>
                    <option data-countryCode="MD" value="373">
                      Moldova (+373)
                    </option>
                    <option data-countryCode="MC" value="377">
                      Monaco (+377)
                    </option>
                    <option data-countryCode="MN" value="976">
                      Mongolia (+976)
                    </option>
                    <option data-countryCode="MS" value="1664">
                      Montserrat (+1664)
                    </option>
                    <option data-countryCode="MA" value="212">
                      Morocco (+212)
                    </option>
                    <option data-countryCode="MZ" value="258">
                      Mozambique (+258)
                    </option>
                    <option data-countryCode="MN" value="95">
                      Myanmar (+95)
                    </option>
                    <option data-countryCode="NA" value="264">
                      Namibia (+264)
                    </option>
                    <option data-countryCode="NR" value="674">
                      Nauru (+674)
                    </option>
                    <option data-countryCode="NP" value="977">
                      Nepal (+977)
                    </option>
                    <option data-countryCode="NL" value="31">
                      Netherlands (+31)
                    </option>
                    <option data-countryCode="NC" value="687">
                      New Caledonia (+687)
                    </option>
                    <option data-countryCode="NZ" value="64">
                      New Zealand (+64)
                    </option>
                    <option data-countryCode="NI" value="505">
                      Nicaragua (+505)
                    </option>
                    <option data-countryCode="NE" value="227">
                      Niger (+227)
                    </option>
                    <option data-countryCode="NG" value="234">
                      Nigeria (+234)
                    </option>
                    <option data-countryCode="NU" value="683">
                      Niue (+683)
                    </option>
                    <option data-countryCode="NF" value="672">
                      Norfolk Islands (+672)
                    </option>
                    <option data-countryCode="NP" value="670">
                      Northern Marianas (+670)
                    </option>
                    <option data-countryCode="NO" value="47">
                      Norway (+47)
                    </option>
                    <option data-countryCode="OM" value="968">
                      Oman (+968)
                    </option>
                    <option data-countryCode="PW" value="680">
                      Palau (+680)
                    </option>
                    <option data-countryCode="PA" value="507">
                      Panama (+507)
                    </option>
                    <option data-countryCode="PG" value="675">
                      Papua New Guinea (+675)
                    </option>
                    <option data-countryCode="PY" value="595">
                      Paraguay (+595)
                    </option>
                    <option data-countryCode="PE" value="51">
                      Peru (+51)
                    </option>
                    <option data-countryCode="PH" value="63">
                      Philippines (+63)
                    </option>
                    <option data-countryCode="PL" value="48">
                      Poland (+48)
                    </option>
                    <option data-countryCode="PT" value="351">
                      Portugal (+351)
                    </option>
                    <option data-countryCode="PR" value="1787">
                      Puerto Rico (+1787)
                    </option>
                    <option data-countryCode="QA" value="974">
                      Qatar (+974)
                    </option>
                    <option data-countryCode="RE" value="262">
                      Reunion (+262)
                    </option>
                    <option data-countryCode="RO" value="40">
                      Romania (+40)
                    </option>
                    <option data-countryCode="RU" value="7">
                      Russia (+7)
                    </option>
                    <option data-countryCode="RW" value="250">
                      Rwanda (+250)
                    </option>
                    <option data-countryCode="SM" value="378">
                      San Marino (+378)
                    </option>
                    <option data-countryCode="ST" value="239">
                      Sao Tome &amp; Principe (+239)
                    </option>
                    <option data-countryCode="SA" value="966">
                      Saudi Arabia (+966)
                    </option>
                    <option data-countryCode="SN" value="221">
                      Senegal (+221)
                    </option>
                    <option data-countryCode="CS" value="381">
                      Serbia (+381)
                    </option>
                    <option data-countryCode="SC" value="248">
                      Seychelles (+248)
                    </option>
                    <option data-countryCode="SL" value="232">
                      Sierra Leone (+232)
                    </option>
                    <option data-countryCode="SG" value="65">
                      Singapore (+65)
                    </option>
                    <option data-countryCode="SK" value="421">
                      Slovak Republic (+421)
                    </option>
                    <option data-countryCode="SI" value="386">
                      Slovenia (+386)
                    </option>
                    <option data-countryCode="SB" value="677">
                      Solomon Islands (+677)
                    </option>
                    <option data-countryCode="SO" value="252">
                      Somalia (+252)
                    </option>
                    <option data-countryCode="ZA" value="27">
                      South Africa (+27)
                    </option>
                    <option data-countryCode="ES" value="34">
                      Spain (+34)
                    </option>
                    <option data-countryCode="LK" value="94">
                      Sri Lanka (+94)
                    </option>
                    <option data-countryCode="SH" value="290">
                      St. Helena (+290)
                    </option>
                    <option data-countryCode="KN" value="1869">
                      St. Kitts (+1869)
                    </option>
                    <option data-countryCode="SC" value="1758">
                      St. Lucia (+1758)
                    </option>
                    <option data-countryCode="SD" value="249">
                      Sudan (+249)
                    </option>
                    <option data-countryCode="SR" value="597">
                      Suriname (+597)
                    </option>
                    <option data-countryCode="SZ" value="268">
                      Swaziland (+268)
                    </option>
                    <option data-countryCode="SE" value="46">
                      Sweden (+46)
                    </option>
                    <option data-countryCode="CH" value="41">
                      Switzerland (+41)
                    </option>
                    <option data-countryCode="SI" value="963">
                      Syria (+963)
                    </option>
                    <option data-countryCode="TW" value="886">
                      Taiwan (+886)
                    </option>
                    <option data-countryCode="TJ" value="7">
                      Tajikstan (+7)
                    </option>
                    <option data-countryCode="TH" value="66">
                      Thailand (+66)
                    </option>
                    <option data-countryCode="TG" value="228">
                      Togo (+228)
                    </option>
                    <option data-countryCode="TO" value="676">
                      Tonga (+676)
                    </option>
                    <option data-countryCode="TT" value="1868">
                      Trinidad &amp; Tobago (+1868)
                    </option>
                    <option data-countryCode="TN" value="216">
                      Tunisia (+216)
                    </option>
                    <option data-countryCode="TR" value="90">
                      Turkey (+90)
                    </option>
                    <option data-countryCode="TM" value="7">
                      Turkmenistan (+7)
                    </option>
                    <option data-countryCode="TM" value="993">
                      Turkmenistan (+993)
                    </option>
                    <option data-countryCode="TC" value="1649">
                      Turks &amp; Caicos Islands (+1649)
                    </option>
                    <option data-countryCode="TV" value="688">
                      Tuvalu (+688)
                    </option>
                    <option data-countryCode="UG" value="256">
                      Uganda (+256)
                    </option>
                    <option data-countryCode="GB" value="44">
                      UK (+44)
                    </option>
                    <option data-countryCode="UA" value="380">
                      Ukraine (+380)
                    </option>
                    <option data-countryCode="AE" value="971">
                      United Arab Emirates (+971)
                    </option>
                    <option data-countryCode="UY" value="598">
                      Uruguay (+598)
                    </option>
                    <option data-countryCode="US" value="1">
                      USA (+1)
                    </option>
                    <option data-countryCode="UZ" value="7">
                      Uzbekistan (+7)
                    </option>
                    <option data-countryCode="VU" value="678">
                      Vanuatu (+678)
                    </option>
                    <option data-countryCode="VA" value="379">
                      Vatican City (+379)
                    </option>
                    <option data-countryCode="VE" value="58">
                      Venezuela (+58)
                    </option>
                    <option data-countryCode="VN" value="84">
                      Vietnam (+84)
                    </option>
                    <option data-countryCode="VG" value="84">
                      Virgin Islands - British (+1284)
                    </option>
                    <option data-countryCode="VI" value="84">
                      Virgin Islands - US (+1340)
                    </option>
                    <option data-countryCode="WF" value="681">
                      Wallis &amp; Futuna (+681)
                    </option>
                    <option data-countryCode="YE" value="969">
                      Yemen (North)(+969)
                    </option>
                    <option data-countryCode="YE" value="967">
                      Yemen (South)(+967)
                    </option>
                    <option data-countryCode="ZM" value="260">
                      Zambia (+260)
                    </option>
                    <option data-countryCode="ZW" value="263">
                      Zimbabwe (+263)
                    </option>
                  </select>
                  {errors.countryCode && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.countryCode.message}
                    </p>
                  )}
                  <input
                    {...register("phone", {
                      required: "Contact number is required",
                    })}
                    type="tel"
                    placeholder="Contact Number "
                    className={`w-full border-2 ${
                      errors.phone ? "border-red-500" : ""
                    } placeholder-gray-500 text-gray-800 rounded-md p-2 mt-1`}
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.phone.message}
                    </p>
                  )}
                </div>

                <div>
                  <RequiredLabel text="Nationality" />
                  <input
                    {...register("nationality", {
                      required: "Nationality is required",
                    })}
                    placeholder="Enter your nationality "
                    className={`w-full border-2 ${
                      errors.nationality ? "border-red-500" : ""
                    } placeholder-gray-500 text-gray-800 rounded-md p-2 mt-1`}
                  >
                   
                  </input>
                  {errors.nationality && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.nationality.message}
                    </p>
                  )}
                </div>

                <div>
                  <RequiredLabel text="What city are you based in?" />
                  <input
                  placeholder="Enter the city you are based in "
                    {...register("city", { required: "City is required" })}
                    className={`w-full border-2 ${
                      errors.city ? "border-red-500" : ""
                    } placeholder-gray-500 text-gray-800 rounded-md p-2 mt-1`}
                  >
                    
                  </input>
                  {errors.city && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.city.message}
                    </p>
                  )}
                </div>

                <div>
                  <RequiredLabel text="Date of Birth" />
                  <input
                    {...register("dob", {
                      required: "Date of birth is required",
                    })}
                    type="date"
                    className={`w-full border-2 ${
                      errors.dob ? "border-red-500" : ""
                    } placeholder-gray-500 text-gray-800 rounded-md p-2 mt-1`}
                  />
                  {errors.dob && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.dob.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex justify-between gap-4">
                <Button
                  className="flex items-center gap-x-3 btn"
                  onClick={onPrevious}
                >
                  <FaArrowLeft /> Previous
                </Button>
                <Button
                  className="flex items-center gap-x-3 btn"
                  onClick={validateAndProceed}
                >
                  Next <FaArrowRight />
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Social Media Handles (All Optional) */}
          {step === 3 && (
            <div className="space-y-5">
              <h2 className="text-2xl font-bold text-gray-800 text-center">
                Social Media Handles
              </h2>
              <p className="text-sm text-gray-600 text-center">
                Please add complete URLs
              </p>
              <div className="space-y-4">
                <input
                  {...register("instagram")}
                  placeholder="Instagram URL"
                  className="w-full border-2  placeholder-gray-500 text-gray-800 rounded-md p-2"
                />
                <input
                  {...register("tiktok")}
                  placeholder="TikTok URL "
                  className="w-full border-2  placeholder-gray-500 text-gray-800 rounded-md p-2"
                />
                <input
                  {...register("youtube")}
                  placeholder="YouTube URL "
                  className="w-full border-2  placeholder-gray-500 text-gray-800 rounded-md p-2"
                />
                <input
                  {...register("facebook")}
                  placeholder="Facebook URL "
                  className="w-full border-2  placeholder-gray-500 text-gray-800 rounded-md p-2"
                />
                <input
                  {...register("twitter")}
                  placeholder="X (Twitter) URL "
                  className="w-full border-2  placeholder-gray-500 text-gray-800 rounded-md p-2"
                />
                <input
                  {...register("linkedin")}
                  placeholder="LinkedIn URL "
                  className="w-full border-2  placeholder-gray-500 text-gray-800 rounded-md p-2"
                />
                <input
                  {...register("otherSocial")}
                  placeholder="Other Platform URL "
                  className="w-full border-2  placeholder-gray-500 text-gray-800 rounded-md p-2"
                />
              </div>
              <div className="flex justify-between gap-4">
                <Button
                  className="flex items-center gap-x-3 btn"
                  onClick={onPrevious}
                >
                  <FaArrowLeft /> Previous
                </Button>
                <Button
                  className="flex items-center gap-x-3 btn"
                  onClick={() => setStep(step + 1)}
                >
                  Next <FaArrowRight />
                </Button>
              </div>
            </div>
          )}

          {/* Step 4: Creator Type & Profile Information */}
          {step === 4 && (
            <div className="space-y-5">
              <h2 className="text-2xl font-bold text-gray-800 text-center">
                Creator Profile
              </h2>

              <div className="space-y-1">
                <RequiredLabel text="What type of creator are you?" />
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input
                      {...register("typeOfContent", {
                        required: "Please select creator type",
                      })}
                      type="radio"
                      value="nano"
                      id="nano"
                      className="mr-2"
                    />
                    <label htmlFor="nano">
                      Nano Creator (1K-10K followers)
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      {...register("typeOfContent")}
                      type="radio"
                      value="micro"
                      id="micro"
                      className="mr-2"
                    />
                    <label htmlFor="micro">
                      Micro Creator (10K-100K followers)
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      {...register("typeOfContent")}
                      type="radio"
                      value="macro"
                      id="macro"
                      className="mr-2"
                    />
                    <label htmlFor="macro">
                      Macro Creator (100K-1M followers)
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      {...register("typeOfContent")}
                      type="radio"
                      value="mega"
                      id="mega"
                      className="mr-2"
                    />
                    <label htmlFor="mega">Mega Creator (1M+ followers)</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      {...register("typeOfContent")}
                      type="radio"
                      value="not-sure"
                      id="not-sure"
                      className="mr-2"
                    />
                    <label htmlFor="not-sure">
                      Not sure / Prefer not to say
                    </label>
                  </div>
                </div>
                {errors.currentFollowers && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.currentFollowers.message}
                  </p>
                )}
              </div>

              <h3 className="text-lg font-semibold text-gray-800 pt-2">
                Profile Information
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="font-medium text-gray-700">Platform</label>
                  <select
                    {...register("platform")}
                    className="w-full border-2  placeholder-gray-500 text-gray-800 rounded-md p-2 mt-1"
                  >
                    <option value="">Select your main platform</option>
                    <option value="instagram">Instagram</option>
                    <option value="tiktok">TikTok</option>
                    <option value="youtube">YouTube</option>
                    <option value="facebook">Facebook</option>
                    <option value="twitter">X (Twitter)</option>
                    <option value="linkedin">LinkedIn</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <input
                  {...register("reachLast30Days")}
                  placeholder="Reach in last 30 days"
                  className="w-full border-2  placeholder-gray-500 text-gray-800 rounded-md p-2"
                />

                <input
                  {...register("currentFollowers")}
                  placeholder="Current Follower Count"
                  className="w-full border-2  placeholder-gray-500 text-gray-800 rounded-md p-2"
                />

                <input
                  {...register("postsLast30Days")}
                  placeholder="How many posts have you shared in the last 30 days?"
                  className="w-full border-2  placeholder-gray-500 text-gray-800 rounded-md p-2"
                />

                <input
                  {...register("averageEngagementRate")}
                  placeholder="What is your average engagement rate over the past 30 days?"
                  className="w-full border-2  placeholder-gray-500 text-gray-800 rounded-md p-2"
                />

                <input
                  {...register("majorityViewersCountry")}
                  placeholder="Majority viewers are from which country"
                  className="w-full border-2  placeholder-gray-500 text-gray-800 rounded-md p-2"
                />

                <div className="space-y-2">
                  <label className="font-medium text-gray-700">
                    Which type of content do you primarily create?
                  </label>
                  <div className="space-y-2 max-h-56 overflow-y-auto">
                    {[
                      "Lifestyle",
                      "Vlogging",
                      "Food Review & Cooking",
                      "Travel",
                      "Education",
                      "Finance & Business",
                      "Tech & Gadgets",
                      "Beauty & Fashion",
                      "Health & Fitness",
                      "Parenting & Family",
                      "DIY & Crafts",
                      "Art & Photography",
                      "Entertainment & Comedy",
                      "Music & Dance",
                      "Motivation & Self-Development",
                    ].map((type) => (
                      <div key={type} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`content-${type}`}
                          className="mr-2"
                          checked={selectedContentTypes.includes(type)}
                          onChange={() => handleContentTypeChange(type)}
                        />
                        <label htmlFor={`content-${type}`}>{type}</label>
                      </div>
                    ))}
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="content-other"
                        className="mr-2"
                        checked={selectedContentTypes.includes("Other")}
                        onChange={() => handleContentTypeChange("Other")}
                      />
                      <label htmlFor="content-other">Other</label>
                    </div>
                    {selectedContentTypes.includes("Other") && (
                      <input
                        placeholder="Please specify"
                        className="w-full border-2  placeholder-gray-500 text-gray-800 rounded-md p-2 mt-2"
                      />
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-between gap-4">
                <Button
                  className="flex items-center gap-x-3 btn"
                  onClick={onPrevious}
                >
                  <FaArrowLeft /> Previous
                </Button>
                <Button
                  className="flex items-center gap-x-3 btn"
                  onClick={validateAndProceed}
                >
                  Next <FaArrowRight />
                </Button>
              </div>
            </div>
          )}

          {/* Step 5: Collaboration Preferences - First Page */}
          {step === 5 && (
            <div className="space-y-5">
              <h2 className="text-2xl font-bold text-gray-800 text-center">
                Collaboration Preferences
              </h2>

              <div className="space-y-2">
                <RequiredLabel text="How much time do you typically need to deliver content for brands?" />
                <div className="space-y-2">
                  {[
                    "Within 24 hours",
                    "1-3 days",
                    "4-7 days",
                    "1-2 weeks",
                    "More than 2 weeks",
                    "Depends on the project",
                  ].map((option) => (
                    <div key={option} className="flex items-center">
                      <input
                        {...register("timeTakenToCreate", {
                          required: "Please select delivery time",
                        })}
                        type="radio"
                        value={option}
                        id={`time-${option}`}
                        className="mr-2"
                      />
                      <label htmlFor={`time-${option}`}>{option}</label>
                    </div>
                  ))}
                </div>
                {errors.timeTakenToCreate && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.timeTakenToCreate.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <RequiredLabel text="What type of collaborations are you open to?" />
                <div className="space-y-2">
                  {[
                    "Paid collaborations only",
                    "Barter collaborations also work",
                    "Open to both",
                    "It depends on the project and deliverables",
                  ].map((option) => (
                    <div key={option} className="flex items-center">
                      <input
                        {...register("collaborationPreference", {
                          required: "Please select collaboration type",
                        })}
                        type="radio"
                        value={option}
                        id={`collab-${option}`}
                        className="mr-2"
                      />
                      <label htmlFor={`collab-${option}`}>{option}</label>
                    </div>
                  ))}
                </div>
                {errors.collaborationPreference && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.collaborationPreference.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="font-medium text-gray-700">
                  If you charge for content, what is your typical price range
                  per reel or content piece?
                  <span className="text-sm block text-gray-500">
                    (Select maximum 2 options)
                  </span>
                </label>
                <div className="space-y-2">
                  {[
                    "Less than 500 AED",
                    "500 - 1000 AED",
                    "1000 - 2000 AED",
                    "2000 - 5000 AED",
                    "5000 - 10,000 AED",
                    "10,000 + AED",
                    "Varies based on project requirements",
                  ].map((range) => (
                    <div key={range} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`price-${range}`}
                        className="mr-2"
                        checked={selectedPriceRanges.includes(range)}
                        onChange={() => handlePriceRangeChange(range)}
                        disabled={
                          !selectedPriceRanges.includes(range) &&
                          selectedPriceRanges.length >= 2
                        }
                      />
                      <label
                        htmlFor={`price-${range}`}
                        className={`${
                          !selectedPriceRanges.includes(range) &&
                          selectedPriceRanges.length >= 2
                            ? "text-gray-400"
                            : ""
                        }`}
                      >
                        {range}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between gap-4">
                <Button
                  className="flex items-center gap-x-3 btn"
                  onClick={onPrevious}
                >
                  <FaArrowLeft /> Previous
                </Button>
                <Button
                  className="flex items-center gap-x-3 btn"
                  onClick={validateAndProceed}
                >
                  Next <FaArrowRight />
                </Button>
              </div>
            </div>
          )}

          {/* Step 6: Collaboration Preferences - Second Page */}
          {step === 6 && (
            <div className="space-y-5">
              <h2 className="text-2xl font-bold text-gray-800 text-center">
                Additional Preferences
              </h2>

              <div className="space-y-2">
                <RequiredLabel text="How do you prefer to collaborate with brands?" />
                <div className="space-y-2">
                  {[
                    "Post collaboration content on my own page",
                    "Freelance content creation for the brand's page (not posted on my profile)",
                    "Open to Both",
                    "Open to discussing different collaboration formats",
                  ].map((option) => (
                    <div key={option} className="flex items-center">
                      <input
                        {...register("preferredCollaboration", {
                          required: "Please select preferred collaboration",
                        })}
                        type="radio"
                        value={option}
                        id={`prefer-${option}`}
                        className="mr-2"
                      />
                      <label htmlFor={`prefer-${option}`}>{option}</label>
                    </div>
                  ))}
                </div>
                {errors.preferredCollaboration && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.preferredCollaboration.message}
                  </p>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <label className="font-medium text-gray-700 block mb-1">
                    Name of brands worked with previously
                    <span className="text-sm text-gray-500 ml-2">
                      (optional)
                    </span>
                  </label>
                  <textarea
                    {...register("brandsWorkedWith")}
                    className="w-full border-2  placeholder-gray-500 text-gray-800 rounded-md p-2 min-h-24"
                    placeholder="List brands you've collaborated with"
                  />
                </div>

                <div>
                  <label className="font-medium text-gray-700 block mb-1">
                    URL links to previous work samples or portfolio
                    <span className="text-sm text-gray-500 ml-2">
                      (optional)
                    </span>
                  </label>
                  <textarea
                    {...register("portfolioLinks")}
                    className="w-full border-2  placeholder-gray-500 text-gray-800 rounded-md p-2 min-h-24"
                    placeholder="Paste links to your best work"
                  />
                </div>
              </div>

              <div className="flex justify-between gap-4">
                <Button
                  className="flex items-center gap-x-3 btn"
                  onClick={onPrevious}
                >
                  <FaArrowLeft /> Previous
                </Button>
                <Button className="flex items-center gap-x-3 btn">
                  Submit <FaArrowRight />
                </Button>
              </div>
            </div>
          )}
        </form>

        <OtpVerificationModal
          isOpen={showOtpModal}
          onClose={() => setShowOtpModal(false)}
          userId={signupUserId}
          email={signupEmail}
          onSuccess={handleOtpSuccess}
        />
      </div>
      <Footer />
    </>
  );
};

export default Onboarding;
