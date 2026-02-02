fetchData()

async function fetchData() {
    
    try{
        const response = await fetch("http://localhost:8080/utilizadores");

        if(!response.ok){
            throw new Error("nao foi possivel encontrar o atributo");
        }

        const data = await response.json();
        console.log(data);
    }
    catch(error){
        console.error(error);
    }

}