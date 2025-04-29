
export default function Navbar(){

    return <div className="border border-black py-3 mx-3 rounded-md ">
        <div className="flex justify-between px-2 items-center">
            <div className="text-2xl md:text-3xl md:font-bold">
                Todo
            </div>

            <div className="flex gap-2">
                <div className="butn md:text-2xl">
                    SignUp
                </div>

                <div className="butn md:text-2xl">
                    SignIn
                </div>
            </div>
        </div>
    </div>
}