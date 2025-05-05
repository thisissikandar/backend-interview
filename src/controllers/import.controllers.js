import XLSX from "xlsx";
import csv from "csv-parser";
import fs from "fs";
import Company from "../models/company.model.js";

// const processImport = async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ error: "No file provided" });
//     }
//     const mode = Number.parseInt(req.body.mode);
//     if (isNaN(mode) || mode < 1 || mode > 5) {
//       return res.status(400).json({ error: "Invalid import mode" });
//     }

//     const workbook = XLSX.readFile(req.file.path);
//     const worksheet = workbook.Sheets[workbook.SheetNames[0]];
//     const data = XLSX.utils.sheet_to_json(worksheet);

//     // Validate data
//     const validatedData = data.filter((row) => {
//       return (
//         row.email && typeof row.email === "string" && row.email.includes("@")
//       );
//     });

//     if (validatedData.length === 0) {
//       return res.status(400).json({ error: "No valid data found in file" });
//     }

//     let inserted = 0;
//     let updated = 0;
//     let skipped = 0;

//     switch (mode) {
//       case 1: // Create New Companies Only
//         for (const company of validatedData) {
//           const existingCompany = await Company.findOne({
//             email: company.email,
//           });
//           if (!existingCompany) {
//             await Company.create(company);
//             inserted++;
//           } else {
//             skipped++;
//           }
//         }
//         break;

//       case 2: // Create New and Update Existing (Without Overwrite)
//         for (const company of validatedData) {
//           const existingCompany = await Company.findOne({
//             email: company.email,
//           });
//           if (!existingCompany) {
//             await Company.insertOne(company);
//             inserted++;
//           } else {
//             // Update only empty fields
//             const updateFields = {};
//             for (const [key, value] of Object.entries(company)) {
//               if (
//                 key !== "email" &&
//                 (!existingCompany[key] || existingCompany[key] === "")
//               ) {
//                 updateFields[key] = value;
//               }
//             }

//             if (Object.keys(updateFields).length > 0) {
//               await Company.updateOne(
//                 { email: company.email },
//                 { $set: updateFields }
//               );
//               updated++;
//             } else {
//               skipped++;
//             }
//           }
//         }
//         break;

//       case 3: // Create New and Update Existing (With Overwrite)
//         for (const company of validatedData) {
//           const existingCompany = await Company.findOne({
//             email: company.email,
//           });
//           if (!existingCompany) {
//             await Company.insertOne(company);
//             inserted++;
//           } else {
//             await Company.replaceOne({ email: company.email }, company);
//             updated++;
//           }
//         }
//         break;

//       case 4: // Update Existing Companies Only (Without Overwrite)
//         for (const company of validatedData) {
//           const existingCompany = await Company.findOne({
//             email: company.email,
//           });
//           if (existingCompany) {
//             // Update only empty fields
//             const updateFields = {};
//             for (const [key, value] of Object.entries(company)) {
//               if (
//                 key !== "email" &&
//                 (!existingCompany[key] || existingCompany[key] === "")
//               ) {
//                 updateFields[key] = value;
//               }
//             }

//             if (Object.keys(updateFields).length > 0) {
//               await Company.updateOne(
//                 { email: company.email },
//                 { $set: updateFields }
//               );
//               updated++;
//             } else {
//               skipped++;
//             }
//           } else {
//             skipped++;
//           }
//         }
//         break;

//       case 5: // Update Existing Companies Only (With Overwrite)
//         for (const company of validatedData) {
//           const existingCompany = await Company.findOne({
//             email: company.email,
//           });
//           if (existingCompany) {
//             await Company.replaceOne({ email: company.email }, company);
//             updated++;
//           } else {
//             skipped++;
//           }
//         }
//         break;

//       default:
//         return res.status(400).json({ error: "Invalid import mode" });
//     }

//     return res.json({
//       status: "success",
//       inserted,
//       updated,
//       skipped,
//     });
//   } catch (error) {
//     console.error("Import error:", error);
//     return res
//       .status(500)
//       .json({ status: "error", error: "Failed to process file" });
//   }
// };





// Helper to parse CSV or Excel file
const parseFile = (filePath, fileType) => {
  return new Promise((resolve, reject) => {
    const results = [];
    if (fileType === "csv") {
      fs.createReadStream(filePath)
        .pipe(csv())
        .on("data", (data) => results.push(data))
        .on("end", () => resolve(results))
        .on("error", (err) => reject(err));
    } else if (fileType === "excel") {
      const workbook = XLSX.readFile(filePath);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json(worksheet);
      resolve(data);
    } else {
      reject(new Error("Unsupported file type"));
    }
  });
};

const isValidEmail = (email) => {
  return typeof email === "string" && /^[^@]+@[^@]+\.[^@]+$/.test(email);
};


const getUpdateFields = (existingCompany, newCompany) => {
  const updateFields = {};
  for (const [key, value] of Object.entries(newCompany)) {
    if (key !== "email" && (!existingCompany[key] || existingCompany[key] === "")) {
      updateFields[key] = value;
    }
  }
  return updateFields;
};

const processImport = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file provided" });
    }
    const mode = Number.parseInt(req.body.mode);
    if (isNaN(mode) || mode < 1 || mode > 5) {
      return res.status(400).json({ error: "Invalid import mode" });
    }

    const fileType = req.file.mimetype.includes("csv") ? "csv" : "excel";
    if (!["csv", "excel"].includes(fileType)) {
      return res.status(400).json({ error: "Only CSV or Excel files are supported" });
    }

    // Parse file
    const data = await parseFile(req.file.path, fileType);

    // Validate data
    const validatedData = data.filter((row) => isValidEmail(row.email));
    if (validatedData.length === 0) {
      return res.status(400).json({ error: "No valid data found in file" });
    }

    let inserted = 0;
    let updated = 0;
    let skipped = 0;

    const bulkOps = [];

    for (const company of validatedData) {
      const existingCompany = await Company.findOne({ email: company.email });

      switch (mode) {
        case 1: 
          if (!existingCompany) {
            bulkOps.push({
              insertOne: { document: company },
            });
            inserted++;
          } else {
            skipped++;
          }
          break;

        case 2: // Create New and Update Existing (Without Overwrite)
          if (!existingCompany) {
            bulkOps.push({
              insertOne: { document: company },
            });
            inserted++;
          } else {
            const updateFields = getUpdateFields(existingCompany, company);
            if (Object.keys(updateFields).length > 0) {
              bulkOps.push({
                updateOne: {
                  filter: { email: company.email },
                  update: { $set: updateFields },
                },
              });
              updated++;
            } else {
              skipped++;
            }
          }
          break;

        case 3: // Create New and Update Existing (With Overwrite)
          if (!existingCompany) {
            bulkOps.push({
              insertOne: { document: company },
            });
            inserted++;
          } else {
            bulkOps.push({
              replaceOne: {
                filter: { email: company.email },
                replacement: company,
              },
            });
            updated++;
          }
          break;

        case 4: // Update Existing Companies Only (Without Overwrite)
          if (existingCompany) {
            const updateFields = getUpdateFields(existingCompany, company);
            if (Object.keys(updateFields).length > 0) {
              bulkOps.push({
                updateOne: {
                  filter: { email: company.email },
                  update: { $set: updateFields },
                },
              });
              updated++;
            } else {
              skipped++;
            }
          } else {
            skipped++;
          }
          break;

        case 5: // Update Existing Companies Only (With Overwrite)
          if (existingCompany) {
            bulkOps.push({
              replaceOne: {
                filter: { email: company.email },
                replacement: company,
              },
            });
            updated++;
          } else {
            skipped++;
          }
          break;
      }
    }

    // Execute bulk operations
    if (bulkOps.length > 0) {
      await Company.bulkWrite(bulkOps);
    }

    // Clean up uploaded file
    fs.unlinkSync(req.file.path);

    return res.json({
      status: "success",
      inserted,
      updated,
      skipped,
    });
  } catch (error) {
    console.error("Import error:", error);
    return res.status(500).json({
      status: "error",
      error: error.message || "Failed to process file",
    });
  }
};

export { processImport };
