import mongoose from "mongoose";

const companySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    address: { type: String },
    industry: { type: String }, 
    location: { type: String }, 
    phone: { type: String },
  },
  { timestamps: true }
);

const Company = mongoose.model("Company", companySchema);

export default Company;