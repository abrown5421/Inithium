import React from 'react';
import { User } from '@inithium/types';
import { Box, Button, Checkbox, Text } from '@inithium/ui';
 
const ROLE_COLOR: Record<string, string> = {
  'super-admin': 'bg-danger text-danger-contrast',
  'admin':       'bg-warning text-warning-contrast',
  'editor':      'bg-accent text-accent-contrast',
  'writer':      'bg-success text-success-contrast',
  'user':        'bg-surface3 text-surface3-contrast',
};
 
export interface UserItemProps {
  user: User;
  isSelected: boolean;
  onToggle: (id: string) => void;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
}

export const UserItem: React.FC<UserItemProps> = ({
  user,
  isSelected,
  onToggle,
  onEdit,
  onDelete,
}) => {
  const fullName = `${user.first_name} ${user.last_name}`;
  const initials = `${user.first_name[0]}${user.last_name[0]}`.toUpperCase();
  const roleColor = ROLE_COLOR[user.role] ?? ROLE_COLOR['user'];
 
  return (
    <Box
      flex
      direction='row'
      justify='between'
      align='center'
      color="surface2"
      border
      borderWidth="thin"
      borderRadius="md"
      padding="md"
      fullWidth
      className="transition-colors hover:bg-surface3 items-center"
      style={{
        gridTemplateColumns: 'auto auto 1fr 1fr 1fr auto',
      }}
    >
    <Box flex direction='row' 
      align='center' className='gap-2'>
      <Box flex align="center" justify="center" className="w-5 h-5">
        <Checkbox
          checked={isSelected}
          onChange={() => onToggle(user._id)}
          color="primary"
          size="md"
        />
      </Box>
 
      <Box
        flex
        align="center"
        justify="center"
        borderRadius="full"
        className="w-9 h-9 bg-primary text-primary-contrast shrink-0"
      >
        {user.user_avatar?.src ? (
          <img
            src={user.user_avatar.src}
            alt={user.user_avatar.alt ?? fullName}
            className="w-full h-full rounded-full object-cover"
          />
        ) : (
          <Text variant="caption" overrideClassName="font-semibold text-xs text-primary-contrast">
            {initials}
          </Text>
        )}
      </Box>
        
      <Box flex direction="col" className="min-w-0">
        <Text variant="body2" overrideClassName="font-semibold text-sm text-primary truncate">
          {fullName}
        </Text>
        <Text variant="caption" color="secondary" overrideClassName="text-xs text-secondary truncate">
          {user.email}
        </Text>
      </Box>
 </Box>
 <Box flex direction='row'
      align='center'>
      <Box flex align="center">
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wide ${roleColor}`}>
          {user.role}
        </span>
      </Box>
 
      <Box flex direction="col" className="hidden md:flex">
        <Text variant="caption" overrideClassName="text-xs font-bold uppercase tracking-wider text-secondary">
          Joined
        </Text>
        
      </Box>
 
      <Box flex align="center" justify="end" className="gap-2">
        <Button
          variant="ghost"
          color="secondary"
          size="sm"
          rounded
          icon="pencil"
          onClick={() => onEdit(user)}
          aria-label={`Edit ${fullName}`}
        />
        <Button
          variant="ghost"
          color="danger"
          size="sm"
          rounded
          icon="trash-2"
          onClick={() => onDelete(user)}
          aria-label={`Delete ${fullName}`}
        />
      </Box>
    </Box>
</Box>
  );
};