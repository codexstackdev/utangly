
const headers = {
    "Content-Type" : "application/json"
}

const handleError = (error:any)=>{
    return error instanceof Error ? error.message : "Server Unreachable";
}


//auth
export async function register(fullName:string, email:string, password:string){
    try {
        const req = await fetch("/api/v1/auth/register", {
            method: "POST",
            headers,
            body: JSON.stringify({fullName, email, password})
        });
        if(!req.ok) return { success: false, message: "Something went wrong"}
        const data = await req.json();
        return data;
    } catch (error) {
        return { success: false, message: handleError(error)}
    }
}

export async function login(email:string, password:string){
    try {
        const req = await fetch("/api/v1/auth/login", {
            method: "POST",
            headers,
            body: JSON.stringify({email, password})
        });
        const data = await req.json();
        if(!data.success) return { success: false, message: data.message}
        return data;
    } catch (error) {
        return { success: false, message: handleError(error)}
    }
}
//end of auth