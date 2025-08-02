import { Dashboard } from "../models/dasboard.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { getMongoosePaginationOptions } from "../utils/helper.js";

export const getDashboardData = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    query,
    region,
    sector,
    topic,
    end_year,
    pestle,
    source,
    country,
    city,
    swot,
    sortBy = "createdAt",
    sortType = "desc",
  } = req.query;

  const matchStage = {};
  if (region) matchStage.region = region;
  if (sector) matchStage.sector = sector;
  if (topic) matchStage.topic = topic;
  if (end_year) matchStage.end_year = end_year;
  if (pestle) matchStage.pestle = pestle;
  if (source) matchStage.source = source;
  if (country) matchStage.country = country;
  if (city) matchStage.city = city;
  if (swot) matchStage.swot = swot;
  if (query) matchStage.title = { $regex: query, $options: "i" };

  const dashboardAggregation = Dashboard.aggregate([
    { $match: matchStage },
    {
      $sort: {
        [sortBy]: sortType === "desc" ? -1 : 1,
      },
    },
  ]);

  const dashboardData = await Dashboard.aggregatePaginate(
    dashboardAggregation,
    getMongoosePaginationOptions({
      page,
      limit,
      customLabels: {
        totalDocs: "totalRecords",
        docs: "records",
      },
    })
  );
  const [
    regions,
    sectors,
    topics,
    years,
    pestles,
    sources,
    countries,
    cities,
    swots,
  ] = await Promise.all([
    Dashboard.distinct("region"),
    Dashboard.distinct("sector"),
    Dashboard.distinct("topic"),
    Dashboard.distinct("end_year"),
    Dashboard.distinct("pestle"),
    Dashboard.distinct("source"),
    Dashboard.distinct("country"),
    Dashboard.distinct("city"),
    Dashboard.distinct("swot"),
  ]);
  return res.status(200).json(
    new ApiResponse(
      200,
      {
        filters: {
          regions: regions.filter(Boolean),
          sectors: sectors.filter(Boolean),
          topics: topics.filter(Boolean),
          years: years.filter(Boolean),
          pestles: pestles.filter(Boolean),
          sources: sources.filter(Boolean),
          countries: countries.filter(Boolean),
          cities: cities.filter(Boolean),
          swots: swots.filter(Boolean),
        },
        ...dashboardData,
      },
      "Dashboard data fetched successfully"
    )
  );
});
