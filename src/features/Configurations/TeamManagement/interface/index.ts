export interface ITeamMember {
  id: number;
  email: string;
  status: string;
  user_name: string;
  is_owner: boolean;
  permissions: IPermissionCategories;
  last_login_at: string;
  registered_at: string;
  resend_invitation: boolean;
}

export interface InviteTeamMemberModalProps {
  open: boolean;
  onClose: () => void;
  selectedMember: ITeamMember | undefined;
  isInviting: boolean;
  onInvite: (
    email: string,
    isOwner: boolean,
    permissions: IPermissionCategories
  ) => void;
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

export interface ApiResponse {
  permissions: IPermissionCategories;
}

export interface IPermissionCategories {
  account: Permission[];
  application: Permission[];
  module: Permission[];
}
