import { NextResponse } from 'next/server';
import dbConnect from '../../utils/dbConnect';
import User from '../../models/user';

export async function POST(req) {
    try {
        const { Id, email } = await req.json();

        if (!Id || !email) {
            return NextResponse.json({ error: "Missing Id or email" }, { status: 400 });
        }
        await dbConnect();
        console.log("DB connected");
        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json({ error: "User doesn't exist." }, { status: 404 });
        }
        const tripIndex = user.trips.findIndex(item => item.id === Id);
        if (tripIndex === -1) {
            return NextResponse.json({ error: "Trip not found" }, { status: 404 });
        }
        user.trips.splice(tripIndex, 1);
        await user.save();
        return NextResponse.json({ message: "Trip cancelled successfully!" }, { status: 200 });
    } catch (error) {
        console.error("Error during trip cancellation:", error);

        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
