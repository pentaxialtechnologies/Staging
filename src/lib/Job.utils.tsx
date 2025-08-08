


export async function GetJob(id:string){
try{
  const baseURL = process.env.NEXT_PUBLIC_BASE_URL
const res = await fetch(`https://s3-staffing-website-ivory.vercel.app/api/auth/jobs/${id}`,
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
const response = await res.json()
console.log('Fetching job from:',response.data );

return  response.data
}
catch(error){
console.error('Fetch error:', error);
    return null;
}}