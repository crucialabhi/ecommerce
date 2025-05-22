import multer from 'multer';


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      if(req.path === '/submitReview'){
        return cb(null, "./public/images/reviewImages");
      }else{
        return cb(null, "./public/images/uploads");
      }
    },
    filename: function (req, file, cb) {
      return cb(null, `${Date.now()}-${file.originalname}`);
    },
  });


//Use this upload in form when you don't have to take the images from the user
export const upload = multer({storage: storage});

const fileFilter = (req, file, cb) => {
console.log(file.mimetype);

  if (!(file.mimetype.includes('png') || file.mimetype.includes('jpeg') || file.mimetype.includes('jpg'))) {
    cb(new Error('Invalid file type, only PNG, JPG and JPEG is allowed!'), false);
  } else {
    cb(null, true);
  }
};

//Use this upload in form when you have to take the images from the user
export const uploadImages = multer({storage: storage,fileFilter ,limits: {fileSize: 10 * 1024 * 1024} }).array('productImgs',5);
export const uploadVendorProfileImg = multer({storage: storage, limits: {fileSize: 2 * 1024 * 1024},fileFilter}).single('profileImg');





// //Use this upload in form when you don't have to take the images from the user
// export const upload = multer({storage: storage});