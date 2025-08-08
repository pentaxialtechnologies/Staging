


export async function GetJob(id:string){
try{
const res = await fetch(`http://localhost:3000/api/auth/jobs/${id}`,
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