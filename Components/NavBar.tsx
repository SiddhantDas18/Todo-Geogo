import Link from 'next/link';

export default function Navbar(){
    return <div className="sticky top-0 border border-black py-3 rounded-md">
        <div className="flex justify-between px-2 items-center">
            <div className="text-2xl md:text-3xl md:font-bold">
                Todo
            </div>

            <div className="flex gap-2">
                <div className="butn md:text-2xl">
                    <Link href="/signup">SignUp</Link>
                </div>

                <div className="butn md:text-2xl">
                    <Link href="/signin">SignIn</Link>
                </div>
            </div>
        </div>
    </div>
}