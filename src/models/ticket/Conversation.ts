import mongoose,{Document,Model,Schema, Types} from 'mongoose'


interface IMessage{
    author:Types.ObjectId
    authorRole: "Admin" | "Employers" 
    content:string
    createdAt?: Date
}

interface IEmployerConversation{
    ticketId:Types.ObjectId
    messages:IMessage[]
    createdAt?: Date
    updatedAt?: Date
}


const MessageSchema = new Schema<IMessage>({
    author:{
        type:Schema.Types.ObjectId,
        required:true,
        refPath:'authorRole',
    },
    authorRole:{
        type:String,
        enum:['Admin','Employers']
    },
    content:{
        type:String,
        required:true
    }
},{timestamps: true})

const ConversationSchema = new Schema<IEmployerConversation>( 
    {
    ticketId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Employer_Tickets',
        required:true
    },
    messages:[MessageSchema]
    
    },{timestamps: true}
)   


export const employer_conversation :Model<IEmployerConversation> = mongoose.models.employer_conversation || mongoose.model('employer_conversation',ConversationSchema)