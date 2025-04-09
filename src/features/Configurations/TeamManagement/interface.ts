export interface ITeamMember {
  id?: number | string;
  email: string;
  is_owner: boolean;
  status: string;
  permissions?: IPermissionCategories;
}

export interface InviteTeamMemberModalProps {
  open: boolean;
  onClose: () => void;
  onInvite: (
    email: string,
    isOwner: boolean,
    permissions: IPermissionCategories
  ) => void;
  selectedMember?: ITeamMember;
  isInviting: boolean;
  existingMembers: ITeamMember[];
}

export interface Permission {
  id: number;
  codename: string;
  name: string;
  description: string;
  category: string;
  enabled: boolean;
}

export interface IPermissionCategories {
  account: Permission[];
  application: Permission[];
  module: Permission[];
}

export interface ApiResponse {
  permissions: IPermissionCategories;
}
