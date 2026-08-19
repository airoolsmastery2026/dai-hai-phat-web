export const SPACE_MODEL_SCHEMA_VERSION = "1.0" as const;
export const SPACE_MODEL_UNIT = "mm" as const;

const MAX_COORDINATE_MM = 10_000_000;
const MAX_ROOMS = 100;
const MAX_ROOM_POINTS = 64;
const MAX_STRUCTURAL_ELEMENTS = 500;
const MAX_PLACEMENTS = 500;
const GEOMETRY_EPSILON = 0.001;
const ID_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._:-]{0,127}$/;

export type GeometryLock = "hard" | "controlled";
export type StructuralElementKind =
  | "wall"
  | "column"
  | "door"
  | "window"
  | "shaft"
  | "fixed-fixture";

export interface SpacePoint {
  x: number;
  y: number;
}

export interface SpaceBounds {
  x: number;
  y: number;
  width: number;
  depth: number;
}

export interface SpaceRoom {
  id: string;
  type: string;
  polygon: SpacePoint[];
}

export interface SpaceStructuralElement {
  id: string;
  roomId?: string;
  kind: StructuralElementKind;
  lock: GeometryLock;
  bounds: SpaceBounds;
  blocksPlacement: boolean;
}

export interface SpaceModel {
  schemaVersion: typeof SPACE_MODEL_SCHEMA_VERSION;
  unit: typeof SPACE_MODEL_UNIT;
  revision: string;
  rooms: SpaceRoom[];
  structuralElements: SpaceStructuralElement[];
}

export type StructuralEditAction = "move" | "resize" | "remove";

export interface SpaceStructuralEdit {
  elementId: string;
  action: StructuralEditAction;
  approved?: boolean;
}

export interface SpacePlacement {
  id: string;
  roomId: string;
  kind: string;
  bounds: SpaceBounds;
  clearanceMm?: number;
}

export interface SpaceDesignProposal {
  baseRevision: string;
  structuralEdits: SpaceStructuralEdit[];
  placements: SpacePlacement[];
}

export type SpaceValidationSeverity = "error" | "warning";

export interface SpaceValidationIssue {
  code: string;
  severity: SpaceValidationSeverity;
  path: string;
  message: string;
}

export interface SpaceValidationReport {
  valid: boolean;
  issues: SpaceValidationIssue[];
}

type UnknownRecord = Record<string, unknown>;

function asRecord(value: unknown): UnknownRecord | null {
  return typeof value === "object" && value !== null && !Array.isArray(value)
    ? (value as UnknownRecord)
    : null;
}

function isValidId(value: unknown): value is string {
  return typeof value === "string" && ID_PATTERN.test(value);
}

function isFiniteCoordinate(value: unknown): value is number {
  return (
    typeof value === "number" &&
    Number.isFinite(value) &&
    Math.abs(value) <= MAX_COORDINATE_MM
  );
}

function readBounds(value: unknown): SpaceBounds | null {
  const record = asRecord(value);
  if (!record) return null;
  const { x, y, width, depth } = record;
  if (
    !isFiniteCoordinate(x) ||
    !isFiniteCoordinate(y) ||
    typeof width !== "number" ||
    typeof depth !== "number" ||
    !Number.isFinite(width) ||
    !Number.isFinite(depth) ||
    width <= 0 ||
    depth <= 0 ||
    width > MAX_COORDINATE_MM ||
    depth > MAX_COORDINATE_MM
  ) {
    return null;
  }
  return { x, y, width, depth };
}

function readPoint(value: unknown): SpacePoint | null {
  const record = asRecord(value);
  if (!record || !isFiniteCoordinate(record.x) || !isFiniteCoordinate(record.y)) {
    return null;
  }
  return { x: record.x, y: record.y };
}

function polygonArea(points: SpacePoint[]): number {
  let twiceArea = 0;
  for (let index = 0; index < points.length; index += 1) {
    const current = points[index];
    const next = points[(index + 1) % points.length];
    twiceArea += current.x * next.y - next.x * current.y;
  }
  return Math.abs(twiceArea) / 2;
}

function pointsEqual(left: SpacePoint, right: SpacePoint): boolean {
  return (
    Math.abs(left.x - right.x) <= GEOMETRY_EPSILON &&
    Math.abs(left.y - right.y) <= GEOMETRY_EPSILON
  );
}

function orientationValue(
  start: SpacePoint,
  end: SpacePoint,
  point: SpacePoint,
): number {
  return (
    (end.x - start.x) * (point.y - start.y) -
    (end.y - start.y) * (point.x - start.x)
  );
}

function orientationSign(value: number): -1 | 0 | 1 {
  if (Math.abs(value) <= GEOMETRY_EPSILON) return 0;
  return value > 0 ? 1 : -1;
}

function pointOnSegment(
  point: SpacePoint,
  start: SpacePoint,
  end: SpacePoint,
): boolean {
  if (Math.abs(orientationValue(start, end, point)) > GEOMETRY_EPSILON) {
    return false;
  }

  return (
    point.x >= Math.min(start.x, end.x) - GEOMETRY_EPSILON &&
    point.x <= Math.max(start.x, end.x) + GEOMETRY_EPSILON &&
    point.y >= Math.min(start.y, end.y) - GEOMETRY_EPSILON &&
    point.y <= Math.max(start.y, end.y) + GEOMETRY_EPSILON
  );
}

function segmentsIntersect(
  firstStart: SpacePoint,
  firstEnd: SpacePoint,
  secondStart: SpacePoint,
  secondEnd: SpacePoint,
): boolean {
  const firstSecondStart = orientationSign(
    orientationValue(firstStart, firstEnd, secondStart),
  );
  const firstSecondEnd = orientationSign(
    orientationValue(firstStart, firstEnd, secondEnd),
  );
  const secondFirstStart = orientationSign(
    orientationValue(secondStart, secondEnd, firstStart),
  );
  const secondFirstEnd = orientationSign(
    orientationValue(secondStart, secondEnd, firstEnd),
  );

  if (
    firstSecondStart !== firstSecondEnd &&
    firstSecondStart !== 0 &&
    firstSecondEnd !== 0 &&
    secondFirstStart !== secondFirstEnd &&
    secondFirstStart !== 0 &&
    secondFirstEnd !== 0
  ) {
    return true;
  }

  return (
    (firstSecondStart === 0 &&
      pointOnSegment(secondStart, firstStart, firstEnd)) ||
    (firstSecondEnd === 0 && pointOnSegment(secondEnd, firstStart, firstEnd)) ||
    (secondFirstStart === 0 &&
      pointOnSegment(firstStart, secondStart, secondEnd)) ||
    (secondFirstEnd === 0 && pointOnSegment(firstEnd, secondStart, secondEnd))
  );
}

function segmentsProperlyIntersect(
  firstStart: SpacePoint,
  firstEnd: SpacePoint,
  secondStart: SpacePoint,
  secondEnd: SpacePoint,
): boolean {
  const firstSecondStart = orientationSign(
    orientationValue(firstStart, firstEnd, secondStart),
  );
  const firstSecondEnd = orientationSign(
    orientationValue(firstStart, firstEnd, secondEnd),
  );
  const secondFirstStart = orientationSign(
    orientationValue(secondStart, secondEnd, firstStart),
  );
  const secondFirstEnd = orientationSign(
    orientationValue(secondStart, secondEnd, firstEnd),
  );

  return (
    firstSecondStart !== 0 &&
    firstSecondEnd !== 0 &&
    secondFirstStart !== 0 &&
    secondFirstEnd !== 0 &&
    firstSecondStart !== firstSecondEnd &&
    secondFirstStart !== secondFirstEnd
  );
}

function isSimplePolygon(points: SpacePoint[]): boolean {
  const pointKeys = new Set<string>();
  for (let index = 0; index < points.length; index += 1) {
    const current = points[index];
    const next = points[(index + 1) % points.length];
    if (pointsEqual(current, next)) return false;

    const key = `${current.x}:${current.y}`;
    if (pointKeys.has(key)) return false;
    pointKeys.add(key);
  }

  for (let firstIndex = 0; firstIndex < points.length; firstIndex += 1) {
    const firstStart = points[firstIndex];
    const firstEnd = points[(firstIndex + 1) % points.length];

    for (
      let secondIndex = firstIndex + 1;
      secondIndex < points.length;
      secondIndex += 1
    ) {
      const adjacent =
        secondIndex === firstIndex + 1 ||
        (firstIndex === 0 && secondIndex === points.length - 1);
      if (adjacent) continue;

      const secondStart = points[secondIndex];
      const secondEnd = points[(secondIndex + 1) % points.length];
      if (segmentsIntersect(firstStart, firstEnd, secondStart, secondEnd)) {
        return false;
      }
    }
  }

  return true;
}

function pointInPolygon(point: SpacePoint, polygon: SpacePoint[]): boolean {
  let inside = false;
  for (
    let currentIndex = 0, previousIndex = polygon.length - 1;
    currentIndex < polygon.length;
    previousIndex = currentIndex, currentIndex += 1
  ) {
    const current = polygon[currentIndex];
    const previous = polygon[previousIndex];

    if (pointOnSegment(point, previous, current)) return true;

    const crosses =
      current.y > point.y !== previous.y > point.y &&
      point.x <
        ((previous.x - current.x) * (point.y - current.y)) /
          (previous.y - current.y) +
          current.x;
    if (crosses) inside = !inside;
  }
  return inside;
}

function expandBounds(bounds: SpaceBounds, clearanceMm = 0): SpaceBounds {
  return {
    x: bounds.x - clearanceMm,
    y: bounds.y - clearanceMm,
    width: bounds.width + clearanceMm * 2,
    depth: bounds.depth + clearanceMm * 2,
  };
}

function boundsCorners(bounds: SpaceBounds): SpacePoint[] {
  return [
    { x: bounds.x, y: bounds.y },
    { x: bounds.x + bounds.width, y: bounds.y },
    { x: bounds.x + bounds.width, y: bounds.y + bounds.depth },
    { x: bounds.x, y: bounds.y + bounds.depth },
  ];
}

function pointStrictlyInsideBounds(
  point: SpacePoint,
  bounds: SpaceBounds,
): boolean {
  return (
    point.x > bounds.x + GEOMETRY_EPSILON &&
    point.x < bounds.x + bounds.width - GEOMETRY_EPSILON &&
    point.y > bounds.y + GEOMETRY_EPSILON &&
    point.y < bounds.y + bounds.depth - GEOMETRY_EPSILON
  );
}

function boundsInsidePolygon(
  bounds: SpaceBounds,
  polygon: SpacePoint[],
): boolean {
  const corners = boundsCorners(bounds);
  if (!corners.every((point) => pointInPolygon(point, polygon))) {
    return false;
  }

  // A concave room can contain all four rectangle corners while a notch still
  // cuts through the rectangle. Reject any room vertex inside the occupied
  // rectangle and any proper boundary crossing to close that false-negative.
  if (polygon.some((point) => pointStrictlyInsideBounds(point, bounds))) {
    return false;
  }

  for (let rectangleIndex = 0; rectangleIndex < corners.length; rectangleIndex += 1) {
    const rectangleStart = corners[rectangleIndex];
    const rectangleEnd = corners[(rectangleIndex + 1) % corners.length];

    for (let polygonIndex = 0; polygonIndex < polygon.length; polygonIndex += 1) {
      const polygonStart = polygon[polygonIndex];
      const polygonEnd = polygon[(polygonIndex + 1) % polygon.length];
      if (
        segmentsProperlyIntersect(
          rectangleStart,
          rectangleEnd,
          polygonStart,
          polygonEnd,
        )
      ) {
        return false;
      }
    }
  }

  return true;
}

function boundsOverlap(left: SpaceBounds, right: SpaceBounds): boolean {
  return (
    left.x < right.x + right.width &&
    left.x + left.width > right.x &&
    left.y < right.y + right.depth &&
    left.y + left.depth > right.y
  );
}

function addIssue(
  issues: SpaceValidationIssue[],
  code: string,
  path: string,
  message: string,
  severity: SpaceValidationSeverity = "error",
) {
  issues.push({ code, severity, path, message });
}

export function validateSpaceModel(input: unknown): SpaceValidationReport {
  const issues: SpaceValidationIssue[] = [];
  const model = asRecord(input);
  if (!model) {
    addIssue(issues, "INVALID_MODEL", "$", "Space Model phải là một object.");
    return { valid: false, issues };
  }

  if (model.schemaVersion !== SPACE_MODEL_SCHEMA_VERSION) {
    addIssue(
      issues,
      "INVALID_SCHEMA_VERSION",
      "schemaVersion",
      "Phiên bản Space Model không được hỗ trợ.",
    );
  }
  if (model.unit !== SPACE_MODEL_UNIT) {
    addIssue(
      issues,
      "INVALID_UNIT",
      "unit",
      "Space Model v1 chỉ chấp nhận đơn vị mm.",
    );
  }
  if (!isValidId(model.revision)) {
    addIssue(
      issues,
      "INVALID_REVISION",
      "revision",
      "Revision phải là định danh ổn định hợp lệ.",
    );
  }

  const rooms = Array.isArray(model.rooms) ? model.rooms : null;
  if (!rooms || rooms.length === 0 || rooms.length > MAX_ROOMS) {
    addIssue(
      issues,
      "INVALID_ROOMS",
      "rooms",
      `Space Model phải có 1-${MAX_ROOMS} phòng.`,
    );
  }

  const roomIds = new Set<string>();
  const allIds = new Set<string>();
  if (rooms) {
    rooms.forEach((value, index) => {
      const path = `rooms[${index}]`;
      const room = asRecord(value);
      if (!room) {
        addIssue(issues, "INVALID_ROOM", path, "Phòng phải là một object.");
        return;
      }
      if (!isValidId(room.id)) {
        addIssue(issues, "INVALID_ID", `${path}.id`, "Room id không hợp lệ.");
      } else if (allIds.has(room.id)) {
        addIssue(
          issues,
          "DUPLICATE_ID",
          `${path}.id`,
          "ID phải duy nhất trong Space Model.",
        );
      } else {
        roomIds.add(room.id);
        allIds.add(room.id);
      }
      if (typeof room.type !== "string" || !room.type.trim()) {
        addIssue(
          issues,
          "INVALID_ROOM_TYPE",
          `${path}.type`,
          "Room type không được để trống.",
        );
      }
      if (
        !Array.isArray(room.polygon) ||
        room.polygon.length < 3 ||
        room.polygon.length > MAX_ROOM_POINTS
      ) {
        addIssue(
          issues,
          "INVALID_POLYGON",
          `${path}.polygon`,
          `Polygon phải có 3-${MAX_ROOM_POINTS} điểm.`,
        );
        return;
      }
      const points = room.polygon.map(readPoint);
      if (points.some((point) => point === null)) {
        addIssue(
          issues,
          "INVALID_POLYGON_POINT",
          `${path}.polygon`,
          "Polygon chứa tọa độ không hợp lệ.",
        );
        return;
      }
      const validatedPoints = points as SpacePoint[];
      if (!isSimplePolygon(validatedPoints)) {
        addIssue(
          issues,
          "NON_SIMPLE_POLYGON",
          `${path}.polygon`,
          "Polygon phòng không được tự cắt, lặp đỉnh hoặc có cạnh rỗng.",
        );
      }
      if (polygonArea(validatedPoints) <= GEOMETRY_EPSILON) {
        addIssue(
          issues,
          "DEGENERATE_POLYGON",
          `${path}.polygon`,
          "Polygon phòng không được suy biến.",
        );
      }
    });
  }

  const elements = Array.isArray(model.structuralElements)
    ? model.structuralElements
    : null;
  if (!elements || elements.length > MAX_STRUCTURAL_ELEMENTS) {
    addIssue(
      issues,
      "INVALID_STRUCTURAL_ELEMENTS",
      "structuralElements",
      `structuralElements phải là mảng tối đa ${MAX_STRUCTURAL_ELEMENTS} phần tử.`,
    );
  } else {
    const allowedKinds = new Set<StructuralElementKind>([
      "wall",
      "column",
      "door",
      "window",
      "shaft",
      "fixed-fixture",
    ]);
    elements.forEach((value, index) => {
      const path = `structuralElements[${index}]`;
      const element = asRecord(value);
      if (!element) {
        addIssue(
          issues,
          "INVALID_STRUCTURAL_ELEMENT",
          path,
          "Structural element phải là một object.",
        );
        return;
      }
      if (!isValidId(element.id)) {
        addIssue(
          issues,
          "INVALID_ID",
          `${path}.id`,
          "Structural element id không hợp lệ.",
        );
      } else if (allIds.has(element.id)) {
        addIssue(
          issues,
          "DUPLICATE_ID",
          `${path}.id`,
          "ID phải duy nhất trong Space Model.",
        );
      } else {
        allIds.add(element.id);
      }
      if (
        typeof element.kind !== "string" ||
        !allowedKinds.has(element.kind as StructuralElementKind)
      ) {
        addIssue(
          issues,
          "INVALID_ELEMENT_KIND",
          `${path}.kind`,
          "Loại structural element không hợp lệ.",
        );
      }
      if (element.lock !== "hard" && element.lock !== "controlled") {
        addIssue(
          issues,
          "INVALID_GEOMETRY_LOCK",
          `${path}.lock`,
          "Structural element phải dùng hard hoặc controlled lock.",
        );
      }
      if (
        element.roomId !== undefined &&
        (!isValidId(element.roomId) || !roomIds.has(element.roomId))
      ) {
        addIssue(
          issues,
          "UNKNOWN_ROOM",
          `${path}.roomId`,
          "Structural element tham chiếu phòng không tồn tại.",
        );
      }
      if (!readBounds(element.bounds)) {
        addIssue(
          issues,
          "INVALID_BOUNDS",
          `${path}.bounds`,
          "Bounds phải có tọa độ hữu hạn và kích thước dương.",
        );
      }
      if (typeof element.blocksPlacement !== "boolean") {
        addIssue(
          issues,
          "INVALID_BLOCKING_FLAG",
          `${path}.blocksPlacement`,
          "blocksPlacement phải là boolean.",
        );
      }
    });
  }

  return {
    valid: issues.every((issue) => issue.severity !== "error"),
    issues,
  };
}

export function evaluateSpaceProposal(
  model: SpaceModel,
  input: unknown,
): SpaceValidationReport {
  const issues: SpaceValidationIssue[] = [];
  const modelReport = validateSpaceModel(model);
  if (!modelReport.valid) {
    return {
      valid: false,
      issues: modelReport.issues.map((issue) => ({
        ...issue,
        path: `model.${issue.path}`,
      })),
    };
  }

  const proposal = asRecord(input);
  if (!proposal) {
    addIssue(
      issues,
      "INVALID_PROPOSAL",
      "$",
      "Design proposal phải là một object.",
    );
    return { valid: false, issues };
  }

  if (proposal.baseRevision !== model.revision) {
    addIssue(
      issues,
      "REVISION_MISMATCH",
      "baseRevision",
      "Proposal không tham chiếu đúng geometry revision hiện tại.",
    );
  }

  const elements = new Map(
    model.structuralElements.map((element) => [element.id, element]),
  );
  const edits = Array.isArray(proposal.structuralEdits)
    ? proposal.structuralEdits
    : null;
  if (!edits) {
    addIssue(
      issues,
      "INVALID_STRUCTURAL_EDITS",
      "structuralEdits",
      "structuralEdits phải là một mảng.",
    );
  } else {
    const editedIds = new Set<string>();
    edits.forEach((value, index) => {
      const path = `structuralEdits[${index}]`;
      const edit = asRecord(value);
      if (!edit || !isValidId(edit.elementId)) {
        addIssue(
          issues,
          "INVALID_STRUCTURAL_EDIT",
          path,
          "Structural edit không hợp lệ.",
        );
        return;
      }
      if (editedIds.has(edit.elementId)) {
        addIssue(
          issues,
          "DUPLICATE_STRUCTURAL_EDIT",
          `${path}.elementId`,
          "Một element chỉ được chỉnh một lần trong proposal.",
        );
        return;
      }
      editedIds.add(edit.elementId);
      if (
        edit.action !== "move" &&
        edit.action !== "resize" &&
        edit.action !== "remove"
      ) {
        addIssue(
          issues,
          "INVALID_EDIT_ACTION",
          `${path}.action`,
          "Edit action không hợp lệ.",
        );
      }
      const element = elements.get(edit.elementId);
      if (!element) {
        addIssue(
          issues,
          "UNKNOWN_STRUCTURAL_ELEMENT",
          `${path}.elementId`,
          "Structural element không tồn tại.",
        );
      } else if (element.lock === "hard") {
        addIssue(
          issues,
          "HARD_LOCK_VIOLATION",
          path,
          "AI/proposal không được thay đổi HARD geometry.",
        );
      } else if (edit.approved !== true) {
        addIssue(
          issues,
          "CONTROLLED_CHANGE_REQUIRES_APPROVAL",
          path,
          "CONTROLLED geometry cần phê duyệt rõ ràng trước khi chấp nhận.",
        );
      } else {
        addIssue(
          issues,
          "CONTROLLED_CHANGE_APPROVED",
          path,
          "CONTROLLED geometry đã có phê duyệt; cần lưu dấu vết thay đổi.",
          "warning",
        );
      }
    });
  }

  const placements = Array.isArray(proposal.placements)
    ? proposal.placements
    : null;
  if (!placements || placements.length > MAX_PLACEMENTS) {
    addIssue(
      issues,
      "INVALID_PLACEMENTS",
      "placements",
      `placements phải là mảng tối đa ${MAX_PLACEMENTS} phần tử.`,
    );
    return { valid: false, issues };
  }

  const rooms = new Map(model.rooms.map((room) => [room.id, room]));
  const placementIds = new Set<string>();
  const validPlacements: Array<{
    index: number;
    id: string;
    roomId: string;
    bounds: SpaceBounds;
  }> = [];

  placements.forEach((value, index) => {
    const path = `placements[${index}]`;
    const placement = asRecord(value);
    if (
      !placement ||
      !isValidId(placement.id) ||
      !isValidId(placement.roomId)
    ) {
      addIssue(
        issues,
        "INVALID_PLACEMENT",
        path,
        "Placement phải có id và roomId hợp lệ.",
      );
      return;
    }
    if (placementIds.has(placement.id)) {
      addIssue(
        issues,
        "DUPLICATE_PLACEMENT_ID",
        `${path}.id`,
        "Placement id phải duy nhất.",
      );
      return;
    }
    placementIds.add(placement.id);
    if (typeof placement.kind !== "string" || !placement.kind.trim()) {
      addIssue(
        issues,
        "INVALID_PLACEMENT_KIND",
        `${path}.kind`,
        "Placement kind không được để trống.",
      );
    }
    const bounds = readBounds(placement.bounds);
    if (!bounds) {
      addIssue(
        issues,
        "INVALID_BOUNDS",
        `${path}.bounds`,
        "Placement bounds không hợp lệ.",
      );
      return;
    }
    const clearanceMm = placement.clearanceMm ?? 0;
    if (
      typeof clearanceMm !== "number" ||
      !Number.isFinite(clearanceMm) ||
      clearanceMm < 0 ||
      clearanceMm > MAX_COORDINATE_MM
    ) {
      addIssue(
        issues,
        "INVALID_CLEARANCE",
        `${path}.clearanceMm`,
        "clearanceMm phải là số hữu hạn không âm.",
      );
      return;
    }
    const room = rooms.get(placement.roomId);
    if (!room) {
      addIssue(
        issues,
        "UNKNOWN_ROOM",
        `${path}.roomId`,
        "Placement tham chiếu phòng không tồn tại.",
      );
      return;
    }

    const occupiedBounds = expandBounds(bounds, clearanceMm);
    if (!boundsInsidePolygon(occupiedBounds, room.polygon)) {
      addIssue(
        issues,
        "OUTSIDE_ROOM",
        `${path}.bounds`,
        "Placement hoặc clearance vượt/cắt ra ngoài polygon phòng.",
      );
    }

    const collision = model.structuralElements.find(
      (element) =>
        element.blocksPlacement &&
        (!element.roomId || element.roomId === placement.roomId) &&
        boundsOverlap(occupiedBounds, element.bounds),
    );
    if (collision) {
      addIssue(
        issues,
        "STRUCTURAL_COLLISION",
        `${path}.bounds`,
        `Placement va chạm structural element ${collision.id}.`,
      );
    }

    validPlacements.push({
      index,
      id: placement.id,
      roomId: placement.roomId,
      bounds: occupiedBounds,
    });
  });

  for (
    let leftIndex = 0;
    leftIndex < validPlacements.length;
    leftIndex += 1
  ) {
    for (
      let rightIndex = leftIndex + 1;
      rightIndex < validPlacements.length;
      rightIndex += 1
    ) {
      const left = validPlacements[leftIndex];
      const right = validPlacements[rightIndex];
      if (
        left.roomId === right.roomId &&
        boundsOverlap(left.bounds, right.bounds)
      ) {
        addIssue(
          issues,
          "PLACEMENT_OVERLAP",
          `placements[${right.index}].bounds`,
          `Placement ${right.id} chồng lấn placement ${left.id} sau khi tính clearance.`,
        );
      }
    }
  }

  return {
    valid: issues.every((issue) => issue.severity !== "error"),
    issues,
  };
}
