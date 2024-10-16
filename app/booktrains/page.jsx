"use client";

import { useState } from 'react';
import { useSession } from "next-auth/react";
import Lottie from "react-lottie";
import animationData from "../../public/animation/train2.json";
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';

export default function FlightSearch() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [modalMessage, setModalMessage] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { data: session } = useSession();
    const [warning, setWarning] = useState(false);
    const [model, setModel] = useState('');

    const searchParams = useSearchParams();
    const origin = searchParams.get('origin');
    const Name = searchParams.get('Name');
    const destination = searchParams.get('destination');
    const num = searchParams.get('num');
    const passengers = searchParams.get('passengers');
    const departureDate = searchParams.get('departureDate');
    const arriveTime = searchParams.get('arriveTime');
    const departTime = searchParams.get('departTime');

    const router = useRouter()
    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
            preserveAspectRatio: "xMidYMid slice",
        },
    };

    const bookTrain = async () => {
        try {
            setLoading(true);
            const res = await fetch('/api/book', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    type: "Train",
                    email: session.user.email,
                    origin,
                    destination,
                    Name,
                    num,
                    arriveTime,
                    departTime,
                    passengers,
                    departureDate,
                    warning
                }),
            });

            setLoading(false);
            if (res.ok) {
                setModalMessage('Train booked successfully!');
                setIsModalOpen(true);
            } else if(res.status === 409) {
                const data = await res.json();
                setModalMessage(data.error || 'Something went wrong');
                setModel("Yes")
                setWarning(true)
                setIsModalOpen(true);
            } else {
                const data = await res.json();
                setModel("Close")
                setModalMessage(data.error || 'Something went wrong');
                setIsModalOpen(true);
            }
        } catch (error) {
            setLoading(false);
            setModel("Close")
            setModalMessage('An error occurred during booking');
            setIsModalOpen(true);
        }
    }

    const closeModal = async () => {
        setIsModalOpen(false);
        router.push('/trips');
    };
    const yesbook = async () => {
        setIsModalOpen(false);
        if (warning) {
            try {
                bookTrain()
                setWarning(false)
            } catch (error) {
                setLoading(false);
                setModel("Close")
                setModalMessage('An error occurred during booking');
                setIsModalOpen(true);
            }
        } else {
            router.push('/trips');
        }
    }
    const nobook = () => {
        setIsModalOpen(false);
    }

    return (
        <div className="relative min-h-screen flex flex-col items-center overflow-hidden bg-gradient-to-br from-blue-200 to-indigo-300">
            {/* Clouds and background */}
            <div className="absolute top-10 left-5 animate-float-slow">
                <img src="/cloud.png" alt="Cloud" className="h-32 opacity-70" />
            </div>
            <div className="absolute top-20 right-10 animate-float-fast">
                <img src="/cloud.png" alt="Cloud" className="h-28 opacity-60" />
            </div>
            <div className="absolute bottom-5 left-15 animate-float-slow">
                <img src="/cloud.png" alt="Cloud" className="h-28 opacity-50" />
            </div>

            <div className="bg-white bg-opacity-95 shadow-xl mt-10 w-7/12 rounded-3xl p-8 relative z-10 mb-10">
                <h1 className="text-4xl font-bold text-center text-indigo-900 mb-6">Review Your Booking</h1>
                <div className='flex'>
                    <div className="flex flex-col space-y-6">
                        <div className="text-xl text-gray-700">
                            <span className="font-semibold">Name:</span> {Name}
                        </div>
                        <div className="text-xl text-gray-700">
                            <span className="font-semibold">Train Number:</span> {num}
                        </div>
                        <div className="text-xl text-gray-700">
                            <span className="font-semibold">From: {origin} → To: {destination}</span>
                        </div>
                        <div className="text-xl text-gray-700">
                            <span className="font-semibold">Date: {departureDate}</span>
                        </div>
                        <div className="text-xl text-gray-700">
                            <span className="font-semibold">Arrival Time: {arriveTime.slice(0, 5)} | Departure Time:{" "}
                                {departTime}</span>
                        </div>
                        <div className="text-xl text-gray-700">
                            <span className="font-semibold">Total Nights: {arriveTime.slice(7)}</span>
                        </div>
                        <div className="text-xl text-gray-700">
                            <span className="font-semibold">Number of passengers:</span> {passengers}
                        </div>
                        <button
                            onClick={bookTrain}
                            className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-lg font-semibold py-3 rounded-xl shadow-md hover:shadow-lg transform hover:scale-105 transition duration-300"
                        >
                            Confirm Booking
                        </button>
                        {loading && <p className="text-blue-500 text-center">Processing...</p>}
                        {error && <p className="text-red-500 text-center">{error}</p>}
                    </div>
                    <div className="relative bottom-10 p-4 scale-150">
                        <Lottie options={defaultOptions} height={200} width={200} />
                    </div>
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white rounded-lg p-6 shadow-lg max-w-sm">
                        <h2 className="text-xl font-bold text-center mb-4">{modalMessage}</h2>
                        {model === "Close" ? <button
                            onClick={closeModal}
                            className="w-full bg-blue-500 text-white font-semibold py-2 rounded"
                        >
                            {model}
                        </button> :
                            <div className="flex gap-5">
                                <button
                                    onClick={yesbook}
                                    className="w-full bg-blue-500 text-white font-semibold py-2 rounded"
                                >
                                    Yes
                                </button>
                                <button
                                    onClick={nobook}
                                    className="w-full bg-blue-500 text-white font-semibold py-2 rounded"
                                >
                                    No
                                </button>
                            </div>
                        }
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
