export default function NextEvent(){
    return(
        <div className="flex justify-center">
            <div className="border-4 border-orange w-3xl px-8 py-4 flex flex-row justify-between align-center">
                <div>
                    <h1 className="text-2xl font-bold">next event</h1>
                    <p>Event Date</p>
                </div>
                <div className="w-1/3">
                    <p>A bit more text here the explain what is going to be there</p>
                </div>
                <div>
                    <button>Get tickets</button>
                </div>
            
            </div>
        </div>
    )
}