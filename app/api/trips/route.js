import { NextResponse } from 'next/server';
import dbConnect from '../../utils/dbConnect';
import User from '../../models/user';

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url); 
        const email = searchParams.get('email'); 

        await dbConnect();
        const user = await User.findOne({ email }).populate('trips');
        if (!user) {
            return NextResponse.json({ error: "User doesn't exist." }, { status: 400 });
        }

        const trips = user.trips;
        return NextResponse.json(trips); 
    } catch (error) {
        console.error("Error occurred:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
