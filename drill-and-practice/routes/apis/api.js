import * as questionService from "../../services/questionService.js";
import * as answerService from "../../services/answerService.js";
import * as topicService from "../../services/topicsService.js";

const JSONQuestion = async ({ response }) => {
  const tId = await topicService.getRandomTopicID();

  if (tId == -1) {
    return response.body = {};
  }
  const qId = await questionService.pickRandomId(tId);
  if (qId == -1) {
    return response.body = {};
  } else {
    const question = await questionService.getQuestionInfo(qId);
    const answers = await answerService.listAnswers(qId);
    const answerList = [];

    for (const answer of answers) {
      const element = {
        optionId: answer.id,
        optionText: answer.option_text,
      };
      answerList.push(element);
    }

    return response.body = {
      "questionId": qId,
      "questionText": question.question_text,
      "answerOptions": answerList,
    };
  }
};

const JSONReceive = async ({ request, response }) => {
  const body = request.body({ type: "json" });
  const document = await body.value;
  if (document.questionId && document.optionId) {
    const correctqId = await answerService.getCorrectId(
      document.questionId,
    );

    let boolean = false;
    for (const qId of correctqId) {
      console.log(`Comparing ${qId.id} and ${document.optionId}`);
      if (qId.id == document.optionId) {
        boolean = true;
      }
    }
    response.body = {
      "correct": boolean,
    };
  } else {
    response.body = {
      "correct": false,
    };
  }
};
export { JSONQuestion, JSONReceive };
