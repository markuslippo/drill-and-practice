import { Router } from "../deps.js";
import * as mainController from "./controllers/mainController.js";
import * as quizController from "./controllers/quizController.js";
import * as topicsController from "./controllers/topicsController.js";
import * as questionController from "./controllers/questionController.js";
import * as authenticationController from "./controllers/authenticationController.js";
import * as api from "./apis/api.js";

const router = new Router();

router.get("/", mainController.showMain);

router.get("/topics", topicsController.showTopics);
router.post("/topics", topicsController.addTopic);
router.get("/topics/:id", topicsController.showTopicWithID);
router.post("/topics/:id/delete", topicsController.deleteTopic);

router.post("/topics/:id/questions", questionController.addQuestionToTopic);
router.get("/topics/:id/questions/:qId", questionController.listAnswers);
router.post("/topics/:id/questions/:qId/options", questionController.addAnswer);

router.post(
  "/topics/:tId/questions/:qId/delete",
  questionController.deleteQuestion,
);
router.post(
  "/topics/:tId/questions/:qId/options/:oId/delete",
  questionController.deleteAnswerFromQuestion,
);

router.get("/quiz", quizController.showTopics);
router.get("/quiz/:tId", quizController.randomQuestion);
router.get("/quiz/:tId/questions/:qId", quizController.viewQuizQuestion);
router.post(
  "/quiz/:tId/questions/:qId/options/:oId",
  quizController.chooseAnswer,
);
router.get("/quiz/:tId/questions/:qId/correct", quizController.correctView);
router.get("/quiz/:tId/questions/:qId/incorrect", quizController.incorrectView);

router.get("/auth/register", authenticationController.showRegistrationForm);
router.post("/auth/register", authenticationController.registerUser);

router.get("/auth/login", authenticationController.showLoginForm);
router.post("/auth/login", authenticationController.processLogin);

router.get("/api/questions/random", api.JSONQuestion);
router.post("/api/questions/answer", api.JSONReceive);

router.get("/auth/addadmin", authenticationController.addAdmin);

export { router };
