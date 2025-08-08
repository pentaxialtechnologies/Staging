
export async function GetJobCount(){
try{
 const baseURL = process.env.NEXT_PUBLIC_BASE_URL
    const res = await fetch(`${baseURL}/api/auth/jobs`,{method:'GET'})
    if(!res.ok){
        return null
    }
const response = await res.json()
console.log(response.jobs,'count jobs');

return response.jobs
}
catch(error){
    console.error(error);
    
}
}