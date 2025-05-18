import { useState, ChangeEvent, FormEvent, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaUpload, FaTrash } from 'react-icons/fa';
import BrandLayout from '../components/BrandLayout';
import Cookies from 'js-cookie';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface FormData {
    title: string;
    description: string;
    requirements: string;
    qualifications: string;
    deliverables: string;
    budget: string;
    platform: string;
    duration: string;
    image: File | null;
}

interface FormErrors {
    [key: string]: string;
}

export default function BrandPost() {
    const navigate = useNavigate();
    const [formVisible, setFormVisible] = useState(true);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const [formData, setFormData] = useState<FormData>({
        title: '',
        description: '',
        requirements: '',
        qualifications: '',
        deliverables: '',
        budget: '',
        platform: '',
        duration: '',
        image: null
    });
    const [errors, setErrors] = useState<FormErrors>({});
    const [formStep, setFormStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);

    /**
     * Validates form fields based on current step
     * @param step Current form step
     * @returns Object containing validation errors
     */
    const validateFormStep = (step: number): FormErrors => {
        const newErrors: FormErrors = {};
        if (step === 1) {
            if (!formData.title.trim()) newErrors.title = 'Title is required';
            if (!formData.description.trim()) newErrors.description = 'Description is required';
        } else if (step === 2) {
            if (!formData.requirements.trim()) newErrors.requirements = 'Requirements are required';
            if (!formData.qualifications.trim()) newErrors.qualifications = 'Qualifications are required';
            if (!formData.deliverables.trim()) newErrors.deliverables = 'Deliverables are required';
        } else if (step === 3) {
            if (!formData.budget || isNaN(Number(formData.budget))) {
                newErrors.budget = 'Valid budget is required';
            }
            if (!formData.duration.trim()) newErrors.duration = 'Duration is required';
            if (!formData.image) newErrors.image = 'Campaign image is required';
        }
        return newErrors;
    };

    /**
     * Updates form data when input fields change
     */
    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Clear error for this field if it exists
        if (errors[name]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
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
            setErrors(prev => ({ ...prev, image: 'Image size should be less than 5MB' }));
            return;
        }

        // Create preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);

        // Update form data
        setFormData(prev => ({ ...prev, image: file }));

        // Clear any previous errors
        if (errors.image) {
            setErrors(prev => {
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
        setFormData(prev => ({ ...prev, image: null }));
        setImagePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    /**
     * Uploads image to Cloudinary and returns secure URL
     */
    const uploadImageToCloudinary = async (imageFile: File): Promise<string | null> => {
        const cloudName = 'drihufdbo'; // Replace with your actual Cloudinary cloud name
        const uploadPreset = 'taseer'; // Replace with your actual upload preset

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
                        'Content-Type': 'multipart/form-data'
                    }
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

        if (formStep < 3) {
            setFormStep(prev => prev + 1);
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

            const payload = {
                title: formData.title,
                description: formData.description,
                requirements: formData.requirements,
                platform: formData.platform,

                qualifications: formData.qualifications,
                deliverables: formData.deliverables,
                budget: formData.budget,
                duration: formData.duration,
                image: imageUrl
            };

            toast.info("Creating campaign...", { autoClose: 2000 });

            const res = await axios.post("http://localhost:5000/api/campaigns", payload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

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
            toast.error(err.response?.data?.message || "Failed to create campaign. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    /**
     * CSS classes for consistent styling
     */
    const inputClass = "p-4 border border-gray-200 rounded-xl bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#6a38ca] shadow-sm";
    const labelClass = "block text-sm font-medium text-gray-700 mb-2";
    const buttonClass = "bg-[#6a38ca] hover:bg-[#5c2eb8] transition-all duration-300 text-white py-4 px-6 rounded-xl text-base font-semibold shadow-lg flex items-center justify-center gap-2";

    /**
     * Returns content for current form step
     */
    const formStepContent = () => {
        switch (formStep) {
            case 1:
                return (
                    <>
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-800">Step 1: Basic Information</h2>
                            <p className="text-gray-600">Let's start with the essentials of your campaign</p>
                        </div>
                        <div className="mb-6">
                            <label htmlFor="title" className={labelClass}>Campaign Title</label>
                            <input
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                className={`${inputClass} w-full`}
                                placeholder="Enter campaign title"
                            />
                            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                        </div>

                        <div className="mb-6">
                            <label htmlFor="description" className={labelClass}>Campaign Description</label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                className={`${inputClass} w-full h-40 resize-none`}
                                placeholder="Describe your campaign in detail"
                            />
                            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                        </div>
                        <div className="mb-6">
                            <label htmlFor="title" className={labelClass}>Platforms You Want To Run Campaign</label>
                            <input
                                id="platform"
                                name="platform"
                                value={formData.platform}
                                onChange={handleChange}
                                className={`${inputClass} w-full`}
                                placeholder="Enter platforms seperated with commas e.g. Instagram, TikTok"
                            />
                            {errors.platform && <p className="text-red-500 text-sm mt-1">{errors.platform}</p>}
                        </div>
                    </>
                );
            case 2:
                return (
                    <>
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-800">Step 2: Requirements & Qualifications</h2>
                            <p className="text-gray-600">Define what you're looking for in creators</p>
                        </div>
                        <div className="mb-6">
                            <label htmlFor="requirements" className={labelClass}>Requirements (comma-separated)</label>
                            <input
                                id="requirements"
                                name="requirements"
                                value={formData.requirements}
                                onChange={handleChange}
                                className={`${inputClass} w-full`}
                                placeholder="e.g. Original content, High quality, 4K resolution"
                            />
                            {errors.requirements && <p className="text-red-500 text-sm mt-1">{errors.requirements}</p>}
                        </div>
                        <div className="mb-6">
                            <label htmlFor="qualifications" className={labelClass}>Qualifications (comma-separated)</label>
                            <input
                                id="qualifications"
                                name="qualifications"
                                value={formData.qualifications}
                                onChange={handleChange}
                                className={`${inputClass} w-full`}
                                placeholder="e.g. 5K+ followers, Content creator, Influencer"
                            />
                            {errors.qualifications && <p className="text-red-500 text-sm mt-1">{errors.qualifications}</p>}
                        </div>
                        <div className="mb-6">
                            <label htmlFor="deliverables" className={labelClass}>Deliverables (comma-separated)</label>
                            <input
                                id="deliverables"
                                name="deliverables"
                                value={formData.deliverables}
                                onChange={handleChange}
                                className={`${inputClass} w-full`}
                                placeholder="e.g. 3 Instagram posts, 2 TikTok videos"
                            />
                            {errors.deliverables && <p className="text-red-500 text-sm mt-1">{errors.deliverables}</p>}
                        </div>
                    </>
                );
            case 3:
                return (
                    <>
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-800">Step 3: Budget & Assets</h2>
                            <p className="text-gray-600">Final details to complete your campaign</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div>
                                <label htmlFor="budget" className={labelClass}>Budget ($)</label>
                                <input
                                    id="budget"
                                    name="budget"
                                    value={formData.budget}
                                    onChange={handleChange}
                                    className={inputClass}
                                    type="number"
                                    min="1"
                                    placeholder="Enter budget amount"
                                />
                                {errors.budget && <p className="text-red-500 text-sm mt-1">{errors.budget}</p>}
                            </div>
                            <div>
                                <label htmlFor="duration" className={labelClass}>Duration (days)</label>
                                <input
                                    id="duration"
                                    name="duration"
                                    value={formData.duration}
                                    onChange={handleChange}
                                    className={inputClass}
                                    placeholder="e.g. 30"
                                />
                                {errors.duration && <p className="text-red-500 text-sm mt-1">{errors.duration}</p>}
                            </div>
                        </div>
                        <div className="mb-6">
                            <label className={labelClass}>Campaign Image</label>
                            <div className="w-full h-60 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center relative overflow-hidden">
                                {imagePreview ? (
                                    <>
                                        <img
                                            src={imagePreview}
                                            alt="Campaign preview"
                                            className="w-full h-full object-cover"
                                        />
                                        <button
                                            type="button"
                                            onClick={handleImageDelete}
                                            className="absolute bottom-4 right-4 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                                            aria-label="Remove image"
                                        >
                                            <FaTrash size={16} />
                                        </button>
                                    </>
                                ) : (
                                    <div
                                        className="text-center p-6 cursor-pointer w-full h-full flex flex-col items-center justify-center"
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        <FaUpload size={32} className="text-gray-400 mb-4" />
                                        <p className="text-[#6a38ca] font-medium hover:underline">Browse files</p>
                                        <p className="text-gray-500 text-sm mt-2">Click to upload campaign image</p>
                                    </div>
                                )}
                            </div>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleImageChange}
                            />
                            {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image}</p>}
                            <p className="text-xs text-gray-500 mt-2">Recommended size: 1200x628px. Max: 5MB</p>
                        </div>
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <BrandLayout>
            {formVisible && (
                <motion.form
                    onSubmit={handleSubmit}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="max-w-4xl mx-auto p-8 bg-white rounded-xl shadow-lg"
                >
                    {formStepContent()}

                    <div className="mt-8 flex justify-between">
                        {formStep > 1 && (
                            <button
                                type="button"
                                onClick={() => setFormStep(prev => prev - 1)}
                                className="text-gray-600 hover:underline font-medium px-6 py-2"
                            >
                                Back
                            </button>
                        )}
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`${buttonClass} ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {formStep < 3 ? 'Next' : isSubmitting ? 'Submitting...' : 'Create Campaign'}
                        </button>
                    </div>
                </motion.form>
            )}
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                closeOnClick
                pauseOnHover
                draggable
                limit={3}
            />
        </BrandLayout>
    );
}