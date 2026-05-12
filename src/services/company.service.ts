import { apiFetch } from "@/lib/api";
import type { BackendCompany, Company } from "@/types/company";

type CreateCompanyPayload = {
  companyName: string;
  description?: string;
  ownerId: string;
};

type UpdateCompanyPayload = {
  companyName?: string;
  description?: string;
  subscriptionPlan?: string;
  storageLimit?: number;
  requesterId: string;
};

export function mapBackendCompany(company: BackendCompany): Company {
  return {
    id: company._id || company.id || "",
    companyName: company.company_name,
    description: company.description,
    ownerId: company.owner_id,
    members: company.members?.map((member) => ({
      userId: member.user_id,
      role: member.role,
      addedAt: member.added_at,
      addedBy: member.added_by,
      isActive: member.is_active,
    })),
    subscriptionPlan: company.subscription_plan,
    storageLimit: company.storage_limit,
    storageUsed: company.storage_used,
    createdAt: company.created_at,
    updatedAt: company.updated_at,
  };
}

export class CompanyService {
  static async create(payload: CreateCompanyPayload): Promise<Company> {
    const company = await apiFetch<BackendCompany>("/companies/", {
      method: "POST",
      body: JSON.stringify({
        company_name: payload.companyName,
        description: payload.description || "",
        owner_id: payload.ownerId,
      }),
    });

    return mapBackendCompany(company);
  }

  static async getById(companyId: string, requesterId: string): Promise<Company> {
    const params = new URLSearchParams({ requester_id: requesterId });
    const company = await apiFetch<BackendCompany>(
      `/companies/${companyId}?${params.toString()}`
    );

    return mapBackendCompany(company);
  }

  static async update(companyId: string, payload: UpdateCompanyPayload): Promise<Company> {
    const company = await apiFetch<BackendCompany>(`/companies/${companyId}`, {
      method: "PUT",
      body: JSON.stringify({
        company_name: payload.companyName,
        description: payload.description,
        subscription_plan: payload.subscriptionPlan,
        storage_limit: payload.storageLimit,
        requester_id: payload.requesterId,
      }),
    });

    return mapBackendCompany(company);
  }

  static async addMember(companyId: string, userId: string, requesterId: string, role?: string) {
    const company = await apiFetch<BackendCompany>(`/companies/${companyId}/members`, {
      method: "POST",
      body: JSON.stringify({
        user_id: userId,
        role,
        requester_id: requesterId,
      }),
    });

    return mapBackendCompany(company);
  }
}
