import * as questionService from "../../services/questionService.js";
import * as answerService from "../../services/answerService.js";
import * as topicsService from "../../services/topicsService.js";

const addQuestionToTopic = async (
  { params, render, request, response, user },
) => {
  const errorData = {
    validationErrors: [],
    invalidName: "",
  };

  const body = request.body({ type: "form" });
  const formValue = await body.value;
  const question_text = formValue.get("question_text");

  const topic_id = params.id;

  if (!question_text || question_text < 1) {
    errorData.validationErrors.push(
      "Question text must have atleast 1 character",
    );
    errorData.invalidName = question_text;

    render("topic.eta", {
      errorData,
      topic: await topicsService.getTopicName(params.id),
      questions: await questionService.listQuestions(params.id),
    });
  } else {
    await questionService.addQuestion(user.id, topic_id, question_text);
    response.redirect(`/topics/${topic_id}`);
  }
};

const listAnswers = async ({ params, render }) => {
  const errorData = {
    validationErrors: [],
    invalidName: "",
  };
  const data = {
    errorData,
    question: await questionService.getQuestionInfo(params.qId),
    answers: await answerService.listAnswers(params.qId),
  };

  render("question.eta", data);
};

const deleteQuestion = async ({ params, response }) => {
  await questionService.deleteQuestion(params.qId);
  response.redirect(`/topics/${params.tId}`);
};

const deleteAnswerFromQuestion = async ({ params, response }) => {
  await answerService.deleteAnswer(params.oId);
  response.redirect(`/topics/${params.tId}/questions/${params.qId}`);
};

const addAnswer = async ({ params, request, response, render }) => {
  const errorData = {
    validationErrors: [],
    invalidName: "",
  };

  const body = request.body({ type: "form" });
  const formValue = await body.value;
  const option_text = formValue.get("option_text");
  let boolean = false;

  if (formValue.get("is_correct")) boolean = true;
  if (!option_text || option_text.length < 1) {
    errorData.validationErrors.push("Answer must have atleast 1 character");
    errorData.invalidName = option_text;

    render("question.eta", {
      errorData,
      question: await questionService.getQuestionInfo(params.qId),
      answers: await answerService.listAnswers(params.qId),
    });
  } else {
    await answerService.addAnswer(params.qId, option_text, boolean);
    response.redirect(`/topics/${params.Id}/questions/${params.qId}`);
  }
};

export {
  addAnswer,
  addQuestionToTopic,
  deleteAnswerFromQuestion,
  deleteQuestion,
  listAnswers,
};
