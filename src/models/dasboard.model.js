import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const dataSchema = new mongoose.Schema(
  {
    end_year: String,
    intensity: Number,
    sector: String,
    topic: String,
    insight: String,
    url: String,
    region: String,
    start_year: String,
    impact: String,
    added: String,
    published: String,
    country: String,
    relevance: Number,
    pestle: String,
    source: String,
    title: String,
    likelihood: Number,
  },
  { collection: "dashboardData" } 
);
dataSchema.plugin(mongooseAggregatePaginate)

export const Dashboard =  mongoose.model("dashboardData", dataSchema);
