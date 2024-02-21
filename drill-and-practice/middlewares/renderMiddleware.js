import { configure, renderFile } from "../deps.js";

configure({
  views: `${Deno.cwd()}/views/`,
});

const renderMiddleware = async (context, next) => {
  context.render = async (file, data) => {
    if (!data) {
      data = {};
    }

    if (typeof context.user === "undefined") {
      data.admin = false;
    } else {
      if (context.user.email == "admin@admin.com") {
        data.admin = true;
      } else {
        data.admin = false;
      }
    }

    context.response.headers.set("Content-Type", "text/html; charset=utf-8");
    context.response.body = await renderFile(file, data);
  };

  await next();
};

export { renderMiddleware };
