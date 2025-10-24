export type StaffStatus = 'ACTIVE' | 'RESIGNED' | 'STUDY_LEAVE' | 'INACTIVE';
export type StaffRoleType = 'STAFF' | 'SUPERVISOR' | 'MANAGER' | 'PARTNER' | 'HR' | 'OFFICE_ADMIN';

export interface Department {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  _count?: {
    staff: number;
  };
}

export interface Role {
  id: string;
  name: string;
  type: StaffRoleType;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  _count?: {
    staffRoles: number;
  };
}

export interface Staff {
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  photoUrl?: string;
  hireDate: Date;
  isActive: boolean;
  status: StaffStatus;
  resignDate?: Date;
  resignReason?: string;
  departmentId: string;
  department?: Department;
  userId?: string;
  roles?: Array<{ id: string; role: Role }>;
  createdAt: Date;
  updatedAt: Date;
}

export interface StaffFormData {
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  photoUrl?: string;
  departmentId: string;
  hireDate: Date;
  status: StaffStatus;
  resignDate?: Date;
  resignReason?: string;
  roleIds: string[];
  createUserAccount: boolean;
}

export interface DepartmentFormData {
  name: string;
  description?: string;
  isActive: boolean;
}

export interface RoleFormData {
  name: string;
  type: StaffRoleType;
  description?: string;
}
