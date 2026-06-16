const mongoose = require("mongoose");

const followSchema = new mongoose.Schema(
  {
    follower: {
      type: String,
    },
    followee: {
      type: String,
    },
    status:{
      type:String,
      default:"pending",
      // enum btata h ki status bs inme se 3 ho skte h agr koi dusra hua to error throw krega java
      enum:{
        values:["pending","accepted","rejected"],
        message:"status can only be pending,accepted or rejected"
      }
    }
  },
  { timestamps: true },
);
// assures that follower can follow user only one time
// ye ek database rule h ki there can only be one relation between a follower and followee
followSchema.index({ follower: 1, followee: 1 }, { unique: true });

const followModel = mongoose.model("follows", followSchema);

module.exports = followModel;
