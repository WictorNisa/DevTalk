import pingNotification from "../../public/media/new-notification-09-352705.mp3";

const useNotificationSound = () => {
  const playNotificationSound = () => {
    const audio = new Audio(pingNotification);
    audio.play();
  };
  return playNotificationSound;
};

export default useNotificationSound;
