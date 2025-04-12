import React, { useState, ChangeEvent, FormEvent, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaPlus, FaSearch, FaUpload, FaTrash, FaCheck } from 'react-icons/fa';
import BrandLayout from '../components/BrandLayout';

interface FormData {
    title: string;
    description: string;
    requirements: string;
    qualifications: string;
    deliverables: string;
    budget: string;
    duration: string;
    image: File | null;
}

interface FormErrors {
    [key: string]: string;
}

export default function BrandPost() {
    const navigate = useNavigate();
    const [formVisible, setFormVisible] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const [formData, setFormData] = useState<FormData>({
        title: '',
        description: '',
        requirements: '',
        qualifications: '',
        deliverables: '',
        budget: '',
        duration: '',
        image: null
    });
    const [errors, setErrors] = useState<FormErrors>({});
    const [formStep, setFormStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const validateFormStep = (step: number): FormErrors => {
        const newErrors: FormErrors = {};

        if (step === 1) {
            if (!formData.title) newErrors.title = 'Title is required';
            if (!formData.description) newErrors.description = 'Description is required';
        } else if (step === 2) {
            if (!formData.requirements) newErrors.requirements = 'Requirements are required';
            if (!formData.qualifications) newErrors.qualifications = 'Qualifications are required';
            if (!formData.deliverables) newErrors.deliverables = 'Deliverables are required';
        } else if (step === 3) {
            if (!formData.budget || isNaN(Number(formData.budget))) newErrors.budget = 'Valid budget is required';
            if (!formData.duration) newErrors.duration = 'Duration is required';
            if (!formData.image) newErrors.image = 'Campaign image is required';
        }

        return newErrors;
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFormData(prev => ({ ...prev, image: file }));
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleImageDelete = () => {
        setFormData(prev => ({ ...prev, image: null }));
        setImagePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const validationErrors = validateFormStep(formStep);

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        if (formStep < 3) {
            setFormStep(prev => prev + 1);
            setErrors({});
            return;
        }

        // Submit the form
        setIsSubmitting(true);
        try {
            const processedData = {
                ...formData,
                requirements: formData.requirements.split(',').map(s => s.trim()),
                qualifications: formData.qualifications.split(',').map(s => s.trim()),
                deliverables: formData.deliverables.split(',').map(s => s.trim())
            };
            console.log(processedData);

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Reset form and navigate
            setFormData({
                title: '',
                description: '',
                requirements: '',
                qualifications: '',
                deliverables: '',
                budget: '',
                duration: '',
                image: null
            });
            setImagePreview(null);
            setFormStep(1);
            setFormVisible(false);
        } catch (error) {
            console.error('Error submitting form:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const inputClass = "p-4 border border-gray-200 rounded-xl bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#6a38ca] shadow-sm";
    const labelClass = "block text-sm font-medium text-gray-700 mb-2";
    const buttonClass = "bg-[#6a38ca] hover:bg-[#5c2eb8] transition-all duration-300 text-white py-4 px-6 rounded-xl text-base font-semibold shadow-lg flex items-center justify-center gap-2";

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
                                placeholder="Enter an attention-grabbing title"
                                className={`${inputClass} w-full`}
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
                                placeholder="Describe your campaign goals and vision"
                                className={`${inputClass} w-full h-40 resize-none`}
                            />
                            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
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
                            <label htmlFor="requirements" className={labelClass}>Campaign Requirements</label>
                            <input
                                id="requirements"
                                name="requirements"
                                value={formData.requirements}
                                onChange={handleChange}
                                placeholder="Separate requirements with commas"
                                className={`${inputClass} w-full`}
                            />
                            {errors.requirements && <p className="text-red-500 text-sm mt-1">{errors.requirements}</p>}
                        </div>

                        <div className="mb-6">
                            <label htmlFor="qualifications" className={labelClass}>Creator Qualifications</label>
                            <input
                                id="qualifications"
                                name="qualifications"
                                value={formData.qualifications}
                                onChange={handleChange}
                                placeholder="Required qualifications (comma separated)"
                                className={`${inputClass} w-full`}
                            />
                            {errors.qualifications && <p className="text-red-500 text-sm mt-1">{errors.qualifications}</p>}
                        </div>

                        <div className="mb-6">
                            <label htmlFor="deliverables" className={labelClass}>Expected Deliverables</label>
                            <input
                                id="deliverables"
                                name="deliverables"
                                value={formData.deliverables}
                                onChange={handleChange}
                                placeholder="Content deliverables (comma separated)"
                                className={`${inputClass} w-full`}
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
                            <p className="text-gray-600">Finalize your campaign details</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div>
                                <label htmlFor="budget" className={labelClass}>Campaign Budget ($)</label>
                                <input
                                    id="budget"
                                    name="budget"
                                    type="number"
                                    value={formData.budget}
                                    onChange={handleChange}
                                    placeholder="Enter your budget"
                                    className={inputClass}
                                />
                                {errors.budget && <p className="text-red-500 text-sm mt-1">{errors.budget}</p>}
                            </div>

                            <div>
                                <label htmlFor="duration" className={labelClass}>Campaign Duration (days)</label>
                                <input
                                    id="duration"
                                    name="duration"
                                    value={formData.duration}
                                    onChange={handleChange}
                                    placeholder="How long will this run?"
                                    className={inputClass}
                                />
                                {errors.duration && <p className="text-red-500 text-sm mt-1">{errors.duration}</p>}
                            </div>
                        </div>

                        <div className="mb-6">
                            <label className={labelClass}>Campaign Image</label>
                            <div className="flex flex-col items-center">
                                <div className="w-full h-60 bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center mb-4 overflow-hidden relative">
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
                                            >
                                                <FaTrash size={16} />
                                            </button>
                                        </>
                                    ) : (
                                        <div className="text-center p-6">
                                            <FaUpload size={32} className="mx-auto text-gray-400 mb-4" />
                                            <p className="text-gray-500 mb-2">Drag and drop an image here or</p>
                                            <button
                                                type="button"
                                                onClick={() => fileInputRef.current?.click()}
                                                className="text-[#6a38ca] font-medium hover:underline"
                                            >
                                                Browse files
                                            </button>
                                        </div>
                                    )}
                                </div>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                />
                                {errors.image && <p className="text-red-500 text-sm">{errors.image}</p>}
                                <p className="text-xs text-gray-500 mt-2">Recommended size: 1200x628px. Max size: 5MB</p>
                            </div>
                        </div>
                    </>
                );
            default:
                return null;
        }
    };

    if (formVisible) {
        return (
            <>
                <BrandLayout>
                    <motion.div
                        className="min-h-screen bg-gray-50 p-8"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        <div className="max-w-4xl mx-auto">
                            <div className="flex items-center justify-between mb-8">
                                <h1 className="text-3xl font-bold text-gray-800">
                                    <span className="text-[#6a38ca]">Create</span> a Premium Campaign
                                </h1>
                                <button
                                    onClick={() => setFormVisible(false)}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    Cancel
                                </button>
                            </div>

                            {/* Progress bar */}
                            <div className="flex items-center mb-10 px-2">
                                {[1, 2, 3].map((step) => (
                                    <React.Fragment key={step}>
                                        <div
                                            className={`w-8 h-8 rounded-full flex items-center justify-center font-medium ${step < formStep ? 'bg-green-500 text-white' :
                                                step === formStep ? 'bg-[#6a38ca] text-white' :
                                                    'bg-gray-200 text-gray-600'
                                                }`}
                                        >
                                            {step < formStep ? <FaCheck size={12} /> : step}
                                        </div>
                                        {step < 3 && (
                                            <div
                                                className={`flex-1 h-1 mx-2 ${step < formStep ? 'bg-green-500' : 'bg-gray-200'
                                                    }`}
                                            />
                                        )}
                                    </React.Fragment>
                                ))}
                            </div>

                            <div className="bg-white rounded-2xl p-8 shadow-xl">
                                <form onSubmit={handleSubmit}>
                                    {formStepContent()}

                                    <div className="flex justify-between mt-8">
                                        {formStep > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => setFormStep(prev => prev - 1)}
                                                className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                                            >
                                                Back
                                            </button>
                                        )}

                                        <button
                                            type="submit"
                                            className={`${buttonClass} ml-auto ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? (
                                                <>Processing...</>
                                            ) : formStep < 3 ? (
                                                <>Continue</>
                                            ) : (
                                                <>Launch Campaign</>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </motion.div>
                </BrandLayout>
            </>
        );
    }

    return (
        <>
            <BrandLayout>
                <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
                    <div className="max-w-6xl w-full">
                        <div className="text-center mb-12">
                            <h1 className="text-4xl font-bold text-gray-800 mb-4">Creator Campaign Dashboard</h1>
                            <p className="text-lg text-gray-600 max-w-2xl mx-auto">Create campaigns that connect your brand with the perfect influencers to showcase your products and services.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <motion.div
                                whileHover={{ scale: 1.03, boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)" }}
                                className="bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer transition-all"
                                onClick={() => setFormVisible(true)}
                            >
                                <div className="h-40 bg-gradient-to-r from-[#6a38ca] to-[#9969f8] flex items-center justify-center">
                                    <FaPlus className="text-6xl text-white opacity-70" />
                                </div>
                                <div className="p-8">
                                    <h2 className="text-2xl font-bold text-gray-800 mb-3">Create New Campaign</h2>
                                    <p className="text-gray-600 mb-6">Launch a professional campaign with custom requirements tailored to your brand's voice and goals.</p>
                                    <div className={`${buttonClass} w-full justify-center`}>
                                        <FaPlus className="mr-2" />
                                        Get Started
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div
                                whileHover={{ scale: 1.03, boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)" }}
                                className="bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer transition-all"
                                onClick={() => navigate('/brand/find-influencers')}
                            >
                                <div className="h-40 bg-gradient-to-r from-[#3c8dca] to-[#69b8f8] flex items-center justify-center">
                                    <FaSearch className="text-6xl text-white opacity-70" />
                                </div>
                                <div className="p-8">
                                    <h2 className="text-2xl font-bold text-gray-800 mb-3">Find Perfect Creators</h2>
                                    <p className="text-gray-600 mb-6">Discover and connect with influencers who align with your brand values and audience demographics.</p>
                                    <div className={`${buttonClass} w-full justify-center bg-[#3c8dca] hover:bg-[#2e7ab0]`}>
                                        <FaSearch className="mr-2" />
                                        Browse Creators
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </BrandLayout>
        </>
    );
}