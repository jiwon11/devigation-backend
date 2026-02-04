import { BusinessException } from '@common/error/business-exception';
import { ErrorCode } from '@common/error/error-code.enum';

export class RoadmapNotFoundException extends BusinessException {
  constructor(roadmapId?: string) {
    super(ErrorCode.ROADMAP_NOT_FOUND, roadmapId !== undefined ? { roadmapId } : undefined);
  }
}

export class RoadmapAccessDeniedException extends BusinessException {
  constructor(roadmapId: string, userId: string) {
    super(ErrorCode.ROADMAP_ACCESS_DENIED, { roadmapId, userId });
  }
}

export class RoadmapAlreadyForkedException extends BusinessException {
  constructor(roadmapId: string, userId: string) {
    super(ErrorCode.ROADMAP_ALREADY_FORKED, { roadmapId, userId });
  }
}

export class NodeNotFoundException extends BusinessException {
  constructor(nodeId?: string) {
    super(ErrorCode.NODE_NOT_FOUND, nodeId !== undefined ? { nodeId } : undefined);
  }
}

export class EdgeNotFoundException extends BusinessException {
  constructor(edgeId?: string) {
    super(ErrorCode.EDGE_NOT_FOUND, edgeId !== undefined ? { edgeId } : undefined);
  }
}

export class InvalidNodeConnectionException extends BusinessException {
  constructor(sourceId: string, targetId: string) {
    super(ErrorCode.INVALID_NODE_CONNECTION, { sourceId, targetId });
  }
}

export class MaxNodesExceededException extends BusinessException {
  constructor(maxNodes: number) {
    super(ErrorCode.MAX_NODES_EXCEEDED, { maxNodes });
  }
}