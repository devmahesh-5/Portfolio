import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    slug: {
        type: String,
        unique: true,
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
}, { timestamps: true });

// Create slug from title
blogSchema.pre('save', function(next) {
    if (this.isModified('title')) {
        this.slug = this.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
    }
    next();
});

const Blog = mongoose.models.Blog || mongoose.model('Blog', blogSchema);
export default Blog;