export {
  GOVERNORATE_ALL,
  GOVERNORATE_COOKIE,
  GOVERNORATE_COOKIE_MAX_AGE,
} from "./constants";

export {
  applyGovernoratePreferenceCookie,
  getGovernoratePreferenceFromCookies,
  isGovernorateAll,
  isGovernorateId,
  readGovernoratePreferenceFromHeader,
  readGovernoratePreferenceFromStore,
  setGovernoratePreferenceClient,
} from "./preference";

export {
  isKnownGovernorateId,
  needsGovernorateUrlSeed,
  pickGovernorateId,
} from "./resolve";

export {
  matchGovernorateSeedRoute,
  stripLocalePrefix,
} from "./routes";

export { getDefaultGovernorateId } from "./default-id";

export { maybeGovernorateRedirect } from "./ensure";
