type UnknownRecord = Record<string, unknown>;

function asRecord(value: unknown): UnknownRecord | null {
  return typeof value === "object" && value !== null && !Array.isArray(value)
    ? (value as UnknownRecord)
    : null;
}

function hasOnlyKeys(record: UnknownRecord, allowed: readonly string[]): boolean {
  const allowedSet = new Set(allowed);
  return Object.keys(record).every((key) => allowedSet.has(key));
}

function hasStrictPointShape(value: unknown): boolean {
  const point = asRecord(value);
  return Boolean(point && hasOnlyKeys(point, ["x", "y"]));
}

function hasStrictBoundsShape(value: unknown): boolean {
  const bounds = asRecord(value);
  return Boolean(
    bounds && hasOnlyKeys(bounds, ["x", "y", "width", "depth"]),
  );
}

function hasStrictRoomShape(value: unknown): boolean {
  const room = asRecord(value);
  return Boolean(
    room &&
      hasOnlyKeys(room, ["id", "type", "polygon"]) &&
      Array.isArray(room.polygon) &&
      room.polygon.every(hasStrictPointShape),
  );
}

function hasStrictStructuralElementShape(value: unknown): boolean {
  const element = asRecord(value);
  return Boolean(
    element &&
      hasOnlyKeys(element, [
        "id",
        "roomId",
        "kind",
        "lock",
        "bounds",
        "blocksPlacement",
      ]) &&
      hasStrictBoundsShape(element.bounds),
  );
}

export function hasStrictSpaceModelShape(value: unknown): boolean {
  const model = asRecord(value);
  return Boolean(
    model &&
      hasOnlyKeys(model, [
        "schemaVersion",
        "unit",
        "revision",
        "rooms",
        "structuralElements",
      ]) &&
      Array.isArray(model.rooms) &&
      model.rooms.every(hasStrictRoomShape) &&
      Array.isArray(model.structuralElements) &&
      model.structuralElements.every(hasStrictStructuralElementShape),
  );
}
