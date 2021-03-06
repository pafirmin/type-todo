import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User";
import { check, validationResult } from "express-validator";

const logIn = [
  check("email", "Please provide a valid email address").isEmail(),
  check("password", "Password field was left empty").not().isEmpty(),
  async (req: Request, res: Response): Promise<Response> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errors.array());
    }
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email: email });

      if (!user) {
        return res
          .status(400)
          .json([{ msg: "No user found with that email address" }]);
      }

      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return res.status(400).json([{ msg: "Invalid login details" }]);
      }

      const payload = {
        user: {
          id: user._id,
          name: user.username,
        },
      };

      const secret: string | undefined = process.env.JWT_SECRET;
      if (!secret) {
        throw "JWT secret is undefined";
      }

      const accessToken: string = jwt.sign(payload, secret, {
        expiresIn: "15m",
      });

      const refreshToken: string = jwt.sign(payload, secret, {
        expiresIn: "7d",
      });

      return res
        .cookie("refreshToken", refreshToken, {
          httpOnly: true,
          sameSite: false,
          secure: true,
          expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        })
        .json({ token: accessToken, username: user.username });
    } catch (err) {
      console.error(err);
      return res.status(500).json([{ msg: "Server error" }]);
    }
  },
];

const guestLogin = async (_req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findOne({ email: "guest@dodaily.com" });

    if (!user) {
      res.status(400).json([{ msg: "No user found with that email address" }]);

      return;
    }

    const payload = {
      user: {
        id: user._id,
        name: user.username,
      },
    };

    const secret: string | undefined = process.env.JWT_SECRET;
    if (!secret) {
      throw "JWT secret is undefined";
    }

    const accessToken: string = jwt.sign(payload, secret, {
      expiresIn: "15m",
    });

    const refreshToken: string = jwt.sign(payload, secret, {
      expiresIn: "7d",
    });

    res
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        sameSite: false,
        secure: true,
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      })
      .json({ token: accessToken, username: user.username });

    return;
  } catch (err) {
    console.error(err);
    res.status(500).json([{ msg: "Server error" }]);

    return;
  }
};

const refreshToken = async (req: Request, res: Response) => {
  try {
    const token = req.cookies["refreshToken"];
    if (!token) {
      return res.status(401).json({ msg: "No refresh token present" });
    }

    const secret: string | undefined = process.env.JWT_SECRET;
    if (!secret) {
      throw "JWT secret is undefined";
    }

    const decoded: any = jwt.verify(token, secret);

    const payload = {
      user: decoded.user,
    };

    const accessToken: string = jwt.sign(payload, secret, {
      expiresIn: "15m",
    });

    return res.json({ token: accessToken, username: decoded.user.name });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "Server error" });
  }
};

const logout = async (_req: Request, res: Response) => {
  try {
    return res
      .clearCookie("refreshToken", { sameSite: false, secure: true })
      .json();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "Server error" });
  }
};

export default { logIn, guestLogin, refreshToken, logout };
