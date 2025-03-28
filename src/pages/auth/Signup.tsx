import { useNavigate } from "react-router-dom";
import Button from "../../components/ui/Button";

export default function Signup() {
    const router = useNavigate()

    const onSelected = () => {
        router('/signup/onboarding')
    }
    return (
        <div className="flex justify-between">
            {/* Left Section */}
            <div className="flex flex-col mx-auto w-1/2 justify-center text-center md:text-left max-w-lg">
                <h1 className="text-4xl md:text-5xl mx-auto font-bold">Welcome to</h1>
                <img className="w-[150px]  mx-auto" src="/logo.svg" alt="Logo" />
                <div className="mt-6 flex mx-auto flex-col gap-4">
                    <Button onClick={() => onSelected()} className="w-[200px]" variant="white">I'm a Brand</Button>
                    <Button onClick={() => onSelected()} className="w-[200px]" variant="white">I'm a Creator</Button>
                </div>
            </div>
            <img className="max-h-screen w-1/2 hidden md:block" src="/signup.png" alt="" />
        </div>
    )
}
