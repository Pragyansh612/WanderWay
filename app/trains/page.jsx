"use client";

import { useState } from 'react';
import Lottie from "react-lottie";
import animationData from "../../public/animation/train.json";
import { useRouter } from 'next/navigation';
import Image from "next/image";

export default function FlightSearch() {
    const [trains, setTrains] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [origin, setOrigin] = useState('');
    const [destination, setDestination] = useState('');
    const [departureDate, setDepartureDate] = useState('');
    const [number, setNumber] = useState('')

    const router = useRouter();
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();
    const date = `${year}-${month}-${day}`;

    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
            preserveAspectRatio: "xMidYMid slice",
        },
    };

    const searchTrains = async () => {
        if (!origin || !destination || !departureDate || !number) {
            setError("Please fill out all fields.");
            return;
        }
        if (date > departureDate) {
            setError("Invalid Date");
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('/api/searchTrains', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    search: origin || destination || 'Rajdhani'
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            const filteredTrains = filterTrainsByStations(result, origin, destination);
            setTrains(filteredTrains);
        } catch (err) {
            console.error('Error details:', err);
            setError(`Error fetching train data: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    const filterTrainsByStations = (trains, origin, destination) => {
        return trains.filter(train =>
            (!origin || train.train_from.toLowerCase() === origin.toLowerCase()) &&
            (!destination || train.train_to.toLowerCase() === destination.toLowerCase())
        );
    };

    const bookTrain = (index) => {
        let train = trains[index];
        const Date = departureDate;
        const Name = train.name;
        const num = train.train_num;
        const origin = train.train_from;
        const destination = train.train_to;
        const arriveTime = train.data.arriveTime;
        const departTime = train.data.departTime;

        const query = new URLSearchParams({
            origin,
            destination,
            num,
            Name,
            arriveTime,
            departTime,
            passengers: number,
            departureDate: Date,
            price: 450 * number
        });

        router.push(`/booktrains?${query.toString()}`);
    };


    return (
        <div className="relative min-h-screen flex flex-col items-center overflow-hidden"
            style={{
                background: "linear-gradient(to bottom, #cce7ff, #99d1ff)",
                position: "relative"
            }}
        >
            {/* Floating Cloud 1 */}
            <div style={{
                position: 'absolute',
                top: '10%',
                left: '5%',
                animation: 'float 8s ease-in-out infinite',
            }}>
                <Image src="/cloud.png" alt="Cloud" width={130} height={110} opacity={0.7} />
            </div>

            {/* Floating Cloud 2 */}
            <div style={{
                position: 'absolute',
                top: '20%',
                right: '10%',
                animation: 'float 6s ease-in-out infinite',
            }}>
                <Image src="/cloud.png" alt="Cloud" width={140} height={100} opacity={0.6} />
            </div>

            {/* Floating Cloud 3 */}
            <div style={{
                position: 'absolute',
                bottom: '20%',
                left: '15%',
                animation: 'float 8s ease-in-out infinite',
            }}>
                <Image src="/cloud.png" alt="Cloud" width={150} height={120} opacity={0.5} />
            </div>
            <div className="bg-white bg-opacity-95 shadow-xl w-7/12 mt-10 mb-10 rounded-3xl p-8 relative z-10">
                <h1 className="text-4xl font-bold text-center text-gray-800 mb-5">Book Your Train</h1>
                <div className='flex gap-20'>
                    <div className="flex flex-col gap-4 w-full">
                        <input
                            type="text"
                            value={origin}
                            onChange={(e) => setOrigin(e.target.value)}
                            placeholder="Origin Code (e.g., DBRG, RNY, LGH, DLI)"
                            className="border p-2 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                            required
                        />
                        <input
                            type="text"
                            value={destination}
                            onChange={(e) => setDestination(e.target.value)}
                            placeholder="Destination Code (e.g., HWH, AGTL, DBG)"
                            className="border p-2 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                            required
                        />
                        <input
                            type="date"
                            value={departureDate}
                            onChange={(e) => setDepartureDate(e.target.value)}
                            className="border p-2 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                            required
                        />
                        <input
                            type="number"
                            value={number}

                            onChange={(e) => setNumber(e.target.value)}
                            placeholder="Number of passengers"
                            className="border p-2 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                            required
                        />
                        <button
                            onClick={searchTrains}
                            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300"
                        >
                            Search Trains
                        </button>
                        {loading && <p className="text-blue-500 text-center mt-4">Loading...</p>}
                        {error && <p className="text-red-500 text-center mt-4">{error}</p>}
                        <ul className="mt-6">
                            {trains.length > 0 && (
                                <div className="">
                                    <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4">
                                        Available Trains
                                    </h2>
                                    <ul className="space-y-4">
                                        {trains.map((train, index) => (
                                            <li key={index} className="bg-gray-100 p-4 rounded-lg shadow-md">
                                                <h3 className="text-lg font-bold">
                                                    {train.name} (Train No: {train.train_num})
                                                </h3>
                                                <p className="text-gray-600">
                                                    From: {train.train_from} → To: {train.train_to}
                                                </p>
                                                <p className="text-gray-600">
                                                    Arrival Time: {train.data.arriveTime.slice(0, 5)} | Departure Time:{" "}
                                                    {train.data.departTime}
                                                </p>
                                                <p className="text-gray-600">Total Days: {train.data.arriveTime.slice(7)}</p>
                                                <p className="text-gray-600">Price: {450 * number}</p>
                                                <button
                                                    onClick={() => bookTrain(index)}
                                                    className="mt-4 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition duration-300"
                                                >
                                                    Book Now
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </ul>
                    </div>
                    <div className="flex justify-center mt-6">
                        <Lottie options={defaultOptions} height={250} width={250} />
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes float {
                    0% {
                        transform: translateY(0px);
                    }
                    50% {
                        transform: translateY(-20px);
                    }
                    100% {
                        transform: translateY(0px);
                    }
                }
                .animate-float {
                    animation: float 6s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
}