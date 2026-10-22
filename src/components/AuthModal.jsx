import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";

/**
 * AuthModal redirector:
 * Automatically routes to the dedicated /register page matching the reference design.
 */
export const AuthModal = () => {
  const { authModalOpen, setAuthModalOpen } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    if (authModalOpen) {
      setAuthModalOpen(false);
      navigate("/register");
    }
  }, [authModalOpen, setAuthModalOpen, navigate]);

  return null;
};
