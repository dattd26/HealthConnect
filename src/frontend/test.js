// const cloudinary = require('cloudinary').v2;

// // Cấu hình Cloudinary
// cloudinary.config({
//   cloud_name: 'dohgfj5aa',
//   api_key: '165213187257618',
//   api_secret: 'KMaybRip7wtycaNCf0p5KxT57WA',
// });

// // Upload ảnh
// (async () => {
//     const res = await cloudinary.uploader.upload('D:/OneDrive/Pictures/339458283_196942599802663_373954496859184747_n.jpg', { upload_preset: 'XeCuHue' })
//     console.log(res);
// })();

const brandsAndModels = {
  "motorcycle" : {
       "Honda" : ["Winner X", "Wave", "Dream", "Future", "SH", "Vision"],
       "Yamaha": ["Exciter", "Sirius", "FZ", "Janus", "NVX"]
  },
  "car": {
       "Honda": ["CITY RS", "Civic", "Accord", "Camry"]
  }
};
const x = "motorcycle"
console.log(brandsAndModels.x);