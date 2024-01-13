import process from "node:process";
import path from "node:path";

export const UPLOAD_DIR = path.join(process.cwd(), "temp_upload");
