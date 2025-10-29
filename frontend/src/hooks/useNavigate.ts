import { useNavigate as userRouterNavigate } from "react-router";

export function useNavigation() {
  const navigate = userRouterNavigate();

  const goToLogin = () => navigate("/login");
  const goToDashBoard = () => navigate("/dashboard");
  const goToChannel = (id: string) => navigate(`/channels/${id}`);
  const goBack = () => navigate(-1);

  return {
    goToLogin,
    goToDashBoard,
    goToChannel,
    goBack,
  };
}
