import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { Friend } from '@inithium/types';
import { selectActiveUser } from '../features/active-user/active-user-slice';
import { showAlert } from '../features/alert/alert-slice';
import { friendsApi } from '../features/friends/friends-api.js';
import { connectSocket, disconnectSocket } from '../socket/socket-client.js';

const buildAlert = (message: string, severity: 'primary' | 'success') => ({
  message,
  severity,
  closeable: true,
  position: 'bottom-right' as const,
  animation_object: {
    entry: 'fadeInRight' as const,
    exit: 'fadeOutRight' as const,
    entrySpeed: 'fast' as const,
    exitSpeed: 'faster' as const,
  },
});

export const useFriendNotifications = (): void => {
  const dispatch = useDispatch();
  const activeUser = useSelector(selectActiveUser);

  useEffect(() => {
    if (!activeUser) {
      disconnectSocket();
      return;
    }

    const socket = connectSocket();
    const channel = `user:${activeUser._id}`;

    const joinChannel = () => socket.emit('channel:join', channel);
    socket.on('connect', joinChannel);
    if (socket.connected) joinChannel();

    const handleFriendRequest = (friend: Friend) => {
      dispatch(friendsApi.util.invalidateTags([{ type: 'Friend', id: activeUser._id }]));
      dispatch(
        showAlert(
          buildAlert(`${friend.requester.first_name} ${friend.requester.last_name} sent you a friend request`, 'primary'),
        ),
      );
    };

    const handleFriendRequestAccepted = (friend: Friend) => {
      dispatch(friendsApi.util.invalidateTags([{ type: 'Friend', id: activeUser._id }]));
      dispatch(
        showAlert(
          buildAlert(`${friend.recipient.first_name} ${friend.recipient.last_name} accepted your friend request`, 'success'),
        ),
      );
    };

    socket.on('friend-request', handleFriendRequest);
    socket.on('friend-request-accepted', handleFriendRequestAccepted);

    return () => {
      socket.off('connect', joinChannel);
      socket.off('friend-request', handleFriendRequest);
      socket.off('friend-request-accepted', handleFriendRequestAccepted);
    };
  }, [activeUser, dispatch]);
};