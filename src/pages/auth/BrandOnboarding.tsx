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
    countrycode: string,
    contactNumber: string;
    website?: string;
    password: string;
    confirmPassword: string;
    otp: number

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
    const totalSteps = 7;

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
                fieldsToValidate = ["companyName", "email", "contactNumber", "countrycode", "password", "confirmPassword"];
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
                fieldsToValidate = ["supportType", "platformUse"];
                break;

            case 6:
                fieldsToValidate = ["creatorType", "acceptTerms"];
                break;
            case 7:
                fieldsToValidate = ["otp"];
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
        return !commonDomains.includes(domain) || "Company domain email required";
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
                                        placeholder="Email "
                                        className="w-full border-2 border-purple-500 outline-purple-500 rounded-md p-2"
                                    />
                                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                                </div>

                                <div className="grid">
                                    <select
                                        className="bg-transparent border-2 mb-1 border-purple-500 outline-purple-500 rounded-md p-2 "
                                        id=""
                                        {...register("countrycode")}

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
                                    {errors.countrycode && <p className="text-red-500 text-sm mt-1">{errors.countrycode.message}</p>}

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
                            <center className="py-3 w-full mx-auto font-medium">Already have an account? <a className="underline text-purple-600" href="/login">Log in</a>  </center>

                        </div>
                    )}

                    {/* Step 2: Company Details */}
                    {step === 2 && (
                        <div className="space-y-5">
                            <h2 className="text-2xl font-bold text-gray-800 text-center">Company Details</h2>

                            <div className="space-y-4">
                                <div className="border-2 border-purple-500 outline-purple-500 rounded-md p-2">
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
                                    <div className="mr-2  inline-flex bg-transparent rounded-md border ml-2 border-gray-300 bg-gray-900 px-3 py-2 text-sm leading-5 font-medium text-white shadow-md cursor-pointer">

                                    </div>
                                    <input
                                        {...register("representativeContactNumber")}
                                        placeholder="Contact Number (optional)"
                                        className="w-fit border-2 border-purple-500 outline-purple-500 rounded-md p-2"
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
                    {
                        step == 5 && (
                            <div className="space-y-5">

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
                        )
                    }
                    {step === 6 && (

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
                                    onClick={onNext}

                                >
                                    Next <FaArrowRight />
                                </Button>

                            </div>
                        </div>
                    )}
                    {step === 7 && (

                        <div className="space-y-5">

                            <h2 className="text-2xl font-bold text-gray-800 text-center">An Otp has been sent your email </h2>

                            <input
                                {...register("otp")}
                                placeholder="Enter the 6 digits otp"
                                type="number"
                                className="w-full border-2 border-purple-500 outline-purple-500 rounded-md p-2"
                            />
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