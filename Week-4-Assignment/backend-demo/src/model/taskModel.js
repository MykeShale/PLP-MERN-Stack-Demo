import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please add a title"],
      trim: true,
    },
    description: {
      type: String,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User",                          
      required: true,
    },
  },
  { timestamps: true }
);


const Task = mongoose.model('Task', taskSchema);
export default Task;
