import { isGovernorateAll, isGovernorateId } from "./preference";

/**
 * @param {string | number | null | undefined} id
 * @param {Array<{ id?: string | number }>} governorates
 * @returns {boolean}
 */
export function isKnownGovernorateId(id, governorates = []) {
  if (!isGovernorateId(id)) return false;
  return governorates.some((item) => String(item.id) === String(id));
}

/**
 * Single source of truth for selecting a browse governorate.
 *
 * Priority: valid URL param → valid cookie preference → first governorate.
 *
 * @param {object} options
 * @param {string | number | null | undefined} [options.rawId] URL param
 * @param {Array<{ id?: string | number }>} [options.governorates]
 * @param {string | number | null | undefined} [options.preferredId] cookie
 * @param {boolean} [options.allowAll] when true, cookie/param `"all"` stays null
 * @returns {string | number | null}
 */
export function pickGovernorateId({
  rawId = null,
  governorates = [],
  preferredId = null,
  allowAll = false,
} = {}) {
  if (allowAll && (isGovernorateAll(rawId) || rawId === "")) {
    return null;
  }

  if (isKnownGovernorateId(rawId, governorates)) {
    return rawId;
  }

  if (allowAll && isGovernorateAll(preferredId)) {
    return null;
  }

  if (isKnownGovernorateId(preferredId, governorates)) {
    return preferredId;
  }

  return governorates[0]?.id ?? null;
}

/**
 * Whether the incoming URL must be corrected to carry `selectedId`.
 *
 * @param {object} options
 * @param {string | number | null | undefined} options.rawId
 * @param {string | number | null | undefined} options.selectedId
 * @param {boolean} [options.allowAll]
 * @returns {boolean}
 */
export function needsGovernorateUrlSeed({
  rawId = null,
  selectedId = null,
  allowAll = false,
} = {}) {
  if (selectedId == null) {
    // Explicit "all" with no param is valid when allowed.
    if (allowAll && (rawId == null || rawId === "" || isGovernorateAll(rawId))) {
      return false;
    }
    return false;
  }

  return String(rawId ?? "") !== String(selectedId);
}
