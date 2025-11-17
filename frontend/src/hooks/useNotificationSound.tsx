import notificationSound from "../../public/media/notification.mp3";

const useNotificationSound = () => {
  try {
    const audio = new Audio(notificationSound);
    audio.volume = 0.5;
    audio.play().catch((error) => {
      console.warn("Could not play notification sound", error);
    });
  } catch (error) {
    console.error("Error loading notification sound: ", error);
  }
};

export default useNotificationSound;
