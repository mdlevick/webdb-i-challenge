const express = require("express");

const db = require("../data/dbConfig.js");

const router = express.Router();

router.get("/", (req, res) => {
  db.select("*")
    .from("accounts")
    .then(accounts => {
      res.status(200).json(accounts);
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ errorMessage: "Error getting the accounts. " });
    });
});

router.get("/:id", (req, res) => {
  db.select("*")
    .from("accounts")
    .where({ id: req.params.id })
    .first()
    .then(account => {
      res.status(200).json(account);
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ errorMessage: "Error getting the account. " });
    });
});

router.post("/", validateAccount, (req, res) => {
  const accountData = req.body;
  db("accounts")
    .insert(accountData, "id")
    .then(ids => {
      const id = ids[0];

      return db("accounts")
        .select("id", "name", "budget")
        .where({ id })
        .first()
        .then(account => {
          res.status(201).json(account);
        });
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ errorMessage: "Error adding the account." });
    });
});

router.put("/:id", validateAccountId, (req, res) => {
  const { id } = req.params;
  const changes = req.body;
  db("accounts")
    .where({ id })
    .update(changes)
    .then(count => {
      count > 0
        ? res
            .status(200)
            .json({ message: `${count} record(s) have been updated. ` })
        : res.status(404).json({ message: "Record not found. " });
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ errorMessage: "Error editing the account." });
    });
});

router.delete("/:id", (req, res) => {
  db("accounts")
    .where({ id: req.params.id })
    .del()
    .then(count => {
      res.status(200).json({ message: `${count} record(s) deleted.` });
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ errorMessage: "Error removing the account." });
    });
});

// uncertain on using middleware in these functions. It wants validation and I can do it in line but I wanted to try and use middleware. Ask Will about clarification.
function validateAccountId(req, res, next) {
  const id = req.params.id;
  db.get(id)
    .then(id => {
      id
        ? next()
        : res.status(400).json({ message: "Account ID does not exist. " });
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ message: "Unable to validate ID." });
    });
}

function validateAccount(req, res, next) {
  const accountData = req.body;
  if (!accountData.name || !accountData.budget) {
    res.status(400).json({ message: "Please provide a name and a budget. " });
  } else {
    next();
  }
}

module.exports = router;