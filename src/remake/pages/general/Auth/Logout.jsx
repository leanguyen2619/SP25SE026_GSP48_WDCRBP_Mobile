import { useEffect } from "react";
import useAuth from "../../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

export default function Logout() {
  const { setAuth } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setAuth(null);
    navigate("/");
  }, [navigate, setAuth]);

  return null;
}
