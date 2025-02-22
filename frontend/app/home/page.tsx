import Typewriter from '../../components/typewriter';

export default function HomePage() {
    return (
        <div className="min-h-screen flex flex-col items-center">
            <h1 className="text-8xl font-bold bg-gradient-to-r from-blue-400 via-violet-500 to-purple-600 bg-clip-text text-transparent"
            style={{ textShadow: '10px 10px 10px rgba(0, 0, 0, 0.25)' }}>
                EchoAce AI
            </h1>
            <h2 className="text-4xl mt-16">
                <Typewriter text=" Use AI to better your chances!" speed={100}/> 
                </h2>
            <div className="flex flex-row gap-8 mt-28">
                <button className="hover:bg-gray-300 border border-2 border-blue-500 font-bold text-blue-500 py-2 px-14 rounded-lg shadow-lg shadow-blue-500/50">Interview</button>
                <button className="bg-black hover:bg-gray-400 font-bold text-white py-3 px-14 rounded-lg shadow-lg shadow-black-500/50">Resume</button>
            </div>
            <h2 className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent font-bold text-2xl mt-16">Backed by LinkedIn</h2>
            <div className="bg-gradient-to-r from-blue-100 via-blue-200 to-blue-300  w-full mt-16 min-h-screen">
                <div className="text-center mt-20 px-4">
                    <h2 className="text-6xl font-semibold mb-6">How It Works</h2>
                    <p>Here is some content with a gray background.</p>
                </div>
                <div className="flex flex-wrap justify-center gap-40 mt-16 max-w-6xl mx-auto">
                    <div className="bg-white border border-2 border-black rounded-3xl p-6 flex-1 flex flex-col">
                        <h2 className="font-bold text-center mt-3">Practice Behavioral interview</h2>
                        <p className="mt-6">Our proven AI evaluation system is as accurate as a human interviewer.</p>
                        <button className="bg-black hover:bg-gray-400 font-bold text-white py-3 px-14 rounded-3xl mt-24 max-w-4xl mx-auto">Learn about our AI interviewer</button>
                    </div>
                    <div className="bg-white border border-2 border-black rounded-3xl p-6 flex-1 flex flex-col">
                        <h1 className="font-bold text-center mt-3">Build a Better Resume</h1>
                        <p className="mt-6">Our model builds upon your resume. Editing it's content based on industry you wish to go in.</p>
                        <button className="bg-black hover:bg-gray-400 font-bold text-white py-3 px-14 rounded-3xl mt-24 max-w-4xl mx-auto">See the resume builder at work</button>
                    </div>
                </div>
                <div className='mt-28 max-w-6xl mx-auto'>
                    <div>
                        <h2 className='font-bold text-5xl'>Meet our AI interviewer STEVE</h2>
                        <p className='text-2xl mt-8 mb-8'>STEVE is an AI interviewer that will rate your interview skills.</p>
                    </div>
                </div>
            </div>
            <div className='mt-16'>
                <h2 className='text-6xl font-bold text-center'>We are currently in Beta!</h2>
                <p className='mt-8 text-xl'>EchoAce is currently in Beta. The app is incomplete and may have major bugs. Please report issues at name@gmail.com</p>
            </div>
        </div>
    );
}