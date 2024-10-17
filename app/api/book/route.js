import { NextResponse } from 'next/server';
import dbConnect from '../../utils/dbConnect';
import User from '../../models/user';

export async function POST(req) {
  const all = "qwertyuiopasdfghjklzxcvbnm1234567890";

  const Idgenerator = () => {
    let num1 = Math.round(Math.random() * 100);
    let id = "";
    for (let i = 0; i < num1; i++) {
      let num2 = Math.floor(Math.random() * all.length);
      id += all[num2];
    }
    return id;
  };

  try {
    const body = await req.json()
    let { type } = body;

    await dbConnect();
    const user = await User.findOne({ email: body.email });

    if (!user) {
      return NextResponse.json({ error: "User doesn't exist." }, { status: 400 });
    }

    let tripData;

    if (type === "Flight") {
      const { email, origin, destination, departure, arrival, duration, price, number, warning } = body;

      if (!email || !departure || !arrival || !duration || !price || !origin || !destination || !number) {
        return NextResponse.json({ error: "All fields are required." }, { status: 400 });
      }
      if (!warning) {
        const trips = await user.trips
        for (let trip of trips) {
          if (trip.origin === origin && trip.destination === destination && trip.arrival === arrival && trip.departure === departure) {
            return NextResponse.json({ error: "You have alreadey booked flight like this, do you want to proceed." }, { status: 409 })
          }
        }
      }
        tripData = {
          id: Idgenerator(),
          type,
          origin,
          destination,
          number,
          departure,
          arrival,
          duration,
          price
      }
    } else if (type === "Train") {
      const { email, origin, destination, Name, num, arriveTime, departTime, passengers, departureDate, warning, price } = body;
      // console.log("flightsssss")
      if (!email || !departureDate || !arriveTime || !departTime || !passengers || !Name || !num || !origin || !destination) {
        return NextResponse.json({ error: "All fields are required." }, { status: 400 });
      }
      if (!warning) {
        const trips = await user.trips
        for (let trip of trips) {
          if (trip.origin === origin && trip.destination === destination && trip.arriveTime === arriveTime && trip.departTime === departTime && trip.departureDate === departureDate) {
            return NextResponse.json({ error: "You have already booked train like this, Do you want to proceed." }, { status: 409 })
          }
        }
      }
      tripData = {
        id: Idgenerator(),
        type,
        origin,
        destination,
        Name,
        num,
        arriveTime,
        departTime,
        passengers,
        departureDate,
        price
      };
    } else if (type === "Hotel") {
      const { email, origin,
        from,
        to,
        name,
        number,
        image,
        rating,
        price, warning } = body;
      // console.log("hotelsss")
      if (!email || !from || !to || !number || !price || !name) {
        return NextResponse.json({ error: "All fields are required." }, { status: 400 });
      }
      if (!warning) {
        const trips = await user.trips
        for (let trip of trips) {
          if (trip.origin === origin && trip.from === from && trip.to === to && trip.name === name) {
            return NextResponse.json({ error: "You have already booked hotel like this, Do you want to proceed." }, { status: 409 })
          }
        }
      }
      tripData = {
        id: Idgenerator(),
        type,
        origin,
        from,
        to,
        name,
        number,
        image,
        rating,
        price
      };
    } else {
      return NextResponse.json({ error: "Invalid trip type." }, { status: 400 });
    }
    // console.log("Trip data before pushing:", tripData);
    user.trips.push(tripData);
    await user.save();

    return NextResponse.json({ message: "Trip created successfully!" }, { status: 201 });
  } catch (error) {
    console.error("Error during trip creation:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}