"use client";

import { useState, Suspense } from 'react';
import { useSession } from "next-auth/react";
import Lottie from "react-lottie";
import animationData from "../../public/animation/hotel2.json";
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import Image from "next/image";

function HotelSearchContent() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [modalMessage, setModalMessage] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { data: session } = useSession();
    const [warning, setWarning] = useState(false);
    const [model, setModel] = useState('');

    const searchParams = useSearchParams();
    const origin = searchParams.get('origin');
    const name = searchParams.get('name');
    const from = searchParams.get('from');
    const number = searchParams.get('number');
    const to = searchParams.get('to');
    const price = searchParams.get('price');
    const rating = searchParams.get('rating')

    const router = useRouter()
    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
            preserveAspectRatio: "xMidYMid slice",
        },
    };

    const bookHotel = async () => {
        try {
            setLoading(true);
            const res = await fetch('/api/book', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    type: "Hotel",
                    email: session.user.email,
                    origin,
                    from,
                    to,
                    name,
                    number,
                    rating,
                    price,
                    warning
                }),
            });
            setLoading(false);
            if (res.ok) {
                setModalMessage('Hotel booked successfully!');
                setModel("Close")
                setIsModalOpen(true);
            } else if (res.status === 409) {
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
        setModel("Close")
        router.push('/trips');
    };
    const yesbook = async () => {
        setIsModalOpen(false);
        if (warning) {
            try {
                bookHotel()
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
                <Image src="/cloud.png" alt="Cloud" width={130} height={110} opacity={0.7} />
            </div>
            <div className="absolute top-20 right-10 animate-float-fast">
                <Image src="/cloud.png" alt="Cloud" width={140} height={100} opacity={0.6} />
            </div>
            <div className="absolute bottom-5 left-15 animate-float-slow">
                <Image src="/cloud.png" alt="Cloud" width={150} height={120} opacity={0.5} />
            </div>

            <div className="bg-white bg-opacity-95 shadow-xl mt-10 w-7/12 rounded-3xl p-8 relative z-10 mb-20">

                <h1 className="text-4xl font-bold text-center text-indigo-900 mb-6">Review Your Booking</h1>
                <div className='flex'>
                    <div className="flex flex-col space-y-6">
                        <div className="text-xl text-gray-700">
                            <span className="font-semibold">Hotel Name:</span> {name}
                        </div>
                        <div className="text-xl text-gray-700">
                            <span className="font-semibold">Searched:</span> {origin}
                        </div>
                        <div className="text-xl text-gray-700">
                            <span className="font-semibold">From: {from} → To: {to}</span>
                        </div>
                        <div className="text-xl text-gray-700">
                            <span className="font-semibold">Rating: {rating}</span>
                        </div>
                        <div className="text-xl text-gray-700">
                            <span className="font-semibold">Number of people:</span> {number}
                        </div>
                        <div className="text-xl text-gray-700">
                            <span className="font-semibold">Price: {price}</span>
                        </div>
                        <button
                            onClick={bookHotel}
                            className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-lg font-semibold py-3 rounded-xl shadow-md hover:shadow-lg transform hover:scale-105 transition duration-300"
                        >
                            Confirm Booking
                        </button>
                        {loading && <p className="text-blue-500 text-center">Processing...</p>}
                        {error && <p className="text-red-500 text-center">{error}</p>}
                    </div>
                    <div className="relative bottom-10 p-4 scale-150 mt-24 ml-20">
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
                            Close
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

export default function HotelSearch() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <HotelSearchContent />
        </Suspense>
    );
}