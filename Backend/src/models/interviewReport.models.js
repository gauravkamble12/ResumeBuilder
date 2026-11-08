const mongoose =require('mongoose')

/**
 * -Job Description Schema
 * -Resume text 
 * -self description
 * -technical questions:[{
 *                  question:"",
 *                  intention:"",
 *                  answer:""
 *              }]
 * -Behavioral Questions:
 *                  [{
 *                  question:"",
 *                  intention:"",
 *                  answer:""
 *              }]
 * -Skill gaps:[
 *          {
 *              skill:"",
 *              severity:{
 *                  type:String,
 *                  enum:["low","medium","high"]
 *              }
 *          }]
 * -Preparation plan :[{
 *          day:nnumber,
 *          focus:String,
 *          tasks=[String]
 *      }]
 */
const technicalQuestionSchema=new mongoose.Schema({
    question:{
        type:String,
        required:[true,"Technical question is required"]
    },
    intention:{
        type:String,
        required:[true,"intention is required"]
    },
    answer:{
        type:String,
        required:[true,"Answer is required"]
    }
},{
    _id:false
})

const behavioralQuestionSchema=new mongoose.Schema({
question:{
        type:String,
        required:[true,"Technical question is required"]
    },
    intention:{
        type:String,
        required:[true,"intention is required"]
    },
    answer:{
        type:String,
        required:[true,"Answer is required"]
    }
},{
    _id:false
})

const skillGapSchema=new mongoose.Schema({
    skill:{
        type:String,
        required:[true,"Skill is required"]
    },
    severity:{
        type:String,
        enum:["low","medium","high"],
        required:[true,"severity is required"]
    }
},{
    _id:false
})

const preparationPlanSchema=new mongoose.Schema({
    day:{
        type:Number,
        required:[true,"Day is Required"]
    },
    focus:{
        type:String,
        required:[true,"Focus is Required"]
    },
    tasks:{
        type:[String],
        required:[true,"Task is required"]
    }
})

const interviewReportSchema=new mongoose.Schema({
    jobDescription:{
        type:String,
        required:[true,"description is required"],

    },
    resume:{
        type:String
    },
    selfDescription:{
        type:String
    },
    matchScore:{
        type:Number,
        min:0,
        max:100,
    },
    technicalQuestions:[technicalQuestionSchema],
    behavioralQuestions:[behavioralQuestionSchema],
    skillGaps:[skillGapSchema],
    preparationPlan:[preparationPlanSchema],
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"users"
    },
    title:{
        type:String,
        required:[true,"title is required"]
    }
},{
    timestamps:true
})

const interviewReportModel=mongoose.model("interviewReport",interviewReportSchema)
module.exports=interviewReportModel;