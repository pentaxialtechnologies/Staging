import mongoose,{Schema,Model,Document, Types} from 'mongoose'

interface ProposalDoc extends Document {
ProviderId: Types.ObjectId,
description:string,
frequency_type: string,
currency_type:string
amount:string
increase_rate:string
increase_percentage:string
company_profile:string
Candidate_data:[{
    firstname:string
    lastname:string
    skills:string[]
    resume:string
}],
JobId: Types.ObjectId,
}


const ProposalsSchema :Schema<ProposalDoc> = new Schema({
    ProviderId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Provider',
        required: true 
    },
    description:{
        type:String,
        required:true
    },
    frequency_type:{
        type:String,
        required:true
    },
    currency_type:{
        type:String,
        required:true
    },
     amount:{
        type:String,
        required:true
    },
    increase_rate:{
        type:String,
        required:true
    },
    increase_percentage:{
        type:String,
        required:true
    },
    company_profile:{
        type:String,
        required:true
    },
    Candidate_data:[{
    firstname:{
        type:String,
        required:true
    },
    lastname:{
        type:String,
        required:true
    },
    skills:[{
        type:String,
        required:true
    }],
    resume:{
        type:String,
        required:true
    },
    }],
    JobId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Jobs',
        required: true 
    },
})


export const Proposals : Model<ProposalDoc> = mongoose.models.Proposals || mongoose.model<ProposalDoc>('Proposals',ProposalsSchema)