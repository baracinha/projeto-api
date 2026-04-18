const API_URL = 'http://localhost:5159';

export async function posts(endpoint, body) {
const token = localStorage.getItem('SessionToken');
    const headers = {
        'Content-Type': 'application/json'
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(body)
    });
    const data = await response.json();

    console.log('POST enviado:', endpoint);
    console.log('status: ', response.status);
    console.log('dados:', data);

    return data;
}

export async function gets(endpoint) {
    const token = localStorage.getItem('SessionToken');
    try{
        const response = await fetch(`${API_URL}${endpoint}`,{
            method : 'GET',
            headers: {
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : ''},
        });
        if (!response.ok) {
            const errorText = await response.text(); // Get the error message from the server
            console.error(`Server Error (${response.status}):`, errorText);
            return [];
        }
        return await response.json();
    }catch (error){
        console.error(`erro no ${endpoint}.`, error);
        return [];
    }
}