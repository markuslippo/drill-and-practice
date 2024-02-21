import * as topicsService from "../../services/topicsService.js";
import * as questionService from "../../services/questionService.js";
import * as answerService from "../../services/answerService.js";

const showTopics = async ({ render }) => {
  const errorData = {
    validationErrors: [],
    invalidName: "",
  };
  render("topics.eta", { errorData, topics: await topicsService.getTopics() });
};

const addTopic = async ({ request, response, user, render }) => {
  const errorData = {
    validationErrors: [],
    invalidName: "",
  };

  const body = request.body({ type: "form" });
  const params = await body.value;
  const topicName = params.get("name");

  if (!topicName || topicName.length < 1) {
    errorData.validationErrors.push("Topic name must have atleast 1 character");
    errorData.invalidName = topicName;

    render("topics.eta", {
      errorData,
      topics: await topicsService.getTopics(),
    });
  } else {
    await topicsService.createTopic(topicName, user.id);
    response.redirect("/topics");
  }
};

const deleteTopic = async ({ params, response }) => {
  const data = {
    questions: await questionService.listQuestions(params.id),
  };
  for (const question of data.questions) {
    await answerService.deleteAnswers(question.id);
    await questionService.deleteQuestion(question.id);
  }
  await topicsService.deleteTopic(params.id);
  response.redirect("/topics");
};

const showTopicWithID = async ({ params, render }) => {
  const errorData = {
    validationErrors: [],
    invalidName: "",
  };

  const data = {
    errorData,
    topic: await topicsService.getTopicName(params.id),
    questions: await questionService.listQuestions(params.id),
  };

  render("topic.eta", data);
};

export { addTopic, deleteTopic, showTopics, showTopicWithID };
