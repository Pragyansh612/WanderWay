"use client";
import { useSession, signIn, signOut } from "next-auth/react";
import Lottie from "react-lottie";
import animationData from "../public/animation/Animation - 1728633989124.json";
import Link from "next/link";
import { MdFlightTakeoff } from "react-icons/md";
import { FaTrainSubway, FaHotel } from "react-icons/fa6";
import { PiHandbagFill } from "react-icons/pi";
import Image from "next/image";

export default function Home() {
  const { data: session } = useSession();

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <div className="relative min-h-screen flex justify-center overflow-y-hidden"
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
        overflow: "hidden"
      }}>
        <Image src="/cloud.png" alt="Cloud" width={130} height={110} opacity={0.7} />
      </div>

      {/* Floating Cloud 2 */}
      <div style={{
        position: 'absolute',
        top: '20%',
        right: '10%',
        animation: 'float 6s ease-in-out infinite',
        overflow: "hidden"
      }}>
        <Image src="/cloud.png" alt="Cloud" width={140} height={100} opacity={0.6} />
      </div>

      {/* Floating Cloud 3 */}
      <div style={{
        position: 'absolute',
        bottom: '20%',
        left: '15%',
        animation: 'float 8s ease-in-out infinite',
        overflow: "hidden"
      }}>
        <Image src="/cloud.png" alt="Cloud" width={150} height={120}opacity={0.5} />
      </div>

      {/* Main Content */}
      <div className="bg-white bg-opacity-90 shadow-lg mt-10 h-96 w-10/12 md:w-8/12 lg:w-6/12 rounded-2xl p-5 relative z-10  overflow-y-hidden">
        <div className="text-4xl font-bold text-center text-gray-800 flex gap-2 justify-center">
          Welcome to <h1 className=" text-sky-400">Wander-way</h1>
        </div>

        <div className="flex justify-between gap-10">
          <div className="text-center">
            {session ? <h2 className="text-2xl font-semibold text-sky-600 mt-10">
              Hello {session.user.name}
            </h2> : <h2 className="text-2xl font-semibold text-sky-600 mt-10">
              Hello Wanderer
            </h2>}

            <h2 className="text-2xl font-semibold m-5 mt-5">
              Book Your Next Destination Now
            </h2>
            <div className=" flex gap-5">
              <div className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300 w-full">
                <Link href="/flights" className="flex gap-2 items-center text-center">
                  <MdFlightTakeoff className="text-2xl" />
                  Flights
                </Link>
              </div>
              <div className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300 w-full">
                <Link href="/trains" className="flex gap-2 items-center text-center">
                  <FaTrainSubway className="text-2xl" />
                  Trains
                </Link>
              </div>
            </div>
            <div className=" flex gap-5">
              <div className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300 w-full">
                <Link href="/hotels" className="flex gap-2 items-center text-center">
                  <FaHotel className="text-2xl " />
                  Hotels
                </Link>
              </div>
              <div className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300 w-full">
                <Link href="/trips" className="flex gap-2 items-center text-center">
                  <PiHandbagFill className="text-2xl" />
                  Trips
                </Link>
              </div>
            </div>
          </div>
          <div className="flex justify-center">
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
      `}</style>
    </div>
  );
}
