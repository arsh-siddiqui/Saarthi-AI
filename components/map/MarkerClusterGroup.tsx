import { createPathComponent } from "@react-leaflet/core";
import L from "leaflet";
import "leaflet.markercluster";

const MarkerClusterGroup = createPathComponent<
  L.MarkerClusterGroup,
  L.MarkerClusterGroupOptions & { children: React.ReactNode }
>(({ children: _c, ...props }, ctx) => {
  const markerClusterGroup = L.markerClusterGroup(props);
  return {
    instance: markerClusterGroup,
    context: { ...ctx, layerContainer: markerClusterGroup },
  };
});

export default MarkerClusterGroup;
