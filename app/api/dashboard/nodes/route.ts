import { NodeController } from "@/features/api/nodes/node.controller";
import { withErrorHandling } from "@/utils/safe-handler";

export const GET = withErrorHandling(NodeController.getFiles);
export const POST = withErrorHandling(NodeController.upload);
export const DELETE = withErrorHandling(NodeController.remove);
export const PATCH = withErrorHandling(NodeController.rename);
