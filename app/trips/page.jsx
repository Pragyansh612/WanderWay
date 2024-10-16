"use client";

import { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";
import Lottie from "react-lottie";
import animationData from "../../public/animation/trip.json";

export default function Page() {
    const { data: session } = useSession();
    const [trips, setTrips] = useState([]);
    const [modalMessage, setModalMessage] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
            preserveAspectRatio: "xMidYMid slice",
        },
    };

    useEffect(() => {
        const fetchData = async () => {
            if (session) {
                try {
                    const res = await fetch(`/api/trips?email=${session.user.email}`);
                    if (!res.ok) throw new Error('Failed to fetch data');
                    const data = await res.json();
                    setTrips(data || []);
                } catch (err) {
                    setError(err.message);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchData();
    }, [session]);

    const cancel = async (index) => {
        try {
            let trip = trips[index]
            const res = await fetch('/api/cancel', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    Id: trip.id,
                    email: session.user.email,
                }),
            });
            if (res.ok) {
                setModalMessage('Trip Cancelled successfully!');
                setIsModalOpen(true);
            } else {
                const data = await res.json();
                setModalMessage(data.error || 'Something went wrong');
                setIsModalOpen(true);
            }
        } catch (error) {
            setLoading(false);
            setModalMessage('An error occurred during cancelling');
            setIsModalOpen(true);
        }
    }

    const closeModal = () => {
        setIsModalOpen(false);
    }

    return (
        <div className="relative min-h-screen flex flex-col items-center overflow-hidden bg-gradient-to-br from-blue-200 to-indigo-300">
            <div className="absolute top-10 left-5 animate-float-slow">
                <img src="/cloud.png" alt="Cloud" className="h-32 opacity-70" />
            </div>
            <div className="absolute top-20 right-10 animate-float-fast">
                <img src="/cloud.png" alt="Cloud" className="h-28 opacity-60" />
            </div>
            <div className="absolute bottom-0 left-15 animate-float-slow">
                <img src="/cloud.png" alt="Cloud" className="h-28 opacity-50" />
            </div>

            <div className="bg-white bg-opacity-95 shadow-xl w-10/12 mb-20 rounded-3xl p-8 relative z-10 mt-10 ">
                {session ? (
                    <div>
                        <h1 className="text-4xl font-bold text-center text-indigo-900 mb-6">Hey {session.user.name}, Here are your Trips</h1>
                        <div className=' flex justify-between'>
                            <div>
                                {loading ? (
                                    <p className="text-center">Loading trips...</p>
                                ) : error ? (
                                    <p className="text-red-500 text-center">{error}</p>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        {trips.length > 0 ? (
                                            trips.map((trip, index) => (
                                                <div key={index} className="bg-gray-100 p-4 rounded-lg shadow-md m-5 w-72">
                                                    <h2 className="text-xl font-semibold text-indigo-800">Trip #{index + 1}</h2>
                                                    {trip.type === "Flight" ? (
                                                        <div>
                                                            <p><strong>Type:</strong> {trip.type}</p>
                                                            <p><strong>From:</strong> {trip.origin}</p>
                                                            <p><strong>To:</strong> {trip.destination}</p>
                                                            <p><strong>Departure:</strong> {trip.departure}</p>
                                                            <p><strong>Arrival:</strong> {trip.arrival}</p>
                                                            <p><strong>Duration:</strong> {trip.duration} hours</p>
                                                            <p><strong>Number of People:</strong> {trip.number}</p>
                                                            <p><strong>Price Paid:</strong> ₹{Math.round(trip.price)}</p>
                                                            <button
                                                                onClick={() => cancel(index)}
                                                                className="bg-red-500 mt-2 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-300">
                                                                Cancel Trip
                                                            </button>
                                                        </div>
                                                    ) : <div>
                                                        {trip.type === "Train" ? (<div>
                                                            <p><strong>Type:</strong> {trip.type}</p>
                                                            <p><strong>Train:</strong> {trip.Name} {trip.num}</p>
                                                            <p><strong>From:</strong> {trip.origin} <strong>To:</strong> {trip.destination} </p>
                                                            <p><strong>Date:</strong> {trip.departureDate}</p>
                                                            <p><strong>Arrive Time:</strong> {trip.arriveTime.slice(0, 6)}</p>
                                                            <p><strong>Depart Time:</strong> {trip.departTime}</p>
                                                            <p><strong>Total Nights:</strong> {trip.arriveTime.slice(7)}</p>
                                                            <p><strong>Number of People:</strong> {trip.passengers}</p>
                                                            <button
                                                                onClick={() => cancel(index)}
                                                                className="bg-red-500 mt-2 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-300">
                                                                Cancel Trip
                                                            </button>
                                                        </div>) : (
                                                            <div>
                                                                <p><strong>Type:</strong> {trip.type}</p>
                                                                <p><strong>Hotel:</strong> {trip.name}</p>
                                                                <p><strong>City:</strong> {trip.origin}</p>
                                                                <p><strong>Check In:</strong> {trip.from} <strong>Check Out:</strong> {trip.to} </p>
                                                                <p><strong>Rating:</strong> {trip.rating}</p>
                                                                <p><strong>Number of People:</strong> {trip.passengers}</p>
                                                                <p><strong>Price:</strong> {trip.price}</p>
                                                                <button
                                                                    onClick={() => cancel(index)}
                                                                    className="bg-red-500 mt-2 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-300">
                                                                    Cancel Trip
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                    }
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-xl font-semibold text-indigo-800">No Trips</div>
                                        )}
                                    </div>

                                )}
                            </div>
                            <div className="flex justify-center mt-6">
                                <Lottie options={defaultOptions} height={250} width={250} />
                            </div>
                        </div>
                    </div>
                ) : (
                    <div>
                        <h1 className="text-4xl font-bold text-center text-indigo-900 mb-6">Please login to see your trips</h1>
                    </div>
                )}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white rounded-lg p-6 shadow-lg max-w-sm">
                        <h2 className="text-xl font-bold text-center mb-4">{modalMessage}</h2>
                        <button
                            onClick={closeModal}
                            className="w-full bg-blue-500 text-white font-semibold py-2 rounded"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}

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

                .animate-float-slow {
                    animation: float 8s ease-in-out infinite;
                }

                .animate-float-fast {
                    animation: float 6s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
}
