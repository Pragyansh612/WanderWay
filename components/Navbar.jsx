"use client";

import React from 'react';
import { MdFlightTakeoff } from "react-icons/md";
import { FaTrainSubway, FaHotel } from "react-icons/fa6";
import Link from 'next/link';
import { useSession, signIn, signOut } from "next-auth/react";
import { PiHandbagFill } from "react-icons/pi";

const Navbar = () => {
    const { data: session, status } = useSession();

    console.log("Session status:", status);
    console.log("Session data:", session);

    if (status === "loading") {
        return <div>Loading...</div>;
    }

    return (
        <div className="bg-gradient-to-r from-blue-400 via-blue-500 to-indigo-500 
        p-4 flex items-center justify-between shadow-md">
            <h1 className="text-white text-3xl font-bold mx-10">
                <Link href="/">
                    WanderWay
                </Link>
            </h1>

            <ul className="flex gap-10 text-lg text-white mx-14">
                <li className="hover:text-blue-200 transition-colors">
                    <Link href="/flights" className="flex gap-2 items-center">
                        <MdFlightTakeoff className="text-2xl" />
                        Flights
                    </Link>
                </li>
                <li className="hover:text-blue-200 transition-colors">
                    <Link href="/trains" className="flex gap-2 items-center">
                        <FaTrainSubway className="text-2xl" />
                        Trains
                    </Link>
                </li>
                <li className="hover:text-blue-200 transition-colors">
                    <Link href="/hotels" className="flex gap-2 items-center">
                        <FaHotel className="text-2xl " />
                        Hotels
                    </Link>
                </li>
                <li className="hover:text-blue-200 transition-colors">
                    <Link href="/trips" className="flex gap-2 items-center">
                        <PiHandbagFill className="text-2xl" />
                        Trips
                    </Link>
                </li>
                {session ? (
                    <li>
                        <Link
                            href="/"
                            className="bg-indigo-500 text-white px-4 py-2 rounded-md 
                            shadow hover:bg-indigo-600 transition duration-300"
                        >
                            <button onClick={() => signOut()}>Sign out</button>
                        </Link>
                    </li>
                ) : (
                    <li>
                        <Link href="/login" className="bg-indigo-500 text-white px-4 
                        py-2 rounded-md shadow hover:bg-indigo-600 transition duration-300">
                            Login
                        </Link>
                    </li>
                )}
            </ul>
        </div>
    );
};

export default Navbar;
