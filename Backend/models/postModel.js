import mongoose, { Schema } from "mongoose";

const postSchema = mongoose.Schema({
    postedBy :{
        type: mongoose.Schema.Types.ObjectId,
        ref : 'User',
        require : true
    },
    text :{
        type: String,
        maxlength: 500
    },
    img:{
        type : String
    },
    likes: {
        // array of user ids
        type: [mongoose.Schema.Types.ObjectId],
        ref: "User",
        default: [],
    },
    replies :[
        {
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true,
            },
            text: {
                type: String,
                required: true,
            },
            userProfilePic: {
                type: String,
            },
            username: {
                type: String,
            },
            likes:{
                type: [mongoose.Schema.Types.ObjectId],
                ref: "User",
                default: [],
            },
            commentsOn : Date,
        },
    ],

},
{
    timestamps: true,
}
);

const Post = mongoose.model("Post", postSchema);

export default Post;