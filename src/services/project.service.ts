import { apiFetch } from "@/lib/api";
import type { BackendProject, Project } from "@/types/project";

type Requester = {
  requesterId: string;
  requesterCompanyId: string;
  token?: string;
};

type CreateProjectPayload = Requester & {
  name: string;
  description?: string;
  companyId: string;
  members?: string[];
};

type UpdateProjectPayload = Requester & {
  name?: string;
  description?: string;
  status?: string;
};

// Fonction pour mapper un projet du backend (snake_case) vers le frontend (camelCase)
export function mapBackendProject(project: BackendProject): Project {
  return {
    id: project._id || project.id || "",
    projectName: project.project_name,
    companyId: project.company_id,
    description: project.description,
    members: project.members?.map((member) => ({
      userId: member.user_id,
      role: member.role,
      addedAt: member.added_at,
      addedBy: member.added_by,
    })),
    status: project.status,
    createdBy: project.created_by,
    createdAt: project.created_at,
    updatedAt: project.updated_at,
  };
}

export class ProjectService {
  // Récupère la liste des projets associés à un utilisateur
  static async listByUser(userId: string, requesterCompanyId: string): Promise<Project[]> {
    const params = new URLSearchParams({ requester_company_id: requesterCompanyId });
    const projects = await apiFetch<BackendProject[]>(
      `/users/${userId}/projects?${params.toString()}`
    );

    return (projects || []).map(mapBackendProject);
  }

  // Récupère la liste des projets associés à une entreprise
  static async listByCompany(companyId: string, requesterCompanyId: string): Promise<Project[]> {
    const params = new URLSearchParams({ requester_company_id: requesterCompanyId });
    const projects = await apiFetch<BackendProject[]>(
      `/companies/${companyId}/projects?${params.toString()}`
    );

    return (projects || []).map(mapBackendProject);
  }

  // Récupère un projet par son ID
  static async getById(projectId: string, requester: Requester): Promise<Project> {
    const params = new URLSearchParams({
      requester_id: requester.requesterId,
      requester_company_id: requester.requesterCompanyId,
    });
    const project = await apiFetch<BackendProject>(
      `/projects/${projectId}?${params.toString()}`,
      { token: requester.token }
    );

    return mapBackendProject(project);
  }

  // Crée un nouveau projet
  static async create(payload: CreateProjectPayload): Promise<Project> {
    const project = await apiFetch<BackendProject>("/projects/", {
      method: "POST",
      token: payload.token,
      body: JSON.stringify({
        name: payload.name,
        description: payload.description || "",
        company_id: payload.companyId,
        requester_id: payload.requesterId,
        requester_company_id: payload.requesterCompanyId,
        members: payload.members || [],
      }),
    });

    return mapBackendProject(project);
  }

  // Met à jour un projet existant
  static async update(projectId: string, payload: UpdateProjectPayload): Promise<Project> {
    const project = await apiFetch<BackendProject>(`/projects/${projectId}`, {
      method: "PUT",
      token: payload.token,
      body: JSON.stringify({
        name: payload.name,
        description: payload.description,
        status: payload.status,
        requester_id: payload.requesterId,
        company_id: payload.requesterCompanyId,
        // Note: company_id here seems to be requesterCompanyId, which might be a backend design choice.
      }),
    });

    return mapBackendProject(project);
  }

  // Supprime un projet
  // Cette méthode permet de supprimer un projet en envoyant l'ID du projet et les informations du demandeur.
  // Le backend se chargera des vérifications d'autorisation (par exemple, seul le propriétaire peut supprimer).
  static async delete(projectId: string, requester: Requester): Promise<void> {
    const params = new URLSearchParams({
      requester_id: requester.requesterId,
      requester_company_id: requester.requesterCompanyId,
    });

    await apiFetch(`/projects/${projectId}?${params.toString()}`, {
      method: "DELETE",
      token: requester.token,
    });
  }
}
