  import { selectActiveUser, useUserQuery } from '@inithium/store';
  import { Avatar, AvatarFallback, AvatarImage, Banner, Box, Button, Text } from '@inithium/ui';
  import React, { useEffect, useState } from 'react';
  import { useSelector } from 'react-redux';
  import { useParams } from 'react-router-dom';
  import { extractAvatarProps } from './avatar-utils';
  import { AvatarEditDialog } from './avatar-edit-dialog';
  import { BannerEditDialog } from './banner-edit-dialog';

  interface ProfileRowProps {
    left: React.ReactNode;
    right?: React.ReactNode;
    className?: string;
  }

  const ProfileRow: React.FC<ProfileRowProps> = ({ 
    left, 
    right = null, 
    className = '' 
  }) => (
    <div className={`flex flex-row w-auto mx-8 ${className}`}>
      <div className="flex flex-col flex-1/4 items-center justify-center">
        {left}
      </div>
      <div className="flex flex-col flex-3/4">
        {right}
      </div>
    </div>
  );

  interface BannerSectionProps {
    profileUser: any;
    isOwnProfile: boolean;
    onEditClick: () => void;
  }

  const BannerSection: React.FC<BannerSectionProps> = ({ profileUser, isOwnProfile, onEditClick }) => (
    <Box fullWidth className="relative group">
      <Banner
        src={profileUser?.user_banner?.src}
        alt={`${profileUser?.first_name ?? ''} ${profileUser?.last_name ?? ''} banner`}
        height="200px"
        options={profileUser?.user_banner}
      />
      {isOwnProfile && (
        <Box className="absolute bottom-3 right-3 transition-opacity duration-150">
          <Button
            variant="solid"
            color="surface3"
            size="sm"
            icon="Pencil"
            onClick={onEditClick}
            aria-label="Edit Banner"
          />
        </Box>
      )}
    </Box>
  );

  interface AvatarSectionProps {
    avatar: any;
    isOwnProfile: boolean;
    onEditClick: () => void;
  }

  const AvatarSection: React.FC<AvatarSectionProps> = ({ avatar, isOwnProfile, onEditClick }) => {
    const leftContent = (
      <Box className="relative block group">
        <Avatar
          src={avatar.src}
          alt={avatar.alt}
          fallback={avatar.fallback}
          size="xl"
          shape={avatar.shape}
          background={avatar.background}
          fontColor={avatar.fontColor}
          className='border-8 border-surface'
        >
          {avatar.src && <AvatarImage src={avatar.src} alt={avatar.alt} />}
          <AvatarFallback>{avatar.fallback}</AvatarFallback>
        </Avatar>
        {isOwnProfile && (
          <Box className="absolute bottom-0 right-0 -translate-x-1/4 -translate-y-1/4">
            <Button
              variant="solid"
              color="surface3"
              size="sm"
              icon="Camera"
              onClick={onEditClick}
              aria-label="Edit Avatar"
            />
          </Box>
        )}
      </Box>
    );

    return <ProfileRow left={leftContent} className="-mt-[96px] relative z-10" />;
  };

  interface ContentSectionProps {
    profileUser: any;
  }

  const formatDate = (dateString?: string): string => 
    dateString ? new Date(dateString).toLocaleDateString() : '';

  const ContentSection: React.FC<ContentSectionProps> = ({ profileUser }) => (
    <ProfileRow 
      className="mt-6"
      left={
        <Box flex direction='col' className="gap-1 text-center">
          <Box flex direction='row' justify='between'>
            <Text variant="h5" color="primary">
              {profileUser?.first_name ?? ''} {profileUser?.last_name ?? ''}
            </Text>
            {profileUser?.createdAt && (
              <Text variant="caption" color="surface4-contrast" overrideClassName="mt-2 text-xs">
                Joined: {formatDate(profileUser.createdAt)}
              </Text>
            )}
          </Box>
          <Text variant="body" color="surface-contrast">
            {profileUser?.email ?? ''}
          </Text>
        </Box>
      } 
      right={
        <Box>
          b
        </Box>
      } 
    />
  );

  const ProfilePage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { data: profileUser } = useUserQuery(id ?? '', { skip: !id });
    const activeUser = useSelector(selectActiveUser);
    const [isAvatarDialogOpen, setIsAvatarDialogOpen] = useState(false);
    const [isBannerDialogOpen, setIsBannerDialogOpen] = useState(false);

    useEffect(() => console.log(profileUser), [profileUser]);
    const isOwnProfile = !!activeUser && profileUser?._id === activeUser._id;
    const avatar = extractAvatarProps(profileUser);

    return (
      <Box overrideClassName="w-full h-full flex flex-col">
        <BannerSection
          profileUser={profileUser}
          isOwnProfile={isOwnProfile}
          onEditClick={() => setIsBannerDialogOpen(true)}
        />
        
        <AvatarSection 
          avatar={avatar} 
          isOwnProfile={isOwnProfile} 
          onEditClick={() => setIsAvatarDialogOpen(true)} 
        />

        <ContentSection profileUser={profileUser} />

        {isOwnProfile && (
          <>
            <AvatarEditDialog
              isOpen={isAvatarDialogOpen}
              onClose={() => setIsAvatarDialogOpen(false)}
              profileUser={profileUser}
              activeUser={activeUser}
              avatar={avatar}
            />
            <BannerEditDialog
              isOpen={isBannerDialogOpen}
              onClose={() => setIsBannerDialogOpen(false)}
              profileUser={profileUser}
              activeUser={activeUser}
            />
          </>
        )}
      </Box>
    );
  };

  export default ProfilePage; 