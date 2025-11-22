import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    thumbnail : {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    readTime :{
        type: String,
        required: true,
    },
    view : {
        type: Number,
        default: 0,
    },
    tags : [{
        type: String,
    }],
    author : {
        type: String,
        required: true,
    },
    category : {
        type: String,
        required: true,
    },
},{ timestamps: true });
const Blog = mongoose.models.Blog || mongoose.model('Blog', blogSchema);
export default Blog;