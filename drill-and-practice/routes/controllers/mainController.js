import * as topicsService from "../../services/topicsService.js";
import * as questionService from "../../services/questionService.js";
import * as answerService from "../../services/answerService.js";

const showMain = async ({ render }) => {
  const errorData = {
    validationErrors: [],
    invalidName: "",
  };

  errorData.validationErrors.push("uugabuuga errror");

  const data = {
    errorData,
    amount_of_topics: await topicsService.statistics(),
    amount_of_questions: await questionService.statistics(),
    amount_of_question_answers: await answerService.statistics(),
  };
  render("main.eta", data);
};

export { showMain };
