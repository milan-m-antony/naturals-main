/* copilot:follow
This module is MARKED AS DONE.
It is protected. Do NOT modify unless the user explicitly asks.
*/
import apiClient from './client';
import type { HeroSlide } from '@/types';

export const heroSlideService = {
  async getAll(): Promise<HeroSlide[]> {
    const response = await apiClient.get('/hero-slides');
    const slides = Array.isArray(response.data) ? response.data : [];
    return slides.map((slide: any) => ({
      ...slide,
      accentColor: slide.accent_color || slide.accentColor,
    }));
  },

  async create(data: Partial<HeroSlide>): Promise<HeroSlide> {
    const response = await apiClient.post<HeroSlide>('/hero-slides', {
      ...data,
      accent_color: data.accentColor,
    });
    const slide: any = response.data;
    return { ...slide, accentColor: slide.accent_color || slide.accentColor } as HeroSlide;
  },

  async update(id: number, data: Partial<HeroSlide>): Promise<HeroSlide> {
    const response = await apiClient.put<HeroSlide>(`/hero-slides/${id}`, {
      ...data,
      accent_color: data.accentColor,
    });
    const slide: any = response.data;
    return { ...slide, accentColor: slide.accent_color || slide.accentColor } as HeroSlide;
  },

  async delete(id: number): Promise<void> {
    await apiClient.delete(`/hero-slides/${id}`);
  },
};
