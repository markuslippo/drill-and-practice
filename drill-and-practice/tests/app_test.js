import { superoak } from "https://deno.land/x/superoak@4.6.0/mod.ts";
import { app, session } from "../app.js";
import { assertEquals } from "../deps.js";
import * as userService from "../services/userService.js";
import { executeQuery } from "../database/database.js";

//1
Deno.test({
  name: "GET requests to /auth/register should return a html file",
  async fn() {
    const testClient = await superoak(app);
    const result = await testClient.get("/auth/register")
      .expect(200)
      .expect("Content-Type", new RegExp("text/html"));
  },
  sanitizeResources: false,
  sanitizeOps: false,
});

//2
Deno.test({
  name: "GET requests to / should return a html file",
  async fn() {
    const testClient = await superoak(app);
    const result = await testClient.get("/")
      .expect(200)
      .expect("Content-Type", new RegExp("text/html"));
  },
  sanitizeResources: false,
  sanitizeOps: false,
});

//3
Deno.test({
  name: "GET requests to /auth/login should return a html file",
  async fn() {
    const testClient = await superoak(app);
    const result = await testClient.get("/auth/login")
      .expect(200)
      .expect("Content-Type", new RegExp("text/html"));
  },
  sanitizeResources: false,
  sanitizeOps: false,
});

//4
Deno.test({
  name: "GET request to /api/questions/random should return JSON data /",
  async fn() {
    const testClient = await superoak(app);
    await testClient.get("/api/questions/random")
      .expect(200)
      .expect("Content-Type", new RegExp("application/json"));
  },
  sanitizeResources: false,
  sanitizeOps: false,
});

//5
Deno.test({
  name: "Registering with email and password should increase count of users",
  async fn() {
    const testClient = await superoak(app);

    await userService.deleteUserByEmail("count@count.com");

    const beforeCount = await executeQuery(
      "SELECT COUNT(id) as count FROM users",
    );

    await testClient.post("/auth/register")
      .send("email=count@count.com&password=test")
      .expect(302);

    const afterCount = await executeQuery(
      "SELECT COUNT(id) as count FROM users",
    );

    assertEquals(
      Number(afterCount.rows[0].count),
      Number(beforeCount.rows[0].count) + 1,
    );
  },
  sanitizeResources: false,
  sanitizeOps: false,
});

//6
Deno.test({
  name:
    "POST to /auth/login with wrong credentials does not log the user in (redirect)",
  async fn() {
    const testClient = await superoak(app);
    await userService.deleteUserByEmail("incorrect@email.com");
    const result = await testClient.post("/auth/login")
      .send("email=incorrect@email.com&password=testing");

    assertEquals(result.redirect, false);
  },
  sanitizeResources: false,
  sanitizeOps: false,
});

//7
Deno.test({
  name:
    "POST to /auth/register with wrong credentials does not register the user (redirect)",
  async fn() {
    const testClient = await superoak(app);
    await userService.deleteUserByEmail("incorrectemail.com");
    const result = await testClient.post("/auth/register")
      .send("email=incorrectemail.com&password=testing");

    assertEquals(result.redirect, false);
  },
  sanitizeResources: false,
  sanitizeOps: false,
});

//8
Deno.test({
  name:
    "GET requests to /topics redirects unauthenticated users to /auth/login",
  async fn() {
    const testClient = await superoak(app);
    const result = await testClient.get("/topics");
    assertEquals(result.text, "Redirecting to /auth/login.");
  },
  sanitizeResources: false,
  sanitizeOps: false,
});

//9
Deno.test({
  name: "GET requests to /quiz redirects unauthenticated users to /auth/login",
  async fn() {
    const testClient = await superoak(app);
    const result = await testClient.get("/quiz");
    assertEquals(result.text, "Redirecting to /auth/login.");
  },
  sanitizeResources: false,
  sanitizeOps: false,
});

//10
Deno.test({
  name: "POST to /auth/login with correct information adds the user to session",
  async fn() {
    const testClient = await superoak(app);

    const admin = await userService.findUserByEmail("admin@admin.com");

    await testClient.post("/auth/login")
      .send("email=admin@admin.com&password=123456");

    const authentication = await session.get("user");
    assertEquals(authentication, admin[0]);
  },

  sanitizeResources: false,
  sanitizeOps: false,
});
