const bcrypt = require("bcrypt");
const User = require("../models/User");
const LoginAttempt = require("../models/LoginAttempt");

const MAX_FAILED_LOGINS = 10;
const LOGIN_WINDOW_MS = 15 * 60 * 1000;

let dummyHashPromise;
/** Compared against when the username doesn't exist, so response time doesn't reveal it. */
function getDummyHash() {
  if (!dummyHashPromise) dummyHashPromise = bcrypt.hash("not-a-real-password", 10);
  return dummyHashPromise;
}

function loginAttemptKey(req) {
  return `ip:${req.ip || "unknown"}`;
}

/**
 * Counts this attempt before the password is checked, so a burst of parallel requests can't all
 * pass the limit check first. Returns the attempt count in the current window.
 */
async function countLoginAttempt(key, now) {
  const bumped = await LoginAttempt.findOneAndUpdate(
    { key, expiresAt: { $gt: now } },
    { $inc: { count: 1 } },
    { new: true }
  ).lean();
  if (bumped) return bumped;
  try {
    return await LoginAttempt.findOneAndUpdate(
      { key },
      { $set: { count: 1, expiresAt: new Date(now.getTime() + LOGIN_WINDOW_MS) } },
      { upsert: true, new: true }
    ).lean();
  } catch (err) {
    // Two first attempts raced on the unique key; the other created the window, so count into it.
    if (err && err.code === 11000) {
      return LoginAttempt.findOneAndUpdate({ key }, { $inc: { count: 1 } }, { new: true }).lean();
    }
    throw err;
  }
}

exports.login = async (req, res) => {
  const { username, password } = req.body || {};
  if (
    typeof username !== "string" ||
    typeof password !== "string" ||
    !username.trim() ||
    !password ||
    username.length > 200 ||
    password.length > 500
  ) {
    return res.status(400).json({ message: "Enter your username and password." });
  }

  try {
    const key = loginAttemptKey(req);
    const now = new Date();
    const attempt = await countLoginAttempt(key, now);
    if (attempt && attempt.count > MAX_FAILED_LOGINS) {
      const retryAfterSec = Math.ceil((attempt.expiresAt - now) / 1000);
      res.set("Retry-After", String(retryAfterSec));
      return res.status(429).json({
        message: `Too many failed attempts. Try again in ${Math.ceil(retryAfterSec / 60)} minute(s).`,
      });
    }

    const user = await User.findOne({ username: username.trim() });
    let valid = false;
    if (user) {
      valid = await bcrypt.compare(password, user.password);
    } else {
      await bcrypt.compare(password, await getDummyHash());
    }
    if (!valid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    await LoginAttempt.deleteOne({ key });

    // New session ID on login so a session cookie set before login can't be reused.
    req.session.regenerate((regenErr) => {
      if (regenErr) {
        console.error("[login] session regenerate failed:", regenErr);
        return res.status(500).json({ message: "Login failed. Try again." });
      }
      req.session.user = { id: user._id, username: user.username };
      req.session.save((saveErr) => {
        if (saveErr) {
          console.error("[login] session save failed:", saveErr);
          return res.status(500).json({ message: "Login failed. Try again." });
        }
        res.json({ message: "Login successful" });
      });
    });
  } catch (err) {
    console.error("[login]", err);
    res.status(500).json({ message: "Login failed. Try again." });
  }
};

exports.checkAuth = (req, res) => {
  // 200 either way: a logged-out visitor isn't an error (keeps shopper consoles clean).
  res.json({ authenticated: Boolean(req.session && req.session.user) });
};

exports.logout = (req, res) => {
  req.session.destroy(() => res.json({ message: "Logged out" }));
};
