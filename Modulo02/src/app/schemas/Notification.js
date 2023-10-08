import mongoose, { mongo } from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      requerid: true,
    },
    user: {
      type: Number,
      require: true,
    },
    read: {
      type: Boolean,
      require: true,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Notification', notificationSchema);
