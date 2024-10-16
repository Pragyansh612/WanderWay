import axios from 'axios';
import { NextResponse } from 'next/server';

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const cityCode = searchParams.get('origin');
    const checkInDate = searchParams.get('from');
    const checkOutDate = searchParams.get('to');
    const adults = searchParams.get('number');

    const formatDate = (dateValue) => {
        const date = new Date(dateValue);
        const year = date.getFullYear();
        const month = ('0' + (date.getMonth() + 1)).slice(-2);
        const day = ('0' + date.getDate()).slice(-2);

        return `${year}-${month}-${day}`;
    };

    const formattedCheckIn = formatDate(checkInDate);
    const formattedCheckOut = formatDate(checkOutDate);

    const SERP_API_KEY = '389670b5878cb65b7d0b1b5a2f47d6229bf4fae5a1904b272e05df3b4b72690c';

    try {
        const url = 'https://serpapi.com/search.json';

        const response = await axios.get(url, {
            params: {
                engine: 'google_hotels',
                q: cityCode,
                check_in_date: formattedCheckIn, 
                check_out_date: formattedCheckOut,
                adults: adults,
                currency: 'INR',
                gl: 'in',
                hl: 'en',
                api_key: SERP_API_KEY,
            },
        });

        return NextResponse.json(response.data);
    } catch (error) {
        console.error('Full error object:', error);
        console.error('Error response:', error.response?.data);
        console.error('Error request:', error.request);
        console.error('Error config:', error.config);

        if (error.response?.status === 400) {
            return NextResponse.json(
                {
                    message: 'Bad request. Please check your search parameters.',
                    details: error.response.data,
                },
                { status: 400 }
            );
        }

        return NextResponse.json(
            {
                message: 'Error fetching hotel data',
                error: error.message,
            },
            { status: 500 }
        );
    }
}
