import { executeQuery } from "../database/database.js";

const addQuestion = async (user_id, topic_id, question_text) => {
  await executeQuery(
    "INSERT INTO questions (user_id, topic_id, question_text) VALUES ($1, $2, $3)",
    user_id,
    topic_id,
    question_text,
  );
};

const listQuestions = async (topic_id) => {
  const result = await executeQuery(
    "SELECT question_text, id FROM questions WHERE topic_id = $1",
    topic_id,
  );
  return result.rows;
};

const getQuestionInfo = async (id) => {
  const result = await executeQuery(
    "SELECT question_text, id, topic_id FROM questions WHERE id = $1",
    id,
  );
  return result.rows[0];
};

const statistics = async () => {
  const result = await executeQuery(
    "SELECT COUNT (id) FROM questions",
  );
  const count = result.rows[0].count;
  return count;
};

const deleteQuestion = async (id) => {
  await executeQuery(
    "DELETE FROM questions WHERE id=$1",
    id,
  );
};

const pickRandomId = async (tId) => {
  const result = await executeQuery(
    "SELECT * FROM (SELECT * FROM questions WHERE questions.topic_id=$1) as topicQuestions WHERE exists (SELECT * FROM question_answer_options WHERE topicQuestions.id=question_answer_options.question_id) ORDER BY RANDOM()",
    tId,
  );

  if (result.rows[0]) {
    return result.rows[0].id;
  } else {
    return -1;
  }
};

const deleteQuestions = async (tId) => {
  await executeQuery(
    "DELETE FROM questions WHERE topic_id = $1",
    tId,
  );
};

export {
  addQuestion,
  deleteQuestion,
  deleteQuestions,
  getQuestionInfo,
  listQuestions,
  pickRandomId,
  statistics,
};
