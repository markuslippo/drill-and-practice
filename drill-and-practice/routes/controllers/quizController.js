import * as topicsService from "../../services/topicsService.js";
import * as questionService from "../../services/questionService.js";
import * as answerService from "../../services/answerService.js";

const showTopics = async ({ render }) => {
  const data = {
    topics: await topicsService.getTopics(),
  };
  render("quiz.eta", data);
};

const randomQuestion = async ({ params, response }) => {
  let qId = await questionService.pickRandomId(params.tId);

  if (qId == -1) {
    response.redirect(`/quiz`);
  } else {
    qId = await questionService.pickRandomId(params.tId);
    response.redirect(`/quiz/${params.tId}/questions/${qId}`);
  }
};

const viewQuizQuestion = async ({ params, render }) => {
  const data = {
    question: await questionService.getQuestionInfo(params.qId),
    answers: await answerService.listAnswers(params.qId),
  };
  render("quizQuestion.eta", data);
};

const chooseAnswer = async ({ params, response, user }) => {
  const true_or_false = await answerService.checkBoolean(params.oId);
  await answerService.addQuizAnswer(user.id, params.qId, params.oId);
  if (true_or_false == true) {
    response.redirect(`/quiz/${params.tId}/questions/${params.qId}/correct`);
  } else {
    response.redirect(`/quiz/${params.tId}/questions/${params.qId}/incorrect`);
  }
};

const correctView = ({ params, render }) => {
  render("correct.eta", { id: params.tId });
};

const incorrectView = async ({ params, render }) => {
  const data = {
    corrects: await answerService.getCorrectAnswers(params.qId),
    id: params.tId,
  };
  render("incorrect.eta", data);
};

export {
  chooseAnswer,
  correctView,
  incorrectView,
  randomQuestion,
  showTopics,
  viewQuizQuestion,
};
