export async function POST(req) {
    const { search } = await req.json();
    const url = 'https://trains.p.rapidapi.com/v1/railways/trains/india';
    const options = {
        method: 'POST',
        headers: {
            'x-rapidapi-key': '252b303942msh3d9651d476de12dp1dbfb7jsna5bcb2ced310',
            'x-rapidapi-host': 'trains.p.rapidapi.com',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ search })
    };

    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        return new Response(JSON.stringify(result), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('Error fetching train data:', error);
        return new Response(JSON.stringify({ error: 'Error fetching train data' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}