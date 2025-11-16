import { NodeController } from "@/features/api/nodes/node.controller";
import { withErrorHandling } from "@/utils/safe-handler";

export const POST = withErrorHandling(NodeController.move);
