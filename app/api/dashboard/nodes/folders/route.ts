import { NodeController } from "@/features/api/nodes/node.controller";
import { withErrorHandling } from "@/utils/safe-handler";

export const GET = withErrorHandling(NodeController.getFolders);
export const POST = withErrorHandling(NodeController.createFolder);
