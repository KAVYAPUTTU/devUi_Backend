import multer from "multer"
//we use multer to store files from user locally
//diskstorage: gives u full controll on storing the files in the disk
const storage = multer.diskStorage({
    //req has all the json data file handles files if there is a file in the request 
    //cb is callback
  destination: function (req, file, cb) {
    //cb-1st parameter is null 2nd is destination folder
    cb(null, './public/temp')
  },
  //filename of saved file
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.originalname)
  }
})

export const upload = multer({ 
    storage: storage 
})
