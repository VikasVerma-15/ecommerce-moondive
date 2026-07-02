import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },

    description: {
      type: String,
      required: true
    },

    price: {
      type: Number,
      required: true
    },

    discountPrice: {
      type: Number,
      default: 0
    },

    stock: {
      type: Number,
      required: true
    },

    images: [
      {
        type: String
      }
    ],

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true
    },

    isFlashSale: {
      type: Boolean,
      default: false
    },

    flashSaleEndDate: {
      type: Date,
      default: null
    },

    isBestSeller: {
      type: Boolean,
      default: false
    },

    isNewArrival: {
      type: Boolean,
      default: false
    },

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active"
    }
  },
  {
    timestamps: true
  }
);

export const Product=mongoose.model("Product", productSchema);