


export async function GetJob(id:string){
try{
const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/jobs/${id}`,
  {
    headers:{
      'Content-Type' : 'application/json'
    },
     cache:'no-store'
  }
)
if(!res.ok){
  return null
}
return  res.json()
}
catch(error){
console.error('Fetch error:', error);
    return null;
}}