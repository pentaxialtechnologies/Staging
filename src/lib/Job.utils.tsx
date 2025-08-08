

export async function GetJob(id:string){
try{
  const baseURL = process.env.NEXT_PUBLIC_BASE_URL
const res = await fetch(`${baseURL}/api/auth/jobs/${id}`,
  {
    headers:{
      'Content-Type' : 'application/json'
    },
     cache:'no-store',
    next: { revalidate: 0 }
  })

if(!res.ok){
  return null
}
const response = await res.json()
console.log('Fetching job from:',response.data );

return  response.data
}
catch(error){
console.error('Fetch error:', error);
    return null;
}}