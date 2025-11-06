const useNotificationSound = () => {
  const playNotificationSound = () => {
    const audio = new Audio(pingNotification);
    audio.play();
  };
  return playNotificationSound;
};

export default useNotificationSound;
