import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name:        { type: String,  required: true },
    slug:        { type: String,  required: true },
    description: { type: String,  required: true },
    price:       { type: Number,  required: true },
    category:    { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    quantity:    { type: Number,  required: true },
    photo:       { data: Buffer,  contentType: String },
    shipping:    { type: Boolean },

    
    averageRating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount:   { type: Number, default: 0, min: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("Products", productSchema);