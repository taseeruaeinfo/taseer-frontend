import { useNavigate } from "react-router-dom";
import Button from "../../components/ui/Button";
import Navbar from "../../components/Navbar";

export default function Signup() {
    const router = useNavigate()

    const onSelected = () => {
        router('/signup/onboarding')
    }
    return (
        <>
            <Navbar />

            <div className="flex items-center justify-center min-h-screen px-4">
                <div className="flex flex-col items-center text-center w-full max-w-2xl">
                    <h1 className="text-5xl md:text-6xl font-bold">Welcome to</h1>
                    <img className="w-[180px] md:w-[200px] my-4" src="/logo.svg" alt="Logo" />
                    <div className="mt-6 flex flex-col gap-4 w-full max-w-[300px]">
                        <Button onClick={() => router('/signup/onboarding/brand')} className="w-full py-4 text-xl" variant="white">
                            I'm a Brand
                        </Button>
                        <Button onClick={() => onSelected()} className="w-full py-4 text-xl" variant="white">
                            I'm a Creator
                        </Button>
                    </div>
                </div>
            </div>
        </>

    )
}
