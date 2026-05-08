// import type { User } from '../user.types';
import apiClient from "../../../services/ApiClient";
import type { StylePresetRequest, StylePresetResponse } from "../style.types";

export const StyleService = {
  getListStyle: async (): Promise<StylePresetResponse> => {
    const response = await apiClient.get("/style_presets/");
    return response.data;
  },

  createStyle: async (
    data: StylePresetRequest
  ): Promise<StylePresetResponse> => {
    const response = await apiClient.post("/style_presets/", data);
    return response.data;
  },

  updateStyle: async (id: string, data): Promise<StylePresetResponse> => {
    const response = await apiClient.patch(`/style_presets/${id}`, data);
    return response.data;
  },

  deleteStyle: async (id: string): Promise<void> => {
    await apiClient.delete(`/style_presets/${id}`);
  },
};
