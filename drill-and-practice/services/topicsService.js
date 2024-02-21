import { executeQuery } from "../database/database.js";

/**
 *  Services related to both topic lists and single topics
 */

const createTopic = async (name, user_id) => {
  await executeQuery(
    "INSERT INTO topics (name, user_id) VALUES ($1, $2);",
    name,
    user_id,
  );
};

const getTopics = async () => {
  const result = await executeQuery("SELECT * FROM topics ORDER BY name");
  return result.rows;
};

const getRandomTopicID = async () => {
  const result = await executeQuery(
    "SELECT id FROM topics WHERE exists(SELECT topic_id FROM (SELECT DISTINCT topic_id FROM questions, question_answer_options WHERE questions.id=question_answer_options.question_id) as QuestionsWithAnswers WHERE topics.id=QuestionsWithAnswers.topic_id) ORDER BY RANDOM()",
  );
  if (result.rows[0].id) {
    return result.rows[0].id;
  } else {
    return -1;
  }
};
const getTopicName = async (topic_id) => {
  const result = await executeQuery(
    "SELECT name, id FROM topics WHERE id = $1",
    topic_id,
  );
  return result.rows[0];
};

const deleteTopic = async (topic_id) => {
  await executeQuery(
    "DELETE FROM topics WHERE id = $1",
    topic_id,
  );
};

const statistics = async () => {
  const result = await executeQuery(
    "SELECT COUNT (id) FROM topics",
  );
  const count = result.rows[0].count;
  return count;
};

export {
  createTopic,
  deleteTopic,
  getRandomTopicID,
  getTopicName,
  getTopics,
  statistics,
};
