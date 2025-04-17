import mongoose from "mongoose";
import Grid from "gridfs-stream";
import multer from "multer";
import { GridFsStorage } from "multer-gridfs-storage";

const conn = mongoose.connection;
let gfs, gridFSBucket;

// Initialize GridFS when MongoDB is connected
conn.once("open", () => {
  gridFSBucket = new mongoose.mongo.GridFSBucket(conn.db, { bucketName: "uploads" });
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection("uploads");
});

// Set up storage engine
const storage = new GridFsStorage({
  url: process.env.MONGO_URI,
  file: (req, file) => {
    return {
      filename: `${Date.now()}-${file.originalname}`,
      bucketName: "uploads",
    };
  },
});

const upload = multer({ storage });

export { gfs, gridFSBucket, upload };
