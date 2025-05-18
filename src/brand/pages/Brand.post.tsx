"use client";

import { useState, type ChangeEvent, type FormEvent, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaUpload, FaTrash } from "react-icons/fa";
import BrandLayout from "../components/BrandLayout";
import Cookies from "js-cookie";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface FormData {
  // Basic Information
  campaignName: string;
  campaignDescription: string;
  campaignDuration: string;
  contentRequirements: string[];

  // Campaign Goal
  campaignGoals: string[];
  kpiReach: string;
  kpiLeads: string;
  kpiDownloads: string;
  kpiWebsiteVisits: string;
  kpiPromoCode: string;

  // Compensation Model
  compensationType: string;
  barterProductValue: string;
  fixedFeeAmount: string;
  payPerViews: string;
  minimumViews: string;
  payPerSale: string;
  trackingMethod: string;
  payPerLead: string;
  otherCompensation: string;
  hybridBasicFee: string;
  hybridBonusType: string;

  // Budget
  budget: string;
  customBudget: string;

  // Target Audience
  audienceAge: string[];
  audienceGender: string[];
  audienceGeography: string;
  audienceNationality: string;
  audienceBehavior: string;

  // Creator Preferences
  creatorCount: string;
  creatorAge: string[];
  creatorGender: string[];
  creatorGeography: string;
  creatorNationality: string;
  creatorPlatforms: string[];
  creatorFollowers: string[];
  creatorEngagementRate: string;
  creatorReach: string;
  creatorContentTypes: string[];

  // Content Requirements
  showFace: string;
  requireUnboxing: string;
  requireExperience: string;
  requireCrossPromotion: string;
  useHashtags: string;
  deliveryTime: string;

  // Content Approvals
  approvalType: string;
  usageRights: string;

  // Campaign Image
  image: File | null;
}

interface FormErrors {
  [key: string]: string;
}

export default function BrandPost() {
  const navigate = useNavigate();
  const [showOptions, setShowOptions] = useState(true);
  const [formVisible, setFormVisible] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formStep, setFormStep] = useState(1);
  const [errors, setErrors] = useState<FormErrors>({});

  const [formData, setFormData] = useState<FormData>({
    // Basic Information
    campaignName: "",
    campaignDescription: "",
    campaignDuration: "",
    contentRequirements: [],

    // Campaign Goal
    campaignGoals: [],
    kpiReach: "",
    kpiLeads: "",
    kpiDownloads: "",
    kpiWebsiteVisits: "",
    kpiPromoCode: "",

    // Compensation Model
    compensationType: "",
    barterProductValue: "",
    fixedFeeAmount: "",
    payPerViews: "",
    minimumViews: "",
    payPerSale: "",
    trackingMethod: "",
    payPerLead: "",
    otherCompensation: "",
    hybridBasicFee: "",
    hybridBonusType: "",

    // Budget
    budget: "",
    customBudget: "",

    // Target Audience
    audienceAge: [],
    audienceGender: [],
    audienceGeography: "",
    audienceNationality: "",
    audienceBehavior: "",

    // Creator Preferences
    creatorCount: "",
    creatorAge: [],
    creatorGender: [],
    creatorGeography: "",
    creatorNationality: "",
    creatorPlatforms: [],
    creatorFollowers: [],
    creatorEngagementRate: "",
    creatorReach: "",
    creatorContentTypes: [],

    // Content Requirements
    showFace: "",
    requireUnboxing: "",
    requireExperience: "",
    requireCrossPromotion: "",
    useHashtags: "",
    deliveryTime: "",

    // Content Approvals
    approvalType: "",
    usageRights: "",

    // Campaign Image
    image: null,
  });

  /**
   * Handles navigation options
   */
  const handleOptionSelect = (option: "create" | "explore") => {
    if (option === "create") {
      setShowOptions(false);
      setFormVisible(true);
    } else {
      navigate("/brand/home");
    }
  };

  /**
   * CSS classes for consistent styling
   */
  const inputClass =
    "p-4 border border-gray-200 rounded-xl bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#6a38ca] shadow-sm";
  const labelClass = "block text-sm font-medium text-gray-700 mb-2";
  const buttonClass =
    "bg-[#6a38ca] hover:bg-[#5c2eb8] transition-all duration-300 text-white py-4 px-6 rounded-xl text-base font-semibold shadow-lg flex items-center justify-center gap-2";
  const radioClass =
    "form-radio h-4 w-4 text-[#6a38ca] border-gray-300 focus:ring-[#6a38ca]";
  const checkboxClass =
    "form-checkbox h-4 w-4 text-[#6a38ca] border-gray-300 rounded focus:ring-[#6a38ca]";
  const cardClass =
    "p-8 rounded-xl border-2 border-gray-200 hover:border-[#6a38ca] cursor-pointer transition-all duration-300";
  const cardActiveClass =
    "p-8 rounded-xl border-2 border-[#6a38ca] bg-purple-50 cursor-pointer transition-all duration-300";

  /**
   * Validates form fields based on current step
   */
  const validateFormStep = (step: number): FormErrors => {
    const newErrors: FormErrors = {};

    switch (step) {
      case 1: // Basic Information
        if (!formData.campaignName.trim())
          newErrors.campaignName = "Campaign name is required";
        if (!formData.campaignDescription.trim())
          newErrors.campaignDescription = "Campaign description is required";
        if (!formData.campaignDuration)
          newErrors.campaignDuration = "Please select a campaign duration";
        if (formData.contentRequirements.length === 0)
          newErrors.contentRequirements =
            "Please select at least one content requirement";
        break;

      case 2: // Campaign Goal
        if (formData.campaignGoals.length === 0)
          newErrors.campaignGoals = "Please select at least one campaign goal";
        break;

      case 3: // Compensation Model
        if (!formData.compensationType)
          newErrors.compensationType = "Please select a compensation type";

        // Validate based on selected compensation type
        if (
          formData.compensationType === "barter" &&
          !formData.barterProductValue
        ) {
          newErrors.barterProductValue = "Product value is required";
        } else if (
          formData.compensationType === "fixed" &&
          !formData.fixedFeeAmount
        ) {
          newErrors.fixedFeeAmount = "Fixed fee amount is required";
        } else if (formData.compensationType === "performance") {
          if (
            !formData.payPerViews &&
            !formData.payPerSale &&
            !formData.payPerLead
          ) {
            newErrors.payPerViews =
              "At least one performance metric is required";
          }
        } else if (formData.compensationType === "hybrid") {
          if (!formData.hybridBasicFee) {
            newErrors.hybridBasicFee = "Basic fee is required";
          }
          if (!formData.hybridBonusType) {
            newErrors.hybridBonusType = "Please select a bonus type";
          }
        }
        break;

      case 4: // Budget
        if (!formData.budget) newErrors.budget = "Please select a budget range";
        if (formData.budget === "custom" && !formData.customBudget) {
          newErrors.customBudget = "Custom budget amount is required";
        }
        break;

      case 5: // Target Audience
        if (formData.audienceAge.length === 0)
          newErrors.audienceAge = "Please select at least one age group";
        if (formData.audienceGender.length === 0)
          newErrors.audienceGender = "Please select at least one gender";
        break;

      case 6: // Creator Preferences
        if (!formData.creatorCount)
          newErrors.creatorCount = "Number of creators is required";
        if (formData.creatorPlatforms.length === 0)
          newErrors.creatorPlatforms = "Please select at least one platform";
        if (formData.creatorFollowers.length === 0)
          newErrors.creatorFollowers =
            "Please select at least one follower range";
        break;

      case 7: // Content Requirements
        if (!formData.showFace) newErrors.showFace = "Please select an option";
        if (!formData.deliveryTime)
          newErrors.deliveryTime = "Please select a delivery time";
        break;

      case 8: // Content Approvals & Image
        if (!formData.approvalType)
          newErrors.approvalType = "Please select an approval type";
        if (!formData.usageRights)
          newErrors.usageRights = "Please select usage rights duration";
        if (!formData.image) newErrors.image = "Campaign image is required";
        break;
    }

    return newErrors;
  };

  /**
   * Updates form data when input fields change
   */
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  /**
   * Handles checkbox changes
   */
  const handleCheckboxChange = (field: string, value: string) => {
    setFormData((prev) => {
      const currentValues = [...(prev[field as keyof FormData] as string[])];
      const index = currentValues.indexOf(value);

      if (index > -1) {
        currentValues.splice(index, 1);
      } else {
        currentValues.push(value);
      }

      return { ...prev, [field]: currentValues };
    });

    // Clear error for this field if it exists
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  /**
   * Handles radio button changes
   */
  const handleRadioChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear error for this field if it exists
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  /**
   * Handles image file selection
   */
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        image: "Image size should be less than 5MB",
      }));
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Update form data
    setFormData((prev) => ({ ...prev, image: file }));

    // Clear any previous errors
    if (errors.image) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.image;
        return newErrors;
      });
    }
  };

  /**
   * Removes selected image
   */
  const handleImageDelete = () => {
    setFormData((prev) => ({ ...prev, image: null }));
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  /**
   * Uploads image to Cloudinary and returns secure URL
   */
  const uploadImageToCloudinary = async (
    imageFile: File
  ): Promise<string | null> => {
    const cloudName = "drihufdbo"; // Replace with your actual Cloudinary cloud name
    const uploadPreset = "taseer"; // Replace with your actual upload preset

    const formData = new FormData();
    formData.append("file", imageFile);
    formData.append("upload_preset", uploadPreset);

    try {
      toast.info("Uploading image...", { autoClose: 2000 });

      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      //@ts-expect-error - idk
      if (response.data && response.data?.secure_url) {
        //@ts-expect-error - idk
        return response.data?.secure_url;
      }
      throw new Error("Invalid response from Cloudinary");
    } catch (err) {
      console.error("Cloudinary upload failed:", err);
      toast.error("Image upload failed. Please try again.");
      return null;
    }
  };

  /**
   * Handles form submission
   */
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const stepErrors = validateFormStep(formStep);
    setErrors(stepErrors);
    if (Object.keys(stepErrors).length > 0) return;

    if (formStep < 8) {
      setFormStep((prev) => prev + 1);
      return;
    }

    setIsSubmitting(true);

    try {
      let imageUrl = null;
      if (formData.image) {
        imageUrl = await uploadImageToCloudinary(formData.image);
        if (!imageUrl) {
          setIsSubmitting(false);
          return;
        }
      }

      const token = Cookies.get("jwt");
      if (!token) {
        toast.error("Authentication error. Please log in again.");
        navigate("/login");
        return;
      }

      // Prepare payload from formData
      const payload = {
        title: formData.campaignName,
        description: formData.campaignDescription,
        duration: formData.campaignDuration,
        campaignGoals: formData.campaignGoals.join(", "),
        kpiReach: formData.kpiReach,
        kpiLeads: formData.kpiLeads,
        kpiDownloads: formData.kpiDownloads,
        kpiWebsiteVisits: formData.kpiWebsiteVisits,
        kpiPromoCode: formData.kpiPromoCode,
        compensationType: formData.compensationType,
        budget:
          formData.budget === "custom"
            ? formData.customBudget
            : formData.budget,
        targetAudience: {
          age: formData.audienceAge.join(", "),
          gender: formData.audienceGender.join(", "),
          geography: formData.audienceGeography,
          nationality: formData.audienceNationality,
          behavior: formData.audienceBehavior,
        },
        creatorPreferences: {
          count: formData.creatorCount,
          age: formData.creatorAge.join(", "),
          gender: formData.creatorGender.join(", "),
          geography: formData.creatorGeography,
          nationality: formData.creatorNationality,
          platforms: formData.creatorPlatforms.join(", "),
          followers: formData.creatorFollowers.join(", "),
          engagementRate: formData.creatorEngagementRate,
          contentTypes: formData.creatorContentTypes.join(", "),
        },
        contentRequirements: {
          showFace: formData.showFace,
          requireUnboxing: formData.requireUnboxing,
          requireExperience: formData.requireExperience,
          requireCrossPromotion: formData.requireCrossPromotion,
          useHashtags: formData.useHashtags,
          deliveryTime: formData.deliveryTime,
        },
        contentApprovals: {
          approvalType: formData.approvalType,
          usageRights: formData.usageRights,
        },
        image: imageUrl,
      };

      toast.info("Creating campaign...", { autoClose: 2000 });

      const res = await axios.post(
        "http://localhost:5000/api/campaigns",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (res.status === 201) {
        toast.success("Campaign created successfully!");
        setFormVisible(false);

        // Add a small delay before navigation for toast to be visible
        setTimeout(() => {
          navigate("/brand/my-campaigns");
        }, 1500);
      } else {
        throw new Error("Failed to create campaign");
      }
    } catch (err: any) {
      console.error("Campaign creation error:", err);
      toast.error(
        err.response?.data?.message ||
          "Failed to create campaign. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Returns the appropriate form step content
   */
  const formStepContent = () => {
    switch (formStep) {
      case 1: // Basic Information
        return (
          <>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800">
                Step 1: Basic Information
              </h2>
              <p className="text-gray-600">
                Let's start with the essentials of your campaign
              </p>
            </div>

            <div className="mb-6">
              <label htmlFor="campaignName" className={labelClass}>
                Campaign Name
              </label>
              <input
                id="campaignName"
                name="campaignName"
                value={formData.campaignName}
                onChange={handleChange}
                className={`${inputClass} w-full`}
                placeholder="Enter campaign name"
              />
              {errors.campaignName && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.campaignName}
                </p>
              )}
            </div>

            <div className="mb-6">
              <label htmlFor="campaignDescription" className={labelClass}>
                Campaign Description
              </label>
              <textarea
                id="campaignDescription"
                name="campaignDescription"
                value={formData.campaignDescription}
                onChange={handleChange}
                className={`${inputClass} w-full h-40 resize-none`}
                placeholder="Describe your campaign in detail"
              />
              {errors.campaignDescription && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.campaignDescription}
                </p>
              )}
            </div>

            <div className="mb-6">
              <label className={labelClass}>Campaign Duration</label>
              <div className="space-y-2">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="duration-1week"
                    name="campaignDuration"
                    className={radioClass}
                    checked={formData.campaignDuration === "1 week"}
                    onChange={() =>
                      handleRadioChange("campaignDuration", "1 week")
                    }
                  />
                  <label htmlFor="duration-1week" className="ml-2">
                    1 week
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="duration-2-4weeks"
                    name="campaignDuration"
                    className={radioClass}
                    checked={formData.campaignDuration === "2-4 weeks"}
                    onChange={() =>
                      handleRadioChange("campaignDuration", "2-4 weeks")
                    }
                  />
                  <label htmlFor="duration-2-4weeks" className="ml-2">
                    2-4 weeks
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="duration-1month"
                    name="campaignDuration"
                    className={radioClass}
                    checked={formData.campaignDuration === "1+ months"}
                    onChange={() =>
                      handleRadioChange("campaignDuration", "1+ months")
                    }
                  />
                  <label htmlFor="duration-1month" className="ml-2">
                    1+ months
                  </label>
                </div>
              </div>
              {errors.campaignDuration && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.campaignDuration}
                </p>
              )}
            </div>

            <div className="mb-6">
              <label className={labelClass}>
                Content Requirements (Choose keywords)
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {[
                  "Reel",
                  "Story",
                  "Post",
                  "Instagram",
                  "TikTok",
                  "Youtube",
                  "LinkedIn",
                  "Quora",
                  "Medium",
                  "Facebook",
                  "Unboxing",
                  "Review",
                  "UGC",
                  "Article",
                  "SEO",
                ].map((item) => (
                  <div key={item} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`content-${item}`}
                      className={checkboxClass}
                      checked={formData.contentRequirements.includes(item)}
                      onChange={() =>
                        handleCheckboxChange("contentRequirements", item)
                      }
                    />
                    <label htmlFor={`content-${item}`} className="ml-2">
                      {item}
                    </label>
                  </div>
                ))}
              </div>
              {errors.contentRequirements && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.contentRequirements}
                </p>
              )}
            </div>
          </>
        );

      case 2: // Campaign Goal
        return (
          <>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800">
                Step 2: Campaign Goal
              </h2>
              <p className="text-gray-600">
                Define your campaign objectives and KPIs
              </p>
            </div>

            <div className="mb-6">
              <label className={labelClass}>What's your primary goal?</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  "Brand awareness",
                  "Drive sales/conversions",
                  "App installs/signups",
                  "User-generated content (UGC)",
                  "Product reviews",
                ].map((goal) => (
                  <div key={goal} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`goal-${goal}`}
                      className={checkboxClass}
                      checked={formData.campaignGoals.includes(goal)}
                      onChange={() =>
                        handleCheckboxChange("campaignGoals", goal)
                      }
                    />
                    <label htmlFor={`goal-${goal}`} className="ml-2">
                      {goal}
                    </label>
                  </div>
                ))}
              </div>
              {errors.campaignGoals && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.campaignGoals}
                </p>
              )}
            </div>

            <div className="mb-6">
              <label className={labelClass}>Is there a measurable KPI?</label>
              <div className="space-y-4">
                <div>
                  <label htmlFor="kpiReach" className="inline-block w-36">
                    Reach
                  </label>
                  <input
                    id="kpiReach"
                    name="kpiReach"
                    value={formData.kpiReach}
                    onChange={handleChange}
                    className={`${inputClass} ml-2 w-48`}
                    placeholder="100k"
                  />
                </div>
                <div>
                  <label htmlFor="kpiLeads" className="inline-block w-36">
                    Leads
                  </label>
                  <input
                    id="kpiLeads"
                    name="kpiLeads"
                    value={formData.kpiLeads}
                    onChange={handleChange}
                    className={`${inputClass} ml-2 w-48`}
                    placeholder="Enter target number"
                  />
                </div>
                <div>
                  <label htmlFor="kpiDownloads" className="inline-block w-36">
                    Downloads
                  </label>
                  <input
                    id="kpiDownloads"
                    name="kpiDownloads"
                    value={formData.kpiDownloads}
                    onChange={handleChange}
                    className={`${inputClass} ml-2 w-48`}
                    placeholder="Enter target number"
                  />
                </div>
                <div>
                  <label
                    htmlFor="kpiWebsiteVisits"
                    className="inline-block w-36"
                  >
                    Website Visits
                  </label>
                  <input
                    id="kpiWebsiteVisits"
                    name="kpiWebsiteVisits"
                    value={formData.kpiWebsiteVisits}
                    onChange={handleChange}
                    className={`${inputClass} ml-2 w-48`}
                    placeholder="Enter target number"
                  />
                </div>
                <div>
                  <label htmlFor="kpiPromoCode" className="inline-block w-36">
                    Use of Promo Code
                  </label>
                  <input
                    id="kpiPromoCode"
                    name="kpiPromoCode"
                    value={formData.kpiPromoCode}
                    onChange={handleChange}
                    className={`${inputClass} ml-2 w-48`}
                    placeholder="Enter target number"
                  />
                </div>
              </div>
            </div>
          </>
        );

      case 3: // Compensation Model
        return (
          <>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800">
                Step 3: Compensation Model
              </h2>
              <p className="text-gray-600">
                How do you want to compensate creators?
              </p>
            </div>

            <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div
                className={
                  formData.compensationType === "barter"
                    ? cardActiveClass
                    : cardClass
                }
                onClick={() => handleRadioChange("compensationType", "barter")}
              >
                <h3 className="text-lg font-semibold mb-3">Barter</h3>
                <p className="text-gray-600 mb-4">
                  Compensate creators with your products or services
                </p>

                {formData.compensationType === "barter" && (
                  <div className="mt-4">
                    <label htmlFor="barterProductValue" className={labelClass}>
                      Product(s) Value:
                    </label>
                    <input
                      id="barterProductValue"
                      name="barterProductValue"
                      value={formData.barterProductValue}
                      onChange={handleChange}
                      className={`${inputClass} w-full`}
                      placeholder="Enter product value"
                    />
                    {errors.barterProductValue && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.barterProductValue}
                      </p>
                    )}
                  </div>
                )}
              </div>

              <div
                className={
                  formData.compensationType === "fixed"
                    ? cardActiveClass
                    : cardClass
                }
                onClick={() => handleRadioChange("compensationType", "fixed")}
              >
                <h3 className="text-lg font-semibold mb-3">Fixed Fee</h3>
                <p className="text-gray-600 mb-4">
                  Pay creators a set amount regardless of performance
                </p>

                {formData.compensationType === "fixed" && (
                  <div className="mt-4">
                    <label htmlFor="fixedFeeAmount" className={labelClass}>
                      Amount per creator:
                    </label>
                    <input
                      id="fixedFeeAmount"
                      name="fixedFeeAmount"
                      value={formData.fixedFeeAmount}
                      onChange={handleChange}
                      className={`${inputClass} w-full`}
                      placeholder="Enter fixed fee amount"
                    />
                    {errors.fixedFeeAmount && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.fixedFeeAmount}
                      </p>
                    )}
                  </div>
                )}
              </div>

              <div
                className={
                  formData.compensationType === "performance"
                    ? cardActiveClass
                    : cardClass
                }
                onClick={() =>
                  handleRadioChange("compensationType", "performance")
                }
              >
                <h3 className="text-lg font-semibold mb-3">
                  Performance-Based Only
                </h3>
                <p className="text-gray-600 mb-4">
                  Pay creators based on their content performance
                </p>

                {formData.compensationType === "performance" && (
                  <div className="mt-4 space-y-4">
                    <div>
                      <label htmlFor="payPerViews" className={labelClass}>
                        Pay-Per-1000 Views:
                      </label>
                      <input
                        id="payPerViews"
                        name="payPerViews"
                        value={formData.payPerViews}
                        onChange={handleChange}
                        className={`${inputClass} w-full`}
                        placeholder="Enter amount per 1000 views"
                      />
                    </div>

                    <div>
                      <label htmlFor="minimumViews" className={labelClass}>
                        Minimum views to qualify (if any):
                      </label>
                      <input
                        id="minimumViews"
                        name="minimumViews"
                        value={formData.minimumViews}
                        onChange={handleChange}
                        className={`${inputClass} w-full`}
                        placeholder="Enter minimum views"
                      />
                    </div>

                    <div>
                      <label htmlFor="payPerSale" className={labelClass}>
                        Pay-Per-Sale/SignUp:
                      </label>
                      <input
                        id="payPerSale"
                        name="payPerSale"
                        value={formData.payPerSale}
                        onChange={handleChange}
                        className={`${inputClass} w-full`}
                        placeholder="Enter amount per sale/signup"
                      />
                    </div>

                    <div>
                      <label className={labelClass}>Tracking method:</label>
                      <div className="flex gap-4">
                        <div className="flex items-center">
                          <input
                            type="radio"
                            id="tracking-promo"
                            name="trackingMethod"
                            className={radioClass}
                            checked={formData.trackingMethod === "Promo Code"}
                            onChange={() =>
                              handleRadioChange("trackingMethod", "Promo Code")
                            }
                          />
                          <label htmlFor="tracking-promo" className="ml-2">
                            Promo Code
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="radio"
                            id="tracking-affiliate"
                            name="trackingMethod"
                            className={radioClass}
                            checked={
                              formData.trackingMethod === "Affiliate Link"
                            }
                            onChange={() =>
                              handleRadioChange(
                                "trackingMethod",
                                "Affiliate Link"
                              )
                            }
                          />
                          <label htmlFor="tracking-affiliate" className="ml-2">
                            Affiliate Link
                          </label>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="payPerLead" className={labelClass}>
                        Pay-Per-Lead:
                      </label>
                      <input
                        id="payPerLead"
                        name="payPerLead"
                        value={formData.payPerLead}
                        onChange={handleChange}
                        className={`${inputClass} w-full`}
                        placeholder="Enter amount per lead"
                      />
                    </div>

                    <div>
                      <label htmlFor="otherCompensation" className={labelClass}>
                        Other:
                      </label>
                      <input
                        id="otherCompensation"
                        name="otherCompensation"
                        value={formData.otherCompensation}
                        onChange={handleChange}
                        className={`${inputClass} w-full`}
                        placeholder="Specify other performance metrics"
                      />
                    </div>

                    {errors.payPerViews && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.payPerViews}
                      </p>
                    )}
                  </div>
                )}
              </div>

              <div
                className={
                  formData.compensationType === "hybrid"
                    ? cardActiveClass
                    : cardClass
                }
                onClick={() => handleRadioChange("compensationType", "hybrid")}
              >
                <h3 className="text-lg font-semibold mb-3">
                  Hybrid – Fixed Fee & Performance Basis
                </h3>
                <p className="text-gray-600 mb-4">
                  Combine fixed payment with performance bonuses
                </p>

                {formData.compensationType === "hybrid" && (
                  <div className="mt-4 space-y-4">
                    <div>
                      <label htmlFor="hybridBasicFee" className={labelClass}>
                        Basic Fee per creator:
                      </label>
                      <input
                        id="hybridBasicFee"
                        name="hybridBasicFee"
                        value={formData.hybridBasicFee}
                        onChange={handleChange}
                        className={`${inputClass} w-full`}
                        placeholder="Enter basic fee amount"
                      />
                      {errors.hybridBasicFee && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.hybridBasicFee}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className={labelClass}>Bonus metric?</label>
                      <div className="flex gap-4 flex-wrap">
                        <div className="flex items-center">
                          <input
                            type="radio"
                            id="bonus-views"
                            name="hybridBonusType"
                            className={radioClass}
                            checked={formData.hybridBonusType === "Views"}
                            onChange={() =>
                              handleRadioChange("hybridBonusType", "Views")
                            }
                          />
                          <label htmlFor="bonus-views" className="ml-2">
                            Views
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="radio"
                            id="bonus-sales"
                            name="hybridBonusType"
                            className={radioClass}
                            checked={formData.hybridBonusType === "Sales"}
                            onChange={() =>
                              handleRadioChange("hybridBonusType", "Sales")
                            }
                          />
                          <label htmlFor="bonus-sales" className="ml-2">
                            Sales
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="radio"
                            id="bonus-signups"
                            name="hybridBonusType"
                            className={radioClass}
                            checked={formData.hybridBonusType === "Signups"}
                            onChange={() =>
                              handleRadioChange("hybridBonusType", "Signups")
                            }
                          />
                          <label htmlFor="bonus-signups" className="ml-2">
                            Signups
                          </label>
                        </div>
                      </div>
                      {errors.hybridBonusType && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.hybridBonusType}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        );

      case 4: // Budget
        return (
          <>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800">
                Step 4: Total Budget of the Campaign
              </h2>
              <p className="text-gray-600">Select your campaign budget range</p>
            </div>

            <div className="mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { value: "1-500", label: "1-500 AED" },
                  { value: "500-1000", label: "500-1000 AED" },
                  { value: "1000-2500", label: "1000-2500 AED" },
                  { value: "2500-5000", label: "2500-5000 AED" },
                  { value: "custom", label: "Custom" },
                ].map((option) => (
                  <div
                    key={option.value}
                    className={
                      formData.budget === option.value
                        ? cardActiveClass
                        : cardClass
                    }
                    onClick={() => handleRadioChange("budget", option.value)}
                  >
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id={`budget-${option.value}`}
                        name="budget"
                        className={radioClass}
                        checked={formData.budget === option.value}
                        onChange={() => {}}
                      />
                      <label
                        htmlFor={`budget-${option.value}`}
                        className="ml-2 text-lg font-medium"
                      >
                        {option.label}
                      </label>
                    </div>
                  </div>
                ))}
              </div>
              {errors.budget && (
                <p className="text-red-500 text-sm mt-3">{errors.budget}</p>
              )}
            </div>

            {formData.budget === "custom" && (
              <div className="mb-6">
                <label htmlFor="customBudget" className={labelClass}>
                  Custom Budget Amount (AED):
                </label>
                <input
                  id="customBudget"
                  name="customBudget"
                  value={formData.customBudget}
                  onChange={handleChange}
                  className={`${inputClass} w-full`}
                  placeholder="Enter custom budget amount"
                  type="number"
                />
                {errors.customBudget && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.customBudget}
                  </p>
                )}
              </div>
            )}
          </>
        );

      case 5: // Target Audience
        return (
          <>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800">
                Step 5: Target Audience
              </h2>
              <p className="text-gray-600">
                Define your ideal customer demographic
              </p>
            </div>

            <div className="mb-6">
              <label className={labelClass}>Age</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  "18-25",
                  "25-30",
                  "30-40",
                  "40-50",
                  "50+",
                  "No preference",
                ].map((age) => (
                  <div key={age} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`audience-age-${age}`}
                      className={checkboxClass}
                      checked={formData.audienceAge.includes(age)}
                      onChange={() => handleCheckboxChange("audienceAge", age)}
                    />
                    <label htmlFor={`audience-age-${age}`} className="ml-2">
                      {age}
                    </label>
                  </div>
                ))}
              </div>
              {errors.audienceAge && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.audienceAge}
                </p>
              )}
            </div>

            <div className="mb-6">
              <label className={labelClass}>Gender</label>
              <div className="grid grid-cols-3 gap-3">
                {["Female", "Male", "Other"].map((gender) => (
                  <div key={gender} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`audience-gender-${gender}`}
                      className={checkboxClass}
                      checked={formData.audienceGender.includes(gender)}
                      onChange={() =>
                        handleCheckboxChange("audienceGender", gender)
                      }
                    />
                    <label
                      htmlFor={`audience-gender-${gender}`}
                      className="ml-2"
                    >
                      {gender}
                    </label>
                  </div>
                ))}
              </div>
              {errors.audienceGender && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.audienceGender}
                </p>
              )}
            </div>

            <div className="mb-6">
              <label htmlFor="audienceGeography" className={labelClass}>
                Geography (City or Country)
              </label>
              <input
                id="audienceGeography"
                name="audienceGeography"
                value={formData.audienceGeography}
                onChange={handleChange}
                className={`${inputClass} w-full`}
                placeholder="Enter target geography"
              />
            </div>

            <div className="mb-6">
              <label htmlFor="audienceNationality" className={labelClass}>
                Nationality
              </label>
              <input
                id="audienceNationality"
                name="audienceNationality"
                value={formData.audienceNationality}
                onChange={handleChange}
                className={`${inputClass} w-full`}
                placeholder="Enter target nationality"
              />
            </div>

            <div className="mb-6">
              <label htmlFor="audienceBehavior" className={labelClass}>
                Buying behavior or pain points (if any)
              </label>
              <textarea
                id="audienceBehavior"
                name="audienceBehavior"
                value={formData.audienceBehavior}
                onChange={handleChange}
                className={`${inputClass} w-full h-24 resize-none`}
                placeholder="Describe target audience behavior or pain points"
              />
            </div>
          </>
        );

      case 6: // Creator Preferences
        return (
          <>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800">
                Step 6: Creator Preferences
              </h2>
              <p className="text-gray-600">
                Define the ideal creators for your campaign
              </p>
            </div>

            <div className="mb-6">
              <label htmlFor="creatorCount" className={labelClass}>
                Number of Creators
              </label>
              <input
                id="creatorCount"
                name="creatorCount"
                value={formData.creatorCount}
                onChange={handleChange}
                className={`${inputClass} w-full`}
                placeholder="Enter number of creators"
                type="number"
                min="1"
              />
              {errors.creatorCount && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.creatorCount}
                </p>
              )}
            </div>

            <div className="mb-6">
              <label className={labelClass}>Creator Age</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  "18-25",
                  "25-30",
                  "30-40",
                  "40-50",
                  "50+",
                  "No preference",
                ].map((age) => (
                  <div key={age} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`creator-age-${age}`}
                      className={checkboxClass}
                      checked={formData.creatorAge.includes(age)}
                      onChange={() => handleCheckboxChange("creatorAge", age)}
                    />
                    <label htmlFor={`creator-age-${age}`} className="ml-2">
                      {age}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label className={labelClass}>Creator Gender</label>
              <div className="grid grid-cols-3 gap-3">
                {["Female", "Male", "Other"].map((gender) => (
                  <div key={gender} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`creator-gender-${gender}`}
                      className={checkboxClass}
                      checked={formData.creatorGender.includes(gender)}
                      onChange={() =>
                        handleCheckboxChange("creatorGender", gender)
                      }
                    />
                    <label
                      htmlFor={`creator-gender-${gender}`}
                      className="ml-2"
                    >
                      {gender}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label htmlFor="creatorGeography" className={labelClass}>
                Creator Geography
              </label>
              <input
                id="creatorGeography"
                name="creatorGeography"
                value={formData.creatorGeography}
                onChange={handleChange}
                className={`${inputClass} w-full`}
                placeholder="Enter preferred creator geography"
              />
            </div>

            <div className="mb-6">
              <label htmlFor="creatorNationality" className={labelClass}>
                Creator Nationality
              </label>
              <input
                id="creatorNationality"
                name="creatorNationality"
                value={formData.creatorNationality}
                onChange={handleChange}
                className={`${inputClass} w-full`}
                placeholder="Enter preferred creator nationality"
              />
            </div>

            <div className="mb-6">
              <label className={labelClass}>Creator Platforms</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  "Instagram",
                  "TikTok",
                  "Facebook",
                  "LinkedIn",
                  "YouTube",
                  "Other",
                ].map((platform) => (
                  <div key={platform} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`platform-${platform}`}
                      className={checkboxClass}
                      checked={formData.creatorPlatforms.includes(platform)}
                      onChange={() =>
                        handleCheckboxChange("creatorPlatforms", platform)
                      }
                    />
                    <label htmlFor={`platform-${platform}`} className="ml-2">
                      {platform}
                    </label>
                  </div>
                ))}
              </div>
              {errors.creatorPlatforms && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.creatorPlatforms}
                </p>
              )}
            </div>

            <div className="mb-6">
              <label className={labelClass}>Creator Followers</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  { value: "Nano", label: "Nano (1K-10K)" },
                  { value: "Micro", label: "Micro (10K-100K)" },
                  { value: "Macro", label: "Macro (100K-1M)" },
                  { value: "Mega", label: "Mega (above 1M)" },
                ].map((option) => (
                  <div key={option.value} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`followers-${option.value}`}
                      className={checkboxClass}
                      checked={formData.creatorFollowers.includes(option.value)}
                      onChange={() =>
                        handleCheckboxChange("creatorFollowers", option.value)
                      }
                    />
                    <label
                      htmlFor={`followers-${option.value}`}
                      className="ml-2"
                    >
                      {option.label}
                    </label>
                  </div>
                ))}
              </div>
              {errors.creatorFollowers && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.creatorFollowers}
                </p>
              )}
            </div>

            <div className="mb-6">
              <label className={labelClass}>Engagement Rate</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {["1-2%", "2-3%", "3-3.5%", "3.5%+"].map((rate) => (
                  <div key={rate} className="flex items-center">
                    <input
                      type="radio"
                      id={`engagement-${rate}`}
                      name="creatorEngagementRate"
                      className={radioClass}
                      checked={formData.creatorEngagementRate === rate}
                      onChange={() =>
                        handleRadioChange("creatorEngagementRate", rate)
                      }
                    />
                    <label htmlFor={`engagement-${rate}`} className="ml-2">
                      {rate}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label htmlFor="creatorReach" className={labelClass}>
                Combined reach in views
              </label>
              <input
                id="creatorReach"
                name="creatorReach"
                value={formData.creatorReach}
                onChange={handleChange}
                className={`${inputClass} w-full`}
                placeholder="Enter target combined reach"
              />
            </div>

            <div className="mb-6">
              <label className={labelClass}>Content Type</label>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
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
                  "Other",
                ].map((type) => (
                  <div key={type} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`content-type-${type}`}
                      className={checkboxClass}
                      checked={formData.creatorContentTypes.includes(type)}
                      onChange={() =>
                        handleCheckboxChange("creatorContentTypes", type)
                      }
                    />
                    <label htmlFor={`content-type-${type}`} className="ml-2">
                      {type}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </>
        );

      case 7: // Content Requirements
        return (
          <>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800">
                Step 7: Content Requirements
              </h2>
              <p className="text-gray-600">
                Define specific requirements for the content
              </p>
            </div>

            <div className="mb-6">
              <label className={labelClass}>
                Must creators show their face?
              </label>
              <div className="flex gap-6">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="face-yes"
                    name="showFace"
                    className={radioClass}
                    checked={formData.showFace === "Yes"}
                    onChange={() => handleRadioChange("showFace", "Yes")}
                  />
                  <label htmlFor="face-yes" className="ml-2">
                    Yes
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="face-no"
                    name="showFace"
                    className={radioClass}
                    checked={formData.showFace === "No"}
                    onChange={() => handleRadioChange("showFace", "No")}
                  />
                  <label htmlFor="face-no" className="ml-2">
                    No
                  </label>
                </div>
              </div>
              {errors.showFace && (
                <p className="text-red-500 text-sm mt-1">{errors.showFace}</p>
              )}
            </div>

            <div className="mb-6">
              <label className={labelClass}>
                Require unboxing/first-use footage?
              </label>
              <div className="flex gap-6">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="unboxing-yes"
                    name="requireUnboxing"
                    className={radioClass}
                    checked={formData.requireUnboxing === "Yes"}
                    onChange={() => handleRadioChange("requireUnboxing", "Yes")}
                  />
                  <label htmlFor="unboxing-yes" className="ml-2">
                    Yes
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="unboxing-no"
                    name="requireUnboxing"
                    className={radioClass}
                    checked={formData.requireUnboxing === "No"}
                    onChange={() => handleRadioChange("requireUnboxing", "No")}
                  />
                  <label htmlFor="unboxing-no" className="ml-2">
                    No
                  </label>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <label className={labelClass}>
                Require experience with collaborations previously?
              </label>
              <div className="flex gap-6">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="experience-yes"
                    name="requireExperience"
                    className={radioClass}
                    checked={formData.requireExperience === "Yes"}
                    onChange={() =>
                      handleRadioChange("requireExperience", "Yes")
                    }
                  />
                  <label htmlFor="experience-yes" className="ml-2">
                    Yes
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="experience-no"
                    name="requireExperience"
                    className={radioClass}
                    checked={formData.requireExperience === "No"}
                    onChange={() =>
                      handleRadioChange("requireExperience", "No")
                    }
                  />
                  <label htmlFor="experience-no" className="ml-2">
                    No
                  </label>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <label className={labelClass}>
                Cross-platform promotions required?
              </label>
              <div className="flex gap-6">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="cross-promotion-yes"
                    name="requireCrossPromotion"
                    className={radioClass}
                    checked={formData.requireCrossPromotion === "Yes"}
                    onChange={() =>
                      handleRadioChange("requireCrossPromotion", "Yes")
                    }
                  />
                  <label htmlFor="cross-promotion-yes" className="ml-2">
                    Yes
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="cross-promotion-no"
                    name="requireCrossPromotion"
                    className={radioClass}
                    checked={formData.requireCrossPromotion === "No"}
                    onChange={() =>
                      handleRadioChange("requireCrossPromotion", "No")
                    }
                  />
                  <label htmlFor="cross-promotion-no" className="ml-2">
                    No
                  </label>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <label className={labelClass}>Use branded hashtag(s)?</label>
              <div className="flex gap-6">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="hashtags-yes"
                    name="useHashtags"
                    className={radioClass}
                    checked={formData.useHashtags === "Yes"}
                    onChange={() => handleRadioChange("useHashtags", "Yes")}
                  />
                  <label htmlFor="hashtags-yes" className="ml-2">
                    Yes
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="hashtags-no"
                    name="useHashtags"
                    className={radioClass}
                    checked={formData.useHashtags === "No"}
                    onChange={() => handleRadioChange("useHashtags", "No")}
                  />
                  <label htmlFor="hashtags-no" className="ml-2">
                    No
                  </label>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <label className={labelClass}>Content delivery time</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  "Within 1 week",
                  "Within 2 weeks",
                  "Within 1 month",
                  "Flexible",
                ].map((time) => (
                  <div key={time} className="flex items-center">
                    <input
                      type="radio"
                      id={`delivery-${time}`}
                      name="deliveryTime"
                      className={radioClass}
                      checked={formData.deliveryTime === time}
                      onChange={() => handleRadioChange("deliveryTime", time)}
                    />
                    <label htmlFor={`delivery-${time}`} className="ml-2">
                      {time}
                    </label>
                  </div>
                ))}
              </div>
              {errors.deliveryTime && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.deliveryTime}
                </p>
              )}
            </div>
          </>
        );

      case 8: // Content Approvals & Image
        return (
          <>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800">
                Step 8: Content Approvals & Campaign Image
              </h2>
              <p className="text-gray-600">
                Define approval process and upload a campaign image
              </p>
            </div>

            <div className="mb-6">
              <label className={labelClass}>Content approval process</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  {
                    value: "Pre-approval",
                    label: "Pre-approval (review before posting)",
                  },
                  {
                    value: "Post-approval",
                    label: "Post-approval (review after posting)",
                  },
                  {
                    value: "No approval",
                    label: "No approval needed (creator has full freedom)",
                  },
                ].map((option) => (
                  <div key={option.value} className="flex items-center">
                    <input
                      type="radio"
                      id={`approval-${option.value}`}
                      name="approvalType"
                      className={radioClass}
                      checked={formData.approvalType === option.value}
                      onChange={() =>
                        handleRadioChange("approvalType", option.value)
                      }
                    />
                    <label
                      htmlFor={`approval-${option.value}`}
                      className="ml-2"
                    >
                      {option.label}
                    </label>
                  </div>
                ))}
              </div>
              {errors.approvalType && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.approvalType}
                </p>
              )}
            </div>

            <div className="mb-6">
              <label className={labelClass}>Usage rights duration</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {["1 month", "3 months", "6 months", "1 year", "Unlimited"].map(
                  (duration) => (
                    <div key={duration} className="flex items-center">
                      <input
                        type="radio"
                        id={`usage-${duration}`}
                        name="usageRights"
                        className={radioClass}
                        checked={formData.usageRights === duration}
                        onChange={() =>
                          handleRadioChange("usageRights", duration)
                        }
                      />
                      <label htmlFor={`usage-${duration}`} className="ml-2">
                        {duration}
                      </label>
                    </div>
                  )
                )}
              </div>
              {errors.usageRights && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.usageRights}
                </p>
              )}
            </div>

            <div className="mb-6">
              <label className={labelClass}>Campaign Image</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                {imagePreview ? (
                  <div className="relative">
                    <img
                      src={imagePreview || "/placeholder.svg"}
                      alt="Campaign preview"
                      className="max-h-64 mx-auto rounded-lg object-contain"
                    />
                    <button
                      type="button"
                      onClick={handleImageDelete}
                      className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                    >
                      <FaTrash size={16} />
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="cursor-pointer py-8"
                  >
                    <FaUpload
                      className="mx-auto text-gray-400 mb-4"
                      size={36}
                    />
                    <p className="text-gray-500">
                      Click to upload campaign image
                    </p>
                    <p className="text-gray-400 text-sm mt-1">
                      PNG, JPG or JPEG (max 5MB)
                    </p>
                  </div>
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/png, image/jpeg, image/jpg"
                  className="hidden"
                />
                {errors.image && (
                  <p className="text-red-500 text-sm mt-3">{errors.image}</p>
                )}
              </div>
            </div>
          </>
        );

      default:
        return null;
    }
  };

  /**
   * Renders the navigation buttons for the form
   */
  const renderFormNavButtons = () => {
    return (
      <div className="flex justify-between mt-8">
        {formStep > 1 && (
          <button
            type="button"
            onClick={() => setFormStep((prev) => prev - 1)}
            className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors"
          >
            Previous
          </button>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className={`${buttonClass} ${
            isSubmitting ? "opacity-70 cursor-not-allowed" : ""
          } ml-auto`}
        >
          {isSubmitting ? (
            <span className="flex items-center">
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Processing...
            </span>
          ) : formStep < 8 ? (
            "Next"
          ) : (
            "Submit Campaign"
          )}
        </button>
      </div>
    );
  };

  return (
    <BrandLayout>
      <div className="max-w-5xl mx-auto px-4 py-8">
        <ToastContainer position="top-right" autoClose={5000} />

        {showOptions ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center py-12"
          >
            <h1 className="text-4xl font-bold text-gray-800 mb-6">
              What would you like to do?
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
              <div
                onClick={() => handleOptionSelect("create")}
                className="p-8 rounded-xl border-2 border-gray-200 hover:border-[#6a38ca] cursor-pointer transition-all duration-300"
              >
                <h2 className="text-2xl font-bold mb-4">Create a Campaign</h2>
                <p className="text-gray-600">
                  Post a new campaign to find creators for your brand
                </p>
              </div>
              <div
                onClick={() => handleOptionSelect("explore")}
                className="p-8 rounded-xl border-2 border-gray-200 hover:border-[#6a38ca] cursor-pointer transition-all duration-300"
              >
                <h2 className="text-2xl font-bold mb-4">Explore Creators</h2>
                <p className="text-gray-600">
                  Browse and discover creators for your campaigns
                </p>
              </div>
            </div>
          </motion.div>
        ) : formVisible ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-800">
                Create a Campaign
              </h1>
              <p className="text-gray-600 mt-2">
                Fill out the details to create your campaign
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 md:p-8">
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  {Array.from({ length: 8 }, (_, i) => i + 1).map((step) => (
                    <div
                      key={step}
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        step === formStep
                          ? "bg-[#6a38ca] text-white"
                          : step < formStep
                          ? "bg-green-500 text-white"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {step < formStep ? "✓" : step}
                    </div>
                  ))}
                </div>
                <div className="h-2 bg-gray-200 rounded-full">
                  <div
                    className="h-2 bg-[#6a38ca] rounded-full transition-all duration-300"
                    style={{ width: `${(formStep / 8) * 100}%` }}
                  ></div>
                </div>
              </div>

              <form onSubmit={handleSubmit}>
                {formStepContent()}
                {renderFormNavButtons()}
              </form>
            </div>
          </motion.div>
        ) : null}
      </div>
    </BrandLayout>
  );
}
