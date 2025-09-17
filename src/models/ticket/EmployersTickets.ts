import mongoose,{Document,Model,Schema,Types} from "mongoose";

interface ITicket extends Document {
    ticketId:string
    ticketname :string
    priority_status:string
    ticket_type:string
    ticket_description:string
    userId:Types.ObjectId
    ticket_status:string
}

const TicketSchema = new Schema<ITicket>({
    ticketId:{
        type:String,
        index:true
    }
    ,
    ticketname:{
        type:String,
        required:true
    },
    priority_status:{
        type:String,
        required:true
    },
    ticket_type:{
        type:String,
        required:true
    },
    ticket_description:{
        type:String,
        required:true
    },
    ticket_status:{
    type:String,
    default:'Open'
    },
    userId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'Employers',
            required:true
        },
},{timestamps: true})

TicketSchema.pre('save',async function(next){
    if(this.isNew){
        const Prefix = 'TICK';
        const count = await mongoose.models.Employer_Tickets.countDocuments()
        const sequence = String(count+1).padStart(5,'0')
        this.ticketId = `${Prefix}-${sequence}`
    }
    next()
})

export const Employer_Tickets : Model<ITicket> = mongoose.models.Employer_Tickets || mongoose.model<ITicket>('Employer_Tickets',TicketSchema)