import { getBreakpoints } from "../reducers/breakpoints";
import { getSelectedSource } from "../reducers/sources";
import { isGeneratedId } from "devtools-source-map";

function getLocation(breakpoint, isGeneratedSource) {
  return isGeneratedSource
    ? breakpoint.generatedLocation || breakpoint.location
    : breakpoint.location;
}

function formatBreakpoint(breakpoint, selectedSource) {
  const { condition, loading, disabled } = breakpoint;
  const sourceId = selectedSource.get("id");
  const isGeneratedSource = isGeneratedId(sourceId);

  return {
    location: getLocation(breakpoint, isGeneratedSource),
    condition,
    loading,
    disabled
  };
}

function isVisible(breakpoint, selectedSource) {
  const sourceId = selectedSource.get("id");
  const isGeneratedSource = isGeneratedId(sourceId);

  const location = getLocation(breakpoint, isGeneratedSource);
  return location.sourceId === sourceId;
}
/*
 * Finds the breakpoints, which appear in the selected source.
 *
 * This
 */
export default function getVisibleBreakpoints(state: OuterState) {
  const selectedSource = getSelectedSource(state);
  if (!selectedSource) {
    return null;
  }

  return getBreakpoints(state)
    .filter(bp => isVisible(bp, selectedSource))
    .map(bp => formatBreakpoint(bp, selectedSource));
}
