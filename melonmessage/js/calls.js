const API_URL = 'http://localhost:5159';

export async function posts(endpoint, body) {
const token = localStorage.getItem('SessionToken');
    const response = await fetch(`${API_URL}${endpoint}`,{
        method : 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : ''},
        body: JSON.stringify(body) 
    });
    return await response.json();
}

export async function gets(endpoint) {
    try{
        const response = await fetch(`${API_URL}${endpoint}`,{
            method : 'GET',
            headers: {
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : ''},
        });
        return await response.json();
    }catch (error){
        console.error(`erro no ${endpoint}.`);
        return [];
    }
}