/**
 * ImageKit Upload Script
 *
 * Run this script to upload all images from client/public/images to ImageKit
 *
 * Usage:
 *   node scripts/upload-to-imagekit.js
 *
 * Prerequisites:
 *   - npm install imagekit
 *   - Set environment variables: IMAGEKIT_PUBLIC_KEY, IMAGEKIT_PRIVATE_KEY, IMAGEKIT_URL_ENDPOINT
 */

import ImageKit from "imagekit";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize ImageKit
const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY || "public_u4RMvhnxcY+obKITfeCIpskSxPM=",
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY || "private_CBO/uXE82pXkbzExkwC+uGJ8n34=",
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT || "https://ik.imagekit.io/vvkwy0zte",
});

const IMAGES_DIR = path.join(__dirname, "..", "client", "public", "images");
const ATTACHED_ASSETS_DIR = path.join(__dirname, "..", "attached_assets");

// Supported image extensions
const SUPPORTED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg"];

async function uploadImage(filePath, fileName) {
  try {
    const fileBuffer = fs.readFileSync(filePath);
    const base64File = fileBuffer.toString("base64");

    const response = await imagekit.upload({
      file: base64File,
      fileName: fileName,
      folder: "/", // Root folder
      useUniqueFileName: false, // Keep original filename
      overwriteFile: true, // Overwrite if exists
    });

    console.log(`✅ Uploaded: ${fileName}`);
    console.log(`   URL: ${response.url}`);
    return response;
  } catch (error) {
    console.error(`❌ Failed to upload ${fileName}:`, error.message);
    return null;
  }
}

async function uploadDirectory(dirPath, label) {
  console.log(`\n📁 Uploading images from: ${label}`);
  console.log("=".repeat(50));

  if (!fs.existsSync(dirPath)) {
    console.log(`   Directory not found: ${dirPath}`);
    return [];
  }

  const files = fs.readdirSync(dirPath);
  const imageFiles = files.filter((file) => {
    const ext = path.extname(file).toLowerCase();
    return SUPPORTED_EXTENSIONS.includes(ext);
  });

  console.log(`   Found ${imageFiles.length} images\n`);

  const results = [];
  for (const file of imageFiles) {
    const filePath = path.join(dirPath, file);
    const result = await uploadImage(filePath, file);
    if (result) {
      results.push(result);
    }
    // Small delay to avoid rate limiting
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  return results;
}

async function main() {
  console.log("\n🚀 ImageKit Upload Script");
  console.log("=".repeat(50));
  console.log(`URL Endpoint: ${imagekit.options.urlEndpoint}`);

  // Upload images from client/public/images
  const publicResults = await uploadDirectory(IMAGES_DIR, "client/public/images");

  // Upload images from attached_assets
  const assetsResults = await uploadDirectory(ATTACHED_ASSETS_DIR, "attached_assets");

  // Summary
  console.log("\n\n📊 Upload Summary");
  console.log("=".repeat(50));
  console.log(`   Public Images: ${publicResults.length} uploaded`);
  console.log(`   Attached Assets: ${assetsResults.length} uploaded`);
  console.log(`   Total: ${publicResults.length + assetsResults.length} images`);

  // Generate URL mapping
  console.log("\n\n📝 Image URLs");
  console.log("=".repeat(50));

  const allResults = [...publicResults, ...assetsResults];
  allResults.forEach((result) => {
    if (result) {
      console.log(`   ${result.name}: ${result.url}`);
    }
  });

  console.log("\n✅ Upload complete!");
  console.log("\n💡 Next steps:");
  console.log("   1. Update client/src/lib/images.ts with the uploaded URLs");
  console.log("   2. Run npm run build to verify everything works");
  console.log("   3. Deploy to Vercel\n");
}

main().catch(console.error);
