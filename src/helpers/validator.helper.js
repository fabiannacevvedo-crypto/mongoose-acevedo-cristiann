import { matchedData } from "express-validator";

export const getValidatedData = (req, options = {}) => {
  return matchedData(req, { locations: ["body", "params", "query"], ...options });
};
