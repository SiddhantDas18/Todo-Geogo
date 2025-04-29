export default function SignIn(){

    return <div className="pt-5 flex justify-center items-center h-screen overflow-hidden">
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-5">
                <input type="text" placeholder="username" className="inpt-styling"/>
                <input type="password" placeholder="password"className="inpt-styling"/>
            </div>

            <div className="flex justify-center">
                <button className="butn">SignIn</button>
            </div>
        </div>
    </div>
}