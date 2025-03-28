import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import { FiCheckCircle } from "react-icons/fi";
import Button from "../../components/ui/Button";

const Onboarding = () => {
    const [step, setStep] = useState(1);
    const navigate = useNavigate();
    const { register, handleSubmit } = useForm();

    const onNext = () => setStep((prev) => prev + 1);
    const onSubmit = (data: any) => {
        console.log("User Data:", data);
        navigate("/dashboard");
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
            {/* Logo & Step Tracker */}
            <div className="w-full max-w-md text-center">
                <img src="/logo.svg" alt="Logo" className="w-24 mx-auto mb-4" />
                <div className="flex justify-between items-center mb-6">
                    {[1, 2, 3].map((num) => (
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
                {/* Step 1: Basic Info */}
                {step === 1 && (
                    <div className="space-y-5">
                        <h2 className="text-2xl font-bold text-gray-800 text-center">Basic Information</h2>
                        <div className="space-y-4">
                            <input {...register("name")} placeholder="Full Name" className="w-full border-2 border-purple-500 outline-purple-500 rounded-md p-2" required />
                            <input {...register("email")} type="email" placeholder="Email" className="w-full border-2 border-purple-500 outline-purple-500 rounded-md p-2" required />
                            <input {...register("phone")} type="tel" placeholder="Phone Number" className="w-full border-2 border-purple-500 outline-purple-500 rounded-md p-2" required />
                            <input {...register("dob")} type="date" className="w-full border-2 border-purple-500 outline-purple-500 rounded-md p-2" required />
                            <select {...register("gender")} className="w-full border-2 border-purple-500 outline-purple-500 rounded-md p-2" required>
                                <option value="">Select Gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                        <Button className="flex items-center mx-auto gap-x-3 btn" onClick={onNext}>
                            Next <FaArrowRight />
                        </Button>
                    </div>
                )}

                {/* Step 2: Social Media */}
                {step === 2 && (
                    <div className="space-y-5">
                        <h2 className="text-2xl font-bold text-gray-800 text-center">Social Media Handles</h2>
                        <div className="space-y-4">
                            <input {...register("instagram")} placeholder="Instagram" className="w-full border-2 border-purple-500 outline-purple-500 rounded-md p-2" />
                            <input {...register("youtube")} placeholder="YouTube" className="w-full border-2 border-purple-500 outline-purple-500 rounded-md p-2" />
                            <input {...register("reddit")} placeholder="Reddit" className="w-full border-2 border-purple-500 outline-purple-500 rounded-md p-2" />
                            <input {...register("pinterest")} placeholder="Pinterest" className="w-full border-2 border-purple-500 outline-purple-500 rounded-md p-2" />
                            <input {...register("other_social")} placeholder="Other Platform" className="w-full border-2 border-purple-500 outline-purple-500 rounded-md p-2" />
                        </div>
                        <Button className="flex items-center mx-auto gap-x-3 btn" onClick={onNext}>
                            Next <FaArrowRight />
                        </Button>
                    </div>
                )}

                {/* Step 3: Location */}
                {step === 3 && (
                    <div className="space-y-5">
                        <h2 className="text-2xl font-bold text-gray-800 text-center">Location</h2>
                        <div className="space-y-4">
                            <input {...register("nationality")} placeholder="Nationality" className="w-full border-2 border-purple-500 outline-purple-500 rounded-md p-2" required />
                            <input {...register("city")} placeholder="City" className="w-full border-2 border-purple-500 outline-purple-500 rounded-md p-2" required />
                            <input {...register("country")} placeholder="Country" className="w-full border-2 border-purple-500 outline-purple-500 rounded-md p-2" required />
                        </div>
                        <Button className="flex items-center mx-auto gap-x-3 btn">
                            Submit <FaArrowRight />
                        </Button>
                    </div>
                )}
            </form>
        </div>
    );
};

export default Onboarding;