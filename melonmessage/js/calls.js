const API_URL = 'http://localhost:8080';

export async function posts(endpoint, body) {
    const response = await fetch(`${API_URL}${endpoint}`,{
        method : 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(body) 
    });
    return await response.json();
}

export async function gets(endpoint) {
    try{
        const response = await fetch(`${API_URL}${endpoint}`,{
            method : 'GET',
            headers: {'Content-Type': 'application/json'},
        });
        return await response.json();
    }catch (error){
        console.error(`erro no ${endpoint}.`);
        return [];
    }
}