"use client";

import { useState } from 'react';
import axios from 'axios';
import Lottie from "react-lottie";
import animationData from "../../public/animation/hotel.json";
import { useRouter } from 'next/navigation';
import Image from "next/image";

export default function FlightSearch() {
    const [hotels, setHotels] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [origin, setOrigin] = useState('');
    const [from, setFrom] = useState('');
    const [to, setTo] = useState('');
    const [number, setNumber] = useState('');
    const [search, setSearch] = useState(false)
    const router = useRouter()
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

    const searchHotels = async () => {
        if (!origin || !from || !to || !number) {
            setError("Please fill out all fields.");
            return;
        }
        if (date > from || date > to) {
            setError("Invalid Date");
            return;
        }
        setLoading(true);
        setError(null);

        try {
            const response = await axios.get('/api/searchHotels', {
                params: {
                    origin,
                    from,
                    to,
                    number
                },
            });
            setHotels(response.data.properties || []);
            setSearch(true)
        } catch (err) {
            console.error(err);
            setError('Error fetching hotel data.');
        } finally {
            setLoading(false);
        }
    };

    const bookHotel = (index) => {
        const hotel = hotels[index];

        const query = new URLSearchParams({
            origin,
            from,
            to,
            number,
            name: hotel.name,
            price: hotel.rate_per_night?.lowest,
            rating: hotel.overall_rating,
        });
        router.push(`/bookhotels?${query.toString()}`);
    };

    return (
        <div className="relative min-h-screen flex flex-col items-center overflow-hidden"
            style={{
                background: "linear-gradient(to bottom, #cce7ff, #99d1ff)",
                position: "relative"
            }}
        >
            {/* Floating Clouds */}
            <div style={{
                position: 'absolute',
                top: '10%',
                left: '0%',
                animation: 'float 8s ease-in-out infinite',
            }}>
                <Image src="/cloud.png" alt="Cloud" width={130} height={110} opacity={0.7} />
            </div>
            <div style={{
                position: 'absolute',
                top: '40%',
                right: '0%',
                animation: 'float 6s ease-in-out infinite',
            }}>
                <Image src="/cloud.png" alt="Cloud" width={140} height={100} opacity={0.6} />
            </div>
            <div style={{
                position: 'absolute',
                bottom: '0%',
                left: '15%',
                animation: 'float 8s ease-in-out infinite',
            }}>
                <Image src="/cloud.png" alt="Cloud" width={150} height={120} opacity={0.5} />
            </div>

            <div className="bg-white bg-opacity-95 shadow-xl mt-10 w-10/12 rounded-3xl p-8 relative z-10">
                <h1 className="text-4xl font-bold text-center text-gray-800 mb-5">Book your Hotel</h1>
                <div className="flex gap-20">
                    <div className="flex flex-col gap-2 w-full">
                        <input
                            type="text"
                            value={origin}
                            onChange={(e) => setOrigin(e.target.value)}
                            placeholder="Search City"
                            className="border p-2 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                        />
                        <div className=' flex gap-5 p-1'>
                            <label htmlFor="" className=' mt-2'>Check-In Date - </label>
                            <input
                                type="date"
                                value={from}
                                onChange={(e) => setFrom(e.target.value)}
                                placeholder='Check-In Date'
                                className="border p-2 ml-3 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                            />
                        </div>
                        <div className=' flex gap-5 p-1'>
                            <label htmlFor="" className=' mt-2'>Check-Out Date - </label>
                            <input
                                type="date"
                                value={to}
                                onChange={(e) => setTo(e.target.value)}
                                className="border p-2 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                            />
                        </div>
                        <input
                            type="number"
                            value={number}
                            onChange={(e) => setNumber(e.target.value)}
                            placeholder="Number of People"
                            className="border p-2 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                        />
                        <button
                            onClick={searchHotels}
                            className="bg-gradient-to-r from-blue-500 to-violet-500 text-white px-4 py-2 rounded-md hover:opacity-90 transition duration-300 mt-2"
                        >
                            Search Hotels
                        </button>
                        {loading && <p className="text-blue-500 text-center mt-4">Loading...</p>}
                        {error && <p className="text-red-500 text-center mt-4">{error}</p>}
                    </div>
                    <div className="flex justify-center">
                        <Lottie options={defaultOptions} height={250} width={250} />
                    </div>
                </div>
                <ul className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2">
                    {hotels.length > 0 ? (
                        hotels.map((hotel, index) => (
                            <li key={index} className="bg-white border border-gray-300 p-4 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300">
                                <h2 className="text-xl font-bold mb-2">{hotel.name}</h2>
                                <p className="text-gray-700 font-semibold mt-2">Rating: {hotel.overall_rating}</p>
                                <p className="text-blue-500 font-semibold mt-1">Price per night: {hotel.rate_per_night?.lowest}</p>
                                <div className="mt-3 relative">
                                    <img
                                        src={hotel.images?.[0]?.thumbnail}
                                        alt={hotel.name}
                                        className="w-full h-48 object-cover rounded-md hover:opacity-80 transition-opacity"
                                    />
                                </div>
                                <button
                                    onClick={() => bookHotel(index)}
                                    className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300 w-full"
                                >
                                    Book Now
                                </button>
                            </li>
                        ))
                    ) : (
                        <div>
                            {search ? <p>No hotels found.</p> : <p></p>}
                        </div>
                    )}
                </ul>
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
