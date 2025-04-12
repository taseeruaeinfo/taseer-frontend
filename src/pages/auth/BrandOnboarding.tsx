import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import { FiCheckCircle } from "react-icons/fi";
import Button from "../../components/ui/Button";
import Footer from "../../components/Fotter";

interface OnboardingFormData {
    // Step 1: Basic Info
    companyName: string;
    email: string;
    contactNumber: string;
    website?: string;
    password: string;
    confirmPassword: string;

    // Step 2: Company Details
    companySize: "startup" | "small" | "medium" | "large" | "enterprise";
    industry: string;
    otherIndustry?: string;
    yearOfIncorporation?: string;
    city: string;

    // Step 3: Representative
    representativeName: string;
    designation: string;
    department: string;
    otherDepartment?: string;
    representativeEmail?: string;
    sameAsCompanyEmail: boolean;
    representativeContactNumber?: string;

    // Step 4: Marketing & Goals
    marketingBudget: string;
    workedWithCreators: "yes" | "no";
    supportType: string;
    platformUse: string;

    // Step 5: Content Preferences
    creatorType: string;
    socialMedia: {
        instagram?: boolean;
        facebook?: boolean;
        twitter?: boolean;
        linkedin?: boolean;
        tiktok?: boolean;
        pinterest?: boolean;
        youtube?: boolean;
        other?: boolean;
    };
    otherSocialMedia?: string;

    // Terms
    acceptTerms: boolean;
}

const Onboarding = () => {
    const [step, setStep] = useState(1);
    const navigate = useNavigate();
    const { register, handleSubmit, watch, formState: { errors }, setValue, trigger } = useForm<OnboardingFormData>({
        mode: "onChange" // Enable validation on field change
    });
    const totalSteps = 5;

    const sameAsCompanyEmail = watch("sameAsCompanyEmail");
    const companyEmail = watch("email");
    const industry = watch("industry");
    const department = watch("department");

    useEffect(() => {
        if (sameAsCompanyEmail) {
            setValue("representativeEmail", companyEmail);
        }
    }, [sameAsCompanyEmail, companyEmail, setValue]);

    const onNext = async () => {
        let fieldsToValidate: string[] = [];

        // Define which fields to validate based on current step
        switch (step) {
            case 1:
                fieldsToValidate = ["companyName", "email", "contactNumber", "password", "confirmPassword"];
                break;
            case 2:
                fieldsToValidate = ["companySize", "industry", "city"];
                if (industry === "other") fieldsToValidate.push("otherIndustry");
                break;
            case 3:
                fieldsToValidate = ["representativeName", "designation", "department"];
                if (department === "other") fieldsToValidate.push("otherDepartment");
                break;
            case 4:
                fieldsToValidate = ["marketingBudget", "workedWithCreators", "supportType", "platformUse"];
                break;
            case 5:
                fieldsToValidate = ["creatorType", "acceptTerms"];
                break;
            default:
                break;
        }

        // Trigger validation for the specified fields
        const result = await trigger(fieldsToValidate as any);

        // Only proceed if validation passes
        if (result) {
            setStep((prev) => prev + 1);
        }
    };

    const onBack = () => setStep((prev) => prev - 1);

    const onSubmit = (data: OnboardingFormData) => {
        console.log("User Data:", data);
        navigate("/brand/home");
    };

    // Check if email is a company domain (not gmail, yahoo, etc.)
    const validateCompanyEmail = (email: string) => {
        const commonDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'aol.com', 'icloud.com'];
        const domain = email.split('@')[1]?.toLowerCase();
        return !commonDomains.includes(domain) || "Company domain email required (no gmail.com, yahoo.com, etc.)";
    };

    // Validate password match
    const validatePasswordMatch = (confirmPassword: string) => {
        const password = watch("password");
        return confirmPassword === password || "Passwords do not match";
    };

    return (
        <>
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4 py-8">
                {/* Logo & Step Tracker */}
                <div className="w-full max-w-md text-center">
                    <img src="/logo.svg" alt="Logo" className="w-24 mx-auto mb-4" />
                    <div className="flex justify-between items-center mb-6">
                        {Array.from({ length: totalSteps }, (_, i) => i + 1).map((num) => (
                            <div
                                key={num}
                                className={`w-8 h-8 flex items-center justify-center rounded-full text-white font-semibold text-xs transition ${step >= num ? "bg-purple-600" : "bg-gray-300"
                                    }`}
                            >
                                {step > num ? <FiCheckCircle size={16} /> : num}
                            </div>
                        ))}
                    </div>
                    <p className="text-gray-600 mb-4">Step {step} of {totalSteps}</p>
                </div>

                {/* Form Card */}
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8 space-y-6"
                >
                    {/* Step 1: Basic Info */}
                    {step === 1 && (
                        <div className="space-y-5">
                            <h2 className="text-2xl font-bold text-gray-800 text-center">Basic Information</h2>
                            <div className="space-y-4">
                                <div>
                                    <input
                                        {...register("companyName", { required: "Company name is required" })}
                                        placeholder="Company Name *"
                                        className="w-full border-2 border-purple-500 outline-purple-500 rounded-md p-2"
                                    />
                                    {errors.companyName && <p className="text-red-500 text-sm mt-1">{errors.companyName.message}</p>}
                                </div>

                                <div>
                                    <input
                                        {...register("email", {
                                            required: "Email is required",
                                            validate: validateCompanyEmail
                                        })}
                                        type="email"
                                        placeholder="Email (company domain required) *"
                                        className="w-full border-2 border-purple-500 outline-purple-500 rounded-md p-2"
                                    />
                                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                                </div>

                                <div>
                                    <input
                                        {...register("contactNumber", { required: "Contact number is required" })}
                                        placeholder="Contact Number (with country code) *"
                                        className="w-full border-2 border-purple-500 outline-purple-500 rounded-md p-2"
                                    />
                                    {errors.contactNumber && <p className="text-red-500 text-sm mt-1">{errors.contactNumber.message}</p>}
                                </div>

                                <div>
                                    <input
                                        {...register("website")}
                                        placeholder="Website (optional)"
                                        className="w-full border-2 border-purple-500 outline-purple-500 rounded-md p-2"
                                    />
                                </div>

                                <div>
                                    <input
                                        {...register("password", {
                                            required: "Password is required",
                                            minLength: { value: 8, message: "Password must be at least 8 characters" }
                                        })}
                                        type="password"
                                        placeholder="Create Password *"
                                        className="w-full border-2 border-purple-500 outline-purple-500 rounded-md p-2"
                                    />
                                    {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
                                </div>

                                <div>
                                    <input
                                        {...register("confirmPassword", {
                                            required: "Please confirm your password",
                                            validate: validatePasswordMatch
                                        })}
                                        type="password"
                                        placeholder="Re-enter Password *"
                                        className="w-full border-2 border-purple-500 outline-purple-500 rounded-md p-2"
                                    />
                                    {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>}
                                </div>
                            </div>
                            <Button
                                className="flex items-center mx-auto gap-x-3 btn"
                                onClick={onNext}
                            >
                                Next <FaArrowRight />
                            </Button>
                        </div>
                    )}

                    {/* Step 2: Company Details */}
                    {step === 2 && (
                        <div className="space-y-5">
                            <h2 className="text-2xl font-bold text-gray-800 text-center">Company Details</h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-gray-700 mb-1">Company Size *</label>
                                    <div className="space-y-2">
                                        {[
                                            { value: "startup", label: "Startup (1-10 employees)" },
                                            { value: "small", label: "Small (11-50 employees)" },
                                            { value: "medium", label: "Medium (51-200 employees)" },
                                            { value: "large", label: "Large (201-1000 employees)" },
                                            { value: "enterprise", label: "Enterprise (1000+ employees)" }
                                        ].map((option) => (
                                            <div key={option.value} className="flex items-center">
                                                <input
                                                    {...register("companySize", { required: "Please select your company size" })}
                                                    type="radio"
                                                    id={option.value}
                                                    value={option.value}
                                                    className="mr-3 h-5 w-5 accent-purple-600"
                                                />
                                                <label htmlFor={option.value} className="text-gray-700">{option.label}</label>
                                            </div>
                                        ))}
                                    </div>
                                    {errors.companySize && <p className="text-red-500 text-sm mt-1">{errors.companySize.message}</p>}
                                </div>

                                <div>
                                    <label className="block text-gray-700 mb-1">Industry *</label>
                                    <select
                                        {...register("industry", { required: "Please select your industry" })}
                                        className="w-full border-2 border-purple-500 outline-purple-500 rounded-md p-2"
                                    >
                                        <option value="">Select Your Industry</option>
                                        <option value="fashion">Fashion & Apparel</option>
                                        <option value="beauty">Beauty & Cosmetics</option>
                                        <option value="health">Health & Wellness</option>
                                        <option value="fitness">Fitness & Sports</option>
                                        <option value="food">Food & Beverage</option>
                                        <option value="ecommerce">E-commerce & Retail</option>
                                        <option value="travel">Travel & Hospitality</option>
                                        <option value="education">Education & E-learning</option>
                                        <option value="realestate">Real Estate & Property</option>
                                        <option value="other">Other (Please specify)</option>
                                    </select>
                                    {errors.industry && <p className="text-red-500 text-sm mt-1">{errors.industry.message}</p>}
                                </div>

                                {industry === "other" && (
                                    <div>
                                        <input
                                            {...register("otherIndustry", {
                                                required: industry === "other" ? "Please specify your industry" : false
                                            })}
                                            placeholder="Please specify your industry *"
                                            className="w-full border-2 border-purple-500 outline-purple-500 rounded-md p-2"
                                        />
                                        {errors.otherIndustry && <p className="text-red-500 text-sm mt-1">{errors.otherIndustry.message}</p>}
                                    </div>
                                )}

                                <div>
                                    <input
                                        {...register("yearOfIncorporation")}
                                        placeholder="Year of Incorporation (optional)"
                                        type="number"
                                        className="w-full border-2 border-purple-500 outline-purple-500 rounded-md p-2"
                                    />
                                </div>

                                <div>
                                    <input
                                        {...register("city", { required: "City is required" })}
                                        placeholder="City *"
                                        className="w-full border-2 border-purple-500 outline-purple-500 rounded-md p-2"
                                    />
                                    {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>}
                                </div>
                            </div>

                            <div className="flex justify-between">
                                <Button
                                    className="flex items-center gap-x-2 btn-outline"
                                    onClick={onBack}

                                >
                                    Back
                                </Button>
                                <Button
                                    className="flex items-center gap-x-2 btn"
                                    onClick={onNext}

                                >
                                    Next <FaArrowRight />
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Representative Information */}
                    {step === 3 && (
                        <div className="space-y-5">
                            <h2 className="text-2xl font-bold text-gray-800 text-center">Representative Information</h2>

                            <div className="space-y-4">
                                <div>
                                    <input
                                        {...register("representativeName", { required: "Representative name is required" })}
                                        placeholder="Name of Representative *"
                                        className="w-full border-2 border-purple-500 outline-purple-500 rounded-md p-2"
                                    />
                                    {errors.representativeName && <p className="text-red-500 text-sm mt-1">{errors.representativeName.message}</p>}
                                </div>

                                <div>
                                    <input
                                        {...register("designation", { required: "Designation is required" })}
                                        placeholder="Designation *"
                                        className="w-full border-2 border-purple-500 outline-purple-500 rounded-md p-2"
                                    />
                                    {errors.designation && <p className="text-red-500 text-sm mt-1">{errors.designation.message}</p>}
                                </div>

                                <div>
                                    <select
                                        {...register("department", { required: "Department is required" })}
                                        className="w-full border-2 border-purple-500 outline-purple-500 rounded-md p-2"
                                    >
                                        <option value="">Select Department</option>
                                        <option value="marketing">Marketing</option>
                                        <option value="hr">Human Resources (HR)</option>
                                        <option value="finance">Finance & Accounting</option>
                                        <option value="operations">Operations & Logistics</option>
                                        <option value="product">Product Development</option>
                                        <option value="customer">Customer Support & Service</option>
                                        <option value="it">Information Technology (IT)</option>
                                        <option value="legal">Legal & Compliance</option>
                                        <option value="business">Business Development</option>
                                        <option value="research">Research & Development (R&D)</option>
                                        <option value="admin">Administration</option>
                                        <option value="other">Other (Please specify)</option>
                                    </select>
                                    {errors.department && <p className="text-red-500 text-sm mt-1">{errors.department.message}</p>}
                                </div>

                                {department === "other" && (
                                    <div>
                                        <input
                                            {...register("otherDepartment", {
                                                required: department === "other" ? "Please specify your department" : false
                                            })}
                                            placeholder="Please specify your department *"
                                            className="w-full border-2 border-purple-500 outline-purple-500 rounded-md p-2"
                                        />
                                        {errors.otherDepartment && <p className="text-red-500 text-sm mt-1">{errors.otherDepartment.message}</p>}
                                    </div>
                                )}

                                <div className="flex items-center mb-2">
                                    <input
                                        {...register("sameAsCompanyEmail")}
                                        type="checkbox"
                                        id="sameAsCompanyEmail"
                                        className="mr-2 h-4 w-4 accent-purple-600"
                                    />
                                    <label htmlFor="sameAsCompanyEmail" className="text-gray-700">Same as company email</label>
                                </div>

                                {!sameAsCompanyEmail && (
                                    <div>
                                        <input
                                            {...register("representativeEmail")}
                                            type="email"
                                            placeholder="Email (optional)"
                                            className="w-full border-2 border-purple-500 outline-purple-500 rounded-md p-2"
                                        />
                                    </div>
                                )}

                                <div>
                                    <input
                                        {...register("representativeContactNumber")}
                                        placeholder="Contact Number (optional)"
                                        className="w-full border-2 border-purple-500 outline-purple-500 rounded-md p-2"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-between">
                                <Button
                                    className="flex items-center gap-x-2 btn-outline"
                                    onClick={onBack}

                                >
                                    Back
                                </Button>
                                <Button
                                    className="flex items-center gap-x-2 btn"
                                    onClick={onNext}

                                >
                                    Next <FaArrowRight />
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Step 4: Marketing & Goals */}
                    {step === 4 && (
                        <div className="space-y-5">
                            <h2 className="text-2xl font-bold text-gray-800 text-center">Marketing & Goals</h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-gray-700 mb-1">Annual Marketing Budget *</label>
                                    <div className="space-y-2">
                                        {[
                                            { value: "less_than_10k", label: "Less than 10,000" },
                                            { value: "10k_50k", label: "10,000 - 50,000" },
                                            { value: "50k_100k", label: "50,000 - 100,000" },
                                            { value: "100k_500k", label: "100,000 - 500,000" },
                                            { value: "500k_1m", label: "500,000 - Million" },
                                            { value: "over_1m", label: "Over 1 Million" }
                                        ].map((option) => (
                                            <div key={option.value} className="flex items-center">
                                                <input
                                                    {...register("marketingBudget", { required: "Please select your marketing budget" })}
                                                    type="radio"
                                                    id={option.value}
                                                    value={option.value}
                                                    className="mr-3 h-5 w-5 accent-purple-600"
                                                />
                                                <label htmlFor={option.value} className="text-gray-700">{option.label}</label>
                                            </div>
                                        ))}
                                    </div>
                                    {errors.marketingBudget && <p className="text-red-500 text-sm mt-1">{errors.marketingBudget.message}</p>}
                                </div>

                                <div>
                                    <label className="block text-gray-700 mb-1">Have you worked with content creators before? *</label>
                                    <div className="space-y-2">
                                        <div className="flex items-center">
                                            <input
                                                {...register("workedWithCreators", { required: "Please select an option" })}
                                                type="radio"
                                                id="yes"
                                                value="yes"
                                                className="mr-3 h-5 w-5 accent-purple-600"
                                            />
                                            <label htmlFor="yes" className="text-gray-700">Yes</label>
                                        </div>
                                        <div className="flex items-center">
                                            <input
                                                {...register("workedWithCreators", { required: "Please select an option" })}
                                                type="radio"
                                                id="no"
                                                value="no"
                                                className="mr-3 h-5 w-5 accent-purple-600"
                                            />
                                            <label htmlFor="no" className="text-gray-700">No</label>
                                        </div>
                                    </div>
                                    {errors.workedWithCreators && <p className="text-red-500 text-sm mt-1">{errors.workedWithCreators.message}</p>}
                                </div>

                                <div>
                                    <label className="block text-gray-700 mb-1">How would you like us to support you? *</label>
                                    <div className="space-y-2">
                                        {[
                                            { value: "full_support", label: "We need everything from strategy to execution" },
                                            { value: "find_creators", label: "We want to find and collaborate with creators independently" },
                                            { value: "campaign_management", label: "We need help managing campaigns" },
                                            { value: "not_sure", label: "I am not sure" }
                                        ].map((option) => (
                                            <div key={option.value} className="flex items-center">
                                                <input
                                                    {...register("supportType", { required: "Please select a support option" })}
                                                    type="radio"
                                                    id={option.value}
                                                    value={option.value}
                                                    className="mr-3 h-5 w-5 accent-purple-600"
                                                />
                                                <label htmlFor={option.value} className="text-gray-700">{option.label}</label>
                                            </div>
                                        ))}
                                    </div>
                                    {errors.supportType && <p className="text-red-500 text-sm mt-1">{errors.supportType.message}</p>}
                                </div>

                                <div>
                                    <label className="block text-gray-700 mb-1">How do you plan to use our platform? *</label>
                                    <div className="space-y-2">
                                        <div className="flex items-center">
                                            <input
                                                {...register("platformUse", { required: "Please select an option" })}
                                                type="radio"
                                                id="self_use"
                                                value="self_use"
                                                className="mr-3 h-5 w-5 accent-purple-600"
                                            />
                                            <label htmlFor="self_use" className="text-gray-700">I'll use it myself</label>
                                        </div>
                                        <div className="flex items-center">
                                            <input
                                                {...register("platformUse", { required: "Please select an option" })}
                                                type="radio"
                                                id="training"
                                                value="training"
                                                className="mr-3 h-5 w-5 accent-purple-600"
                                            />
                                            <label htmlFor="training" className="text-gray-700">I need a training session to use it better</label>
                                        </div>
                                    </div>
                                    {errors.platformUse && <p className="text-red-500 text-sm mt-1">{errors.platformUse.message}</p>}
                                </div>
                            </div>

                            <div className="flex justify-between">
                                <Button
                                    className="flex items-center gap-x-2 btn-outline"
                                    onClick={onBack}

                                >
                                    Back
                                </Button>
                                <Button
                                    className="flex items-center gap-x-2 btn"
                                    onClick={onNext}

                                >
                                    Next <FaArrowRight />
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Step 5: Content Preferences & Terms */}
                    {step === 5 && (
                        <div className="space-y-5">
                            <h2 className="text-2xl font-bold text-gray-800 text-center">Content Preferences</h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-gray-700 mb-1">Which type of creator are you looking for? *</label>
                                    <div className="space-y-2">
                                        {[
                                            { value: "freelancer", label: "Freelancer Creator (Business account posts)" },
                                            { value: "ugc", label: "UGC Creator (Authentic user-generated content)" },
                                            { value: "both", label: "Both" },
                                            { value: "not_sure", label: "Not sure" }
                                        ].map((option) => (
                                            <div key={option.value} className="flex items-center">
                                                <input
                                                    {...register("creatorType", { required: "Please select a creator type" })}
                                                    type="radio"
                                                    id={option.value}
                                                    value={option.value}
                                                    className="mr-3 h-5 w-5 accent-purple-600"
                                                />
                                                <label htmlFor={option.value} className="text-gray-700">{option.label}</label>
                                            </div>
                                        ))}
                                    </div>
                                    {errors.creatorType && <p className="text-red-500 text-sm mt-1">{errors.creatorType.message}</p>}
                                </div>

                                <div>
                                    <label className="block text-gray-700 mb-1">Which social media platforms are you focusing on?</label>
                                    <div className="space-y-2">
                                        {[
                                            { name: "instagram", label: "Instagram" },
                                            { name: "facebook", label: "Facebook" },
                                            { name: "twitter", label: "X" },
                                            { name: "linkedin", label: "LinkedIn" },
                                            { name: "tiktok", label: "TikTok" },
                                            { name: "pinterest", label: "Pinterest" },
                                            { name: "youtube", label: "YouTube" },
                                            { name: "other", label: "Other" }
                                        ].map((platform) => (
                                            <div key={platform.name} className="flex items-center">
                                                <input
                                                    {...register(`socialMedia.${platform.name as keyof OnboardingFormData["socialMedia"]}`)}
                                                    type="checkbox"
                                                    id={platform.name}
                                                    className="mr-3 h-5 w-5 accent-purple-600"
                                                />
                                                <label htmlFor={platform.name} className="text-gray-700">{platform.label}</label>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-gray-200">
                                    <div className="flex items-center">
                                        <input
                                            {...register("acceptTerms", { required: "You must accept the terms and conditions" })}
                                            type="checkbox"
                                            id="acceptTerms"
                                            className="mr-3 h-5 w-5 accent-purple-600"
                                        />
                                        <label htmlFor="acceptTerms" className="text-gray-700">
                                            I accept the <a href="#" className="text-purple-600 underline">Terms and Conditions</a> and <a href="#" className="text-purple-600 underline">Privacy Policy</a>
                                        </label>
                                    </div>
                                    {errors.acceptTerms && <p className="text-red-500 text-sm mt-1">{errors.acceptTerms.message}</p>}
                                </div>
                            </div>

                            <div className="flex justify-between">
                                <Button
                                    className="flex items-center gap-x-2 btn-outline"
                                    onClick={onBack}

                                >
                                    Back
                                </Button>
                                <Button
                                    className="flex items-center gap-x-2 btn"
                                >
                                    Submit <FaArrowRight />
                                </Button>
                            </div>
                        </div>
                    )}
                </form>
            </div>
            <Footer />
        </>
    );
};

export default Onboarding;