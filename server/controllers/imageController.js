const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// module.exports = { cloudinary };

const uploadImage = async (req, res) => {
  try {
    const file = JSON.parse(req.body.data);
    const base64file = file.file.file;
    var name = file.file.name;
    name = name.substring(0, name.indexOf("."));

    const uploadedResponse = await cloudinary.uploader.upload(base64file, {
      upload_preset: "bike-images",
      public_id: name,
    });
    console.log(uploadedResponse);
    res.json({ msg: "Response Uploaded" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ err: "Response not uploaded" });
  }
};

const getImages = async (req, res) => {
  const { resources } = await cloudinary.search
    .expression("folder:bike-images")
    .sort_by("created_at")
    .max_results(500)
    .execute();
  const publicIds = resources.map((file) => file.public_id);
  res.send(publicIds);
};

const getSignature = async (req, res) => {
  const { public_id } = req.query;
  const timestamp = Math.round(new Date().getTime() / 1000);

  const signature = cloudinary.utils.api_sign_request(
    {
      timestamp,
      public_id,
      folder: "bike-images2", // Optional: where to upload
    },
    cloudinary.config().api_secret
  );

  res.json({
    timestamp,
    signature,
    apiKey: cloudinary.config().api_key,
    cloudName: cloudinary.config().cloud_name,
    folder: "bike-images2", // Optional
  });
};

module.exports = { uploadImage, getImages, getSignature };
