import dbConnect from '@/lib/Mongodb';
import { NextResponse } from 'next/server';
import { Provider } from '@/models/Provider/Organization';


type RouteContexts = { params: Promise<{ id: string }> };
export async function GET(req: Request, Context: RouteContexts) {
  try {
    await dbConnect();
    const { id } = await Context.params;

    // Find the provider by id and select only the 'portfolio' field
    const provider = await Provider.findById(id).select('portfolio').populate('portfolio');

    if (!provider) {
      return NextResponse.json({ message: 'Not found' }, { status: 400 });
    }
 const filteredPortfolio = provider.portfolio.filter((item: any) => !item.isdelete);
    return NextResponse.json({ message: 'Portfolio', portfolio: filteredPortfolio }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Internal Server Error',error }, { status: 500 });
  }
}

type RouteContext = { params: Promise<{ id: string }> };

export async function PUT(req:Request,Context:RouteContext){
  try{
await dbConnect()
const {id} =await Context.params;
const body = await req.json()
const providers = await Provider.findByIdAndUpdate(id,{...body},{new: true})
if (!providers) {
      return NextResponse.json({ message: 'Update failed' }, { status: 400 });
    }  
      return NextResponse.json({ message: 'Updated',portfolio:providers }, { status: 400 });
}
  catch(error){
    return NextResponse.json({ message: 'Internal Server Error',error }, { status: 500 });

  }
}