import type { Service, ServiceFilter } from '@/types';

/**
 * Filter services based on criteria
 */
export const filterServices = (
  services: Service[],
  filter: ServiceFilter
): Service[] => {
  return services.filter((service) => {
    if (filter.category && service.category !== filter.category) {
      return false;
    }
    if (filter.subCategory && service.subCategory !== filter.subCategory) {
      return false;
    }
    if (filter.priceRange) {
      const [min, max] = filter.priceRange;
      if (service.price < min || service.price > max) {
        return false;
      }
    }
    if (filter.duration && service.duration > filter.duration) {
      return false;
    }
    if (filter.searchTerm) {
      const searchLower = filter.searchTerm.toLowerCase();
      return (
        service.name.toLowerCase().includes(searchLower) ||
        service.description.toLowerCase().includes(searchLower) ||
        service.category.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });
};

/**
 * Get unique categories from services
 */
export const getUniqueCategories = (services: Service[]): string[] => {
  return Array.from(new Set(services.map((s) => s.category)));
};

/**
 * Get subcategories for a specific category
 */
export const getSubCategories = (
  services: Service[],
  category: string
): string[] => {
  const subCats = services
    .filter((s) => s.category === category && s.subCategory)
    .map((s) => s.subCategory!);
  return Array.from(new Set(subCats));
};

/**
 * Calculate discounted price
 */
export const getDiscountedPrice = (service: Service): number => {
  if (!service.discount || service.discount <= 0) {
    return service.price;
  }
  return Math.round(service.price * (1 - service.discount / 100));
};
