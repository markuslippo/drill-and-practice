import { executeQuery } from "../database/database.js";

const listAnswers = async (question_id) => {
  const result = await executeQuery(
    "SELECT option_text, is_correct, id FROM question_answer_options WHERE question_id = $1",
    question_id,
  );
  return result.rows;
};

const statistics = async () => {
  const result = await executeQuery(
    "SELECT COUNT (question_answer_option_id) FROM question_answers ",
  );
  const count = result.rows[0].count;
  return count;
};

const deleteAnswer = async (id) => {
  await executeQuery(
    "DELETE FROM question_answers WHERE question_answer_option_id =$1",
    id,
  );

  await executeQuery(
    "DELETE FROM question_answer_options WHERE id=$1",
    id,
  );
};

const checkBoolean = async (id) => {
  const result = await executeQuery(
    "SELECT is_correct FROM question_answer_options WHERE id=$1",
    id,
  );
  return result.rows[0].is_correct;
};

const getCorrectAnswers = async (id) => {
  const result = await executeQuery(
    "SELECT option_text FROM question_answer_options WHERE question_id=$1 AND is_correct=true",
    id,
  );
  return result.rows;
};

const getCorrectId = async (id) => {
  const result = await executeQuery(
    "SELECT id FROM question_answer_options WHERE question_id=$1 AND is_correct=true",
    id,
  );
  return result.rows;
};

const addAnswer = async (question_id, option_text, is_correct) => {
  await executeQuery(
    "INSERT INTO question_answer_options (question_id, option_text, is_correct) VALUES ($1, $2, $3)",
    question_id,
    option_text,
    is_correct,
  );
};

const deleteAnswers = async (qId) => {
  await executeQuery(
    "DELETE FROM question_answers WHERE question_id = $1",
    qId,
  );

  await executeQuery(
    "DELETE FROM question_answer_options AND WHERE question_id = $1",
    qId,
  );
};

const addQuizAnswer = async (user_id, question_id, QA_option_id) => {
  await executeQuery(
    "INSERT INTO question_answers (user_id, question_id, question_answer_option_id) VALUES ($1, $2, $3) ",
    user_id,
    question_id,
    QA_option_id,
  );
};

export {
  addAnswer,
  addQuizAnswer,
  checkBoolean,
  deleteAnswer,
  deleteAnswers,
  getCorrectAnswers,
  getCorrectId,
  listAnswers,
  statistics,
};
