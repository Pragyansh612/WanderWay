import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '../../utils/dbConnect'; 
import User from '../../models/user';

export async function POST(req) {
    try {
        const { name, email, password } = await req.json();

        if (!name || !email || !password) {
            return NextResponse.json({ error: "All fields are required." }, { status: 400 });
        }
        await dbConnect();
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ error: "User already exists." }, { status: 400 });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
        });
        await newUser.save();

        return NextResponse.json({ message: "User created successfully!" }, { status: 201 });
    } catch (error) {
        console.error("Error during user creation:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
