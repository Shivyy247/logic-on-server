import mongoose, { Schema } from "mongoose";

const subscriptionSchema = new Schema({
  subsciber: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  channel: {
    type: Schema.Types.ObjectId,
    ref: "User",
    },
  
     
  
});

export const Subscription = mongoose.model("Subsription", subscriptionSchema)