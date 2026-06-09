import { registerProfileTab } from './profile-tab-registry';
import { ProfileInfoEditTab } from './profile-info-edit/profile-info-edit';

registerProfileTab({
  id: 'profile-info-edit',
  label: 'Edit Profile',
  leadingIcon: 'Pencil',
  component: ProfileInfoEditTab,
  ownProfileOnly: true,
});
