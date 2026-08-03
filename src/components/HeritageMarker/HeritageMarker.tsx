interface MarkerPreviewProps {
  index?: number;
  selected?: boolean;
}

export function createHeritageMarkerHtml(index: number, selected = false): string {
  const selectedClass = selected ? " is-selected" : "";
  return `<span class="heritage-marker${selectedClass}" data-testid="map-marker" aria-hidden="true"><span class="heritage-marker__seal">${index}</span></span>`;
}

export function HeritageMarker({ index = 1, selected = false }: MarkerPreviewProps) {
  return (
    <span className={`heritage-marker${selected ? " is-selected" : ""}`} data-testid="map-marker" aria-hidden="true">
      <span className="heritage-marker__seal">{index}</span>
    </span>
  );
}
