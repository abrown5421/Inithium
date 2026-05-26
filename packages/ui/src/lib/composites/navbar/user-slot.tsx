import React from 'react';
import { useSelector } from 'react-redux';
import { selectActiveUser } from '@inithium/store';
import { Box } from '../../components';
import { Avatar, AvatarImage, AvatarFallback } from '../avatar';
import { UserSlotProps } from './navbar.types';


const UserSlot: React.FC<UserSlotProps> = ({ onAvatarClick }) => {
  const activeUser = useSelector(selectActiveUser);

  const renderAvatar = (avatar: NonNullable<NonNullable<typeof activeUser>['user_avatar']>) => (
    <Avatar
      src={avatar.src}
      alt={avatar.alt}
      fallback={avatar.fallback}
      size={avatar.size}
      status={avatar.status}
      shape={avatar.shape}
      onClick={onAvatarClick}
    >
      {avatar.src && <AvatarImage src={avatar.src} alt={avatar.alt} />}
      <AvatarFallback>{avatar.fallback || '??'}</AvatarFallback>
    </Avatar>
  );

  if (!activeUser || !activeUser.user_avatar) {
    return (
      <Box flex align="center" padding="sm" className="h-[56px] w-full">
        <Avatar size="md" shape="circle" status="offline" onClick={onAvatarClick}>
          <AvatarFallback>??</AvatarFallback>
        </Avatar>
      </Box>
    );
  }

  return (
    <Box flex align="center" padding="sm" className="h-[56px] w-full">
      {renderAvatar(activeUser.user_avatar)}
    </Box>
  );
};

export default UserSlot;