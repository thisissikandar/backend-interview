import XLSX from "xlsx";
import Company from "../models/company.model.js";

const processImport = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file provided" });
    }
    const mode = Number.parseInt(req.body.mode);
    if (isNaN(mode) || mode < 1 || mode > 5) {
      return res.status(400).json({ error: "Invalid import mode" });
    }

    const workbook = XLSX.readFile(req.file.path);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(worksheet);

    // Validate data
    const validatedData = data.filter((row) => {
      return (
        row.email && typeof row.email === "string" && row.email.includes("@")
      );
    });

    if (validatedData.length === 0) {
      return res.status(400).json({ error: "No valid data found in file" });
    }

    let inserted = 0;
    let updated = 0;
    let skipped = 0;

    switch (mode) {
      case 1: // Create New Companies Only
        for (const company of validatedData) {
          const existingCompany = await Company.findOne({
            email: company.email,
          });
          if (!existingCompany) {
            await Company.create(company);
            inserted++;
          } else {
            skipped++;
          }
        }
        break;

      case 2: // Create New and Update Existing (Without Overwrite)
        for (const company of validatedData) {
          const existingCompany = await Company.findOne({
            email: company.email,
          });
          if (!existingCompany) {
            await Company.insertOne(company);
            inserted++;
          } else {
            // Update only empty fields
            const updateFields = {};
            for (const [key, value] of Object.entries(company)) {
              if (
                key !== "email" &&
                (!existingCompany[key] || existingCompany[key] === "")
              ) {
                updateFields[key] = value;
              }
            }

            if (Object.keys(updateFields).length > 0) {
              await Company.updateOne(
                { email: company.email },
                { $set: updateFields }
              );
              updated++;
            } else {
              skipped++;
            }
          }
        }
        break;

      case 3: // Create New and Update Existing (With Overwrite)
        for (const company of validatedData) {
          const existingCompany = await Company.findOne({
            email: company.email,
          });
          if (!existingCompany) {
            await Company.insertOne(company);
            inserted++;
          } else {
            await Company.replaceOne({ email: company.email }, company);
            updated++;
          }
        }
        break;

      case 4: // Update Existing Companies Only (Without Overwrite)
        for (const company of validatedData) {
          const existingCompany = await Company.findOne({
            email: company.email,
          });
          if (existingCompany) {
            // Update only empty fields
            const updateFields = {};
            for (const [key, value] of Object.entries(company)) {
              if (
                key !== "email" &&
                (!existingCompany[key] || existingCompany[key] === "")
              ) {
                updateFields[key] = value;
              }
            }

            if (Object.keys(updateFields).length > 0) {
              await Company.updateOne(
                { email: company.email },
                { $set: updateFields }
              );
              updated++;
            } else {
              skipped++;
            }
          } else {
            skipped++;
          }
        }
        break;

      case 5: // Update Existing Companies Only (With Overwrite)
        for (const company of validatedData) {
          const existingCompany = await Company.findOne({
            email: company.email,
          });
          if (existingCompany) {
            await Company.replaceOne({ email: company.email }, company);
            updated++;
          } else {
            skipped++;
          }
        }
        break;

      default:
        return res.status(400).json({ error: "Invalid import mode" });
    }

    return res.json({
      status: "success",
      inserted,
      updated,
      skipped,
    });
  } catch (error) {
    console.error("Import error:", error);
    return res
      .status(500)
      .json({ status: "error", error: "Failed to process file" });
  }
};

// // Validate all rows in the imported data
// async function validateImportData(data) {
//   const validData = []
//   const errors = []

//   for (let i = 0; i < data.length; i++) {
//     const row = data[i]
//     const rowNumber = i + 2 // +2 because of header row and 0-indexing

//     // Basic email validation
//     if (!row.email || typeof row.email !== "string" || !row.email.includes("@")) {
//       errors.push({
//         row: rowNumber,
//         message: "Missing or invalid email address",
//         data: row,
//       })
//       continue
//     }

//     // Validate against schema
//     const { isValid, error } = validateCompanyData(row)

//     if (!isValid) {
//       errors.push({
//         row: rowNumber,
//         message: error,
//         data: row,
//       })
//       continue
//     }

//     validData.push(row)
//   }

//   return { validData, errors }
// }

// // Process data according to the selected import mode
// async function processDataByMode(mode, validatedData) {
//   let inserted = 0
//   let updated = 0
//   let skipped = 0

//   switch (mode) {
//     case 1: // Create New Companies Only
//       for (const company of validatedData) {
//         const existingCompany = await Company.findOne({ email: company.email })
//         if (!existingCompany) {
//           await Company.create(company)
//           inserted++
//         } else {
//           skipped++
//         }
//       }
//       break

//     case 2: // Create New and Update Existing (Without Overwrite)
//       for (const company of validatedData) {
//         const existingCompany = await Company.findOne({ email: company.email })
//         if (!existingCompany) {
//           await Company.create(company)
//           inserted++
//         } else {
//           // Update only empty fields
//           const updateFields = {}
//           for (const [key, value] of Object.entries(company)) {
//             if (key !== "email" && (!existingCompany[key] || existingCompany[key] === "")) {
//               updateFields[key] = value
//             }
//           }

//           if (Object.keys(updateFields).length > 0) {
//             await Company.updateOne({ email: company.email }, { $set: updateFields })
//             updated++
//           } else {
//             skipped++
//           }
//         }
//       }
//       break

//     case 3: // Create New and Update Existing (With Overwrite)
//       for (const company of validatedData) {
//         const existingCompany = await Company.findOne({ email: company.email })
//         if (!existingCompany) {
//           await Company.create(company)
//           inserted++
//         } else {
//           await Company.findOneAndReplace({ email: company.email }, company, { new: true })
//           updated++
//         }
//       }
//       break

//     case 4: // Update Existing Companies Only (Without Overwrite)
//       for (const company of validatedData) {
//         const existingCompany = await Company.findOne({ email: company.email })
//         if (existingCompany) {
//           // Update only empty fields
//           const updateFields = {}
//           for (const [key, value] of Object.entries(company)) {
//             if (key !== "email" && (!existingCompany[key] || existingCompany[key] === "")) {
//               updateFields[key] = value
//             }
//           }

//           if (Object.keys(updateFields).length > 0) {
//             await Company.updateOne({ email: company.email }, { $set: updateFields })
//             updated++
//           } else {
//             skipped++
//           }
//         } else {
//           skipped++
//         }
//       }
//       break

//     case 5: // Update Existing Companies Only (With Overwrite)
//       for (const company of validatedData) {
//         const existingCompany = await Company.findOne({ email: company.email })
//         if (existingCompany) {
//           await Company.findOneAndReplace({ email: company.email }, company, { new: true })
//           updated++
//         } else {
//           skipped++
//         }
//       }
//       break

//     default:
//       throw new Error("Invalid import mode")
//   }

//   return { inserted, updated, skipped }
// }

export { processImport };
