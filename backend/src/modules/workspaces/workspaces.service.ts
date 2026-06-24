import type { Prisma, Workspace } from '@prisma/client';
import { prisma } from '../../shared/database/prisma';

export interface WorkspaceSettings {
  timezone?: string;
  logoUrl?: string | null;
  audio_enabled?: boolean;
  audio_max_duration_seconds?: number;
  audio_max_size_bytes?: number;
  evidenceRequiredDefault?: boolean;
  defaultDueDays?: number;
  allowAssigneeEvidenceAfterReview?: boolean;
  [key: string]: unknown;
}

export function parseWorkspaceSettings(json: Prisma.JsonValue | null): WorkspaceSettings {
  if (!json || typeof json !== 'object' || Array.isArray(json)) return {};
  return json as WorkspaceSettings;
}

export function mapWorkspace(workspace: Workspace) {
  const settings = parseWorkspaceSettings(workspace.settingsJson);
  return {
    id: workspace.id,
    name: workspace.name,
    slug: workspace.slug,
    status: workspace.status,
    settings,
    settingsJson: workspace.settingsJson,
    createdAt: workspace.createdAt,
    updatedAt: workspace.updatedAt,
  };
}

export class WorkspacesService {
  getCurrent(workspace: Workspace) {
    return mapWorkspace(workspace);
  }

  async updateCurrent(
    workspaceId: string,
    input: { name?: string; settings?: Partial<WorkspaceSettings> }
  ) {
    const existing = await prisma.workspace.findUniqueOrThrow({ where: { id: workspaceId } });
    const currentSettings = parseWorkspaceSettings(existing.settingsJson);
    const mergedSettings = input.settings
      ? { ...currentSettings, ...input.settings }
      : currentSettings;

    const updated = await prisma.workspace.update({
      where: { id: workspaceId },
      data: {
        ...(input.name !== undefined ? { name: input.name.trim() } : {}),
        settingsJson: mergedSettings as Prisma.InputJsonValue,
      },
    });

    return mapWorkspace(updated);
  }
}

export const workspacesService = new WorkspacesService();
