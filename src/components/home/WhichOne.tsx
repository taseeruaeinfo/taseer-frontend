import Button from "../ui/Button";

export default function WhichOne() {
    return (
        <div className="py-10">
            <h3 className="text-4xl md:text-5xl font-bold text-center">Which One are you ?</h3>
            <div className="mt-6 flex gap-4 justify-center">
                <Button variant="primary">I'm a Brand</Button>
                <Button variant="white">I'm a Creator</Button>
            </div>
        </div>
    )
}
