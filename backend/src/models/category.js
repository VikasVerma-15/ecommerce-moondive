import mongoose from 'mongoose'

const catergoryschema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true
        },
        slug: {
            type: String,
            required: true,
            unique: true
        },
        image: {
            type: String,
        },

    }, { timestamps: true }
);
export const Category = mongoose.model("Category", catergoryschema);