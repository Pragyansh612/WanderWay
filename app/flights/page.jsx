"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import getAmadeusToken from '../utils/amadeusToken';
import Lottie from "react-lottie";
import animationData from "../../public/animation/flight.json";
import { useRouter } from 'next/navigation';
import Image from "next/image";

export default function FlightSearch() {
    const [flights, setFlights] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [origin, setOrigin] = useState('');
    const [destination, setDestination] = useState('');
    const [departureDate, setDepartureDate] = useState('');
    const [number, setNumber] = useState('');
    const [price, setPrice] = useState([]);

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

    const searchFlights = async () => {
        if (!origin || !destination || !departureDate || !number) {
            setError("Please fill out all fields.");
            return;
        }
        if(date > departureDate){
            setError("Invalid Date");
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const token = await getAmadeusToken();
            const response = await axios.get(
                'https://test.api.amadeus.com/v2/shopping/flight-offers',
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    params: {
                        originLocationCode: origin,
                        destinationLocationCode: destination,
                        departureDate: departureDate,
                        adults: number,
                        max: 5,
                    },
                }
            );

            setFlights(response.data.data);
            let prices = []
            for (let index = 0; index < response.data.data.length; index++) {
                const element = response.data.data[index];
                let paisa = element.price.total
                prices.push(paisa * 92);
            }
            setPrice(prices)
        } catch (err) {
            console.error(err);
            setError('Error fetching flight data.');
        } finally {
            setLoading(false);
        }
    };

    const bookFlight = (index) => {
        let flight = flights[index];
        const departureDate = flight.itineraries[0].segments[0]?.departure.at;
        const arrivalDate = flight.itineraries[0].segments[0]?.arrival.at;
        const departureISO = departureDate ? new Date(departureDate).toLocaleString() : 'Invalid Date';
        const arrivalISO = arrivalDate ? new Date(arrivalDate).toLocaleString() : 'Invalid Date';

        const query = new URLSearchParams({
            origin,
            destination,
            number,
            departure: departureISO,
            arrival: arrivalISO,
            duration: flight.itineraries[0].duration.slice(2, 7),
            price: price[index],
        });

        router.push(`/bookflights?${query.toString()}`);
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

            <div className="bg-white bg-opacity-95 shadow-xl mt-10 w-7/12 rounded-3xl p-8 relative z-10">
                <h1 className="text-4xl font-bold text-center text-gray-800 mb-5">Book Your Flights</h1>
                <div className='flex gap-20'> {/* Adjusted gap for better layout */}
                    <div className="flex flex-col gap-4 w-full"> {/* Added width for better alignment */}
                        <input
                            type="text"
                            value={origin}
                            onChange={(e) => setOrigin(e.target.value)}
                            placeholder="Origin IATA Code (e.g., BOM)"
                            className="border p-2 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                            required
                        />
                        <input
                            type="text"
                            value={destination}
                            onChange={(e) => setDestination(e.target.value)}
                            placeholder="Destination IATA Code (e.g., DEL)"
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
                            onClick={searchFlights}
                            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300"
                        >
                            Search Flights
                        </button>
                        {loading && <p className="text-blue-500 text-center mt-4">Loading...</p>}
                        {error && <p className="text-red-500 text-center mt-4">{error}</p>}
                        <ul className="mt-6">
                            {flights.map((flight, index) => (
                                <li key={index} className="border border-gray-300 rounded-lg shadow-md p-4 mb-4">
                                    <h3 className="font-bold text-lg">
                                        Airline: {flight.airline} - {flight.itineraries[0].segments[0].departure.iataCode} to {flight.itineraries[0].segments[0].arrival.iataCode}
                                    </h3>
                                    <p className="text-gray-600">Departure: {new Date(flight.itineraries[0].segments[0].departure.at).toLocaleString()}</p>
                                    <p className="text-gray-600">Arrival: {new Date(flight.itineraries[0].segments[0].arrival.at).toLocaleString()}</p>
                                    <p className="text-gray-600">Duration:
                                        {flight.itineraries[0].duration.slice(2, 7)}</p>
                                    <p className="font-bold">Price: {Math.round(price[index])}</p>
                                    <button
                                        onClick={() => bookFlight(index)}
                                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300">
                                        Book
                                    </button>
                                </li>
                            ))}
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