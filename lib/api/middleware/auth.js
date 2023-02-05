import { initialize } from "passport";
import passport from "../auth/passport";

const auth = [passport.initialize(), passport.session()];

export default auth;
