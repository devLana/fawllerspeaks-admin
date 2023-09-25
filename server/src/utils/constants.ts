import process from "node:process";
import path from "node:path";

export const UUID_REGEX = /\w{8}-\w{4}-\w{4}-\w{4}-\w{12}/;
export const DATE_REGEX = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
export const uploadDir = path.join(process.cwd(), "temp_upload");
