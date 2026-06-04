import { selectActiveUser, useUserQuery } from '@inithium/store';
import { Avatar, AvatarFallback, AvatarImage, Box, Button } from '@inithium/ui';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { extractAvatarProps } from './avatar-utils';
import { AvatarEditDialog } from './avatar-edit-dialog';

const ProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: profileUser } = useUserQuery(id ?? '', { skip: !id });
  const activeUser = useSelector(selectActiveUser);

  const isOwnProfile = !!activeUser && profileUser?._id === activeUser._id;
  const avatar = extractAvatarProps(profileUser);

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <Box fullHeight fullWidth>
      <Box padding="md" className="relative inline-block group">
        <Avatar
          src={avatar.src}
          alt={avatar.alt}
          fallback={avatar.fallback}
          size="xl"
          shape={avatar.shape}
          background={avatar.background}
          fontColor={avatar.fontColor}
        >
          {avatar.src && <AvatarImage src={avatar.src} alt={avatar.alt} />}
          <AvatarFallback>{avatar.fallback}</AvatarFallback>
        </Avatar>

        {isOwnProfile && (
          <Box className='absolute bottom-0 right-0 -translate-x-full -translate-y-full'>
            <Button
              variant="solid"
              color="surface3"
              size="sm"
              icon="Camera"
              onClick={() => setIsDialogOpen(true)}
              aria-label="Edit Avatar"
            />
          </Box>
        )}
      </Box>

      {isOwnProfile && (
        <AvatarEditDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          profileUser={profileUser}
          activeUser={activeUser}
          avatar={avatar}
        />
      )}
    </Box>
  );
};

export default ProfilePage;