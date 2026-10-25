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

/** Slashes would let a caller sign uploads outside the bike-images2 folder. */
function isSafeUploadPublicId(value) {
  if (typeof value !== "string") return false;
  const id = value.trim();
  if (!id || id.length > 200) return false;
  return !/[/\\\u0000-\u001f\u007f]/.test(id);
}

const getSignature = async (req, res) => {
  const { public_id } = req.query;
  if (!isSafeUploadPublicId(public_id)) {
    return res.status(400).json({
      error:
        "public_id must be 1-200 characters with no slashes or control characters",
    });
  }
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

/**
 * Parse public_id (with optional folder path) from a Cloudinary delivery URL.
 * Skips transformation segments (contain commas), version prefix, file extension.
 */
function publicIdFromCloudinaryUrl(url) {
  if (!url || typeof url !== "string") return null;
  if (!/cloudinary\.com/i.test(url)) return null;
  const marker = "/upload/";
  const idx = url.indexOf(marker);
  if (idx === -1) return null;
  let rest = url.slice(idx + marker.length).split("?")[0];
  while (rest.length > 0) {
    const slash = rest.indexOf("/");
    const seg = slash === -1 ? rest : rest.slice(0, slash);
    if (seg.includes(",")) {
      rest = rest.slice(seg.length + 1);
    } else {
      break;
    }
  }
  rest = rest.replace(/^v\d+\//, "");
  rest = rest.replace(/\.(jpe?g|png|gif|webp|avif|bmp)$/i, "");
  try {
    return decodeURIComponent(rest);
  } catch {
    return rest;
  }
}

const destroyUpload = async (req, res) => {
  try {
    let publicId =
      typeof req.body?.public_id === "string"
        ? req.body.public_id.trim()
        : "";
    const secureUrl =
      typeof req.body?.secure_url === "string"
        ? req.body.secure_url.trim()
        : "";

    if (!publicId && secureUrl) {
      publicId = publicIdFromCloudinaryUrl(secureUrl) || "";
    }

    if (!publicId) {
      return res
        .status(400)
        .json({ error: "public_id or Cloudinary secure_url required" });
    }

    const nameCfg = cloudinary.config().cloud_name;
    if (
      secureUrl &&
      nameCfg &&
      !secureUrl.includes(`res.cloudinary.com/${nameCfg}/`)
    ) {
      return res
        .status(400)
        .json({ error: "Image URL does not belong to this Cloudinary account" });
    }

    const result = await cloudinary.uploader.destroy(publicId, {
      invalidate: true,
    });

    res.json({ result, public_id: publicId });
  } catch (err) {
    console.error("Cloudinary destroy:", err);
    res.status(500).json({ error: err.message || "Destroy failed" });
  }
};

module.exports = {
  uploadImage,
  getImages,
  getSignature,
  destroyUpload,
};
