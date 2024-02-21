import { bcrypt } from "../../deps.js";
import * as userService from "../../services/userService.js";

const registerUser = async ({ render, request, response }) => {
  const errorData = {
    validationErrors: [],
    invalidEmail: "",
  };

  const body = request.body({ type: "form" });
  const params = await body.value;
  const email = params.get("email");
  const userFromDatabase = await userService.findUserByEmail(
    email,
  );

  const emailValid = (email.includes("@") && email.length > 1);
  const passwordValid = (params.get("password").length >= 4);

  if (emailValid) {
    if (passwordValid) {
      if (userFromDatabase.length === 0) {
        await userService.addUser(
          email,
          await bcrypt.hash(params.get("password")),
        );

        response.redirect("/");
      } else {
        errorData.validationErrors.push("Email already exists.");
        errorData.invalidEmail = email;
        render("registration.eta", errorData);
      }
    } else {
      errorData.validationErrors.push("Password must be atleast 4 characters");
      errorData.invalidEmail = email;
      render("registration.eta", errorData);
    }
  } else if (passwordValid) {
    errorData.validationErrors.push("Email must be a real email");
    errorData.invalidEmail = email;
    render("registration.eta", errorData);
  } else {
    errorData.validationErrors.push("Email must be a real email");
    errorData.validationErrors.push("Password must be atleast 4 characters");
    errorData.invalidEmail = email;
    render("registration.eta", errorData);
  }
};

const showRegistrationForm = ({ render }) => {
  const errorData = {
    validationErrors: [],
    invalidEmail: "",
  };
  render("registration.eta", errorData);
};

const showLoginForm = ({ render }) => {
  const errorData = {
    validationErrors: [],
    invalidEmail: "",
  };
  render("login.eta", errorData);
};

const processLogin = async ({ render, request, response, state }) => {
  const errorData = {
    validationErrors: [],
    invalidEmail: "",
  };
  const body = request.body({ type: "form" });
  const params = await body.value;
  const email = params.get("email");
  const userFromDatabase = await userService.findUserByEmail(
    email,
  );
  if (userFromDatabase.length === 0) {
    errorData.validationErrors.push("Email does not exist");
    render("login.eta", errorData);
    return;
  }

  const user = userFromDatabase[0];
  const passwordMatches = await bcrypt.compare(
    params.get("password"),
    user.password,
  );

  if (!passwordMatches) {
    errorData.validationErrors.push("Password does not match");
    errorData.invalidEmail = email;
    render("login.eta", errorData);
    return;
  }

  await state.session.set("user", user);
  await state.session.set("authenticated", true);

  response.redirect("/topics");
};

const addAdmin = async () => {
  await userService.addAdmin(await bcrypt.hash("123456"));
};

export {
  addAdmin,
  processLogin,
  registerUser,
  showLoginForm,
  showRegistrationForm,
};
