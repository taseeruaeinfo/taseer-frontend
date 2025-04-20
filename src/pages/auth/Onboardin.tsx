import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa";
import { FiCheckCircle } from "react-icons/fi";
import Button from "../../components/ui/Button";
import Footer from "../../components/Fotter";

// Define types for form data
type FormData = {
    // Basic Information
    firstName: string;
    lastName: string;
    email: string;
    contactNumber: string;
    nationality: string;
    password: string;
    confirmPassword: string;
    city: string;
    dateOfBirth: string;

    // Social Media Handles (all optional)
    instagram: string;
    tiktok: string;
    youtube: string;
    facebook: string;
    twitter: string;
    linkedin: string;
    otherSocial: string;

    // Creator Type
    creatorType: string;

    // Profile Information
    platform: string; // Optional
    reachLast30Days: string; // Optional
    followerCount: string; // Optional
    postsLast30Days: string; // Optional
    averageEngagementRate: string; // Optional
    majorityViewersCountry: string; // Optional
    contentTypes: string[]; // Optional

    // Collaboration Preferences
    deliveryTime: string;
    collaborationType: string;
    priceRange: string[]; // Optional
    preferredCollaboration: string;
    previousBrands: string; // Optional
    portfolioLinks: string; // Optional
};

const Onboarding = () => {
    const [step, setStep] = useState(1);
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
        trigger,
        getValues
    } = useForm<FormData>();


    console.log(getValues)

    // For tracking selected content types
    const [selectedContentTypes, setSelectedContentTypes] = useState<string[]>([]);
    // For tracking selected price ranges
    const [selectedPriceRanges, setSelectedPriceRanges] = useState<string[]>([]);

    const password = watch("password");

    const validateAndProceed = async () => {
        let fieldsToValidate: string[] = [];

        // Define fields to validate based on current step
        if (step === 1) {
            fieldsToValidate = [
                "firstName", "lastName", "email", "contactNumber",
                "nationality", "password", "confirmPassword", "city", "dateOfBirth"
            ];
        } else if (step === 3) {
            fieldsToValidate = ["creatorType"];
        } else if (step === 4) {
            fieldsToValidate = ["deliveryTime", "collaborationType", "preferredCollaboration"];
        }

        const result = await trigger(fieldsToValidate as any);
        if (result) {
            setStep((prev) => prev + 1);
        }
    };

    const onPrevious = () => setStep((prev) => prev - 1);

    const onSubmit = (data: FormData) => {
        // Add the selected content types and price ranges to the data
        data.contentTypes = selectedContentTypes;
        data.priceRange = selectedPriceRanges;

        console.log("User Data:", data);
        navigate("/home");
    };

    const handleContentTypeChange = (type: string) => {
        if (selectedContentTypes.includes(type)) {
            setSelectedContentTypes(selectedContentTypes.filter(item => item !== type));
        } else {
            setSelectedContentTypes([...selectedContentTypes, type]);
        }
    };

    const handlePriceRangeChange = (range: string) => {
        // Maximum 2 options can be chosen
        if (selectedPriceRanges.includes(range)) {
            setSelectedPriceRanges(selectedPriceRanges.filter(item => item !== range));
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
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4 py-8">
                {/* Logo & Step Tracker */}
                <div className="w-full max-w-md text-center mb-6">
                    <img src="/logo.svg" alt="Logo" className="w-24 mx-auto mb-4" />
                    <div className="flex justify-between items-center">
                        {[1, 2, 3, 4].map((num) => (
                            <div
                                key={num}
                                className={`w-10 h-10 flex items-center justify-center rounded-full text-white font-semibold transition ${step >= num ? "bg-purple-600" : "bg-gray-300"}`}
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
                    {/* Step 1: Basic Information */}
                    {step === 1 && (
                        <div className="space-y-5">
                            <h2 className="text-2xl font-bold text-gray-800 text-center">Basic Information</h2>
                            <div className="space-y-4">
                                <div>
                                    <RequiredLabel text="First Name" />
                                    <input
                                        {...register("firstName", { required: "First name is required" })}
                                        placeholder="First Name"
                                        className={`w-full border-2 ${errors.firstName ? "border-red-500" : "border-purple-500"} outline-purple-500 rounded-md p-2 mt-1`}
                                    />
                                    {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>}
                                </div>

                                <div>
                                    <RequiredLabel text="Last Name" />
                                    <input
                                        {...register("lastName", { required: "Last name is required" })}
                                        placeholder="Last Name"
                                        className={`w-full border-2 ${errors.lastName ? "border-red-500" : "border-purple-500"} outline-purple-500 rounded-md p-2 mt-1`}
                                    />
                                    {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>}
                                </div>

                                <div>
                                    <RequiredLabel text="Email" />
                                    <input
                                        {...register("email", {
                                            required: "Email is required",
                                            pattern: {
                                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                message: "Invalid email address"
                                            }
                                        })}
                                        type="email"
                                        placeholder="Email"
                                        className={`w-full border-2 ${errors.email ? "border-red-500" : "border-purple-500"} outline-purple-500 rounded-md p-2 mt-1`}
                                    />
                                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                                </div>

                                <div>
                                    <RequiredLabel text="Contact Number (with country code)" />
                                    <input
                                        {...register("contactNumber", { required: "Contact number is required" })}
                                        type="tel"
                                        placeholder="Contact Number (with country code)"
                                        className={`w-full border-2 ${errors.contactNumber ? "border-red-500" : "border-purple-500"} outline-purple-500 rounded-md p-2 mt-1`}
                                    />
                                    {errors.contactNumber && <p className="text-red-500 text-sm mt-1">{errors.contactNumber.message}</p>}
                                </div>

                                <div>
                                    <RequiredLabel text="Nationality" />
                                    <input
                                        {...register("nationality", { required: "Nationality is required" })}
                                        placeholder="Nationality"
                                        className={`w-full border-2 ${errors.nationality ? "border-red-500" : "border-purple-500"} outline-purple-500 rounded-md p-2 mt-1`}
                                    />
                                    {errors.nationality && <p className="text-red-500 text-sm mt-1">{errors.nationality.message}</p>}
                                </div>

                                <div>
                                    <RequiredLabel text="Create Password" />
                                    <input
                                        {...register("password", {
                                            required: "Password is required",
                                            minLength: {
                                                value: 6,
                                                message: "Password must be at least 6 characters"
                                            }
                                        })}
                                        type="password"
                                        placeholder="Create Password"
                                        className={`w-full border-2 ${errors.password ? "border-red-500" : "border-purple-500"} outline-purple-500 rounded-md p-2 mt-1`}
                                    />
                                    {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
                                </div>

                                <div>
                                    <RequiredLabel text="Re-enter Password" />
                                    <input
                                        {...register("confirmPassword", {
                                            required: "Please confirm your password",
                                            validate: value => value === password || "Passwords do not match"
                                        })}
                                        type="password"
                                        placeholder="Re-enter Password"
                                        className={`w-full border-2 ${errors.confirmPassword ? "border-red-500" : "border-purple-500"} outline-purple-500 rounded-md p-2 mt-1`}
                                    />
                                    {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>}
                                </div>

                                <div>
                                    <RequiredLabel text="What city are you based in?" />
                                    <input
                                        {...register("city", { required: "City is required" })}
                                        placeholder="What city are you based in?"
                                        className={`w-full border-2 ${errors.city ? "border-red-500" : "border-purple-500"} outline-purple-500 rounded-md p-2 mt-1`}
                                    />
                                    {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>}
                                </div>

                                <div>
                                    <RequiredLabel text="Date of Birth" />
                                    <input
                                        {...register("dateOfBirth", { required: "Date of birth is required" })}
                                        type="date"
                                        className={`w-full border-2 ${errors.dateOfBirth ? "border-red-500" : "border-purple-500"} outline-purple-500 rounded-md p-2 mt-1`}
                                    />
                                    {errors.dateOfBirth && <p className="text-red-500 text-sm mt-1">{errors.dateOfBirth.message}</p>}
                                </div>
                            </div>
                            <Button className="flex items-center mx-auto gap-x-3 btn" onClick={validateAndProceed}>
                                Next <FaArrowRight />
                            </Button>
                            <center className="py-3 w-full mx-auto font-medium">Already have an account? <a className="underline text-purple-600" href="/login">Log in</a>  </center>

                        </div>
                    )}

                    {/* Step 2: Social Media Handles (All Optional) */}
                    {step === 2 && (
                        <div className="space-y-5">
                            <h2 className="text-2xl font-bold text-gray-800 text-center">Social Media Handles</h2>
                            <p className="text-sm text-gray-600 text-center">Please add complete URLs (all fields optional)</p>
                            <div className="space-y-4">
                                <input
                                    {...register("instagram")}
                                    placeholder="Instagram URL"
                                    className="w-full border-2 border-purple-500 outline-purple-500 rounded-md p-2"
                                />
                                <input
                                    {...register("tiktok")}
                                    placeholder="TikTok URL"
                                    className="w-full border-2 border-purple-500 outline-purple-500 rounded-md p-2"
                                />
                                <input
                                    {...register("youtube")}
                                    placeholder="YouTube URL"
                                    className="w-full border-2 border-purple-500 outline-purple-500 rounded-md p-2"
                                />
                                <input
                                    {...register("facebook")}
                                    placeholder="Facebook URL"
                                    className="w-full border-2 border-purple-500 outline-purple-500 rounded-md p-2"
                                />
                                <input
                                    {...register("twitter")}
                                    placeholder="X (Twitter) URL"
                                    className="w-full border-2 border-purple-500 outline-purple-500 rounded-md p-2"
                                />
                                <input
                                    {...register("linkedin")}
                                    placeholder="LinkedIn URL"
                                    className="w-full border-2 border-purple-500 outline-purple-500 rounded-md p-2"
                                />
                                <input
                                    {...register("otherSocial")}
                                    placeholder="Other Platform URL"
                                    className="w-full border-2 border-purple-500 outline-purple-500 rounded-md p-2"
                                />
                            </div>
                            <div className="flex justify-between gap-4">
                                <Button className="flex items-center gap-x-3 btn" onClick={onPrevious}>
                                    <FaArrowLeft /> Previous
                                </Button>
                                <Button className="flex items-center gap-x-3 btn" onClick={() => setStep(step + 1)}>
                                    Next <FaArrowRight />
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Creator Type & Profile Information */}
                    {step === 3 && (
                        <div className="space-y-5">
                            <h2 className="text-2xl font-bold text-gray-800 text-center">Creator Profile</h2>

                            <div className="space-y-1">
                                <RequiredLabel text="What type of creator are you?" />
                                <div className="space-y-2">
                                    <div className="flex items-center">
                                        <input
                                            {...register("creatorType", { required: "Please select creator type" })}
                                            type="radio"
                                            value="nano"
                                            id="nano"
                                            className="mr-2"
                                        />
                                        <label htmlFor="nano">Nano Creator (1K-10K followers)</label>
                                    </div>
                                    <div className="flex items-center">
                                        <input
                                            {...register("creatorType")}
                                            type="radio"
                                            value="micro"
                                            id="micro"
                                            className="mr-2"
                                        />
                                        <label htmlFor="micro">Micro Creator (10K-100K followers)</label>
                                    </div>
                                    <div className="flex items-center">
                                        <input
                                            {...register("creatorType")}
                                            type="radio"
                                            value="macro"
                                            id="macro"
                                            className="mr-2"
                                        />
                                        <label htmlFor="macro">Macro Creator (100K-1M followers)</label>
                                    </div>
                                    <div className="flex items-center">
                                        <input
                                            {...register("creatorType")}
                                            type="radio"
                                            value="mega"
                                            id="mega"
                                            className="mr-2"
                                        />
                                        <label htmlFor="mega">Mega Creator (1M+ followers)</label>
                                    </div>
                                    <div className="flex items-center">
                                        <input
                                            {...register("creatorType")}
                                            type="radio"
                                            value="not-sure"
                                            id="not-sure"
                                            className="mr-2"
                                        />
                                        <label htmlFor="not-sure">Not sure / Prefer not to say</label>
                                    </div>
                                </div>
                                {errors.creatorType && <p className="text-red-500 text-sm mt-1">{errors.creatorType.message}</p>}
                            </div>

                            <h3 className="text-lg font-semibold text-gray-800 pt-2">Profile Information</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="font-medium text-gray-700">Platform (dropdown)</label>
                                    <select
                                        {...register("platform")}
                                        className="w-full border-2 border-purple-500 outline-purple-500 rounded-md p-2 mt-1"
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
                                    className="w-full border-2 border-purple-500 outline-purple-500 rounded-md p-2"
                                />

                                <input
                                    {...register("followerCount")}
                                    placeholder="Current Follower Count"
                                    className="w-full border-2 border-purple-500 outline-purple-500 rounded-md p-2"
                                />

                                <input
                                    {...register("postsLast30Days")}
                                    placeholder="How many posts have you shared in the last 30 days?"
                                    className="w-full border-2 border-purple-500 outline-purple-500 rounded-md p-2"
                                />

                                <input
                                    {...register("averageEngagementRate")}
                                    placeholder="What is your average engagement rate over the past 30 days?"
                                    className="w-full border-2 border-purple-500 outline-purple-500 rounded-md p-2"
                                />

                                <input
                                    {...register("majorityViewersCountry")}
                                    placeholder="Majority viewers are from which country"
                                    className="w-full border-2 border-purple-500 outline-purple-500 rounded-md p-2"
                                />

                                <div className="space-y-2">
                                    <label className="font-medium text-gray-700">Which type of content do you primarily create?</label>
                                    <div className="space-y-2 max-h-56 overflow-y-auto">
                                        {[
                                            "Lifestyle", "Vlogging", "Food Review & Cooking", "Travel",
                                            "Education", "Finance & Business", "Tech & Gadgets",
                                            "Beauty & Fashion", "Health & Fitness", "Parenting & Family",
                                            "DIY & Crafts", "Art & Photography", "Entertainment & Comedy",
                                            "Music & Dance", "Motivation & Self-Development"
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
                                                className="w-full border-2 border-purple-500 outline-purple-500 rounded-md p-2 mt-2"
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-between gap-4">
                                <Button className="flex items-center gap-x-3 btn" onClick={onPrevious}>
                                    <FaArrowLeft /> Previous
                                </Button>
                                <Button className="flex items-center gap-x-3 btn" onClick={validateAndProceed}>
                                    Next <FaArrowRight />
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Step 4: Collaboration Preferences */}
                    {step === 4 && (
                        <div className="space-y-5">
                            <h2 className="text-2xl font-bold text-gray-800 text-center">Collaboration Preferences</h2>

                            <div className="space-y-2">
                                <RequiredLabel text="How much time do you typically need to deliver content for brands?" />
                                <div className="space-y-2">
                                    {[
                                        "Within 24 hours", "1-3 days", "4-7 days", "1-2 weeks",
                                        "More than 2 weeks", "Depends on the project"
                                    ].map((option) => (
                                        <div key={option} className="flex items-center">
                                            <input
                                                {...register("deliveryTime", { required: "Please select delivery time" })}
                                                type="radio"
                                                value={option}
                                                id={`time-${option}`}
                                                className="mr-2"
                                            />
                                            <label htmlFor={`time-${option}`}>{option}</label>
                                        </div>
                                    ))}
                                </div>
                                {errors.deliveryTime && <p className="text-red-500 text-sm mt-1">{errors.deliveryTime.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <RequiredLabel text="What type of collaborations are you open to?" />
                                <div className="space-y-2">
                                    {[
                                        "Paid collaborations only",
                                        "Barter collaborations also work",
                                        "Open to both",
                                        "It depends on the project and deliverables"
                                    ].map((option) => (
                                        <div key={option} className="flex items-center">
                                            <input
                                                {...register("collaborationType", { required: "Please select collaboration type" })}
                                                type="radio"
                                                value={option}
                                                id={`collab-${option}`}
                                                className="mr-2"
                                            />
                                            <label htmlFor={`collab-${option}`}>{option}</label>
                                        </div>
                                    ))}
                                </div>
                                {errors.collaborationType && <p className="text-red-500 text-sm mt-1">{errors.collaborationType.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <label className="font-medium text-gray-700">
                                    If you charge for content, what is your typical price range per reel or content piece?
                                    <span className="text-sm block text-gray-500">(Select maximum 2 options)</span>
                                </label>
                                <div className="space-y-2">
                                    {[
                                        "Less than 500 AED",
                                        "500 - 1000 AED",
                                        "1000 - 2000 AED",
                                        "2000 - 5000 AED",
                                        "5000 - 10,000 AED",
                                        "10,000 + AED",
                                        "Varies based on project requirements"
                                    ].map((range) => (
                                        <div key={range} className="flex items-center">
                                            <input
                                                type="checkbox"
                                                id={`price-${range}`}
                                                className="mr-2"
                                                checked={selectedPriceRanges.includes(range)}
                                                onChange={() => handlePriceRangeChange(range)}
                                                disabled={!selectedPriceRanges.includes(range) && selectedPriceRanges.length >= 2}
                                            />
                                            <label
                                                htmlFor={`price-${range}`}
                                                className={`${!selectedPriceRanges.includes(range) && selectedPriceRanges.length >= 2 ? "text-gray-400" : ""}`}
                                            >
                                                {range}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <RequiredLabel text="How do you prefer to collaborate with brands?" />
                                <div className="space-y-2">
                                    {[
                                        "Post collaboration content on my own page",
                                        "Freelance content creation for the brand's page (not posted on my profile)",
                                        "Open to Both",
                                        "Open to discussing different collaboration formats"
                                    ].map((option) => (
                                        <div key={option} className="flex items-center">
                                            <input
                                                {...register("preferredCollaboration", { required: "Please select preferred collaboration" })}
                                                type="radio"
                                                value={option}
                                                id={`prefer-${option}`}
                                                className="mr-2"
                                            />
                                            <label htmlFor={`prefer-${option}`}>{option}</label>
                                        </div>
                                    ))}
                                </div>
                                {errors.preferredCollaboration && <p className="text-red-500 text-sm mt-1">{errors.preferredCollaboration.message}</p>}
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="font-medium text-gray-700 block mb-1">
                                        Name of brands worked with previously
                                        <span className="text-sm text-gray-500 ml-2">(optional)</span>
                                    </label>
                                    <textarea
                                        {...register("previousBrands")}
                                        className="w-full border-2 border-purple-500 outline-purple-500 rounded-md p-2 min-h-24"
                                        placeholder="List brands you've collaborated with"
                                    />
                                </div>

                                <div>
                                    <label className="font-medium text-gray-700 block mb-1">
                                        URL links to previous work samples or portfolio
                                        <span className="text-sm text-gray-500 ml-2">(optional)</span>
                                    </label>
                                    <textarea
                                        {...register("portfolioLinks")}
                                        className="w-full border-2 border-purple-500 outline-purple-500 rounded-md p-2 min-h-24"
                                        placeholder="Paste links to your best work"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-between gap-4">
                                <Button className="flex items-center gap-x-3 btn" onClick={onPrevious}>
                                    <FaArrowLeft /> Previous
                                </Button>
                                <Button className="flex items-center gap-x-3 btn">
                                    Submit <FaArrowRight />
                                </Button>
                            </div>
                        </div>
                    )}
                </form >
            </div >
            <Footer />
        </>
    );
};

export default Onboarding;