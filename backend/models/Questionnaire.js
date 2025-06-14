import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  questionText: {
    type: String,
    required: true,
  },
  inputType: {
    type: String,
    enum: ['text', 'number', 'radio', 'checkbox'],
    default: 'text',
  },
  options: [String],
});

const questionnaireSchema = new mongoose.Schema({
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  questions: [questionSchema],
}, { timestamps: true });

const Questionnaire = mongoose.model("Questionnaire", questionnaireSchema);
export default Questionnaire;
