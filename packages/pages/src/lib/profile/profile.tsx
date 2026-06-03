import { useUserQuery } from '@inithium/store';
import { Avatar, AvatarFallback, AvatarImage, Box } from '@inithium/ui';
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';

const ProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  
  const { data: profileUser } = useUserQuery(id ?? '', { skip: !id });

  const isOwnProfile = profileUser?._id === id;

  useEffect(() => {
    console.log(profileUser);
  }, [id, profileUser, isOwnProfile]);

  return (
    <Box className="h-full w-full">
      <Box padding="md">
        <Avatar
          src={profileUser.user_avatar.src}
          alt={profileUser.user_avatar.alt}
          fallback={profileUser.user_avatar.fallback}
          size="xl"
          shape={profileUser.user_avatar.shape}
          background={profileUser.user_avatar.background}
        >
          {profileUser.user_avatar.src && <AvatarImage src={profileUser.user_avatar.src} alt={profileUser.user_avatar.alt} />}
          <AvatarFallback>{profileUser.user_avatar.fallback || '??'}</AvatarFallback>
        </Avatar>
      </Box>
    </Box>
  );
};

export default ProfilePage;