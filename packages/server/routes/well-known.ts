import type { Router } from "express";
import express from "express";
import * as console from "node:console";

const router: Router = express.Router();

router.post("/", (req, res) => {
  console.log(req);
  res.json({ message: "SSL" });
});

router.get("/", (req, res, next) => {
  console.log(req);
  console.log(next);
  res.json({ message: "Hello SSL" });
});

router.post("/test", (req, res) => {
  console.log(req);
  res.send("post test");
});

router.get("/test", (req, res, next) => {
  console.log(req);
  console.log(next);
  res.send( "get test" );
});

router.post("/QAiULDTpnlXN_8bVKP_Ux0euXNzzFNTIWJW7nrd4rbk", (req, res) => {
  // console.log(req, 19)
  res.send(
    "QAiULDTpnlXN_8bVKP_Ux0euXNzzFNTIWJW7nrd4rbk.n9vhoVsr9f-p5AVhDGW_-NIPSlTUrf15Jo0eKIxokYI"
  );
});

router.get("/QAiULDTpnlXN_8bVKP_Ux0euXNzzFNTIWJW7nrd4rbk", (req, res) => {
  // console.log(req, 26)
  res.send(
    "QAiULDTpnlXN_8bVKP_Ux0euXNzzFNTIWJW7nrd4rbk.n9vhoVsr9f-p5AVhDGW_-NIPSlTUrf15Jo0eKIxokYI"
  );
});

router.post("/s2kGuS_N19Hp_7qSrZn2lmW25bBpWAr__PHvSHtPdyg", (req, res) => {
  // console.log(req, 33)
  res.send(
    "s2kGuS_N19Hp_7qSrZn2lmW25bBpWAr__PHvSHtPdyg.n9vhoVsr9f-p5AVhDGW_-NIPSlTUrf15Jo0eKIxokYI"
  );
});

router.get("/s2kGuS_N19Hp_7qSrZn2lmW25bBpWAr__PHvSHtPdyg", (req, res) => {
  // console.log(req, 40)
  res.send(
    "s2kGuS_N19Hp_7qSrZn2lmW25bBpWAr__PHvSHtPdyg.n9vhoVsr9f-p5AVhDGW_-NIPSlTUrf15Jo0eKIxokYI"
  );
});

router.post("/8wQMYgzr3HyfB_j3j2z4ZB0Eab8k2UCKVah3AOXuD-U", (req, res) => {
  res.send(
    "8wQMYgzr3HyfB_j3j2z4ZB0Eab8k2UCKVah3AOXuD-U.n9vhoVsr9f-p5AVhDGW_-NIPSlTUrf15Jo0eKIxokYI"
  );
});

router.get("/8wQMYgzr3HyfB_j3j2z4ZB0Eab8k2UCKVah3AOXuD-U", (req, res) => {
  res.send(
    "8wQMYgzr3HyfB_j3j2z4ZB0Eab8k2UCKVah3AOXuD-U.n9vhoVsr9f-p5AVhDGW_-NIPSlTUrf15Jo0eKIxokYI"
  );
});

router.post("/yvv9qs1EEhic_TF8lO-Ey5COrG9WRfk9-s260UhNyjg", (req, res) => {
  res.send(
    "yvv9qs1EEhic_TF8lO-Ey5COrG9WRfk9-s260UhNyjg.n9vhoVsr9f-p5AVhDGW_-NIPSlTUrf15Jo0eKIxokYI"
  );
});

router.get("/yvv9qs1EEhic_TF8lO-Ey5COrG9WRfk9-s260UhNyjg", (req, res) => {
  res.send(
    "yvv9qs1EEhic_TF8lO-Ey5COrG9WRfk9-s260UhNyjg.n9vhoVsr9f-p5AVhDGW_-NIPSlTUrf15Jo0eKIxokYI"
  );
});

router.post("/eAhSU1WCytGk_YiU25jvextL56HmRGxLDPsBwQe0CWI", (req, res) => {
  res.send(
    "eAhSU1WCytGk_YiU25jvextL56HmRGxLDPsBwQe0CWI._rru0JgAEX1oWwR4SVw9QAtHkFZehQTvFNDzBKzvTbQ"
  );
});

router.get("/eAhSU1WCytGk_YiU25jvextL56HmRGxLDPsBwQe0CWI", (req, res) => {
  res.send(
    "eAhSU1WCytGk_YiU25jvextL56HmRGxLDPsBwQe0CWI._rru0JgAEX1oWwR4SVw9QAtHkFZehQTvFNDzBKzvTbQ"
  );
});

export const well = router;
// export default router;
