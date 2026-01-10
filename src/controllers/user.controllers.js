import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apierror.js"
import { User } from "../models/user.models.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import {ApiResponse} from "../utils/apiresponse.js"

const registerUser = asyncHandler(async (req, res) => {


  // get user details from frontend
  // validation - not empty
  // check if user already exists
  // username and email
  // check for images, check for avatar
  // upload them to cloudinary, avatar
  // create user object - create entry in db
  // remove password and refresh token field from response
  // check for user creation
  // return response

  console.log("FILES:", req.files);
  console.log("BODY:", req.body);

  const { fullname, email, username, password } = req.body;
  console.log("email: ", email);

  if (
    [fullname, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required!!");
  }
  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "User with email or username already exist!!");
  }

  console.log(req.files);

  // 1. Safe extraction using optional chaining
  const avatarLocalPath = req.files?.avatar?.[0]?.path;

  // Check coverimage safely (it might be optional)
  let coverimageLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.coverimage) &&
    req.files.coverimage.length > 0
  ) {
    coverimageLocalPath = req.files.coverimage[0].path;
  }

  // 2. Validation
  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }

  // 3. Upload to Cloudinary
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverimage = coverimageLocalPath
    ? await uploadOnCloudinary(coverimageLocalPath)
    : null;

  if (!avatar) {
    throw new ApiError(400, "Failed to upload avatar to Cloudinary");
  }

  const user = await User.create({
    fullname,
    avatar: avatar.url,
    coverimage: coverimage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });

  const createduser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createduser) {
    throw new ApiError(500, "Something went wrong while registering the user ");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createduser, "user registered successfully !!"));
});



export {
    registerUser
}