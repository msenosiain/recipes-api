const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
eval(
  `Grid.prototype.findOne = ${Grid.prototype.findOne
    .toString()
    .replace('nextObject', 'next')}`
);
const crypto = require('crypto');
const multer = require('multer');

const conn = mongoose.connection;
let gfs;

conn.once('open', () => {
  // Init stream
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('images');
});

// Create storage engine
const storage = new GridFsStorage({
  url: process.env.MONGODB_URI,
  options: { useUnifiedTopology: true },
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString('hex') + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: 'images'
        };
        resolve(fileInfo);
      });
    });
  }
});

exports.upload = multer({ storage });

exports.processUpload = (req, res) => {
  res.status(201).json({ image: req.file });
};

exports.view = (req, res) => {
  gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
    if (file) {
      const readstream = gfs.createReadStream(file.filename);
      readstream.pipe(res);
    } else {
      return res.status(404).json({
        status: 'error',
        message: 'Image not found'
      });
    }
  });
};
