"use client";

import { useEffect } from "react";
import axios from "@/api/axios";

const AnalyticsTracker = () => {
  useEffect(() => {
    // Проверяем, отправляли ли мы визит в этой сессии
    if (typeof window !== "undefined" && sessionStorage.getItem("visit_sent")) {
      return; // Уже отправлено — выходим, чтобы не дублировать
    }

    const sendVisit = async () => {
      try {
        await axios.post("/analytics/visit", {
          page: window.location.pathname,
          referrer: document.referrer || null,
        });
        // Помечаем, что визит отправлен
        sessionStorage.setItem("visit_sent", "true");
      } catch (error) {
        console.error("Failed to record visit:", error);
      }
    };

    sendVisit();
  }, []);

  return null;
};

export default AnalyticsTracker;
